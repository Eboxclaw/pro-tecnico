import { useState, type ImgHTMLAttributes } from "react";
import { ImageOff } from "lucide-react";

/** Keep a failed external photograph from breaking the card or its accessible name. */
export function ProductImage({
  src,
  alt = "",
  className = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [failedSrc, setFailedSrc] = useState<string>();
  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={`${alt || "Produto"} — fotografia indisponível`}
        className={`flex flex-col items-center justify-center gap-3 bg-[#eee8dc] p-5 text-center text-[#625c53] ${className}`}
      >
        <ImageOff className="h-6 w-6" aria-hidden="true" />
        <span className="max-w-56 text-xs leading-5">{alt || "Produto"}</span>
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
