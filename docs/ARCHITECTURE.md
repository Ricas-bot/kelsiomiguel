# Arquitectura & Decisões Técnicas

Documento vivo. Regista o estado do projecto, a arquitectura-alvo, o plano por
fases e as decisões técnicas (com justificação) à medida que são tomadas.

---

## 1. Auditoria inicial (Fase 1 — 2026-11-08)

### O que existia

| Área | Estado |
|---|---|
| Stack | Next.js 16.4.5 (App Router, Turbopack), React 19.3, Framer Motion 12, Lucide. JS/JSX sem TS. |
| Rotas | Apenas `/` (estática). Sem páginas de projecto, `not-found`, sitemap ou robots. |
| Página | `src/app/page.jsx` monolítico (~140 linhas) com `"use client"` na página inteira. |
| Conteúdo | `data/translations.js` (PT/EN) e `data/projects.js` (4 projectos). |
| Terminal | `components/Terminal.jsx`: modal funcional, 8 comandos, bilingue, `clear`/`exit`. |
| Estilos | `globals.css` minificado numa linha por regra, 4 tokens CSS, Google Fonts via `@import`. |
| i18n | `useState("pt")` — perde-se ao recarregar; `<html lang="pt">` fixo; metadata só em EN. |

### Problemas encontrados

- **Lint partido**: `eslint-config-next@15` com Next 16 → `ERR_MODULE_NOT_FOUND`. *(corrigido)*
- **Toda a página é Client Component**: todo o conteúdo e traduções vão para o bundle JS.
- **Fontes via `@import` CSS**: bloqueia render, pedido externo a Google, sem fallback metrics (CLS). *(corrigido)*
- **Labels mono a 7–9px**: abaixo de um mínimo legível. *(corrigido: mínimo 11px)*
- **Terminal**: anuncia "ESC to close" mas não tratava Escape *(corrigido)*; sem focus trap,
  sem histórico ↑/↓, sem autocomplete, sem atalho global, `scrollIntoView` ignora reduced motion.
- **Acessibilidade**: menu mobile sem `aria-expanded`/`aria-controls`; sem skip link;
  sem indicação da secção actual; selector de idioma sem `lang`/`hreflang`.
- **Links**: todos os cards de projecto abrem o GitHub (não há página de projecto).
- **Conteúdo não verificado**: verificado a 2026-11-08 contra o CV (2026-10-15) e o
  GitHub. Ver §1.1.
- **Descrições de projectos imprecisas** face aos repositórios (ver §4).

### 1.1 Verificação de conteúdo (CV + GitHub, 2026-11-08)

| Afirmação na v1 | Resultado | Fonte | Acção |
|---|---|---|---|
| 04+ anos de experiência | ✅ "mais de 4 anos em TI" | CV › Resumo | Mantido como "4+ anos em TI" |
| 10+ formações | ✅ | CV › Customer Solutions Developer | Mantido |
| 02 mercados | ✅ Portugal e Angola | CV › Projetos + Kelsio | Mantido |
| PORTUGAL · ANGOLA · REMOTE | ❌ Localização é Lisboa; "remote" não consta | CV, GitHub | Substituído por "Lisboa, Portugal" |
| EST. 2023 — NOW | ❌ Contradiz "4+ anos" | CV | Substituído por "EDUdigital · desde 2023" (Fev. 2023) |
| Disponível para novos desafios | ✅ Confirmado pelo Kelsio | Kelsio | Ligado (`profile.availability.enabled`) |
| Domínio | ❌ Não existe | Kelsio | `NEXT_PUBLIC_SITE_URL` vazio; sem URLs absolutas falsas |

Dados verificados vivem em `data/profile.js`, `data/experience.js`, `data/skills.js`
e `data/projects.js`. O telefone do CV não é publicado.

**Decisões (Kelsio, 2026-11-08):**
- Clientes do CV podem ser nomeados → `data/clients.js` (só o que o CV afirma).
- `crosstenant` tornado público e incluído como projecto principal.
- `laravel-tchiowa` fica de fora até ser actualizado.
- Repositórios privados ou com dados sensíveis nunca são referidos no site.

### O que se reutiliza

Paleta (fundo `#0a0a0a`, lima `#c7ff4a`), Manrope + DM Mono, o tom editorial,
a estrutura de dados bilingue, o Terminal (evoluído, não reescrito do zero) e a
composição geral das secções como ponto de partida.

---

## 2. Arquitectura-alvo

```
src/
├── app/
│   ├── [lang]/                  # pt | en — root layout por idioma
│   │   ├── layout.jsx           # <html lang>, fontes, Navbar, Footer, providers
│   │   ├── page.jsx             # Home (Server Component a compor secções)
│   │   ├── not-found.jsx
│   │   └── projects/[slug]/page.jsx   # case studies (SSG)
│   ├── sitemap.js · robots.js · icon / opengraph-image
│   └── globals.css              # importa styles/ + estilos legados em migração
├── proxy.js                     # "/" → /pt ou /en (cookie > Accept-Language)
├── components/
│   ├── layout/   Navbar, Footer, MobileMenu, LanguageSwitch
│   ├── sections/ Hero, Introduction, Projects, About, Experience, Expertise, Contact
│   ├── effects/  Reveal ✅, SmoothScroll, CustomCursor, Magnetic, Parallax
│   ├── terminal/ Terminal, commands.js, useTerminal.js
│   └── ui/       Button ✅, Tag ✅, SectionHeading ✅, ProjectCard
├── data/         projects.js, experience.js, skills.js, site.js
├── i18n/         config.js, dictionaries/{pt,en}.js, getDictionary.js
├── hooks/        useMediaQuery ✅, useReducedMotion ✅, useActiveSection
├── lib/          fonts ✅, motion ✅, gsap ✅, utils ✅, seo
└── styles/       tokens ✅, base ✅, utilities ✅
```

✅ = implementado na Fase 2.

### Princípios

- **Server Components por defeito.** Secções são RSC; só efeitos, navegação,
  terminal e cursor são Client Components ("ilhas").
- **i18n por sub-rota (`/pt`, `/en`)** em vez de estado React: URLs indexáveis por
  idioma, `hreflang`, metadata por idioma, sem flash de idioma e sem hydration
  mismatch. Preferência persistida em cookie (`NEXT_LOCALE`) e aplicada pelo
  `proxy.js` em `/`. Adicionar um idioma = um dicionário + uma entrada em `i18n/config.js`.
- **Dados separados de apresentação.** Conteúdo traduzível vive em `data/` com
  campos `{ pt, en }`; componentes não contêm texto fixo.
- **CSS:** tokens + base + utilities globais; estilos de componente em CSS Modules
  co-localizados. Os estilos v1 em `globals.css` vão sendo apagados à medida que
  cada secção é reconstruída.

---

## 3. Design System (Fase 2)

### Cor — `src/styles/tokens.css`

| Token | Valor | Uso | Contraste em `--color-bg` |
|---|---|---|---|
| `--color-bg` | `#0a0a0a` | Fundo | — |
| `--color-bg-elevated` | `#101010` | Secções alternadas | — |
| `--color-surface` / `-2` | `#151515` / `#1c1c1c` | Painéis, media | — |
| `--color-text` | `#f1f0ec` | Texto principal | 17.4:1 |
| `--color-text-muted` | `#8f8f8a` | Texto secundário | 6.1:1 (AA) |
| `--color-text-subtle` | `#5e5e5a` | Tipo display "fantasma", decoração | 3.06:1 (AA large) |
| `--color-accent` | `#c7ff4a` | Destaque — com moderação | 16.8:1 |

### Tipografia — `src/lib/fonts.js` (next/font, self-hosted)

| Papel | Fonte | Porquê |
|---|---|---|
| Display | **Bricolage Grotesque** (variável: wght, wdth, opsz) | Expressiva, com eixo de largura para títulos gigantes condensados sem segunda família. |
| Texto | Manrope (variável) | Mantida da v1. Legível, moderna. |
| Mono | DM Mono 400/500 | Mantida da v1. Labels, metadata, terminal. |

Escala fluida `--text-label` (11px) → `--text-display` (68→240px) com `clamp()`.
Classes: `.t-display`, `.t-h1`, `.t-h2`, `.t-h3`, `.t-lead`, `.t-body`, `.t-label`.

> **Não usar `-webkit-text-stroke`** com a fonte display: sendo variável, os
> contornos sobrepostos dos glifos ficam visíveis. Usar preenchimento tonal.

### Espaço & layout

Base de 4px (`--space-1…10`), `--space-section` fluido, `--gutter` fluido
(16px → 120px), grelha de 12 colunas (`.grid-12`), `.shell` com `--container-max`.

### Sistema de animação — `src/lib/motion.js` + `src/lib/gsap.js`

- Easings e durações partilhados entre CSS, Framer Motion e GSAP.
- **Framer Motion** → estado de componentes (menus, overlays, presença, hover).
- **GSAP + ScrollTrigger + SplitText** → timelines e tudo o que depende do scroll.
- Nunca os dois no mesmo elemento.
- `Reveal` (`fade-up`, `lines`, `words`, `clip`) regista as animações dentro de
  `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`: com reduced motion
  o conteúdo aparece no estado final. SplitText aplica `aria-label` automaticamente
  para que leitores de ecrã leiam a frase inteira.
- Conteúdo é renderizado visível no servidor; nada depende de JS para ser legível.

### Componentes base

`Button` (primary / outline / link; `<Link>`, `<a>` externo ou `<button>`;
alvo mínimo 44px), `Tag` / `TagList`, `SectionHeading` / `SectionLabel`.

---

## 3.1 Estrutura e navegação (Fase 3)

### Internacionalização
- Rotas `/pt` e `/en` (`app/[lang]`, root layout por idioma), ambas SSG;
  `dynamicParams = false`.
- `src/proxy.js`: qualquer caminho sem prefixo é redireccionado com 307 e
  `Vary: Cookie, Accept-Language`. Prioridade: cookie `NEXT_LOCALE` (escolha explícita
  no selector) → `Accept-Language` → `en` (`defaultLocale`, também usado em `x-default`).
- Dicionários em `src/i18n/dictionaries/`, carregados só no servidor; os Client
  Components recebem apenas as strings de que precisam.
- `<html lang>` (`pt-PT` / `en`), metadata e Open Graph por idioma. Canonical e
  `hreflang` só são emitidos quando `NEXT_PUBLIC_SITE_URL` estiver definido.
- Novo idioma: ver o cabeçalho de `src/i18n/config.js`.

### Navegação
- **Navbar** (client): logótipo KM, links de secção numerados com indicador animado
  (Framer `layoutId`) e `aria-current="location"` via IntersectionObserver;
  transparente no topo, sólida após scroll, esconde-se a descer e volta a subir
  ou com foco de teclado (`:focus-within`).
- **Menu mobile**: padrão disclosure (`aria-expanded`/`aria-controls`), ecrã inteiro,
  conteúdo de fundo `inert`, scroll bloqueado, Escape fecha e devolve o foco.
  Renderizado como irmão do header: `backdrop-filter`/`transform` no header
  tornariam-no o containing block do `position: fixed`.
- **Footer**: Server Component, sem JS.
- **Terminal**: `TerminalProvider` partilhado (abre a partir de qualquer componente,
  devolve o foco ao fechar).
- `MotionConfig reducedMotion="user"` aplica reduced motion a todo o Framer Motion.

### Page transitions
- `PageTransition` = `<ViewTransition enter="page-in" exit="page-out" default="none">`
  em cada página (não no layout). CSS em `src/styles/transitions.css`: a página
  antiga sobe e desvanece (350ms) e a nova revela-se de baixo com clip-path (900ms).
  O header tem `view-transition-name` e não se mexe; `pointer-events: none` no
  overlay (não bloqueia cliques). Com reduced motion: crossfade de 150ms. Sem suporte: navegação normal.

### 404 — `global-not-found.jsx` (experimental)
Com o root layout em `app/[lang]`, um `not-found.jsx` dentro do layout devolvia
status 404 correcto mas **HTML vazio** (`<html id="__next_error__">`), com o conteúdo
renderizado só no cliente. Testado e descartado: `dynamicParams = true` no catch-all
e catch-all `async`. Solução: `experimental.globalNotFound` + `app/global-not-found.jsx`,
a abordagem documentada pelo Next para root layouts em segmentos dinâmicos. A página
é bilingue (o idioma não é conhecido fora do layout), com `lang` por bloco e
`noindex` automático. **Risco:** flag experimental; rever em upgrades do Next.

## 3.2 Hero e efeitos (Fase 4)

### Hero (`components/sections/Hero.jsx`)
Server Component; a animação vive em ilhas cliente (`HeroMotion`, `HeroActions`).
Nome gigante (h1), título profissional, frase de abordagem, CTAs magnéticos (trabalhos, terminal),
disponibilidade, localização, pilares e indicador de scroll. Visual: diagrama orbital em SVG
puro (`HeroVisual`), em que as órbitas representam camadas e o núcleo o ponto de integração.

**Sequência de entrada (≈2.2s, só no primeiro carregamento):** nome letra a letra → título e
frase → visual (traços desenhados) → navegação e meta → CTAs → indicador de scroll.
Ao voltar à home por navegação cliente, só o nome anima.

**Sem flash:** um script inline no layout corre antes da primeira pintura e marca
`html[data-intro="pending"]`; `styles/intro.css` esconde os `[data-intro-el]` até o GSAP
assumir os estados iniciais. Salvaguarda: se o JS falhar, tudo aparece aos 3.5s.

**Scroll storytelling:** ao sair do hero, as duas linhas do nome afastam-se, o visual roda e
escala (parallax) e o texto sobe e desvanece (ScrollTrigger com scrub, desktop).
A frase de introdução acende palavra a palavra com o scroll (`ScrollTextReveal`).

### Efeitos (`components/effects/`)
| Componente | Comportamento | Desligado quando |
|---|---|---|
| `SmoothScroll` | Lenis no ticker do GSAP, sincronizado com ScrollTrigger; `autoToggle` pausa com `overflow: hidden`; `data-lenis-prevent` em áreas com scroll próprio | touch, reduced motion |
| `SectionLink` | Links para secções: scroll suave via Lenis (forçado, funciona com o menu aberto) e actualiza o hash; sem Lenis, o Next faz scroll nativo | — |
| `CustomCursor` | Ponto + anel; estados `link`, `project` (com etiqueta), `hidden` (campos de texto mostram o caret nativo) | pointer não fino (touch) |
| `Magnetic` | O elemento segue o ponteiro com mola elástica | touch, reduced motion |
| `ScrollTextReveal` | Leitura com scrub, palavra a palavra | reduced motion (texto completo) |

### Regras técnicas aprendidas
- **O GSAP escreve `translate/scale/rotate: none` inline** nos elementos que anima (≥3.11):
  nunca usar as propriedades CSS individuais (`translate`, `scale`) nem `transform` de
  centragem num elemento animado pelo GSAP. Separar em wrapper (GSAP) + filho (CSS). Foi a
  causa do cursor de projecto pequeno e do risco de a nav ficar descentrada depois da intro.
- **SVG `pathLength` + `vector-effect: non-scaling-stroke`** desenha traços incompletos no
  Chromium (tracejado calculado em espaço de ecrã). Não combinar nos traços animados.
- `String.prototype.replace` interpreta `$` na string de substituição: usar `split/join`
  em scripts de edição.

## 3.3 Secções de conteúdo (Fase 5)

Todas são Server Components (`components/sections/`); a animação vive em ilhas
cliente pequenas. Cada secção tem composição e movimento próprios:

| Secção | Composição | Movimento |
|---|---|---|
| Introduction | Declaração gigante + 3 pilares, texto sticky | `ScrollTextReveal` (leitura com scrub) + `Reveal` |
| Selected Work | Projecto principal (Cross-Tenant Access) em 8/12 colunas + índice editorial | `ScrollScale` (media cresce com o scroll) + pré-visualização a seguir o cursor (`ProjectList`) |
| About | Título sticky + bio verificada + factos | `Counter` (contagem até ao valor real) |
| Experience | Cabeçalho sticky + timeline + tabela de clientes | `ScrollProgress` (espinha preenche com scroll) + `<details>` nativo |
| Expertise | 7 áreas em lista tipográfica + ferramentas agrupadas | `FocusList` (área na linha de leitura em foco) |
| Contact | Superfície lima a toda a largura | Título palavra a palavra, email magnético, copiar email |

- **Sem formulário**: não há backend de envio; email (enviar/copiar), LinkedIn e GitHub.
  A cópia usa a Clipboard API e informa honestamente se falhar (`role="status"`).
- **Projectos**: links principais para o site online ou repositório até existirem as
  páginas de case study (Fase 6). `ProjectArt` (composições tipográficas por projecto)
  substitui imagens até haver capturas publicáveis.
- **Clientes**: tabela semântica (`<table>`, `scope`), responsiva em cartões no mobile;
  âmbito exactamente como no CV.
- **Datas**: `lib/format.js` formata sem dados de locale do `Intl`, por isso servidor e
  cliente nunca divergem.
- `SectionHeading` ganhou `stacked` para colunas estreitas/sticky.
- Regra: nomes de classes de variante aplicados à raiz de um CSS Module (`.orbits`)
  não podem ser reutilizados em elementos internos (colapsou a arte do projecto principal).

## 3.4 Case studies (Fase 6)

- Rota `app/[lang]/projects/[slug]/page.jsx`: 6 projectos × 2 idiomas, todos SSG,
  `dynamicParams = false` (slug desconhecido → 404 global). Metadata por projecto
  (título, descrição, Open Graph `article`; canonical/hreflang só com domínio).
- Conteúdo em `data/caseStudies.js`: contexto, problema, solução, arquitectura,
  tecnologias, decisões técnicas e, **só quando verificável**, resultados e notas
  (as secções vazias não são renderizadas). Cada afirmação vem do código/README;
  limitações e estado (ex.: ALPHA, limites do desfazer) são ditos com franqueza.
- Página: hero, composição do projecto, índice sticky com secção activa (`CaseToc`),
  secções numeradas, próximo projecto em loop. No mobile o índice é omitido.
- Home → case study: título, media e botão "Ver case study" levam à página interna;
  links online/código continuam externos. Projectos privados também têm case study.
- **Morph partilhado:** `ProjectMorph` dá o mesmo `view-transition-name` à
  composição na home e no hero do case study (React `<ViewTransition share="morph">`).
- **Bug corrigido (desde a Fase 3):** o `view-transition-name: site-header` estava num
  CSS Module, que fazia hash do valor (`cRh5nW_site-header`), e as regras globais nunca
  coincidiam: o header não ficava ancorado nas transições. Passou a estilo inline.
  Regra: nomes de view transition nunca em CSS Modules.

## 4. Projectos — factos verificados nos repositórios

| Projecto | Confirmado no repositório | Ano (1.º commit) |
|---|---|---|
| **Cross-Tenant Access** (`crosstenant`) | Plugin local Totara (`local_crosstenant`, maturidade ALPHA, base Moodle 3.9 / Totara 19). Autoriza User → Course entre tenants; papéis limitados a student/editingteacher; capabilities `view`/`grantaccess`/`revokeaccess`; 4 funções externas AJAX; inscrição via instância `enrol_self` dedicada por curso; tarefa agendada de expiração (15 min); eventos de auditoria; privacy provider RGPD com anonimização; observer de eliminação de curso; UI Mustache + AMD; strings PT/EN; 10 ficheiros de testes PHPUnit + scripts CLI de verificação. Achado em aberto documentado: cursos cross-tenant não aparecem nas listagens "Os meus cursos". **Não reproduzir** host de QA, nomes de tenants ou IDs que constam do README. | 2026 |
| **Progress Recovery** (repositório **privado**, dados sensíveis; fonte: README fornecido pelo Kelsio, 2026-11-08) | Plugin local Totara 19 (`local_progressrecovery`), desenvolvido para a **Zurich**. Recebe, valida, compara e recupera dados exportados por uma ferramenta de extracção. **Validação:** pára na primeira falha, nada é guardado; ZIP lido por streams (nunca extraído); nomes de entradas seguros, sem symlinks, cifra ou expansão desproporcionada; assinatura HMAC-SHA256 com segredo partilhado; checksums SHA-256 com lista fechada; manifesto com lista fechada de tabelas; compatibilidade por componente (4 níveis); pacotes guardados fora do webroot. **Comparação:** 7 classificações (Novo, Idêntico, Alterado, Conflito, Inválido, Destino mais recente, Ignorado), sem alterar dados; utilizadores mapeados por username; o destino prevalece; relatório com filtros e exportação CSV/JSON. **Recuperação em 6 etapas** validadas uma a uma (contas e fichas, tentativas SCORM, Feedback e conclusões, notas, registos de eventos, certificados), por lotes retomáveis; operação por registo (interrupções nunca duplicam; reclassificação no momento da escrita); conclusões via `core_completion\helper`; nunca cria inscrições; **desfazer** por ordem inversa, com limites documentados. Recuperação desligada por omissão; capability `local/progressrecovery:manage` sem papel por omissão. **Testes:** scripts que geram pacotes reais em SQLite descartável e validam com as classes do plugin. **Nunca publicar:** nomes de servidores, caminhos locais, estado/datas das fases, nem link para o repositório. | 2026 |
| **LBS Demo** | Demo de website para um centro de formação executiva (Luanda Business School). HTML, CSS e JS vanilla; 2 páginas (início, contactos); barra de progresso de scroll, scroll reveal (IntersectionObserver), contadores animados, countdown, menu mobile. O formulário de contacto é apenas front-end (validação + estado de sucesso, sem envio). | 2026 |
| **Ozua Consultoria** | Single page para um centro de formação profissional. Reconstrução de um site não lançado; **o design é de outra pessoa** (README). HTML, CSS, JS com Bootstrap 5.3, jQuery 3.7 e Lordicon; cursor personalizado, carrosséis de cursos gerados a partir de dados JS, separadores empresas/singulares, modais, FAQ em acordeão. | 2024 |
| **UOR Website** | Website para a Universidade Óscar Ribas. HTML, CSS, JS vanilla; carrossel hero com swipe e teclado, scroll reveal, contadores, menu mobile acessível (Escape). | 2026 |
| **Capstone Blog** | App de blog CRUD. Node.js, Express 5, EJS, Bootstrap 5.3, `method-override`; persistência em `posts.json` (sem base de dados), datas de criação/edição. | 2026 |

Versões online (GitHub Pages, HTTP 200 a 2026-11-08): `ricas-bot.github.io/lbs-demo`,
`/ozuaconsultoria`, `/uorwebsite`. O Capstone Blog precisa de servidor Node (sem demo).
Os anos são a data de criação do repositório.

---

## 5. Plano de implementação

| Fase | Âmbito | Estado |
|---|---|---|
| 1 | Auditoria, arquitectura, plano | ✅ |
| 2 | Design system: tokens, tipografia, espaço, motion, componentes base | ✅ |
| 3 | i18n por rota + proxy + cookie; Navbar (secção activa, menu mobile, estado de scroll), Footer; page transitions (React `<ViewTransition>`) | ✅ |
| 4 | Hero (sequência de entrada), SmoothScroll (Lenis), CustomCursor, Magnetic, scroll storytelling | ✅ |
| 5 | Secções: Introduction, Selected Work, About, Experience, Expertise, Contact | ✅ |
| 6 | `/[lang]/projects/[slug]` com case studies | ✅ (imagens reais: pendente de material publicável) |
| 7 | Terminal v2: histórico ↑/↓, Tab autocomplete, sugestões, atalho global, focus trap, comandos `github`/`linkedin` | — |
| 8 | SEO: metadata por idioma, OG/Twitter, sitemap, robots, canonical + hreflang, JSON-LD `Person`, ícones; Lighthouse | — |
| 9 | Testes: lint, build, navegação, mobile, links; deploy | — |

---

## 6. Dependências

| Pacote | Versão | Motivo |
|---|---|---|
| `gsap` | ^3.15 | ScrollTrigger, SplitText (gratuitos desde 3.13). Animações de scroll e sequências. |
| `@gsap/react` | ^2.1 | `useGSAP`: cleanup automático e seguro com React 19 / Strict Mode. |
| `eslint-config-next` | 16.4.5 | Alinhado com `next@16.4.5` (o 15.x partia o lint). |
| `lenis` | 1.3.27 | Smooth scroll que mantém o scroll **nativo** (teclado, find-in-page, leitores de ecrã, `position: sticky`), ao contrário do ScrollSmoother que transforma o conteúdo. Desactivado em touch e com reduced motion. |

Não planeadas: page transitions usam o `<ViewTransition>` nativo do React 19.3 (sem
biblioteca, sem bloquear a navegação, degrada para navegação normal sem suporte).

`npm audit` reporta 1 vulnerabilidade moderada em `minimatch`, transitiva de
`@typescript-eslint` (dev-only, via `eslint-config-next`). Não entra no bundle.

---

## 7. Riscos técnicos

| Risco | Mitigação |
|---|---|
| SplitText altera o DOM; se o React actualizar o mesmo nó → conflito | Com i18n por rota, mudar de idioma remonta a árvore. Até lá, `key={language}` nos títulos divididos. |
| Smooth scroll vs acessibilidade / mobile | Lenis (scroll nativo), off em touch e reduced motion, âncoras via API do Lenis. |
| Peso de JS (GSAP + Framer + Lenis) vs Lighthouse 90+ | RSC por defeito, ilhas pequenas, import de plugins GSAP só onde são usados, medir na Fase 8. |
| View Transitions com suporte parcial (Safari/Firefox) | Progressive enhancement: sem suporte, a navegação funciona sem animação. |
| Hydration mismatch (media queries, idioma, datas) | `useSyncExternalStore` com snapshot de servidor; idioma vem da rota; ano do footer calculado no servidor. |
| Conteúdo não verificado publicado | Lista de pontos a confirmar (§1). Nada é publicado sem confirmação. |
| Imagens de projectos de clientes | Usar só material público do repositório ou composições abstractas; sem dados de clientes. |
| Domínio ainda não definido | `NEXT_PUBLIC_SITE_URL` em env; sitemap/canonical só absolutos quando definido. |
