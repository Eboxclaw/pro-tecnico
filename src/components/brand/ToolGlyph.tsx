import type { SVGProps } from "react";

export type ToolGlyphName =
  | "precision"
  | "driver"
  | "socket"
  | "grip"
  | "cut"
  | "hvac"
  | "power"
  | "electronics"
  | "ev"
  | "reward"
  | "referral";

export function ToolGlyph({
  name,
  className,
  ...props
}: { name: ToolGlyphName; className?: string } & SVGProps<SVGSVGElement>) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} {...props}>
      {name === "precision" && (
        <>
          <circle cx="16" cy="16" r="8.25" {...shared} />
          <circle cx="16" cy="16" r="2.25" {...shared} />
          <path d="M16 3v5M16 24v5M3 16h5M24 16h5" {...shared} />
          <path d="M7.2 7.2l3.4 3.4M21.4 21.4l3.4 3.4" {...shared} />
        </>
      )}
      {name === "driver" && (
        <>
          <path d="M7 24.5L22.5 9M10 27l-3-3 4.5-4.5 3 3L10 27Z" {...shared} />
          <path d="M21 7.5l3.5-3.5L28 7.5 24.5 11" {...shared} />
          <path d="M18.8 10.7l2.5 2.5" {...shared} />
        </>
      )}
      {name === "socket" && (
        <>
          <path d="M7 10.5 12 6h8l5 4.5v11L20 26h-8l-5-4.5v-11Z" {...shared} />
          <path d="M12 12h8v8h-8z" {...shared} />
          <path d="M16 6v6M16 20v6" {...shared} />
        </>
      )}
      {name === "grip" && (
        <>
          <path d="M9 6c2.4 3.4 4.7 5.9 7 7.5 2.3-1.6 4.6-4.1 7-7.5" {...shared} />
          <path d="M16 13.5 10 28M16 13.5 22 28" {...shared} />
          <path d="M8 4.5 11.5 8M24 4.5 20.5 8" {...shared} />
        </>
      )}
      {name === "cut" && (
        <>
          <path d="M8 25 23.5 9.5M10.5 27.5 6 23l4-4 4.5 4.5-4 4Z" {...shared} />
          <path d="m20.5 7 2.5-2.5 4.5 4.5-2.5 2.5" {...shared} />
          <path d="M21 11 9.5 22.5" {...shared} />
        </>
      )}
      {name === "hvac" && (
        <>
          <path d="M5 11h9v10H5zM18 7h9v18h-9z" {...shared} />
          <path d="M8 15h3M21 11h3M21 15h3M21 19h3" {...shared} />
          <path d="M14 16h4" {...shared} />
        </>
      )}
      {name === "power" && (
        <>
          <path d="M5 12h12l5 5-5 5H5z" {...shared} />
          <path d="M17 12v10M22 17h5" {...shared} />
          <path d="M8 22v5h7v-5" {...shared} />
          <path d="M10 15h4" {...shared} />
        </>
      )}
      {name === "electronics" && (
        <>
          <path d="M10 10h12v12H10z" {...shared} />
          <path d="M13 13h6v6h-6z" {...shared} />
          <path d="M6 12.5h4M6 16h4M6 19.5h4M22 12.5h4M22 16h4M22 19.5h4" {...shared} />
          <path d="M12.5 6v4M16 6v4M19.5 6v4M12.5 22v4M16 22v4M19.5 22v4" {...shared} />
        </>
      )}
      {name === "ev" && (
        <>
          <path d="M6.5 21.5 9 14.5h14l2.5 7" {...shared} />
          <path d="M4.5 21.5h23" {...shared} />
          <circle cx="10" cy="24" r="1.9" {...shared} />
          <circle cx="22" cy="24" r="1.9" {...shared} />
          <path d="M17 10.5 13.5 15h2.8l-1.6 4 4.3-5h-2.7l1.4-3.5z" {...shared} />
        </>
      )}
      {name === "reward" && (
        <>
          <circle cx="16" cy="13" r="8" {...shared} />
          <path d="m12 20-2 9 6-3 6 3-2-9" {...shared} />
          <path
            d="m16 8 1.4 2.8 3.1.4-2.2 2.2.5 3.1-2.8-1.5-2.8 1.5.5-3.1-2.2-2.2 3.1-.4L16 8Z"
            {...shared}
          />
        </>
      )}
      {name === "referral" && (
        <>
          <circle cx="11" cy="11" r="4" {...shared} />
          <circle cx="23" cy="21" r="4" {...shared} />
          <path d="M14 13.5 20 18.5M8.5 15 6 22h9M26 17l2-6h-9" {...shared} />
        </>
      )}
    </svg>
  );
}
