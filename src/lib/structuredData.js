import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";
import { htmlLang } from "@/i18n/config";

/**
 * schema.org builders. Only verified facts from src/data; URLs are added
 * only when a real site URL is known (profile.siteUrl).
 */
const base = () => profile.siteUrl;

export function personSchema(lang, description) {
  const current = experience[0];
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role[lang],
    description,
    email: `mailto:${profile.contact.email}`,
    ...(base() && { url: `${base()}/${lang}` }),
    sameAs: [profile.contact.github, profile.contact.linkedin],
    address: { "@type": "PostalAddress", addressLocality: "Lisboa", addressCountry: "PT" },
    worksFor: { "@type": "Organization", name: current.company },
    alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.institution },
    knowsAbout: skillGroups.flatMap((g) => g.items).slice(0, 24),
    knowsLanguage: ["pt", "en"]
  };
}

export function projectSchema(project, lang) {
  const isCode = Boolean(project.repoUrl);
  return {
    "@context": "https://schema.org",
    "@type": isCode ? "SoftwareSourceCode" : "CreativeWork",
    name: project.title,
    description: project.description[lang],
    inLanguage: htmlLang[lang],
    dateCreated: String(project.year),
    keywords: project.tags.join(", "),
    author: { "@type": "Person", name: profile.name, ...(base() && { url: `${base()}/${lang}` }) },
    ...(project.client && { sourceOrganization: { "@type": "Organization", name: project.client } }),
    ...(isCode && { codeRepository: project.repoUrl }),
    ...(base() && { url: `${base()}/${lang}/projects/${project.slug}` })
  };
}
