import { useRef, useState } from "react";
import { ImageOff, ScanLine } from "lucide-react";
import type { CuratedToolReference } from "@/data/curated-tool-references";

type SmartProductVisualProps = {
  tool: CuratedToolReference;
  featured?: boolean;
  hero?: boolean;
  className?: string;
};

export function SmartProductVisual({
  tool,
  featured = false,
  hero = false,
  className = "",
}: SmartProductVisualProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [failedSrc, setFailedSrc] = useState<string>();
  const imageFailed = failedSrc === tool.imageUrl;
  const imagePadding = hero
    ? "p-7 sm:p-12 lg:p-16"
    : tool.task === "grip"
      ? featured
        ? "p-3 sm:p-5"
        : "p-3 sm:p-4"
      : featured
        ? "p-7 sm:p-9"
        : "p-6";

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty("--product-x", `${(x * 14).toFixed(2)}px`);
    stage.style.setProperty("--product-y", `${(y * 12).toFixed(2)}px`);
    stage.style.setProperty("--product-rx", `${(-y * 2.2).toFixed(2)}deg`);
    stage.style.setProperty("--product-ry", `${(x * 2.8).toFixed(2)}deg`);
    stage.style.setProperty("--product-back-x", `${(-x * 6).toFixed(2)}px`);
    stage.style.setProperty("--product-back-y", `${(-y * 5).toFixed(2)}px`);
  };

  const reset = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--product-x", "0px");
    stage.style.setProperty("--product-y", "0px");
    stage.style.setProperty("--product-rx", "0deg");
    stage.style.setProperty("--product-ry", "0deg");
    stage.style.setProperty("--product-back-x", "0px");
    stage.style.setProperty("--product-back-y", "0px");
  };

  return (
    <div
      ref={stageRef}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={`smart-product-visual group/visual relative overflow-hidden bg-[var(--plate)] ${hero ? "h-[420px] sm:h-[520px] lg:h-[640px]" : featured ? "aspect-[16/10]" : "aspect-[4/3]"} ${className}`}
    >
      <div className="washi-noise absolute inset-0 opacity-55" aria-hidden="true" />
      <div className="smart-product-grid absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="smart-product-orbit absolute left-[12%] top-[12%] h-[58%] w-[58%] rounded-full border border-black/[0.07]" aria-hidden="true" />
      <div className="smart-product-orbit absolute bottom-[8%] right-[7%] h-[34%] w-[34%] rounded-full border border-primary/10" aria-hidden="true" />

      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3.5 sm:p-4">
        <span className="border border-black/10 bg-white/88 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-black/62 shadow-sm backdrop-blur">
          {tool.badge}
        </span>
        <span className="font-display text-[11px] font-semibold tracking-[0.06em] text-black/40">
          {tool.japanese}
        </span>
      </div>

      {tool.imageUrl && !imageFailed ? (
        <>
          <img
            src={tool.imageUrl}
            alt=""
            aria-hidden="true"
            loading={hero ? "eager" : "lazy"}
            referrerPolicy="no-referrer"
            className={`smart-product-ghost absolute inset-0 z-[1] h-full w-full object-contain opacity-[0.08] blur-[0.4px] ${imagePadding}`}
          />
          <img
            src={tool.imageUrl}
            alt={tool.imageAlt ?? `${tool.brand} ${tool.model}`}
            loading={hero ? "eager" : "lazy"}
            referrerPolicy="no-referrer"
            onError={() => setFailedSrc(tool.imageUrl)}
            className={`smart-product-main absolute inset-0 z-[3] h-full w-full object-contain ${imagePadding}`}
          />
        </>
      ) : (
        <div className="micro-grid relative z-[3] flex h-full min-h-[260px] w-full flex-col items-center justify-center p-8 text-center">
          <span className="jp-label text-primary">{tool.japanese}</span>
          <span className="mt-4 font-display text-4xl font-semibold tracking-[-0.06em] text-black/16">{tool.brand}</span>
          <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-black/42">{tool.model}</span>
          <span className="mt-3 text-xs text-black/55">{imageFailed ? "Fotografia indisponível" : "Fotografia em preparação"}</span>
          {imageFailed && <ImageOff className="mt-5 h-5 w-5 text-black/25" />}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-[16%] bottom-[9%] z-[2] h-8 rounded-[50%] bg-black/12 blur-xl" />
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.13em] text-black/45">
        <ScanLine className="h-3 w-3 text-primary" />
        <span>REF {tool.officialCode ?? tool.model}</span>
      </div>
      {tool.specPt && (
        <span className="absolute bottom-3 right-3 z-20 max-w-[48%] truncate border border-black/10 bg-white/72 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-black/48 backdrop-blur">
          {tool.specPt}
        </span>
      )}
    </div>
  );
}
