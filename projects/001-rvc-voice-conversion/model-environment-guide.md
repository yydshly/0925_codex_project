# RVC 本地模型、环境与能力说明

核对范围：RVC 官方仓库当前 main 分支，2026-09-25。不同版本的文件布局与依赖可能不同，本说明不与旧版安装教程混用。

![RVC 模型与环境全景图](../../docs/projects/001-rvc-voice-conversion/assets/rvc-model-environment-map.png)

## 先理解：文件、模型结构、运行框架是三件事

- **权重文件**（如 .pth、.pt、pytorch_model.bin）：保存训练得到的参数，不是可以独立双击运行的软件。
- **网络代码**：定义如何使用这些参数进行计算。RVC 的生成器结构由仓库中的代码实现。
- **运行框架与设备**：PyTorch 等框架执行计算，CPU 或兼容的显卡完成实际运算。

因此，目标声线 .pth 就是核心生成模型所需的权重，并不缺少一个额外的“总模型”。RVC 程序加载辅助模型和这个生成模型，组织整个转换流程。

## 图中 A、B、C 的对应关系

| 标识 | 核心模型 | 本地文件（相对 RVC 根目录） | 主要依赖 | 提供的能力 |
| --- | --- | --- | --- | --- |
| A | HuBERT / ContentVec 特征模型 | assets/hubert_base/ 下的 pytorch_model.bin、config.json、preprocessor_config.json | Transformers + PyTorch | 把音频变成发音相关的特征 |
| B | RMVPE 音高模型 | assets/rmvpe/rmvpe.pt | 常见 CPU / CUDA 路线使用 PyTorch | 提取基频 F0 随时间的变化 |
| B 的另一执行路线 | 同一用途的 RMVPE ONNX 模型 | assets/rmvpe/rmvpe.onnx | Windows ONNX Runtime DirectML | 在相应 DirectML 方案中提取音高 |
| C | RVC 目标声线生成模型 | assets/weights/声线名.pth | RVC 网络代码 + PyTorch | 根据特征与音高等条件生成新波形 |
| 可选辅助 | 目标特征索引，不是神经网络模型 | assets/indices/配套.index | faiss-cpu | 检索相近目标特征，辅助转换 |

C 的常见带 F0 结构源于 VITS 一类生成网络，包含 NSF / HiFi-GAN 类波形生成模块。这些已经由 RVC 的网络代码和导出的权重覆盖，不要求再单独安装一个 VITS 软件或下载另一个通用声码器。

图采用 RMVPE 和带 F0 模型的常见配置。其他音高方法或无 F0 模型会改变 B 的需求。基础模型可以在多个目标声线之间共用。

依据：[HuBERT 加载代码](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/blob/main/infer/hubert.py)、[RMVPE 执行路线](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/blob/main/infer/rmvpe.py)、[目标模型加载](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/blob/main/infer/vc/modules.py)、[生成网络](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/blob/main/infer/module/models.py)。

## 共享环境与硬件路线

当前分支面向 Python 3.12 x64。Windows 和 Linux 有对应安装说明，Ubuntu 推荐 24.04 x86_64。依赖安装在一套项目环境中。

- NVIDIA RTX 50 系：官方方案使用 Torch / Torchaudio 2.7.1 + cu128。
- 更早的 NVIDIA 系列：官方提供 2.7.1 + cu118 方案，具体显卡仍需兼容。
- CPU：CPU 依赖清单采用 Torch / Torchaudio 2.4.1 系列。
- Windows AMD / Intel：使用 CPU 依赖清单安装，由 torch-directml 提供推理支持；RMVPE 使用 ONNX Runtime DirectML。
- Linux AMD / Intel：按当前官方文档使用 CPU 路线。

三种依赖清单是不同的环境方案，不能把所有 Torch 版本叠加安装在同一环境。NVIDIA 路线先装指定 Torch，再装对应清单。显卡需要兼容驱动；不要把“CUDA 版 PyTorch”直接理解成“每个模型都需要单独安装 CUDA”。

普通配套工具包括 FFmpeg / FFprobe、Librosa、SoundFile、NumPy、SciPy；网页操作使用 Gradio；实时界面与音频设备处理使用 FreeSimpleGUI 和 SoundDevice。网页只是操作入口，模型计算在 Python 程序中进行。

依据：[官方环境说明](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI#环境配置)、[CPU 依赖](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/blob/main/requirments_cpu_py312.txt)、[cu128 依赖](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/blob/main/requirments_cu128_py312.txt)。

## 额外能力需要追加什么

- **训练自己的声线**：在基础环境与特征/音高提取资源之外，准备 assets/pretrained/ 或 assets/pretrained_v2/ 中与训练配置匹配的生成器 G、判别器 D 预训练权重，以及目标录音和 logs/mute/ 静音样本。训练阶段会用到 D；日常转换不用另行加载 D。
- **人声分离**：按所选模型与后端准备 assets/pymss_weights/ 下的分离权重和匹配的 PyMSS / MSST 环境。可选功能的模型文件不等于基础换声都必需，官方整套依赖安装可能仍包含相关软件包。
- **实时变声**：沿用换声模型，额外配置输入输出设备和音频路由；是否流畅由算力、驱动和缓冲设置共同决定。

依据：[官方模型目录与下载清单](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI#模型与运行目录)、[训练代码](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/blob/main/train/train.py)、[实时界面](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/blob/main/realtime_gui.py)。

## 硬件要求怎样理解

当前配置代码用约 4 GiB 显存和 SM 5.3 检查 CUDA 设备资格，具体还有精度与架构选择规则。这是代码选择设备的条件，不是“任意 4 GB 显卡均可训练或实时运行”的保证。官方没有为所有任务提供统一的最低内存、磁盘和速度要求，实际占用随模型、音频、批量大小和训练规模变化。

本项目目前只完成研究说明、示意图和教学试听，没有安装 RVC 转换环境，也没有在你的电脑上验证训练或换声性能。

[硬件配置代码](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI/blob/main/configs/config.py)

## 图像文件

- [高清 PNG](../../docs/projects/001-rvc-voice-conversion/assets/rvc-model-environment-map.png)
- [可缩放 SVG](../../docs/projects/001-rvc-voice-conversion/assets/rvc-model-environment-map.svg)

制作方式：图像生成服务发生网络错误后，使用可精确排版的矢量图导出 PNG。模型名称、文件路径与依赖关系经过源代码核对。
