/**
 * Terminal command registry. Pure functions: given a language they return
 * output blocks (rendered by Terminal.jsx) and an optional effect.
 * All answers are built from the verified data in src/data — nothing here
 * restates facts by hand.
 *
 * Block kinds:
 *   { kind: "text", text, tone? }        tone: "muted" | "accent" | "error"
 *   { kind: "rows", rows: [[key, value, href?]] }
 *   { kind: "list", items: [{ index, label, meta, aside, href }] }
 * Effects: { type: "clear" } | { type: "exit" } | { type: "open", url }
 */
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { experience } from "@/data/experience";
import { clients } from "@/data/clients";
import { formatRange } from "@/lib/format";
import { strings } from "./strings";

const pad = (n) => String(n).padStart(2, "0");

export const COMMANDS = ["help", "about", "projects", "skills", "experience", "contact", "github", "linkedin", "clear", "exit"];

const ALIASES = { whoami: "about", ls: "projects", cls: "clear", quit: "exit", "?": "help" };

const handlers = {
  help(lang) {
    const s = strings[lang];
    return {
      blocks: [
        { kind: "rows", rows: COMMANDS.map((c) => [c, s.descriptions[c]]) },
        { kind: "text", text: s.aliases, tone: "muted" },
        { kind: "text", text: s.hints, tone: "muted" }
      ]
    };
  },

  about(lang) {
    const current = experience[0];
    const years = profile.facts[0]; // "4+ anos em tecnologias de informação" (CV)
    const pt = lang === "pt";
    return {
      blocks: [
        { kind: "text", text: `${profile.name} · ${profile.role[lang]}`, tone: "accent" },
        { kind: "text", text: `${profile.location[lang]} · ${current.role[lang]} ${pt ? "na" : "at"} ${current.company}` },
        {
          kind: "text",
          text: `${years.value} ${years.label[lang].toLowerCase()}: ${
            pt
              ? "desenvolvimento web, plataformas Moodle e Totara, integrações e infraestrutura."
              : "web development, Moodle and Totara platforms, integrations and infrastructure."
          }`
        },
        {
          kind: "text",
          text: `${profile.education.degree[lang]} - ${profile.education.institution} (${profile.education.graduated.slice(0, 4)}).`,
          tone: "muted"
        }
      ]
    };
  },

  projects(lang) {
    return {
      blocks: [
        {
          kind: "list",
          items: projects.map((p, i) => ({
            index: pad(i + 1),
            label: p.title,
            meta: p.client ? `${p.category[lang]} · ${p.client}` : p.category[lang],
            aside: String(p.year),
            href: `/${lang}/projects/${p.slug}`
          }))
        },
        { kind: "text", text: strings[lang].projectsHint, tone: "muted" }
      ]
    };
  },

  skills(lang) {
    return { blocks: [{ kind: "rows", rows: skillGroups.map((g) => [g.label[lang].toLowerCase(), g.items.join(" · ")]) }] };
  },

  experience(lang) {
    const s = strings[lang];
    return {
      blocks: [
        {
          kind: "rows",
          rows: experience.map((r) => [
            formatRange(r.start, r.end, lang, lang === "pt" ? "presente" : "present"),
            `${r.role[lang]} · ${r.company}`
          ])
        },
        { kind: "text", text: s.clientsLine(clients.length), tone: "muted" },
        { kind: "text", text: clients.map((c) => c.name).join(" · ") }
      ]
    };
  },

  contact(lang) {
    const { labels } = strings[lang];
    const { email, linkedin, github } = profile.contact;
    const rows = [
      [labels.email, email, `mailto:${email}`],
      [labels.linkedin, linkedin.replace(/^https:\/\/(www\.)?/, ""), linkedin],
      [labels.github, github.replace(/^https:\/\//, ""), github],
      [labels.location, profile.location[lang]]
    ];
    if (profile.availability.enabled) rows.push([labels.available, profile.availability.label[lang]]);
    return { blocks: [{ kind: "rows", rows }] };
  },

  github(lang) {
    return openExternal(lang, "GitHub", profile.contact.github);
  },

  linkedin(lang) {
    return openExternal(lang, "LinkedIn", profile.contact.linkedin);
  },

  clear() {
    return { blocks: [], effect: { type: "clear" } };
  },

  exit() {
    return { blocks: [], effect: { type: "exit" } };
  }
};

function openExternal(lang, name, url) {
  const s = strings[lang];
  return {
    blocks: [
      { kind: "text", text: s.opening(name), tone: "accent" },
      { kind: "rows", rows: [[s.fallback, url.replace(/^https:\/\/(www\.)?/, ""), url]] }
    ],
    effect: { type: "open", url }
  };
}

/** Classic edit distance, for "did you mean" suggestions. */
function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

function closest(input) {
  let best = null;
  for (const name of [...COMMANDS, ...Object.keys(ALIASES)]) {
    const d = distance(input, name);
    if (d <= 2 && (!best || d < best.d)) best = { name: ALIASES[name] ?? name, d };
  }
  return best?.name ?? null;
}

/** Runs a raw input line. Unknown commands get a helpful error. */
export function runCommand(raw, lang) {
  const name = raw.trim().toLowerCase().split(/\s+/)[0];
  const resolved = ALIASES[name] ?? name;
  if (handlers[resolved]) return handlers[resolved](lang);

  const s = strings[lang];
  const guess = closest(name);
  return {
    blocks: [
      { kind: "text", text: s.notFound(name), tone: "error" },
      { kind: "text", text: guess ? s.didYouMean(guess) : s.tryHelp, tone: "muted" }
    ],
    error: true
  };
}

/** Tab completion: unique prefix → completed value; several → candidates. */
export function complete(input) {
  const prefix = input.trim().toLowerCase();
  if (!prefix) return { value: input, candidates: [] };
  const matches = COMMANDS.filter((c) => c.startsWith(prefix));
  if (matches.length === 1) return { value: matches[0], candidates: [] };
  if (matches.length > 1) {
    // Extend to the longest shared prefix (bash-style).
    let common = matches[0];
    for (const m of matches) while (!m.startsWith(common)) common = common.slice(0, -1);
    return { value: common, candidates: matches };
  }
  return { value: input, candidates: [] };
}

/** Commands to suggest for the current input (chips under the prompt). */
export function suggest(input) {
  const prefix = input.trim().toLowerCase();
  if (!prefix) return ["help", "about", "projects", "contact"];
  return COMMANDS.filter((c) => c.startsWith(prefix) && c !== prefix).slice(0, 5);
}
