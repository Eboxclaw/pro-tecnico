# CULTURE CONVERGENCE — REJENDARI

> A identidade fundida do projeto, 2026-09-28. Este documento é a referência para
> curadoria, tom editorial e decisões de catálogo daqui em diante.

## 1. De onde viemos

O projeto nasceu **pro'tecnico** (plano de 2026-09-20): loja portuguesa de ferramenta
profissional com foco em marcas europeias — Wera, Knipex, Bahco, Wiha, Stabila, FACOM,
Beta, Klauke — e disciplina de negócio: *fornecedor antes de stock*, landed cost, margens
alvo de 30–35%, fases de go-to-market (0–10), scoring de fornecedores e produtos.

A 2026-09-24 pivotou para **Rejendarī**: rebrand com foco em ferramenta japonesa — VESSEL,
ANEX, Ko-ken, OLFA, LOBSTER, Makita, ENGINEER, Fujiya, Tsunoda, TONE, KTC, Nepros, HOZAN,
TAJIMA — curadoria editorial por tarefa, narrativa 絶縁/締結/精密, e a arquitetura técnica
atual (TanStack Start + Shopify Storefront + Supabase).

**A convergence funde as duas culturas numa só.** Não é uma loja japonesa que também vende
alemão; é uma curadoria única com um critério único aplicado a três escolas de fabrico.

## 2. O critério: regimes de trabalho

> Não vender todos os bits de todas as marcas — vender **o melhor instrumento para cada
> regime de trabalho**.

| Regime | O que decide | Escola âncora |
|---|---|---|
| **Impacto** | Liga dimensionada para impact driver 18 V+ | Wera Impaktor · ANEX Ryujin Cr-Mo-V |
| **Torsion** | Zona torsional que absorve picos em montagem repetitiva | Wera BiTorsion · Wiha T-Bit · VESSEL Torsion |
| **Precisão** | Controlo fino, ESD, microparafuso | Kraftform Micro · PicoFinish · VESSEL MC |
| **Retenção** | Parafuso agarrado ao bit em qualquer ângulo | TORX HF · íman anelar Impaktor |
| **Acesso estreito** | Perfil curto, offset, slim | Ryujin Slim · slimBits 6 mm · 270BW |
| **1000 V** | Cadeia completa certificada IEC 60900, ensaio individual 10 kV | Wera VDE · Wiha · Knipex VDE · Bahco V |

Do critério decorrem **duas famílias claramente separadas** no site:
`STANDARD 1/4″ SYSTEM` e `1000 V INSULATED SYSTEM` — e a nota obrigatória em todo o
vertical elétrico: *o isolamento do cabo não transforma uma ferramenta comum numa
ferramenta para trabalho em tensão; a cadeia completa usada no trabalho deve ser
certificada para esse uso.*

## 3. O catálogo fundador (20 famílias)

- **Bits**: Wera BiTorsion, Wera Impaktor, TORX HF, Hex-Plus, Wiha T-Bit, Wiha Impact,
  ANEX Ryujin (Cr-Mo-V), VESSEL Torsion.
- **Holders/adaptadores**: Rapidaptor, Rapidaptor BiTorsion, Impaktor íman anelar,
  porta-porcas 1/4″ 7–13 mm.
- **Hand systems**: Wera 838 RA-R L/M, Zyklop Pocket, VESSEL 220W/230W/270BW, Ko-ken Z-EAL.
- **1000 V**: Wera KK VDE 17 RA/slim, 8007 B VDE, 8790 B, 8794; Wiha slimVario + slimBits,
  TorqueVario-S, speedE!; Knipex 74 06/86 06/05 01 VDE; Bahco 8071V/8072V/8073V.
- **Grip/cut**: Cobra 250, Pliers Wrench 250, TwinGrip, 74 02/06, Bahco 9031P/9033,
  Engineer PZ-58, OLFA XH-1.
- **Power**: Makita LXT 18 V (DTD172/173, DHP489, DGA519, DLX).
- **Eletrónica** (vertical nova): precisão, ESD, stripping — VESSEL 9836/MR36, HOZAN,
  Kraftform Micro, PicoFinish, pinças ESD.
- **VE** (vertical nova): torque VDE, tesoura de cabos isolada, sockets 1000 V — só
  ferramenta certificada, sem EPI (luvas/tapetes ficam fora da identidade da loja).

## 4. Legendary Combos

Onze combos do documento fundador + dois verticais, todos editoriais (disponibilidade
via B2B): Impact Beast · German Torsion · Japanese Impact · Ball Grip Hybrid ·
Ratchet Driver · Pocket Mechanic · JDM Mechanic · Electrician 1000 · Slim Electrician ·
HVAC Grip · Broken Screw · Electronics Bench · EV High-Voltage.

A regra: **juntar fabricantes quando a combinação fica melhor** — muito mais vendável do
que "kit Wera" ou "kit Knipex".

## 5. Cultura de negócio herdada do pro'tecnico

1. **Fornecedor antes de stock** — contrato, margem e dados antes de encher armazém.
2. Margens alvo 30–35% bruto; landed cost como número de decisão.
3. Scoring de fornecedores/produtos antes de alargar catálogo.
4. Fases de go-to-market; lançamento pequeno com motivo técnico claro por referência.
5. Queue de expansão disciplinada: ICHINEN TASCO (AVAC), KTC/Nepros premium, Silky,
   Stabila (medição), Klauke (crimpagem), alicate de cobre dedicado.

## 6. Implementação técnica (estado atual)

- `src/data/curated-tool-references.ts` — `CURATED_TOOL_REFERENCES` (antes
  `JAPAN_TOOL_REFERENCES`), tasks `electronics` e `ev` na union, ~130 referências.
- `src/data/brand-stories.ts` — stories WERA/KNIPEX/WIHA/BAHCO (+QUICK_BRANDS).
- `src/components/shop/LegendaryCombos.tsx` — 13 combos em `/packs`.
- `src/components/shop/BitRegimeComparison.tsx` — "parede de bits" na homepage.
- Taxonomia espelhada em `shop.tsx` (TASKS), `index.tsx`/`SiteHeader.tsx` (CATEGORIES),
  `ToolGlyph.tsx` (glifos `electronics`/`ev`), `QUICK_FOCUS` (`impact-bits`, `electronics`, `ev`).
- Fallback de imagem sem foto: tile tipográfico "Fotografia em preparação".

## 7. Em aberto

- Imagens aprovadas dos fabricantes europeus para as novas referências.
- Espelhamento Shopify dos combos/referências (tags `task:*`, `legendary`) quando a loja abrir.
- "Monta o teu kit" + comparadores após catálogo real (ver roadmap).
