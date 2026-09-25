(() => {
  "use strict";
  const sample = (frequency, rms, harmonics, title) => ({ frequency, rms, harmonics, title });
  const modes = {
    pitch: {
      a: sample(220, 0.06, [1, 0, 0, 0, 0], "A · 较低的音"),
      b: sample(440, 0.06, [1, 0, 0, 0, 0], "B · 较高的音"),
      text: "A 为 220 Hz，B 为 440 Hz；数字振幅相同。观察 B 在同样时间内重复更多次，听起来更高。"
    },
    volume: {
      a: sample(220, 0.04, [1, 0, 0, 0, 0], "A · 较小振幅"),
      b: sample(220, 0.08, [1, 0, 0, 0, 0], "B · 较大振幅"),
      text: "两者都是 220 Hz，B 的振幅是 A 的两倍。波形重复的速度相同，B 通常听起来更响；振幅翻倍不等于主观响度翻倍。"
    },
    timbre: {
      a: sample(220, 0.06, [1, 0, 0, 0, 0], "A · 纯音"),
      b: sample(220, 0.06, [1, 0.65, 0.4, 0.25, 0.1], "B · 含更多谐波的复合音"),
      text: "两者基频都是 220 Hz，数字 RMS 相同。B 加入 440、660 Hz 等谐波，重复周期相同，周期内部形状更复杂，音色也不同。"
    }
  };
  const buttons = [...document.querySelectorAll("[data-sound-mode]")];
  const plays = [...document.querySelectorAll("[data-play-sample]")];
  const stopButton = document.getElementById("stop-sound");
  const status = document.getElementById("sound-status");
  if (!stopButton || !status) return;
  let mode = "pitch";
  let context;
  let active = null;
  let serial = 0;
  const svgNS = "http://www.w3.org/2000/svg";
  function scale(config) {
    return config.rms * Math.sqrt(2 / config.harmonics.reduce((sum, h) => sum + h * h, 0));
  }
  function value(config, t) {
    return scale(config) * config.harmonics.reduce((sum, h, i) =>
      sum + h * Math.sin(2 * Math.PI * config.frequency * (i + 1) * t), 0);
  }
  function draw(id, config) {
    document.getElementById("sample-" + id + "-title").textContent = config.title;
    document.getElementById("sample-" + id + "-meta").textContent =
      "基频 " + config.frequency + " Hz · RMS " + config.rms.toFixed(2);
    const svg = document.getElementById("wave-" + id);
    svg.replaceChildren();
    svg.setAttribute("aria-label", config.title + "：基频 " + config.frequency + " Hz，20 毫秒波形；横轴时间，纵轴相对信号幅度");
    [25, 75, 125].forEach(y => {
      const line = document.createElementNS(svgNS, "line");
      Object.entries({ x1: 0, y1: y, x2: 560, y2: y, class: y === 75 ? "wave-zero" : "wave-grid" })
        .forEach(([key, val]) => line.setAttribute(key, String(val)));
      svg.append(line);
    });
    let d = "";
    for (let x = 0; x <= 560; x++) {
      d += (x ? " L" : "M") + x + "," + (75 - value(config, x / 560 * 0.02) * 440).toFixed(2);
    }
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", "wave-trace");
    svg.append(path);
    const bars = document.getElementById("harmonics-" + id);
    bars.replaceChildren();
    config.harmonics.forEach((h, i) => {
      const column = document.createElement("div");
      column.className = "harmonic-column";
      const track = document.createElement("div");
      track.className = "harmonic-track";
      const fill = document.createElement("span");
      fill.className = "harmonic-fill";
      fill.style.height = (h * scale(config) / 0.12 * 100).toFixed(2) + "%";
      const label = document.createElement("span");
      label.textContent = config.frequency * (i + 1) + " Hz";
      column.setAttribute("aria-label", label.textContent + "，相对幅度 " + (h * scale(config)).toFixed(3));
      track.append(fill);
      column.append(track, label);
      bars.append(column);
    });
  }
  function stop(message) {
    serial++;
    if (active) {
      const old = active;
      active = null;
      try {
        old.gain.gain.setTargetAtTime(0, context.currentTime, 0.005);
        old.source.stop(context.currentTime + 0.03);
      } catch (_) { /* Already ended. */ }
    }
    stopButton.disabled = true;
    plays.forEach(button => button.classList.remove("is-playing"));
    if (message) status.textContent = message;
  }
  function render() {
    stop("已切换对比，可播放 A、B。");
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.soundMode === mode)));
    document.getElementById("sound-observation").textContent = modes[mode].text;
    draw("a", modes[mode].a);
    draw("b", modes[mode].b);
  }
  async function play(id) {
    stop();
    const request = serial;
    const config = modes[mode][id];
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error("Audio unavailable");
      context ||= new AudioContext();
      await context.resume();
      if (request !== serial) return;
      const duration = 1.2;
      const buffer = context.createBuffer(1, Math.round(context.sampleRate * duration), context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / context.sampleRate;
        const ramp = Math.min(1, t / 0.035, (duration - t) / 0.035);
        const envelope = Math.sin(Math.max(0, ramp) * Math.PI / 2) ** 2;
        data[i] = value(config, t) * envelope;
      }
      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      source.connect(gain);
      gain.connect(context.destination);
      const current = { source, gain };
      active = current;
      source.onended = () => {
        source.disconnect();
        gain.disconnect();
        if (active !== current) return;
        active = null;
        stopButton.disabled = true;
        plays.forEach(button => button.classList.remove("is-playing"));
        status.textContent = id.toUpperCase() + " 播放完成。可再次播放或切换对比。";
      };
      stopButton.disabled = false;
      plays.find(button => button.dataset.playSample === id).classList.add("is-playing");
      status.textContent = "正在播放 " + config.title + "（1.2 秒）";
      source.start();
    } catch (_) {
      stop("当前浏览器未能播放音频；仍可通过波形与文字比较声音特征。");
    }
  }
  buttons.forEach(button => button.addEventListener("click", () => {
    mode = button.dataset.soundMode;
    render();
  }));
  plays.forEach(button => button.addEventListener("click", () => play(button.dataset.playSample)));
  stopButton.addEventListener("click", () => stop("已停止播放。"));
  window.addEventListener("pagehide", () => stop());
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop("已停止播放。"); });
  render();
  status.textContent = "点击按钮播放短音，不会自动播放。";
})();
