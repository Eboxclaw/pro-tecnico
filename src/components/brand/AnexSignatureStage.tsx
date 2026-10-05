import { Link } from "@tanstack/react-router";
import { ANEX_SIGNATURE_SOLUTIONS } from "@/data/anex-editorial";
import { referenceById } from "@/data/curated-tool-references";
import { ProductImage } from "@/components/shop/ProductImage";
import { AnexRyujinScene } from "./AnexRyujinScene";

const ORDER = [
  "anex-397-d",
  "anex-aoa-17s1",
  "anex-adrs-2065",
  "anex-ryujin-artm5-01",
  "anex-azm-2698",
];
export function AnexSignatureStage() {
  return (
    <div className="anex-signature-stage" aria-label="As cinco soluções de assinatura ANEX">
      <AnexRyujinScene />
      <span className="anex-stage-mark" aria-hidden="true">
        龍靭
      </span>
      <div className="anex-stage-tools">
        {ORDER.map((id, index) => {
          const tool = referenceById(id);
          const solution = ANEX_SIGNATURE_SOLUTIONS.find((item) => item.id === id);
          if (!tool || !solution) return null;
          return (
            <Link
              key={id}
              to="/referencia/$id"
              params={{ id }}
              className={`anex-stage-tool anex-stage-tool-${index + 1}`}
            >
              <span className="anex-stage-code">
                0{index + 1} / {tool.model}
              </span>
              <ProductImage
                src={tool.imageUrl}
                alt={tool.imageAlt ?? tool.namePt}
                loading={index < 3 ? "eager" : "lazy"}
                className="anex-stage-image"
              />
              <strong>{solution.name}</strong>
              <span>{solution.detail}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
