# Kelsio Miguel — Digital Portfolio

Portfolio imersivo bilingue (PT/EN) desenvolvido com Next.js App Router, JavaScript (JSX) e CSS.

## Requisitos
- Node.js 20.9+
- npm 10+

## Comandos
```bash
npm install
npm run dev     # http://localhost:3000
npm run lint    # ESLint (eslint-config-next/core-web-vitals)
npm run build   # build de produção
npm start       # servir a build
```

## Stack
- Next.js 16 (App Router, Turbopack) · React 19
- CSS: design tokens (CSS variables) + CSS Modules por componente
- Framer Motion (interacções de UI) · GSAP + ScrollTrigger + SplitText (scroll e sequências)
- Lucide React (ícones) · `next/font` (fontes self-hosted)

## Idiomas
O site vive em `/pt` e `/en`. `/` redirecciona conforme a escolha guardada (cookie) ou o idioma do browser. Para adicionar um idioma, ver `src/i18n/config.js`.

## Estrutura
- `src/app`: rotas (`[lang]/`, `[lang]/projects/[slug]/`), layout por idioma, 404 global, ícone e estilos globais
- `src/i18n`: configuração de idiomas e dicionários PT/EN
- `src/proxy.js`: redireccionamento de idioma
- `src/components/layout`: Navbar, menu mobile, selector de idioma, Footer, transições
- `src/styles`: design system (`tokens.css`, `base.css`, `utilities.css`)
- `src/components/ui`: componentes base (Button, Tag, SectionHeading, SectionLink, ProjectArt)
- `src/components/effects`: efeitos (Reveal, SmoothScroll, CustomCursor, Magnetic, ScrollTextReveal, ScrollScale, Counter, ScrollProgress, FocusList)
- `src/components/terminal`: terminal interactivo e provider
- `src/components/sections`: secções da home (Hero, Introduction, Projects, About, Experience, Expertise, Contact)
- `src/lib`: fontes, tokens de motion, setup GSAP, utilitários
- `src/hooks`: hooks partilhados (media queries, reduced motion)
- `src/data`: conteúdo verificado (perfil, experiência, clientes, projectos, case studies, competências)
- `src/components/case`: página de case study (índice, estilos)
- `docs/ARCHITECTURE.md`: auditoria, arquitectura, plano por fases, dependências e decisões técnicas

## Antes de publicar
1. Definir `NEXT_PUBLIC_SITE_URL` quando houver domínio (activa canonical e hreflang).
2. Conteúdo verificado contra o CV e o GitHub vive em `src/data/` (ver `docs/ARCHITECTURE.md` §1.1); textos de interface em `src/i18n/dictionaries/`.
3. Adicionar imagens em `public/images/projects/` (apenas material público).

## Nota
Projectos de clientes são descritos de forma genérica. Não incluir código, dados, capturas de ecrã ou informação confidencial sem autorização.
