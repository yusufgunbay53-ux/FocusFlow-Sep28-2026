/** Procedural Lo-Fi / rain via Web Audio — no external assets. */

export type SoundMode = "off" | "lofi" | "rain";

export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private timers: number[] = [];
  mode: SoundMode = "off";

  private ensure() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.22;
      this.master.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  setVolume(v: number) {
    if (this.master) this.master.gain.value = v;
  }

  stop() {
    this.timers.forEach(clearInterval);
    this.timers = [];
    this.nodes.forEach((n) => {
      try {
        (n as OscillatorNode).stop?.();
      } catch {}
      try {
        n.disconnect();
      } catch {}
    });
    this.nodes = [];
    this.mode = "off";
  }

  async play(mode: SoundMode) {
    this.stop();
    if (mode === "off") return;
    const ctx = this.ensure();
    await ctx.resume();
    this.mode = mode;
    if (mode === "rain") this.startRain(ctx);
    else this.startLofi(ctx);
  }

  private startRain(ctx: AudioContext) {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    const gain = ctx.createGain();
    gain.gain.value = 0.55;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.master!);
    noise.start();
    this.nodes.push(noise, filter, gain);
  }

  private startLofi(ctx: AudioContext) {
    const notes = [196, 246.94, 293.66, 329.63, 392];
    const playChord = () => {
      const root = notes[Math.floor(Math.random() * notes.length)];
      [1, 1.25, 1.5].forEach((m, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? "triangle" : "sine";
        osc.frequency.value = root * m;
        const g = ctx.createGain();
        g.gain.value = 0;
        osc.connect(g);
        g.connect(this.master!);
        const now = ctx.currentTime;
        g.gain.linearRampToValueAtTime(0.08 / (i + 1), now + 0.4);
        g.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
        osc.start(now);
        osc.stop(now + 3.3);
        this.nodes.push(osc, g);
      });
    };
    playChord();
    this.timers.push(window.setInterval(playChord, 2800) as unknown as number);
  }
}
