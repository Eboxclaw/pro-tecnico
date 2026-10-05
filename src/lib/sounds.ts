/**
 * Sons da casa: o "yooo oooo bonk" japonês na abertura (sintetizado, ou o teu
 * mp3 real se colocares o ficheiro em public/sounds/intro-yooo.mp3) e efeitos
 * de oficina sintetizados para os momentos com significado.
 *
 * Tudo passa por withAudio: cria o AudioContext, espera o resume() e só depois
 * renderiza — nenhum som se perde no primeiro clique (política de autoplay).
 * Preferência guardada em localStorage; toggle no rodapé.
 */

const PREF_KEY = "rejendari:som";
const INTRO_FILE_VARIANTS = ["/sounds/intro-yooo.mp3", "/sounds/myinstants.mp3"];

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

async function withAudio(render: (context: AudioContext, when: number) => void) {
  if (typeof window === "undefined" || !soundEnabled()) return;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  try {
    if (ctx.state === "suspended") await ctx.resume();
  } catch {
    return;
  }
  if (ctx.state !== "running") return;
  render(ctx, ctx.currentTime + 0.02);
}

function logNamed(name: string) {
  const w = window as unknown as { __rejendariSounds?: string[] };
  w.__rejendariSounds = [...(w.__rejendariSounds ?? []), name].slice(-12);
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

let introBufferCache: AudioBuffer | null = null;

async function introBuffer(context: AudioContext): Promise<AudioBuffer | null> {
  if (introBufferCache) return introBufferCache;
  for (const url of INTRO_FILE_VARIANTS) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      introBufferCache = await context.decodeAudioData(await res.arrayBuffer());
      return introBufferCache;
    } catch {
      // ficheiro ausente: segue para a versão sintetizada
    }
  }
  return null;
}

/** O "yooo oooo bonk" japonês na abertura: o teu mp3, só ele. */
export function playIntroYooo() {
  logNamed("intro");
  void withAudio(async (context, when) => {
    const buffer = await introBuffer(context);
    if (!buffer) {
      logNamed("intro:sem-ficheiro");
      return;
    }
    const source = context.createBufferSource();
    const gain = context.createGain();
    gain.gain.value = 0.6;
    source.buffer = buffer;
    source.connect(gain).connect(context.destination);
    source.start(when);
    logNamed("intro:mp3");
  });
}

/** Catraca: três cliques curtos de engrenagem a trabalhar. */
export function playRatchet() {
  logNamed("ratchet");
  void withAudio((context, when) => {
    for (let i = 0; i < 3; i++) {
      const clickWhen = when + i * 0.048;
      const click = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      click.buffer = noiseBuffer(context, 0.02);
      filter.type = "bandpass";
      filter.frequency.value = 3300;
      filter.Q.value = 6;
      env(gain, 0.42, 0.025, clickWhen);
      click.connect(filter).connect(gain).connect(context.destination);
      click.start(clickWhen);
    }
  });
}

/** Thock de martelo: a reserva a ficar cravada na bancada. */
export function playThock() {
  logNamed("thock");
  void withAudio((context, when) => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, when);
    osc.frequency.exponentialRampToValueAtTime(72, when + 0.11);
    env(gain, 0.65, 0.16, when);
    osc.connect(gain).connect(context.destination);
    osc.start(when);
    osc.stop(when + 0.18);

    const strike = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const strikeGain = context.createGain();
    strike.buffer = noiseBuffer(context, 0.05);
    filter.type = "lowpass";
    filter.frequency.value = 1100;
    env(strikeGain, 0.36, 0.05, when);
    strike.connect(filter).connect(strikeGain).connect(context.destination);
    strike.start(when);
  });
}

/** Faahaha real: public/sounds/fail-faaah.mp3 (o teu ficheiro); sintetizado só como recurso. */
const FAIL_FILE = "/sounds/fail-faaah.mp3";
let failBufferCache: AudioBuffer | null = null;

async function failBuffer(context: AudioContext): Promise<AudioBuffer | null> {
  if (failBufferCache) return failBufferCache;
  try {
    const res = await fetch(FAIL_FILE);
    if (!res.ok) return null;
    failBufferCache = await context.decodeAudioData(await res.arrayBuffer());
    return failBufferCache;
  } catch {
    return null;
  }
}

export function playFail() {
  logNamed("fail");
  void withAudio(async (context, when) => {
    const buffer = await failBuffer(context);
    if (!buffer) {
      logNamed("fail:sintetizado");
      synthFail(context, when);
      return;
    }
    const source = context.createBufferSource();
    const gain = context.createGain();
    gain.gain.value = 0.55;
    source.buffer = buffer;
    source.connect(gain).connect(context.destination);
    source.start(when);
    logNamed("fail:mp3");
  });
}

function synthFail(context: AudioContext, when: number) {
  for (const [start, freq, length] of [
    [0, 233, 0.26],
    [0.3, 174, 0.44],
  ] as const) {
    const osc = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, when + start);
    osc.frequency.linearRampToValueAtTime(freq * 0.88, when + start + length);
    filter.type = "lowpass";
    filter.frequency.value = 900;
    env(gain, 0.2, length, when + start);
    osc.connect(filter).connect(gain).connect(context.destination);
    osc.start(when + start);
    osc.stop(when + start + length + 0.05);
  }
}

/**
 * A abertura com som: o primeiro gesto em qualquer lado toca o "yooo oooo bonk".
 * O splash arma a bandeira; browsers bloqueiam áudio sem gesto, e este caminho
 * garante que o som pedido toca dentro do próprio gesto.
 */
let introArmed = false;
let introFired = false;

export function armIntroSound() {
  if (introFired) return;
  introArmed = true;
}

/** O yooo pertence só ao loading: passado o splash, o som desarma. */
export function disarmIntroSound() {
  introArmed = false;
}

function fireArmedIntro() {
  if (!introArmed || introFired) return;
  introArmed = false;
  introFired = true;
  playIntroYooo();
}

if (typeof window !== "undefined") {
  const unlock = () => {
    fireArmedIntro();
    window.removeEventListener("pointerdown", unlock, true);
    window.removeEventListener("keydown", unlock, true);
  };
  window.addEventListener("pointerdown", unlock, { capture: true });
  window.addEventListener("keydown", unlock, { capture: true });
}
