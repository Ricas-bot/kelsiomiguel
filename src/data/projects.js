/**
 * Selected work. Every field was verified against the public repository
 * on 2026-11-08 (README, package.json, source files, GitHub Pages).
 * `year` = repository creation year. `liveUrl` = GitHub Pages (HTTP 200).
 * Case-study fields (context, problem, solution…) are added in Phase 6.
 */
export const projects = [
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
