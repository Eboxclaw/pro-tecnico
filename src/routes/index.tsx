import { ProductImage, ProductMonogram } from "@/components/shop/ProductImage";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { ReferenceProductCard } from "@/components/shop/ReferenceProductCard";
import { FeaturedDropCard } from "@/components/systems/SystemCards";
import { RejendariSeal } from "@/components/brand/RejendariSeal";
import { Button } from "@/components/ui/button";
import { BRAND_STORIES } from "@/data/brand-stories";
import { referenceById, SHOWCASED_BRANDS } from "@/data/curated-tool-references";
import { REJENDARI_KITS } from "@/data/kits";
import { featuredSystem } from "@/data/systems";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "REJENDARI — Ferramentas excecionais. Sistemas mais inteligentes." },
      {
        name: "description",
        content:
          "A REJENDARI encontra ferramentas excecionais, testa compatibilidades e cria sistemas mais inteligentes. Curadoria técnica em Portugal — do impacto ao 1000 V.",
      },
      {
        property: "og:title",
        content: "REJENDARI — Ferramentas excecionais. Sistemas mais inteligentes.",
      },
      {
        property: "og:description",
        content:
          "ANEX, VESSEL, Makita, Wera, Knipex, Bahco, TAJIMA e OLFA: seleção, sistemas e procura da comunidade a decidir os próximos drops.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/** A cadeia da casa: descobrir → escolher → combinar → trabalhar. */
const PIPELINE = [
  {
    kanji: "探",
    jp: "探す",
    pt: "Descobrir",
    note: "Fabricantes que resolvem problemas reais de trabalho.",
  },
  {
    kanji: "選",
    jp: "選ぶ",
    pt: "Escolher",
    note: "Uma referência por classe. A melhor ganha, sempre.",
  },
  {
    kanji: "組",
    jp: "組む",
    pt: "Combinar",
    note: "Sistemas que crescem por módulos, sem duplicar peças.",
  },
  {
    kanji: "仕事",
    jp: "仕事",
    pt: "Trabalhar",
    note: "Menos peso na mala, mais trabalho resolvido.",
  },
];

const SYMBOLS = [
  {
    kanji: "選",
    title: "Descoberta & seleção",
    text: "Não agregamos catálogos. Encontramos ferramentas excecionais — aço especificado, ergonomia provada, origem declarada — e deixamos as restantes de fora.",
  },
  {
    kanji: "組",
    title: "Compatibilidade & sistema",
    text: "Testamos como as ferramentas trabalham juntas: o mesmo bit no roquete, na máquina e no impacto. Cada módulo entra porque desbloqueia trabalho novo.",
  },
  {
    kanji: "仕事",
    title: "Trabalho resolvido",
    text: "O resultado mede-se no dia: menos peças repetidas, menos peso, mais cobertura. O investimento anterior continua útil quando o sistema cresce.",
  },
];

const HOUSE_RULES = [
  ["BEST COMPONENT WINS", "Nem tudo de uma marca: cada peça entra porque é a certa."],
  ["SÓ IMPACTO DOCUMENTADO", "O selo IMPACT READY só aparece quando está tecnicamente provado."],
  ["MENOS DUPLICAÇÃO", "Se a resposta for “aumenta o número de peças”, não entra."],
] as const;

/** Peças ANEX que abrem a seleção individual — a escola fundadora. */
const ANEX_PICKS = [
  "anex-397-d",
  "anex-ryujin-artm5-01",
  "anex-adrs-2065",
  "anex-art-14m-2-65",
  "anex-431",
  "anex-307-s1",
];

/** Destaques das outras escolas, todas em vitrina. */
const SCHOOL_PICKS = [
  "wera-8100-sb-6",
  "knipex-cobra-250",
  "vessel-220usb-s1eb",
  "bahco-s330",
  "olfa-xh-1",
  "tajima-l25-50e1-eur",
];

function Index() {
  const featured = featuredSystem();
  const anexPicks = ANEX_PICKS.map(referenceById).filter(Boolean);
  const schoolPicks = SCHOOL_PICKS.map(referenceById).filter(Boolean);

  return (
    <div>
      {/* ── HERO · a promessa ─────────────────────────────────── */}
      <section className="relative flex min-h-[92svh] flex-col overflow-hidden bg-[#1b1917]">
        <div className="technical-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="washi-noise absolute inset-0 opacity-20" aria-hidden="true" />
        <span
          className="hero-kanji-ghost pointer-events-none absolute -right-8 top-1/2 hidden -translate-y-1/2 select-none font-display text-[26rem] font-semibold leading-none text-white/[0.05] lg:block"
          aria-hidden="true"
        >
          選
        </span>
        <span
          className="writing-vertical absolute right-6 top-28 hidden select-none font-display text-base leading-loose tracking-[0.4em] text-white/35 md:right-14 lg:block"
          aria-hidden="true"
        >
          選り抜きの道具を、より賢く。
        </span>

        <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 pb-24 pt-32 sm:px-6 lg:px-10">
          <p className="hero-rise hero-rise-1 jp-label text-[#dfbba4]">
            選定工具 · curated tool systems
          </p>
          <h1 className="hero-rise hero-rise-2 mt-6 max-w-5xl font-display text-6xl font-semibold leading-[0.9] tracking-[-0.06em] text-white sm:text-8xl">
            REJENDARI
          </h1>
          <p className="hero-rise hero-rise-3 mt-6 max-w-2xl font-display text-2xl font-semibold leading-[1.1] tracking-[-0.04em] text-white/90 sm:text-3xl">
            Encontramos ferramentas excecionais.
            <span className="text-[#dfbba4]"> Criamos sistemas mais inteligentes.</span>
          </p>
          <p className="hero-rise hero-rise-3 mt-5 max-w-xl text-sm leading-7 text-white/55">
            Não fabricamos. Não colamos autocolantes. Descobrimos, escolhemos, combinamos — e a
            procura da comunidade decide o que entra em produção.
          </p>

          <div className="hero-rise hero-rise-4 mt-12 grid max-w-4xl grid-cols-2 gap-px border border-white/12 bg-white/12 sm:grid-cols-4">
            {PIPELINE.map((step, index) => (
              <div key={step.kanji} className="relative bg-[#1b1917] p-4 sm:p-5">
                <span className="absolute right-3 top-3 font-mono text-[9px] text-white/25">
                  0{index + 1}
                </span>
                <span className="font-display text-3xl text-[#dfbba4]">{step.kanji}</span>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
                  {step.jp}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-white">{step.pt}</p>
                <p className="mt-2 text-[11px] leading-5 text-white/50">{step.note}</p>
              </div>
            ))}
          </div>

          <div className="hero-rise hero-rise-4 mt-10 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-none bg-white text-[#1b1917] hover:bg-[#dfbba4]"
            >
              <a href="#systems">
                Ver os systems
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none border-white/25 bg-transparent text-white hover:border-[#dfbba4] hover:bg-transparent hover:text-[#dfbba4]"
            >
              <a href="#anex">Começar pela ANEX</a>
            </Button>
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
          aria-hidden="true"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/30">
            scroll
          </span>
          <span className="hero-scroll-hint block h-10 w-px bg-[#dfbba4]/60" />
        </div>
      </section>

      {/* ── 01 · SIMBOLOGIA ───────────────────────────────────── */}
      <section className="section-reveal paper-panel">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-col gap-4 border-b border-black/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="jp-label text-primary">
                <span className="mr-3 font-mono">01</span>基準 · o que a marca significa
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                Três ideias. Uma casa de seleção.
              </h2>
            </div>
            <RejendariSeal className="hidden lg:grid" />
          </div>

          <div className="mt-10 grid gap-px border border-black/15 bg-black/15 lg:grid-cols-3">
            {SYMBOLS.map((symbol, index) => (
              <article key={symbol.kanji} className="relative bg-[#f3eee2] p-7 sm:p-9">
                <span
                  className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[7rem] font-semibold leading-none text-black/[0.06]"
                  aria-hidden="true"
                >
                  {symbol.kanji}
                </span>
                <span className="font-mono text-[10px] text-black/40">0{index + 1}</span>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em]">
                  {symbol.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-black/62">{symbol.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-px grid gap-px border border-black/15 bg-black/15 sm:grid-cols-3">
            {HOUSE_RULES.map(([rule, note]) => (
              <p
                key={rule}
                className="bg-[#1b1917] p-5 font-mono text-[9px] uppercase leading-5 tracking-[0.15em] text-white/60"
              >
                <span className="mb-2 block text-[#dfbba4]">{rule}</span>
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 · O DROP EM RESERVAS ───────────────────────────── */}
      {featured && (
        <section id="systems" className="section-reveal scroll-mt-24 bg-[#1b1917]">
          <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
            <div className="flex flex-col gap-3 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="jp-label text-[#dfbba4]">
                  <span className="mr-3 font-mono">02</span>注目のドロップ · featured drop
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
                  O primeiro system está em reservas.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-white/55">
                €0 para reservar, sem cartão. Quando a procura atingir o MOQ, o drop é confirmado e
                as reservas têm prioridade de 48 horas.
              </p>
            </div>
            <FeaturedDropCard system={featured} />
            <div className="mt-6 flex justify-end">
              <Link
                to="/packs"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-[#dfbba4]"
              >
                Todos os systems e módulos
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 03 · KITS 組 ──────────────────────────────────────── */}
      <section className="section-reveal border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="jp-label text-primary">
                <span className="mr-3 font-mono">03</span>職人キット · kits de assinatura
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                Dois sistemas, três caixas de ofício.
              </h2>
            </div>
            <Button variant="outline" asChild className="rounded-none">
              <Link to="/packs">
                Ver os kits
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
            {REJENDARI_KITS.map((kit) => (
              <Link
                key={kit.id}
                to="/packs"
                className="category-tile group flex min-h-44 flex-col bg-card p-5"
              >
                <span className="flex items-center justify-between">
                  <span className="font-display text-3xl text-primary" aria-hidden>
                    {kit.format === "kit" ? "組" : "箱"}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                    {kit.jp.split(" · ")[0]}
                  </span>
                </span>
                <span className="mt-auto text-sm font-medium leading-5">{kit.trade}</span>
                <span className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {kit.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 · PEÇAS INDIVIDUAIS · ANEX PRIMEIRO ────────────── */}
      <section
        id="anex"
        className="section-reveal scroll-mt-24 border-b border-border bg-surface/40"
      >
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="jp-label text-primary">
                <span className="mr-3 font-mono">04</span>アネックス · começa pela ANEX
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                A escola de Sanjō.
                <br />
                <span className="text-primary">Feita numa casa só.</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">
                A ANEX é o alicerce da seleção: o Quick Ball 72 no punho, os bits Ryujin em Cr-Mo-V
                fabricados no Japão, o aperto offset que chega onde os outros não chegam. 一貫生産 —
                do aço ao fio, na mesma casa. É aqui que o sistema REJENDARI começa.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                <Button asChild className="rounded-none bg-black text-white hover:bg-black/85">
                  <Link to="/anex">
                    A seleção ANEX
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="rounded-none">
                  <Link to="/shop" search={{ brand: "ANEX" }}>
                    Ver na loja
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3">
              {anexPicks.slice(0, 6).map((tool) => (
                <Link
                  key={tool!.id}
                  to="/referencia/$id"
                  params={{ id: tool!.id }}
                  className="product-plate group relative aspect-square overflow-hidden"
                >
                  {tool!.imageUrl ? (
                    <ProductImage
                      src={tool!.imageUrl}
                      alt={tool!.imageAlt ?? tool!.namePt}
                      className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <ProductMonogram
                      brand={tool!.brand}
                      label={tool!.namePt}
                      className="flex h-full w-full items-center justify-center"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-10 text-white">
                    <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/70">
                      {tool!.brand} · {tool!.model}
                    </p>
                    <p className="mt-0.5 line-clamp-1 font-display text-sm font-semibold">
                      {tool!.namePt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {anexPicks.slice(0, 3).map((tool) => (
              <ReferenceProductCard key={tool!.id} tool={tool!} featured />
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 · AS OUTRAS ESCOLAS ────────────────────────────── */}
      <section className="section-reveal border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="jp-label text-primary">
                <span className="mr-3 font-mono">05</span>ブランド · as outras escolas
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                Oito casas. Um só critério.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Best component wins: Wera para o roquete 3/8″, Knipex e Bahco para o grip, VESSEL para
              o Ball Grip, Makita para as máquinas, TAJIMA e OLFA para medida e corte.
            </p>
          </div>

          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {BRAND_STORIES.map((brand) => (
              <Link
                key={brand.slug}
                to="/marcas"
                search={{ brand: brand.slug }}
                className="category-tile group flex min-h-40 flex-col bg-card p-5"
              >
                <span className="jp-label text-muted-foreground">{brand.jp}</span>
                <span className="mt-auto font-display text-xl font-semibold tracking-[-0.03em] group-hover:text-primary">
                  {brand.name}
                </span>
                <span className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {brand.specialty}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schoolPicks.map((tool) => (
              <ReferenceProductCard key={tool!.id} tool={tool!} featured />
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-semibold">
                Procuras uma referência específica?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Diz-nos a marca, o modelo ou o trabalho a fazer.
              </p>
            </div>
            <Button asChild className="rounded-none">
              <Link to="/b2b">
                Pedir disponibilidade
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── divisor · marquee das marcas em vitrina ───────────── */}
      <section className="bg-[#1b1917]">
        <div className="brand-marquee py-5">
          <div className="brand-marquee-track gap-12 pr-12">
            {[...SHOWCASED_BRANDS, ...SHOWCASED_BRANDS].map((brand, index) => (
              <Link
                key={brand + index}
                to="/marcas"
                search={{ brand }}
                className="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[0.19em] text-white/46 transition-colors hover:text-white"
              >
                {brand}
                <span className="h-1 w-1 rounded-full bg-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── fecho · B2B + vantagens ───────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:py-20">
        <div className="paper-panel grid gap-7 p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#b54530]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
                相談 · kit à medida
              </p>
            </div>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1] tracking-[-0.05em]">
              Diz-nos o que já tens antes de comprares mais.
            </h2>
          </div>
          <div>
            <p className="text-sm leading-7 text-black/65">
              Para empresa, equipa ou profissional, construímos uma seleção à volta das ferramentas
              existentes. A regra é evitar redundância: um bom roquete multi-bit, um sistema de
              sockets coerente e ferramentas de acesso específicas antes de encher a mala com
              duplicados.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button className="rounded-none bg-black text-white hover:bg-black/85" asChild>
                <Link to="/b2b">
                  Pedir proposta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="rounded-none" asChild>
                <Link to="/pontos">Pontos e convites</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
