import { useEffect, useState } from "react";
import { startAmbient } from "@/lib/sounds";

/**
 * Cortina de abertura REJENDARI: uma vez por sessão, salta com um clique e
 * desaparece por completo para quem prefere movimento reduzido.
 * A página por baixo já está renderizada, a cortina só acenta a entrada.
 * É aqui que o loop ambiente arranca — o som de fundo do site.
 */
const SESSION_KEY = "rejendari:intro-vista";

export function IntroSplash() {
  const [phase, setPhase] = useState<"hidden" | "playing" | "leaving">(() => {
    if (typeof window === "undefined") return "hidden";
    if (window.sessionStorage.getItem(SESSION_KEY)) return "hidden";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "hidden";
    return "playing";
  });

  useEffect(() => {
    // a chave grava-se logo à entrada: navegar ou recarregar durante o loading
    // não repete o splash
    if (phase === "playing") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      // o loop ambiente arranca com o loading (no 1.º load espera pelo clique)
      void startAmbient();
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "hidden") return;
    document.documentElement.style.overflow = "hidden";
    const leave = setTimeout(() => setPhase("leaving"), 3000);
    const done = setTimeout(() => setPhase("hidden"), 3900);
    return () => {
      clearTimeout(leave);
      clearTimeout(done);
      document.documentElement.style.overflow = "";
    };
  }, [phase]);

  if (phase === "hidden") return null;

  const skip = () => {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    setPhase("hidden");
    document.documentElement.style.overflow = "";
  };

  return (
    <div
      role="presentation"
      onClick={skip}
      className={`intro-splash fixed inset-0 flex cursor-pointer flex-col items-center justify-center bg-[#1b1917] ${
        phase === "leaving" ? "intro-splash--leave" : ""
      }`}
    >
      <div className="washi-noise absolute inset-0 opacity-25" aria-hidden="true" />
      <span
        className="intro-vertical absolute right-6 top-1/2 hidden -translate-y-1/2 font-display text-sm tracking-[0.5em] text-white/25 sm:block md:right-14"
        aria-hidden="true"
      >
        選り抜きの道具を、より賢く。
      </span>

      <p className="intro-line h-px w-24 origin-left bg-[#c7c2ec]/70" aria-hidden="true" />

      <div className="intro-mark relative mt-8 grid place-items-center">
        <span
          className="intro-kanji font-display text-7xl font-semibold text-[#c7c2ec] sm:text-8xl"
          aria-hidden="true"
        >
          選
        </span>
        <span className="intro-mono absolute -bottom-3 font-mono text-[9px] uppercase tracking-[0.5em] text-white/40">
          せん
        </span>
      </div>

      <p className="intro-word mt-14 font-display text-3xl font-semibold tracking-[0.22em] text-white sm:text-4xl">
        REJENDARI
      </p>
      <p className="intro-sub mt-4 font-mono text-[9px] uppercase tracking-[0.42em] text-white/45">
        JAPAN FIRST · PORTUGAL READY
      </p>
      <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.24em] text-[#c7c2ec]/80">
        clica em qualquer lado para entrar com som de fundo
      </p>

      <span
        className="intro-line intro-line--bottom mt-8 h-px w-40 origin-right bg-white/20"
        aria-hidden="true"
      />
    </div>
  );
}
