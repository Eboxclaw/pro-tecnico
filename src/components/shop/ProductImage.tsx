import { useState, type ImgHTMLAttributes } from "react";
import { ImageOff } from "lucide-react";

function monogramOf(brand?: string | undefined, fallback?: string | undefined) {
  const source = (brand ?? fallback ?? "").trim();
  if (!source) return "R";
  const words = source.split(/\s+/).filter(Boolean);
  const first = words[0] ?? "R";
  const second = words[1] ?? "";
  const letters = second ? first.charAt(0) + second.charAt(0) : first.slice(0, 2);
  return letters.toUpperCase();
}

/**
 * Prato editorial quando não há fotografia: monograma da marca dimensionado
 * pelo próprio prato (container query), parece intencional, não partido.
 */
export function ProductMonogram({
  brand,
  label,
  className = "",
}: {
  brand?: string | undefined;
  label?: string | undefined;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${label || brand || "Produto"}, representação editorial da marca`}
      className={`product-plate relative flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <span
        aria-hidden
        className="font-display text-[38cqi] font-semibold leading-none tracking-[-0.06em] text-[#29272014]"
      >
        {monogramOf(brand, label)}
      </span>
      <span
        aria-hidden
        className="absolute bottom-[6%] font-mono text-[max(7px,3.2cqi)] uppercase tracking-[0.14em] text-[#625c5399]"
      >
        {brand ?? label ?? "REJENDARI"}
      </span>
    </div>
  );
}

/** Keep a failed external photograph from breaking the card or its accessible name. */
export function ProductImage({
  src,
  alt = "",
  brand,
  className = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { brand?: string | undefined }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  if (!src) {
    return <ProductMonogram brand={brand} label={alt} className={className} />;
  }
  if (failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={`${alt || brand || "Produto"}, fotografia indisponível`}
        className={`product-plate flex flex-col items-center justify-center gap-3 p-5 text-center text-[#625c53] ${className}`}
      >
        <ImageOff className="h-6 w-6" aria-hidden="true" />
        <span className="max-w-56 text-xs leading-5">{alt || brand || "Produto"}</span>
        <span className="font-mono text-[9px] uppercase tracking-wider">
          Fotografia indisponível
        </span>
      </div>
    );
  }
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={className}
      loading={props.loading ?? "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(event) => {
        setFailedSrc(src);
        props.onError?.(event);
      }}
    />
  );
}
