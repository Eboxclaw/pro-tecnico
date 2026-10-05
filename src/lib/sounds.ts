/**
 * Sons da casa: sintetizados na hora com Web Audio. Zero ficheiros, zero peso.
 * Fofos e discretos: volume baixo, curtos, só em momentos com significado
 * (abertura, like, favorito, reserva confirmada, erros).
 * O contexto desbloqueia no primeiro gesto do utilizador (política de autoplay).
 * Preferência guardada em localStorage; toggle no rodapé.
 */

const PREF_KEY = "rejendari:som";

export function soundEnabled(): boolean {
  try {
    return localStorage.getItem(PREF_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(PREF_KEY, on ? "on" : "off");
  } catch {
    // storage indisponível: a preferência vive só nesta sessão
  }
}

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined" || !soundEnabled()) return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx.state === "running" ? ctx : null;
}

/** Desbloqueia o áudio no primeiro gesto (política de autoplay dos browsers). */
if (typeof window !== "undefined") {
  const unlock = () => {
    audio();
    window.removeEventListener("pointerdown", unlock, true);
    window.removeEventListener("keydown", unlock, true);
  };
  window.addEventListener("pointerdown", unlock, { capture: true });
  window.addEventListener("keydown", unlock, { capture: true });
}

function env(gain: GainNode, peak: number, seconds: number, when: number) {
  const g = gain.gain;
  g.setValueAtTime(0.0001, when);
  g.exponentialRampToValueAtTime(peak, when + 0.012);
  g.exponentialRampToValueAtTime(0.0001, when + seconds);
}

function noiseBuffer(context: AudioContext, seconds: number) {
  const buffer = context.createBuffer(
    1,
    Math.ceil(context.sampleRate * seconds),
    context.sampleRate,
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Bonk quente de abertura: o kanji 選 a assentar na bancada. */
export function playBonk() {
  const context = audio();
  if (!context) return;
  const t = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(210, t);
  osc.frequency.exponentialRampToValueAtTime(92, t + 0.16);
  env(gain, 0.5, 0.3, t);
  osc.connect(gain).connect(context.destination);
  osc.start(t);
  osc.stop(t + 0.32);

  const thump = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const thumpGain = context.createGain();
  thump.buffer = noiseBuffer(context, 0.08);
  filter.type = "lowpass";
  filter.frequency.value = 420;
  env(thumpGain, 0.28, 0.09, t);
  thump.connect(filter).connect(thumpGain).connect(context.destination);
  thump.start(t);
}

/** Catraca: três cliques curtos de engrenagem a trabalhar. */
export function playRatchet() {
  const context = audio();
  if (!context) return;
  const t = context.currentTime;
  for (let i = 0; i < 3; i++) {
    const when = t + i * 0.048;
    const click = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    click.buffer = noiseBuffer(context, 0.02);
    filter.type = "bandpass";
    filter.frequency.value = 3300;
    filter.Q.value = 6;
    env(gain, 0.32, 0.025, when);
    click.connect(filter).connect(gain).connect(context.destination);
    click.start(when);
  }
}

/** Ting metálico: a estrela ★ a assentar no system. */
export function playTing() {
  const context = audio();
  if (!context) return;
  const t = context.currentTime;
  for (const [freq, peak] of [
    [1320, 0.22],
    [1985, 0.09],
  ] as const) {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    env(gain, peak, 0.5, t);
    osc.connect(gain).connect(context.destination);
    osc.start(t);
    osc.stop(t + 0.55);
  }
}

/** Thock de martelo: a reserva a ficar cravada na bancada. */
export function playThock() {
  const context = audio();
  if (!context) return;
  const t = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(72, t + 0.11);
  env(gain, 0.55, 0.16, t);
  osc.connect(gain).connect(context.destination);
  osc.start(t);
  osc.stop(t + 0.18);

  const strike = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const strikeGain = context.createGain();
  strike.buffer = noiseBuffer(context, 0.05);
  filter.type = "lowpass";
  filter.frequency.value = 1100;
  env(strikeGain, 0.3, 0.05, t);
  strike.connect(filter).connect(strikeGain).connect(context.destination);
  strike.start(t);
}

/** Faahaha: o fail simpático para esgotado, erros e páginas perdidas. */
export function playFail() {
  const context = audio();
  if (!context) return;
  const t = context.currentTime;
  for (const [start, freq, length] of [
    [0, 233, 0.26],
    [0.3, 174, 0.44],
  ] as const) {
    const osc = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, t + start);
    osc.frequency.linearRampToValueAtTime(freq * 0.88, t + start + length);
    filter.type = "lowpass";
    filter.frequency.value = 900;
    env(gain, 0.16, length, t + start);
    osc.connect(filter).connect(gain).connect(context.destination);
    osc.start(t + start);
    osc.stop(t + start + length + 0.05);
  }
}
