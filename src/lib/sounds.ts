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

/** Toca o ambiente (se ligado e o ficheiro existir). Devolve true se começou. */
export async function startAmbient(): Promise<boolean> {
  if (!ambientEnabled()) return false;
  const el = ambientElement();
  try {
    await el.play();
    return true;
  } catch {
    // autoplay bloqueado no 1.º load: arranca no primeiro gesto
    return false;
  }
}

export function stopAmbient() {
  ambientElement().pause();
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
