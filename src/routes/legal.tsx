import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Informação legal — REJENDARI" },
      {
        name: "description",
        content: "Termos, privacidade, devoluções, garantia e regulamento do sorteio da REJENDARI.",
      },
      { property: "og:title", content: "Informação legal — REJENDARI" },
      {
        property: "og:description",
        content: "Termos, privacidade, devoluções, garantia e regulamento do sorteio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LegalPage,
});

const CONTENT = {
  terms: [
    "A seleção editorial apresenta referências de fabricantes e ajuda a comparar aplicações. Uma referência no catálogo não constitui confirmação de stock, preço ou prazo de entrega.",
    "Os pedidos profissionais são analisados individualmente. Antes de qualquer compra devem ser confirmados a referência exata, a composição, o preço total e as condições de entrega. Uma proposta de kit editorial só constitui um conjunto comercial quando isso estiver expressamente indicado.",
  ],
  privacy: [
    "Os formulários pedem os dados necessários ao pedido: contacto, empresa e referências procuradas. Evita incluir informação sensível no campo de mensagem.",
    "A conta permite autenticação e consulta dos dados associados ao utilizador. O catálogo e as compras usam Shopify; a autenticação e os pedidos profissionais usam Supabase. As fotografias externas são carregadas a partir dos domínios indicados nas fontes.",
    "A identificação do responsável pelo tratamento, o contacto para exercer direitos, os prazos de conservação e as condições de transferência de dados têm de ser publicados antes da abertura comercial.",
  ],
  returns: [
    "Guarda a referência, a fatura e a identificação da encomenda para qualquer pedido de devolução. A devolução de uma compra e a comunicação de um defeito são situações distintas.",
    "O procedimento, o endereço de devolução e a informação legal sobre prazos, custos e exceções serão disponibilizados com as condições de venda antes da abertura. Esta página não limita os direitos legais dos consumidores.",
  ],
  warranty: [
    "A garantia legal e eventuais garantias comerciais do fabricante são distintas. As condições comerciais podem variar conforme o produto, o país e o registo exigido pelo fabricante.",
    "Confirma o modelo e o número de série e guarda o comprovativo de compra. A documentação técnica ligada em cada ficha ajuda a identificar a ferramenta; não substitui as condições de garantia aplicáveis à compra.",
  ],
  raffle: [
    "Os pontos e os convites associados à conta devem ser consultados na página Pontos. A existência de um link de convite não garante uma recompensa: são necessárias condições de campanha aplicáveis e validação.",
    "Cada campanha ou sorteio necessita de condições próprias que identifiquem elegibilidade, datas, vantagens e forma de participação. Não participes sem consultar o regulamento aplicável. Não é atribuída nesta página uma taxa de conversão dos pontos em dinheiro.",
  ],
};
const SECTIONS = ["terms", "privacy", "returns", "warranty", "raffle"] as const;

function LegalPage() {
  const t = useT();
  return (
    <div>
      <section className="border-b border-border">
        <div className="technical-grid mx-auto max-w-[1100px] px-4 py-14 sm:px-6">
          <p className="jp-label text-primary">規約 · informação legal</p>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.055em]">
            {t("legal.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            Informação de preparação da loja. As condições contratuais finais e a identificação da
            entidade vendedora ainda não estão publicadas.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
        <nav aria-label="Secções de informação legal" className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="border border-border px-3 py-2 font-mono text-xs hover:border-primary"
            >
              {t(`legal.${s}`)}
            </a>
          ))}
        </nav>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {SECTIONS.map((s, i) => (
            <section
              key={s}
              id={s}
              className="scroll-mt-40 grid gap-4 py-7 sm:grid-cols-[90px_1fr]"
            >
              <p className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</p>
              <div>
                <h2 className="font-display text-2xl font-semibold">{t(`legal.${s}`)}</h2>
                {CONTENT[s].map((p) => (
                  <p key={p} className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="mt-8 border-l-2 border-primary bg-surface p-6">
          <h2 className="font-display text-xl font-semibold">Antes da abertura comercial</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Falta publicar a denominação e o NIF da entidade vendedora, morada, contactos de apoio,
            informação sobre reclamações e resolução de litígios, condições de venda e política de
            privacidade completas.
          </p>
        </aside>
      </div>
    </div>
  );
}
