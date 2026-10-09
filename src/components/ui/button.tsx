import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Botão base REJENDARI (KUROKIN). TODAS as variantes são rounded-none por
 * defeito — a casa não usa cantos redondos em ações.
 *
 * Contrato de variantes:
 *   default  → dourado (bg-primary, tinta ink-950, brilho suave no hover)
 *   outline  → borda hairline, hover dourado
 *   ghost    → sem fundo nem borda, hover neutro
 *   secondary→ DEPRECATED (mantida só para usos legados; usar default/outline/ghost)
 *
 * Contrato de sizes: sm h-9 · default h-11 · lg h-12 — nada abaixo de h-9.
 * icon é quadrado (h-11 w-11) e existe apenas para controlos de toolbar legados.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium cursor-pointer transition-[color,background-color,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-[#1b1917] hover:bg-primary/90 hover:shadow-[0_0_24px_oklch(0.78_0.13_82/0.35)]",
        outline:
          "border border-input bg-transparent hover:border-primary/60 hover:bg-primary/10 hover:text-primary",
        ghost: "hover:bg-secondary hover:text-foreground",
        // DEPRECATED: manter até os usos legados migrarem para default/outline/ghost.
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
