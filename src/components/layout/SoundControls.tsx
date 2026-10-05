import { useEffect, useState } from "react";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";
import {
  ambientPlaying,
  muteAll,
  pauseAmbient,
  soundEnabled,
  startAmbient,
  unmuteAll,
} from "@/lib/sounds";

/**
 * Controlo de som sempre visível (canto inferior direito): pause/play do
 * ambiente e silenciar tudo. Compacto para não disputar atenção com a loja.
 */
export function SoundControls() {
  const [aTocar, setATocar] = useState(ambientPlaying());
  const [somLigado, setSomLigado] = useState(soundEnabled());

  useEffect(() => {
    const sync = () => {
      setATocar(ambientPlaying());
      setSomLigado(soundEnabled());
    };
    window.addEventListener("rejendari:ambient-changed", sync);
    const interval = window.setInterval(sync, 2000);
    return () => {
      window.removeEventListener("rejendari:ambient-changed", sync);
      window.clearInterval(interval);
    };
  }, []);

  const toggleAmbientPlay = () => {
    if (aTocar) {
      pauseAmbient();
      setATocar(false);
    } else {
      void startAmbient().then((ok) => setATocar(ok));
    }
  };

  const toggleSom = () => {
    if (somLigado) {
      muteAll();
      setSomLigado(false);
      setATocar(false);
    } else {
      unmuteAll();
      setSomLigado(true);
      window.setTimeout(() => setATocar(ambientPlaying()), 300);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-px border border-white/15 bg-[#1b1917]/92 p-1 shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur">
      <button
        type="button"
        onClick={toggleAmbientPlay}
        aria-label={aTocar ? "Pausar ambiente" : "Tocar ambiente"}
        className="grid h-8 w-8 place-items-center text-[#c7c2ec] transition-colors hover:text-white"
        title={aTocar ? "Pausar música ambiente" : "Tocar música ambiente"}
      >
        {aTocar ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <span className="h-4 w-px bg-white/15" aria-hidden="true" />
      <button
        type="button"
        onClick={() => {
          if (somLigado) {
            muteAll();
            setSomLigado(false);
            setATocar(false);
          } else {
            unmuteAll();
            setSomLigado(true);
            window.setTimeout(() => setATocar(ambientPlaying()), 300);
          }
        }}
        aria-label={somLigado ? "Silenciar tudo" : "Ligar som"}
        className="grid h-8 w-8 place-items-center text-white/55 transition-colors hover:text-white"
        title={somLigado ? "Silenciar tudo" : "Ligar som"}
      >
        {somLigado ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>
    </div>
  );
}
