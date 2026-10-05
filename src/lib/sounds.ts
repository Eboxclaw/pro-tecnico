/**
 * Sons da casa, esquema mínimo decidido:
 * 1. Ambiente instrumental em loop (o teu "Wrench Locking") — arranca com o
 *    loading e acompanha as compras em volume muito baixo.
 * 2. Faahaha nos erros e produto esgotado.
 * Nenhum outro som. Preferências guardadas em localStorage.
 */

const SFX_KEY = "rejendari:som";
const AMBIENT_KEY = "rejendari:ambiente";
const FAIL_FILE = "/sounds/fail-faaah.mp3";
const AMBIENT_FILE = "/sounds/ambiente-loop.mp3";

export function soundEnabled(): boolean {
  try {
    return localStorage.getItem(SFX_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(SFX_KEY, on ? "on" : "off");
  } catch {
    // storage indisponível
  }
}

export function ambientEnabled(): boolean {
  try {
    return localStorage.getItem(AMBIENT_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setAmbientEnabled(on: boolean) {
  try {
    localStorage.setItem(AMBIENT_KEY, on ? "on" : "off");
  } catch {
    // storage indisponível
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

// ── Ambiente em loop ─────────────────────────────────────────

let ambientEl: HTMLAudioElement | null = null;

function ambientElement(): HTMLAudioElement {
  if (!ambientEl) {
    ambientEl = new Audio(AMBIENT_FILE);
    ambientEl.loop = true;
    ambientEl.volume = 0.12;
    ambientEl.preload = "none";
    if (typeof window !== "undefined") {
      (window as unknown as { __rejendariAmbientEl?: HTMLAudioElement }).__rejendariAmbientEl =
        ambientEl;
    }
  }
  return ambientEl;
}

/**
 * Toca o ambiente (se ligado e o ficheiro existir). Nunca duplica: se já está
 * a tocar é no-op, e avisa os outros tabs (BroadcastChannel) para pausarem os
 * deles — o loop soa uma só vez, num só tab.
 */
function notifyAmbient() {
  try {
    window.dispatchEvent(new Event("rejendari:ambient-changed"));
  } catch {
    // sem janela: nada a notificar
  }
}

export async function startAmbient(): Promise<boolean> {
  if (!ambientEnabled()) return false;
  const el = ambientElement();
  if (!el.paused) return true;
  try {
    await el.play();
    emitAmbientStart();
    notifyAmbient();
    return true;
  } catch {
    // autoplay bloqueado no 1.º load: arranca no primeiro gesto
    return false;
  }
}

export function stopAmbient() {
  ambientElement().pause();
  notifyAmbient();
}

export function pauseAmbient() {
  ambientElement().pause();
  notifyAmbient();
}

export function ambientPlaying(): boolean {
  const el = ambientEl;
  return !!el && !el.paused && el.currentTime > 0;
}

/** Retoma o ambiente após um gesto (usado pelos controlos de UI). */
export function resumeAmbient(): boolean {
  setAmbientEnabled(true);
  const el = ambientElement();
  if (!el.paused) return true;
  void el
    .play()
    .then(emitAmbientStart)
    .catch(() => {});
  return true;
}

function emitAmbientStart() {
  try {
    getAmbientChannel().postMessage({ type: "ambient-start" });
  } catch {
    // canal indisponível: segue sem coordenação entre tabs
  }
}

let ambientChannel: BroadcastChannel | null = null;

function getAmbientChannel(): BroadcastChannel {
  if (!ambientChannel) {
    ambientChannel = new BroadcastChannel("rejendari-som");
    ambientChannel.onmessage = (event) => {
      if (event.data?.type === "ambient-start") ambientEl?.pause();
    };
  }
  return ambientChannel;
}

/** Silencia tudo: pausa o ambiente e desliga os efeitos. */
export function muteAll() {
  setSoundEnabled(false);
  stopAmbient();
}

/** Liga tudo: retoma o ambiente e reativa os efeitos. */
export function unmuteAll() {
  setSoundEnabled(true);
  void startAmbient();
}

/** Liga/desliga o ambiente a partir de um gesto (toggle do rodapé). */
export function toggleAmbient(): boolean {
  const next = !ambientEnabled();
  setAmbientEnabled(next);
  if (next) {
    void startAmbient();
  } else {
    stopAmbient();
  }
  return next;
}

/** O ambiente arranca no primeiro gesto, se estiver ligado. */
if (typeof window !== "undefined") {
  const startAmbientOnGesture = () => {
    void startAmbient();
    window.removeEventListener("pointerdown", startAmbientOnGesture, true);
    window.removeEventListener("keydown", startAmbientOnGesture, true);
  };
  window.addEventListener("pointerdown", startAmbientOnGesture, { capture: true });
  window.addEventListener("keydown", startAmbientOnGesture, { capture: true });
}

// ── Faahaha ──────────────────────────────────────────────────

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

let lastFailAt = 0;

export function playFail() {
  // cooldown: evita o fail a acumular em navegação seguida
  const now = Date.now();
  if (now - lastFailAt < 6000) return;
  lastFailAt = now;
  void withAudio(async (context, when) => {
    const buffer = await failBuffer(context);
    if (!buffer) return;
    const source = context.createBufferSource();
    const gain = context.createGain();
    gain.gain.value = 0.55;
    source.buffer = buffer;
    source.connect(gain).connect(context.destination);
    source.start(when);
  });
}
