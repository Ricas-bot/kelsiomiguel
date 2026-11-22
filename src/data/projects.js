/**
 * Selected work. Every field was verified against the public repository
 * on 2026-11-08 (README, package.json, source files, GitHub Pages), or —
 * for private work — against material Kelsio provided (noted inline).
 * `year` = repository creation year. `liveUrl` = public site (GitHub Pages
 * checked HTTP 200; client sites as given by Kelsio).
 * `repoUrl: null` = private code: the UI shows "private" and links nowhere.
 * `client` (optional) = named with Kelsio's approval.
 * `owner` (optional) = company that owns the product (shown as "Product of").
 * Screenshots live in ./media.js.
 * Case-study fields (context, problem, solution…) are added in Phase 6.
 */
export const projects = [
  {
    // Source: local_lnf README, version.php, tests/ and git history (local
    // checkout, 2026-11-14) + Kelsio's description of his role. EDUdigital
    // product, private repository: never link it or name other contributors.
    slug: "sdf",
    title: "Diagnóstico Formativo",
    art: "SDF",
    year: 2025,
    owner: "EDUdigital",
    category: { pt: "Plugin Totara · Produto EDUdigital", en: "Totara plugin · EDUdigital product" },
    description: {
      pt: "SDF - Sistema de Diagnóstico Formativo: plugin para Totara 19 que gere o ciclo anual de necessidades de formação, da proposta do RH à validação pelas Direções, aprovação, cronograma e inscrição automática.",
      en: "SDF - Training Needs Diagnosis System: a Totara 19 plugin that runs the yearly training-needs cycle, from HR proposals to department validation, approval, schedule and automatic enrolment."
    },
    tags: ["PHP 8.1", "Totara 19", "Mustache", "JavaScript (AMD)", "PHPUnit"],
    liveUrl: null,
    repoUrl: null // EDUdigital, private
  },
  {
    // Verified from source: version.php, db/*.php, classes/, tests/ (2026-11-08).
    // The repo README mentions a QA host and client tenant names — never
    // reproduce those here or in the case study.
    slug: "cross-tenant-access",
    title: "Cross-Tenant Access",
    art: "XTA",
    year: 2026,
    category: { pt: "Plugin Totara · LMS Engineering", en: "Totara plugin · LMS Engineering" },
    description: {
      pt: "Plugin local para Totara multi-tenant que permite autorizar utilizadores de um tenant a frequentar cursos específicos de outro, com inscrição real, expiração automática, auditoria e privacidade RGPD, sem quebrar o isolamento entre tenants.",
      en: "Local plugin for multi-tenant Totara that lets users from one tenant be authorised into specific courses of another, with real enrolment, automatic expiry, audit events and GDPR privacy, without breaking tenant isolation."
    },
    tags: ["PHP", "Totara", "JavaScript", "Mustache", "PHPUnit"],
    liveUrl: null,
    repoUrl: "https://github.com/Ricas-bot/crosstenant"
  },
  {
    // Source: plugin README shared by Kelsio (2026-11-08); the repository is
    // private (sensitive data). Public copy describes the engineering only —
    // never server names (sv1/sv2), local paths, phase status or client data.
    slug: "progress-recovery",
    title: "Progress Recovery",
    art: "REC",
    year: 2026,
    client: "Zurich",
    category: { pt: "Plugin Totara · LMS Engineering", en: "Totara plugin · LMS Engineering" },
    description: {
      pt: "Plugin para Totara 19 que recupera o progresso dos formandos a partir de um pacote assinado: validação segura, comparação com a instalação e recuperação por etapas retomáveis, com opção de desfazer.",
      en: "Totara 19 plugin that restores learner progress from a signed package: secure validation, comparison against the live site and recovery in resumable stages, with an undo option."
    },
    tags: ["PHP", "Totara 19", "HMAC-SHA256", "SCORM", "CSV / JSON"],
    liveUrl: null,
    repoUrl: null // private repository
  },
  {
    // Source: the live site (HTML + screenshots, 2026-11-14) and Kelsio
    // (designed and built it). The About page lists team members: never
    // publish their names or photos.
    slug: "technologic",
    title: "Technologic",
    art: "TL",
    year: 2025,
    category: { pt: "Website institucional · Next.js", en: "Corporate website · Next.js" },
    description: {
      pt: "Website da Technologic, empresa angolana de tecnologia: identidade escura e lima, serviços com pacotes e preços públicos, páginas institucionais e consentimento de cookies granular.",
      en: "Website for Technologic, an Angolan technology company: a dark and lime identity, services with public packages and prices, company pages and granular cookie consent."
    },
    tags: ["Next.js", "React", "CSS Modules", "Bootstrap"],
    liveUrl: "https://technologic.ao",
    repoUrl: null
  },
  {
    // Source: Kelsio (2026-11-14) + the Totara project memory/sessions
    // (home, crossselingedu, BBB) and the local_oidcgraphsync source.
    // Never name other client sites where the block runs. liveUrl given by
    // Kelsio (2026-11-15); behind Cloudflare, so automated checks get a 403.
    slug: "acores-platform",
    title: "Plataforma APR Açores",
    art: "APR",
    year: 2026,
    client: "Direção Regional dos Açores",
    category: { pt: "Totara · UI/UX e plugins", en: "Totara · UI/UX and plugins" },
    description: {
      pt: "Quatro entregas na plataforma de formação da Administração Pública Regional dos Açores: nova home pública, bloco Crossselling, BigBlueButton adaptado ao Totara 19 e sincronização de atributos OIDC com o Microsoft Graph.",
      en: "Four deliveries on the Azores Regional Public Administration training platform: a new public home, the Crossselling block, BigBlueButton adapted to Totara 19 and OIDC attribute sync with Microsoft Graph."
    },
    tags: ["PHP", "Totara 19", "JavaScript", "Microsoft Graph", "UI/UX"],
    liveUrl: "https://learnit.servicos.azores.gov.pt/server/home/index.php",
    repoUrl: null
  },
  {
    slug: "lbs-demo",
    title: "LBS Demo",
    art: "LBS",
    year: 2026,
    category: { pt: "Website demonstrativo", en: "Demo website" },
    description: {
      pt: "Demo de website para um centro de formação executiva, criada para mostrar a um cliente o que o seu site poderia oferecer: navegação simples e uma experiência cuidada.",
      en: "Demo website for an executive training centre, built to show a client what their site could deliver: simple navigation and a polished experience."
    },
    tags: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://ricas-bot.github.io/lbs-demo/",
    repoUrl: "https://github.com/Ricas-bot/lbs-demo"
  },
  {
    slug: "ozua-consultoria",
    title: "Ozua Consultoria",
    art: "OZUA",
    year: 2024,
    category: { pt: "Website institucional · Front-end", en: "Corporate website · Front-end" },
    description: {
      pt: "Single page para um centro de formação profissional. Reconstrução de um site que não chegou a ser lançado, com melhorias de detalhe sobre um design de outro autor.",
      en: "Single-page site for a professional training centre. A rebuild of a site that was never launched, refining the details of a design by another author."
    },
    tags: ["HTML", "CSS", "JavaScript", "Bootstrap", "jQuery"],
    liveUrl: "https://ricas-bot.github.io/ozuaconsultoria/",
    repoUrl: "https://github.com/Ricas-bot/ozuaconsultoria"
  },
  {
    slug: "uor-website",
    title: "UÓR Website",
    art: "UÓR",
    year: 2026,
    category: { pt: "Website institucional", en: "Institutional website" },
    description: {
      pt: "Website para a Universidade Óscar Ribas, com carrossel principal navegável por toque e teclado, animações de entrada e menu mobile que fecha com Escape.",
      en: "Website for Universidade Óscar Ribas, with a hero carousel navigable by touch and keyboard, scroll-in animations and a mobile menu that closes with Escape."
    },
    tags: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://ricas-bot.github.io/uorwebsite/",
    repoUrl: "https://github.com/Ricas-bot/uorwebsite"
  },
  {
    slug: "capstone-blog",
    title: "Capstone Blog",
    art: "BLOG",
    year: 2026,
    category: { pt: "Aplicação web · Full-stack", en: "Web application · Full-stack" },
    description: {
      pt: "Aplicação de blog com operações CRUD completas, renderização no servidor e persistência num ficheiro JSON em vez de base de dados.",
      en: "Blog application with full CRUD, server-side rendering and persistence in a JSON file instead of a database."
    },
    tags: ["Node.js", "Express", "EJS", "Bootstrap"],
    liveUrl: null,
    repoUrl: "https://github.com/Ricas-bot/capstoneblog"
  }
];
