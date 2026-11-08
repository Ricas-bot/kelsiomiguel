/**
 * Personal profile — single source of truth for identity, contacts and
 * career facts. Every value here was checked against the CV (2026-10-15)
 * and the GitHub profile (github.com/Ricas-bot) on 2026-11-08.
 * Do not add claims that cannot be traced to one of those sources.
 */
export const profile = {
  name: "Kelsio Miguel",
  initials: "KM",
  role: {
    pt: "Full-Stack Developer · LMS Engineer",
    en: "Full-Stack Developer · LMS Engineer"
  },
  location: { pt: "Lisboa, Portugal", en: "Lisbon, Portugal" },

  contact: {
    email: "kelsiomiguel2000@hotmail.com",
    github: "https://github.com/Ricas-bot",
    linkedin: "https://www.linkedin.com/in/kelsio-miguel-3437801a3/"
    // Phone is on the CV but deliberately not published on the website.
  },

  /** Professional availability badge in the hero. Confirmed by Kelsio 2026-11-08. */
  availability: {
    enabled: true,
    label: { pt: "Disponível para novos desafios", en: "Open to new opportunities" }
  },

  /** Headline facts shown in About. Source noted for each. */
  facts: [
    // CV › Resumo: "mais de 4 anos de experiência em Tecnologias de Informação"
    { value: "4+", label: { pt: "Anos em tecnologias de informação", en: "Years in information technology" } },
    // CV › Customer Solutions Developer: "Realização de 10+ formações"
    { value: "10+", label: { pt: "Formações para administradores e eFormadores", en: "Training sessions for admins and trainers" } },
    // CV › Projetos (clients in Portugal and Angola) — confirmed by Kelsio 2026-11-08
    { value: "02", label: { pt: "Mercados: Portugal e Angola", en: "Markets: Portugal and Angola" } }
  ],

  education: {
    degree: {
      pt: "Licenciatura em Engenharia Informática e Comunicações",
      en: "BSc in Computer Engineering and Communications"
    },
    institution: "Universidade Óscar Ribas",
    graduated: "2022-06"
  },

  languages: [
    { name: { pt: "Português", en: "Portuguese" }, level: { pt: "Nativo", en: "Native" } },
    { name: { pt: "Inglês", en: "English" }, level: { pt: "B1", en: "B1" } }
  ],

  /**
   * Public site URL. No domain yet (confirmed 2026-11-08): set
   * NEXT_PUBLIC_SITE_URL when one exists. Until then, absolute URLs
   * (canonical, sitemap, Open Graph) are omitted rather than faked.
   */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null
};
