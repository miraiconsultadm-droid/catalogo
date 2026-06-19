# Catálogo MirAI

Catálogo / apresentação comercial das plataformas da **MirAI** — site one-page,
estático e responsivo, pronto para publicar na Vercel.

## Estrutura

```
index.html            # página única (todas as seções)
assets/css/styles.css # design system (casca MirAI + temas por produto)
assets/js/main.js      # interações (nav, reveal, contadores) — sem dependências
```

## Conceito de design

- **Casca MirAI** (header, hero, seções institucionais): base escura, acento
  violeta/ciano, tipografia *Space Grotesk* + *Inter* — identidade proposta
  (a MirAI não possui logo/cores definidos ainda).
- **Seções de produto**: cada uma respeita o brand do próprio produto, via
  `data-brand` no `<section>`:
  - `hellogrowth` → verde-limão `#83E509` / preto, *Sora* (cores reais do site).
  - `kaivaa` → amarelo `#FFDE43` + coral `#E06A5E` / quase-preto, *Bricolage Grotesque*.
  - demais produtos seguem o padrão HelloGrowth até terem brand próprio.

## Conteúdo

- Seções institucionais (Por quê / Como / O que fazemos, dores, automação on demand)
  extraídas das apresentações da MirAI e do HelloGrowth.
- **HelloGrowth** e **Kaivaa**: seções completas, com link para o site oficial.
- **CRM, Mirai Marketing, Painel Admin HG, Site Artê**: seções com conteúdo
  provisório (placeholder), aguardando resumo oficial de cada produto.

CTA final e botões de fallback levam ao WhatsApp `(47) 99909-1798`.

## Rodar localmente

É um site estático — basta abrir `index.html` no navegador, ou servir a pasta:

```bash
python3 -m http.server 8000
# http://localhost:8000
```
