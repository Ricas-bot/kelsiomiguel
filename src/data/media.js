/**
 * Project screenshots, keyed by project slug (see ./projects.js).
 *
 * Source: screenshots Kelsio provided on 2026-11-14 (src/assets/portfolio-img.zip,
 * git-ignored) and captures of the public technologic.ao site. Every file in
 * src/assets/projects was cropped/redacted first: people's names are blurred,
 * and Progress Recovery shows only aggregate tables (no usernames, audiences,
 * file names or dates). SDF screens use development data.
 *
 *   cover    shown over the project art (lead, hover preview, case hero)
 *   gallery  case-study "On screen" section; `wide` spans the full width
 *   compare  before/after pairs (same feature, old vs new)
 *   device: "phone" on a gallery item draws a phone frame instead of a window
 */
import ctaGrant from "@/assets/projects/cross-tenant-access/grant.webp";
import ctaConfirm from "@/assets/projects/cross-tenant-access/confirm.webp";
import ctaActive from "@/assets/projects/cross-tenant-access/active.webp";
import ctaRevoked from "@/assets/projects/cross-tenant-access/revoked.webp";
import prCompare from "@/assets/projects/progress-recovery/compare.webp";
import prRecover from "@/assets/projects/progress-recovery/recover.webp";
import prUndoPlan from "@/assets/projects/progress-recovery/undo-plan.webp";
import prUndoDone from "@/assets/projects/progress-recovery/undo-done.webp";
import sdfSuggestions from "@/assets/projects/sdf/suggestions.webp";
import sdfValidation from "@/assets/projects/sdf/validation.webp";
import sdfReception from "@/assets/projects/sdf/reception.webp";
import sdfSchedule from "@/assets/projects/sdf/schedule.webp";
import sdfBudget from "@/assets/projects/sdf/budget.webp";
import sdfSettings from "@/assets/projects/sdf/settings.webp";
import apHome from "@/assets/projects/acores-platform/home.webp";
import apFeatured from "@/assets/projects/acores-platform/home-featured.webp";
import apCross from "@/assets/projects/acores-platform/crossselling.webp";
import apOidc from "@/assets/projects/acores-platform/oidc-sync.webp";
import apRecBefore from "@/assets/projects/acores-platform/bbb-recordings-before.webp";
import apRecAfter from "@/assets/projects/acores-platform/bbb-recordings-after.webp";
import apRolesBefore from "@/assets/projects/acores-platform/bbb-roles-before.webp";
import apRolesAfter from "@/assets/projects/acores-platform/bbb-roles-after.webp";
import tlHome from "@/assets/projects/technologic/home.webp";
import tlServices from "@/assets/projects/technologic/services.webp";
import tlPricing from "@/assets/projects/technologic/pricing.webp";
import tlMobile from "@/assets/projects/technologic/mobile.webp";

const t = (pt, en) => ({ pt, en });
const shot = (src, alt, caption, opts = {}) => ({ src, alt, caption, ...opts });

export const media = {
  "cross-tenant-access": {
    cover: shot(ctaGrant, t("Formulário para conceder acesso cross-tenant a um curso", "Form for granting cross-tenant access to a course")),
    gallery: [
      shot(ctaGrant, t("Página de acesso cross-tenant de um curso, com pesquisa de utilizador, papel, data de expiração e motivo", "A course's cross-tenant access page, with user search, role, expiry date and reason"), t("Conceder: utilizador de outro tenant, papel, expiração e motivo.", "Grant: a user from another tenant, role, expiry and reason."), { wide: true }),
      shot(ctaConfirm, t("Modal de confirmação antes de conceder o acesso", "Confirmation modal before granting access"), t("Cada acção pede confirmação e explica o que vai acontecer.", "Every action asks for confirmation and explains what will happen.")),
      shot(ctaActive, t("Tabela de utilizadores autorizados com o estado Ativo", "Authorised users table showing the Active state"), t("Autorização activa, com tenant de origem, papel e datas.", "Active authorisation, with source tenant, role and dates.")),
      shot(ctaRevoked, t("Tabela de utilizadores autorizados com o estado Revogado", "Authorised users table showing the Revoked state"), t("Depois de revogar: o registo fica, a inscrição sai.", "After revoking: the record stays, the enrolment goes."), { wide: true })
    ]
  },

  "progress-recovery": {
    cover: shot(prUndoPlan, t("Ecrã para desfazer a recuperação, com o plano por tabela", "Undo screen with the per-table plan")),
    gallery: [
      shot(prCompare, t("Tabela de comparação por componente: novos, idênticos, alterados, conflitos e ignorados", "Per-component comparison table: new, identical, changed, conflicts and ignored"), t("Comparação: cada registo classificado antes de qualquer escrita.", "Comparison: every record classified before anything is written."), { wide: true }),
      shot(prRecover, t("Resultado de uma etapa de recuperação por tabela: criados, actualizados, saltados e falhados", "Result of a recovery stage per table: created, updated, skipped and failed"), t("Recuperação: resultado acumulado por tabela.", "Recovery: cumulative result per table."), { wide: true }),
      shot(prUndoPlan, t("Plano para desfazer a recuperação, com aviso do que não é revertido e confirmações obrigatórias", "Plan to undo the recovery, with a warning about what isn't reverted and required confirmations"), t("Desfazer: o plano, os limites explícitos e duas confirmações.", "Undo: the plan, explicit limits and two confirmations.")),
      shot(prUndoDone, t("Resultado do desfazer: registos desfeitos e mantidos por tabela", "Undo result: records reverted and kept per table"), t("Depois de desfazer: o que mudou entretanto fica e é listado.", "After undo: whatever changed in the meantime stays and is listed."))
    ]
  },

  sdf: {
    cover: shot(sdfReception, t("Painel de receção do SDF com indicadores de validações, participantes, horas e custo", "SDF reception dashboard with validations, participants, hours and cost")),
    gallery: [
      shot(sdfSuggestions, t("Lista de sugestões de formação com modalidade, entidade formadora e estado", "Training suggestions list with delivery mode, provider and status"), t("1 · Sugestões do RH, com o estado calculado de cada proposta.", "1 · HR suggestions, each with its computed status."), { wide: true }),
      shot(sdfValidation, t("Painel de validação da Direção com separadores e acções por sugestão", "Department validation dashboard with tabs and actions per suggestion"), t("2 · Validação: cada Direção escolhe prioridade e participantes.", "2 · Validation: each department picks priority and participants.")),
      shot(sdfReception, t("Painel de receção com validações pendentes e resumo por curso", "Reception dashboard with pending validations and a per-course summary"), t("3 · Receção: o RH aprova, rejeita ou devolve.", "3 · Reception: HR approves, rejects or returns.")),
      shot(sdfSchedule, t("Cronograma anual de formação com totais e exportação CSV", "Annual training schedule with totals and CSV export"), t("4 · Cronograma anual, mensal ou em lista.", "4 · Annual, monthly or list schedule.")),
      shot(sdfBudget, t("Recolha para orçamento com filtros e exportação para Excel e CSV", "Budget collection with filters and Excel/CSV export"), t("Recolha para orçamento, com exportação filtrada.", "Budget collection, with filtered export.")),
      shot(sdfSettings, t("Definições do plugin: notificações, conversão de moeda e período de diagnóstico", "Plugin settings: notifications, currency conversion and diagnosis period"), t("Definições: moeda, conversão e período de diagnóstico.", "Settings: currency, conversion and diagnosis period."), { wide: true })
    ]
  },

  "acores-platform": {
    cover: shot(apHome, t("Home pública da plataforma de formação, com mapa das ilhas, pesquisa e filtros", "Public home of the training platform, with an islands map, search and filters")),
    gallery: [
      shot(apHome, t("Home pública: título, pesquisa e filtros por público e por entidade formadora", "Public home: title, search and filters by audience and training provider"), t("Home pública: pesquisa e filtros por público e entidade.", "Public home: search and filters by audience and provider."), { wide: true }),
      shot(apFeatured, t("Cartões de formações em destaque com entidade, datas, estado e chamada para acção", "Featured course cards with provider, dates, status and call to action"), t("Formações em destaque: entidade, datas e estado em cada cartão.", "Featured courses: provider, dates and status on every card."), { wide: true }),
      shot(apCross, t("Bloco de cursos em destaque com categorias e botões Saber mais e Ir para o curso", "Featured courses block with categories and Learn more / Go to course buttons"), t("Bloco Crossselling dentro da plataforma.", "Crossselling block inside the platform.")),
      shot(apOidc, t("Definições da sincronização de atributos OIDC com o mapeamento de atributos do Microsoft Graph", "OIDC attribute sync settings with Microsoft Graph attribute mapping"), t("Sincronização OIDC: cada atributo do Graph mapeado para um campo.", "OIDC sync: each Graph attribute mapped to a field."))
    ],
    compare: [
      {
        label: t("BigBlueButton · gravações", "BigBlueButton · recordings"),
        caption: t("Antes, a lista de gravações ficava vazia no Totara; depois, a tabela completa.", "Before, the recordings list was empty on Totara; after, the full table."),
        before: shot(apRecBefore, t("Antes: secção de gravações vazia", "Before: empty recordings section")),
        after: shot(apRecAfter, t("Depois: tabela de gravações com reprodução, nome, descrição, data e duração", "After: recordings table with playback, name, description, date and duration"))
      },
      {
        label: t("BigBlueButton · papéis na sessão", "BigBlueButton · session roles"),
        caption: t("Antes, o seletor de papéis aparecia como texto solto; depois, controlos funcionais.", "Before, the role picker rendered as loose text; after, working controls."),
        before: shot(apRolesBefore, t("Antes: seletor de papéis apresentado como texto", "Before: role picker rendered as text")),
        after: shot(apRolesAfter, t("Depois: seletores de papel e tabela de participantes com papel na sessão", "After: role pickers and a participant table with their session role"))
      }
    ]
  },

  technologic: {
    cover: shot(tlHome, t("Hero do website Technologic: Simplificamos o futuro", "Technologic website hero: Simplificamos o futuro")),
    gallery: [
      shot(tlHome, t("Hero do website com navegação, título, texto de apoio e botão Explorar", "Website hero with navigation, headline, supporting copy and Explore button"), t("Hero: a identidade escura e lima da marca.", "Hero: the brand's dark and lime identity."), { wide: true }),
      shot(tlServices, t("Secção de serviços: Website, Design UI/UX e Softwares à medida", "Services section: Website, UI/UX Design and Custom software"), t("Serviços na home.", "Services on the home page."), { wide: true }),
      shot(tlPricing, t("Três pacotes de websites com preços em kwanzas e funcionalidades", "Three website packages with prices in kwanzas and features"), t("Pacotes de websites, com preços públicos em kwanzas.", "Website packages, with public prices in kwanzas.")),
      shot(tlMobile, t("Hero do website num ecrã de telemóvel", "Website hero on a phone screen"), t("A mesma hero em mobile.", "The same hero on mobile."), { device: "phone" })
    ]
  }
};

export function getMedia(slug) {
  return media[slug] ?? null;
}
