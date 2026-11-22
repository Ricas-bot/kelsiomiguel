# Kelsio Miguel - Portfolio

Portfolio bilingue (PT/EN) de Kelsio Miguel, Full-Stack Developer e LMS Engineer.
Next.js App Router, JavaScript (JSX) e CSS, com animação em GSAP e Framer Motion.

## Requisitos
- Node.js 20.9 ou superior (definido em `engines` no `package.json`)
- npm 10 ou superior

## Comandos
```bash
npm ci          # instala exactamente as versões do package-lock.json
npm run dev     # desenvolvimento em http://localhost:3000
npm run lint    # ESLint (eslint-config-next)
npm run build   # build de produção
npm start       # serve a build (porta 3000; outra porta: npm start -- -p 3123)
```

## Publicar no Vercel (recomendado)
O projecto não precisa de configuração própria do Vercel: os headers de segurança estão
em `next.config.mjs` e o redireccionamento de idioma em `src/proxy.js`.

1. Em [vercel.com/new](https://vercel.com/new), importar o repositório do GitHub.
2. Deixar o que o Vercel detecta: framework **Next.js**, build `npm run build`,
   instalação `npm install`. A versão de Node vem de `engines`.
3. Variáveis de ambiente: nenhuma é obrigatória. O URL de produção
   (`VERCEL_PROJECT_PRODUCTION_URL`) é detectado sozinho e activa o canonical, o
   hreflang, o sitemap e as imagens de partilha com URL absoluto.
4. **Deploy.** Cada push para `main` passa a publicar em produção, e cada outro branch
   ou pull request ganha um URL de pré-visualização.

**Domínio próprio (mais tarde):** em *Project → Settings → Domains*, adicionar o domínio
e seguir as instruções de DNS. Com um domínio próprio, o `VERCEL_PROJECT_PRODUCTION_URL`
passa a ser o domínio próprio mais curto do projecto, por isso o código não muda. Para
fixar um URL específico, definir `NEXT_PUBLIC_SITE_URL` (ex.: `https://dominio.com`) e
voltar a publicar: os URLs são gerados no build.

## Publicar noutro alojamento
É precisa uma plataforma que corra Node.js. O site não funciona como exportação
estática, porque o redireccionamento de idioma (`proxy.js`) e a optimização de imagens
correm no servidor.

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://dominio.com npm run build   # o URL é lido no build
npm start
```

Sem `NEXT_PUBLIC_SITE_URL` (fora do Vercel), o site funciona, mas o sitemap fica vazio,
não há canonical nem hreflang e as imagens de partilha apontam para `localhost`.
Ver `.env.example`.

## Depois de cada publicação
- Abrir `/`: deve redireccionar para `/pt` ou `/en`.
- Abrir `/sitemap.xml` e `/robots.txt`: com URL definido, listam o domínio certo.
- Partilhar um link (LinkedIn ou um validador de Open Graph) para ver a imagem de
  partilha.
- Correr o Lighthouse sobre o URL público. Os valores em `docs/ARCHITECTURE.md` são
  medições locais.
- Opcional: submeter o sitemap na Google Search Console.

## Idiomas
O site vive em `/pt` e `/en`. `/` redirecciona conforme a escolha guardada (cookie) ou o
idioma do browser. Para acrescentar um idioma, ver `src/i18n/config.js`.

## Estrutura
- `src/app`: rotas (`[lang]/`, `[lang]/projects/[slug]/`), layout por idioma, 404 global,
  imagens de partilha, ícones, manifest, robots e sitemap
- `src/i18n`: configuração de idiomas e dicionários PT/EN
- `src/proxy.js`: redireccionamento de idioma
- `src/data`: conteúdo verificado (perfil, experiência, clientes, projectos, case studies,
  imagens dos projectos, competências)
- `src/assets/projects`: capturas de ecrã já tratadas (WebP); `src/assets/fonts`: fontes
  das imagens de partilha
- `src/components/layout`: Navbar, menu mobile, selector de idioma, Footer, transições
- `src/components/sections`: secções da home (Hero, Introduction, Projects, About,
  Experience, Expertise, Contact)
- `src/components/case`: página de case study (índice, galeria com lightbox e
  antes/depois)
- `src/components/ui`: componentes base (Button, Tag, SectionHeading, ProjectArt,
  ProjectCover, ScreenFrame...)
- `src/components/effects`: efeitos (Reveal, SmoothScroll, CustomCursor, Magnetic,
  ScrollTextReveal, ScrollScale, Counter, ScrollProgress, FocusList)
- `src/components/terminal`: terminal interactivo. Abre com o botão da navbar,
  Ctrl/⌘+K ou `
- `src/components/seo`: dados estruturados (JSON-LD)
- `src/styles`: design system (`tokens.css`, `base.css`, `utilities.css`, transições)
- `src/lib`, `src/hooks`: setup GSAP, motion, fontes, utilitários e hooks partilhados
- `docs/ARCHITECTURE.md`: auditoria, arquitectura, decisões técnicas, factos verificados
  de cada projecto e resultados dos testes

## Conteúdo e confidencialidade
Todo o conteúdo tem origem no CV, no GitHub ou em material fornecido pelo autor (ver
`docs/ARCHITECTURE.md` §1.1 e §4). As capturas de projectos de clientes só entram depois
de tratadas: nomes de pessoas desfocados e sem dados de clientes, nomes de servidores ou
datas internas (ver §3.7). As capturas originais (`src/assets/portfolio-img.zip`) estão no
`.gitignore` e nunca devem ser publicadas.
