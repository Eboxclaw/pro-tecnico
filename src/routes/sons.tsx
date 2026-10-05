import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { playFail, playIntroYooo, playRatchet, playThock, toggleAmbient } from "@/lib/sounds";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sons")({
  head: () => ({
    meta: [{ title: "Sons da oficina — REJENDARI" }, { name: "robots", content: "noindex" }],
  }),
  component: SonsPage,
});

const SFX = [
  {
    play: playIntroYooo,
    name: "Intro · yooo oooo bonk",
    file: "public/sounds/intro-yooo.mp3 (o teu mp3)",
    where: "Só durante o loading (3s): primeiro clique após o splash.",
  },
  {
    play: playRatchet,
    name: "Catraca",
    file: "sintetizado",
    where: "Clique no ♡ like e no ★ favorito.",
  },
  {
    play: playThock,
    name: "Thock (kick)",
    file: "sintetizado",
    where: "Reserva confirmada com sucesso.",
  },
  {
    play: playFail,
    name: "Fail (faahaha)",
    file: "public/sounds/fail-faaah.mp3 (o teu mp3)",
    where: "Página 404, erros e produto esgotado.",
  },
  {
    play: toggleAmbient,
    name: "Ambiente (loop)",
    file: "public/sounds/ambiente-loop.mp3 (o teu tema do Suno)",
    where: "Loop contínuo de volume baixo para acompanhar as compras.",
  },
] as const;

function SonsPage() {
  const [last, setLast] = useState("");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="jp-label text-primary">音 · sons da oficina</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">
        Um som de cada vez.
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Toca cada efeito isoladamente e diz-nos quais não queres. O volume é intencionalmente baixo;
        o intro usa o teu mp3 de public/sounds/intro-yooo.mp3.
        {last && (
          <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.13em] text-primary">
            último: {last}
          </span>
        )}
      </p>

      <ul className="mt-8 divide-y divide-border border border-border bg-card">
        {SFX.map((sfx) => (
          <li key={sfx.name} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-display text-lg font-semibold">{sfx.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sfx.where}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                {sfx.file}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-none"
              onClick={() => {
                setLast(sfx.name);
                sfx.play();
              }}
            >
              Tocar
            </Button>
          </li>
        ))}
      </ul>

      <p className="mt-6 font-mono text-[9px] uppercase leading-4 tracking-[0.12em] text-muted-foreground">
        Diz quais não queres e trocamos ou removemos. Fonte dos sons: src/lib/sounds.ts.
      </p>
    </div>
  );
}
