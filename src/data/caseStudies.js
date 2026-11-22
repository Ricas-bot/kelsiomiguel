/**
 * Case studies, keyed by project slug (see ./projects.js).
 *
 * Source rule: every statement traces to the project's code/README (public
 * repos, verified 2026-11-08) or to material Kelsio provided (Progress
 * Recovery README). Sections without verifiable content are omitted
 * (`results: null`, `notes: null`) - never filled with invented metrics.
 * Never include: server/host names, tenant names, IDs, local paths, phase
 * status of private work, or client data.
 *
 * Shape (all text bilingual { pt, en }):
 *   context, problem: string
 *   solution: string[]
 *   architecture: { name, body }[]
 *   decisions: { title, body }[]
 *   results, notes: string[] | null
 *   stack: string[]
 */
const t = (pt, en) => ({ pt, en });

export const caseStudies = {
  "cross-tenant-access": {
    context: t(
      "Num Totara multi-tenant, cada tenant é isolado: um utilizador de uma organização não vê nem acede aos cursos de outra. Esse isolamento é o que torna a plataforma segura - mas há casos legítimos em que um formando ou formador de um tenant precisa de frequentar um curso específico de outro.",
      "In multi-tenant Totara, every tenant is isolated: a user from one organisation can't see or access another's courses. That isolation is what makes the platform safe - but there are legitimate cases where a learner or trainer from one tenant needs to attend a specific course in another."
    ),
    problem: t(
      "Abrir esse acesso sem enfraquecer o isolamento. A autorização tinha de ser explícita, limitada a um curso, com papel controlado, expiração e auditoria - sem nunca alterar a pertença do utilizador ao seu tenant original. E tinha de chegar a tudo o que o curso serve, actividades e ficheiros incluídos, não só à página do curso.",
      "Opening that access without weakening isolation. Authorisation had to be explicit, scoped to one course, with a controlled role, expiry and auditing - never changing the user's membership of their original tenant. And it had to reach everything the course serves, activities and files included, not just the course page."
    ),
    solution: t(
      [
        "Um plugin local, local_crosstenant, ligado a um ponto de extensão no core do Totara, documentado como patch. Quando o core decide se um utilizador está bloqueado pelo isolamento de tenants, pergunta ao plugin se existe uma autorização activa para aquele utilizador e aquele curso.",
        "A autorização é sempre Utilizador → Curso. Conceder cria uma inscrição real; revogar ou expirar remove-a. Na administração do curso, uma página permite pesquisar utilizadores de outros tenants e conceder ou revogar acessos, com confirmação antes de cada acção."
      ],
      [
        "A local plugin, local_crosstenant, wired into an extension point in Totara core, documented as a patch. When core decides whether a user is blocked by tenant isolation, it asks the plugin whether there is an active authorisation for that user and that course.",
        "Authorisation is always User → Course. Granting creates a real enrolment; revoking or expiry removes it. In course administration, a page lets admins search users from other tenants and grant or revoke access, with a confirmation before every action."
      ]
    ),
    architecture: [
      { name: t("Ponto de extensão no core", "Core extension point"), body: t("is_user_access_prevented() consulta o callback do plugin - o único ponto de decisão do isolamento.", "is_user_access_prevented() calls the plugin's callback - the single decision point for isolation.") },
      { name: t("access_manager", "access_manager"), body: t("Decide o acesso para contextos de curso e de actividade (módulos e ficheiros herdam o tenant do curso). Recusa categorias, blocos e sistema.", "Decides access for course and activity contexts (modules and files inherit the course's tenant). Refuses categories, blocks and system.") },
      { name: t("authorization_manager", "authorization_manager"), body: t("grant(), revoke() e expire_due(): idempotentes e na mesma transacção que a inscrição.", "grant(), revoke() and expire_due(): idempotent and in the same transaction as the enrolment.") },
      { name: t("enrolment_manager", "enrolment_manager"), body: t("Uma instância de inscrição dedicada por curso, por onde passam todas as inscrições concedidas pelo plugin.", "One dedicated enrolment instance per course, through which every plugin-granted enrolment goes.") },
      { name: t("Funções externas", "External functions"), body: t("Quatro endpoints AJAX - conceder, revogar, listar e pesquisar - formam a fronteira de segurança: parâmetros, contexto e capability são validados antes de qualquer serviço.", "Four AJAX endpoints - grant, revoke, list and search - form the security boundary: parameters, context and capability are validated before any service runs.") },
      { name: t("Tarefa agendada", "Scheduled task"), body: t("Marca autorizações expiradas e remove as inscrições, a cada 15 minutos por omissão.", "Marks expired authorisations and removes their enrolments, every 15 minutes by default.") },
      { name: t("Eventos e privacidade", "Events and privacy"), body: t("Eventos access_granted, access_revoked e access_expired, observer para cursos eliminados e privacy provider RGPD.", "access_granted, access_revoked and access_expired events, an observer for deleted courses and a GDPR privacy provider.") },
      { name: t("Interface", "Interface"), body: t("Templates Mustache e um módulo AMD: pesquisa com debounce, selecção de candidato e modais de confirmação.", "Mustache templates and an AMD module: debounced search, candidate selection and confirmation modals.") }
    ],
    decisions: [
      { title: t("Tenants derivados, nunca recebidos", "Tenants derived, never received"), body: t("Os tenants de origem e destino não existem como parâmetro: são calculados a partir do utilizador e do curso reais. Fazer spoofing de tenant é estruturalmente impossível.", "Source and target tenants don't exist as parameters: they're derived from the real user and course. Tenant spoofing is structurally impossible.") },
      { title: t("Separação estrutural das inscrições", "Structural enrolment separation"), body: t("Em vez de adivinhar que inscrições pertencem ao plugin, cada curso tem uma instância dedicada. Remover as inscrições do plugin nunca pode tocar noutras. Usa enrol_self, depois de confirmar que enrol_manual só permite uma instância por curso.", "Instead of guessing which enrolments belong to the plugin, each course gets a dedicated instance. Removing plugin enrolments can never touch others. It uses enrol_self, after confirming enrol_manual only allows one instance per course.") },
      { title: t("Expiração em tempo real", "Real-time expiry"), body: t("A decisão de acesso trata como inválida uma autorização com data passada, mesmo antes de a tarefa agendada correr. A tarefa arruma; não decide.", "The access decision treats an authorisation past its date as invalid, even before the scheduled task runs. The task tidies up; it doesn't decide.") },
      { title: t("Papéis limitados", "Limited roles"), body: t("Só Formando e Formador. Ter permissão para conceder acesso não basta para escolher um papel privilegiado.", "Only Learner and Trainer. Having permission to grant access isn't enough to pick a privileged role.") },
      { title: t("Auditoria preservada no RGPD", "Audit kept under GDPR"), body: t("Num pedido de eliminação, só o campo que identifica a pessoa é anonimizado; o registo do que aconteceu mantém-se.", "On an erasure request, only the field identifying that person is anonymised; the record of what happened is kept.") }
    ],
    results: t(
      [
        "10 ficheiros de testes PHPUnit: ponto de extensão, fronteira de segurança, inscrições, contexto de actividade, revogação, tarefa agendada, pesquisa, eventos, privacidade e segurança (IDOR, utilizador eliminado ou suspenso, curso eliminado).",
        "Script de verificação sem PHPUnit, executado com dados reais em ambiente de QA: 20/20 verificações.",
        "Conceder e revogar testados de ponta a ponta no browser, como Formador e como Formando."
      ],
      [
        "10 PHPUnit test files: extension point, security boundary, enrolments, activity context, revocation, scheduled task, search, events, privacy and security (IDOR, deleted or suspended user, deleted course).",
        "A verification script without PHPUnit, run against real data in a QA environment: 20/20 checks.",
        "Grant and revoke tested end to end in the browser, as Trainer and as Learner."
      ]
    ),
    notes: t(
      ["Maturidade ALPHA (V1). Achado em aberto, documentado: os cursos autorizados ainda não aparecem nas listagens \"Os meus cursos\", que usam um segundo mecanismo de isolamento no SQL do core."],
      ["ALPHA maturity (V1). Open, documented finding: authorised courses don't yet appear in \"My courses\" listings, which rely on a second isolation mechanism in core SQL."]
    ),
    stack: ["PHP", "Totara", "External API (AJAX)", "JavaScript (AMD)", "Mustache", "PHPUnit", "Scheduled tasks", "Privacy API"]
  },

  "progress-recovery": {
    context: t(
      "Desenvolvido para a plataforma Totara 19 da Zurich: recuperar, na instalação de destino, o progresso formativo exportado de outra instalação - contas, tentativas SCORM, conclusões, notas, registos de eventos e certificados.",
      "Built for Zurich's Totara 19 platform: restoring, on the target site, learning progress exported from another installation - accounts, SCORM attempts, completions, grades, event logs and certificates."
    ),
    problem: t(
      "Escrever directamente em dados académicos é arriscado: um pacote adulterado, um utilizador mal identificado ou uma recuperação interrompida podem corromper notas e conclusões. O processo tinha de ser verificável, retomável e conservador - nunca sobrepor dados mais recentes do destino.",
      "Writing straight into academic data is risky: a tampered package, a misidentified user or an interrupted run can corrupt grades and completions. The process had to be verifiable, resumable and conservative - never overwriting newer data on the target."
    ),
    solution: t(
      [
        "Um plugin local que trabalha em passos explícitos: carregar e validar o pacote, compará-lo com a instalação, aprovar um plano e recuperar por etapas. A recuperação está desligada por omissão e a aprovação exige confirmar a cópia de segurança.",
        "Cada etapa é validada antes da seguinte, por lotes retomáveis, e a interface mostra o resultado acumulado e só o que ainda falta."
      ],
      [
        "A local plugin that works in explicit steps: upload and validate the package, compare it with the site, approve a plan and recover in stages. Recovery is off by default and approval requires confirming the backup.",
        "Each stage is validated before the next, in resumable batches, and the interface shows the cumulative result and only what's still pending."
      ]
    ),
    architecture: [
      { name: t("Validação do pacote", "Package validation"), body: t("Pára na primeira falha e nada fica guardado. O ZIP é lido por streams, nunca extraído para disco; entradas seguras, sem ligações simbólicas nem cifra; assinatura HMAC-SHA256; checksums SHA-256 com lista fechada; manifesto com lista fechada de tabelas.", "Stops at the first failure and stores nothing. The ZIP is read via streams, never extracted to disk; safe entries, no symlinks or encryption; HMAC-SHA256 signature; SHA-256 checksums against a closed list; manifest with a closed list of tables.") },
      { name: t("Compatibilidade", "Compatibility"), body: t("Classificação por componente: Compatível, Compatível com avisos, Necessita de intervenção manual ou Incompatível.", "Per-component rating: Compatible, Compatible with warnings, Needs manual intervention or Incompatible.") },
      { name: t("Comparação", "Comparison"), body: t("Cada registo é Novo, Idêntico, Alterado, Conflito, Inválido, Destino mais recente ou Ignorado - sem alterar dados. Relatório com filtros e exportação em CSV e JSON.", "Every record is New, Identical, Changed, Conflict, Invalid, Target newer or Ignored - without changing data. Report with filters and CSV/JSON export.") },
      { name: t("Recuperação em 6 etapas", "Recovery in 6 stages"), body: t("Contas e fichas → tentativas SCORM → Feedback e conclusões → notas → registos de eventos → certificados.", "Accounts and forms → SCORM attempts → Feedback and completions → grades → event logs → certificates.") },
      { name: t("Registo de operações", "Operations log"), body: t("Uma operação por registo: uma interrupção nunca duplica nada e uma falha isolada não trava as outras. Repetir retoma os saltados e os falhados.", "One operation per record: an interruption never duplicates anything and a single failure doesn't block the rest. Re-running resumes skipped and failed records.") },
      { name: t("Desfazer", "Undo"), body: t("Reverte as escritas por ordem inversa, apenas nos registos que continuam como a recuperação os deixou.", "Reverts writes in reverse order, only on records still as the recovery left them.") }
    ],
    decisions: [
      { title: t("Utilizadores por username", "Users by username"), body: t("O id de outra instalação nunca é usado, para não atribuir progresso à pessoa errada.", "IDs from another installation are never used, so progress is never attributed to the wrong person.") },
      { title: t("O destino prevalece", "The target wins"), body: t("Se o destino já tem dados mais recentes para o mesmo utilizador e actividade, ficam os do destino. A origem só preenche o que falta.", "If the target already has newer data for the same user and activity, the target's data stays. The source only fills gaps.") },
      { title: t("Escrita directa nas tentativas SCORM", "Direct writes for SCORM attempts"), body: t("scorm_insert_track() gravaria a data de hoje e dispararia notas e conclusões. A escrita directa preserva as datas da origem e deixa esses cálculos para as etapas seguintes.", "scorm_insert_track() would stamp today's date and trigger grades and completions. Writing directly keeps the source dates and leaves those calculations to later stages.") },
      { title: t("Reclassificação no momento da escrita", "Re-check at write time"), body: t("Se o destino mudou desde a comparação, o registo é saltado e listado, em vez de sobreposto.", "If the target changed since the comparison, the record is skipped and listed instead of overwritten.") },
      { title: t("Sem efeitos laterais", "No side effects"), body: t("Conclusões pela API core_completion\\helper, sem disparar eventos. O plugin nunca cria inscrições, e os resultados nunca guardam respostas de inquéritos nem conteúdo SCORM.", "Completions go through the core_completion\\helper API without firing events. The plugin never creates enrolments, and results never store survey answers or SCORM content.") },
      { title: t("Acesso restrito", "Restricted access"), body: t("Capability própria, sem papel atribuído por omissão. A recuperação só é activada onde foi aprovada.", "Its own capability, assigned to no role by default. Recovery is only enabled where it was approved.") }
    ],
    results: t(
      ["Testes automáticos geram pacotes reais numa base de dados SQLite descartável e validam a leitura, a comparação (com um destino simulado) e a recuperação (com o core_completion\\helper real), sem precisar de uma base de dados Totara."],
      ["Automated tests generate real packages in a throwaway SQLite database and validate reading, comparison (against a simulated target) and recovery (with the real core_completion\\helper), without needing a Totara database."]
    ),
    notes: t(
      ["Limites do desfazer, documentados: não reverte contas criadas, respostas de inquérito e linhas SCORM substituídas, nem notificações já enviadas. A reposição desses dados faz-se pela cópia de segurança.", "Código num repositório privado, por envolver dados de um cliente."],
      ["Documented undo limits: it doesn't revert created accounts, replaced survey answers and SCORM rows, or notifications already sent. Those are restored from the backup.", "Code lives in a private repository, as it involves client data."]
    ),
    stack: ["PHP", "Totara 19", "HMAC-SHA256", "SHA-256", "ZIP streams", "JSON", "CSV", "SCORM", "SQLite (testes)"]
  },

  // Source: local_lnf README, version.php, tests/ and git history (local
  // checkout, 2026-11-14) + Kelsio's description of his role.
  sdf: {
    context: t(
      "Produto da EDUdigital para Totara. Todos os anos, uma organização decide que formação vai dar e a quem. O SDF traz esse levantamento para dentro da plataforma: o RH propõe, as Direções escolhem, o RH decide, e as formações aprovadas passam a um cronograma com inscrição automática.",
      "An EDUdigital product for Totara. Every year, an organisation decides which training to run and for whom. SDF brings that survey into the platform: HR proposes, departments choose, HR decides, and approved training moves to a schedule with automatic enrolment."
    ),
    problem: t(
      "Um processo com quatro papéis, estados que dependem uns dos outros e dinheiro envolvido. Cada Direção só pode escolher a sua equipa, várias Direções podem escolher a mesma proposta, e o custo tem de ser recalculado só com os participantes aprovados - em várias moedas, sem nunca reinterpretar valores já guardados.",
      "A process with four roles, interdependent states and money involved. Each department may only pick its own team, several departments can pick the same proposal, and the cost must be recalculated from approved participants only - across currencies, without ever reinterpreting stored amounts."
    ),
    solution: t(
      [
        "Na fase de MVP coordenei a equipa e desenvolvi a Receção, a Validação e o Cronograma. Depois do MVP fiquei responsável pelo plugin completo e levei-o até à primeira versão estável.",
        "Cinco páginas, uma por etapa, integradas no menu principal do Totara: cada pessoa só vê as que pode abrir. As Direções são identificadas pelas job assignments do Totara, por isso não há uma hierarquia paralela para manter."
      ],
      [
        "During the MVP I coordinated the team and built Reception, Validation and the Schedule. After the MVP I took over the whole plugin and brought it to its first stable release.",
        "Five pages, one per stage, wired into Totara's main menu: each person only sees the ones they can open. Departments are identified through Totara job assignments, so there is no parallel hierarchy to maintain."
      ]
    ),
    architecture: [
      { name: t("Sugestão (RH)", "Suggestion (HR)"), body: t("Vários cursos num só formulário, cada um uma proposta independente: curso do catálogo ou externo, custo por participante, até 5 anexos. Um token de submissão impede duplicados por duplo clique.", "Several courses in one form, each an independent proposal: catalogue or external course, cost per participant, up to 5 attachments. A submission token prevents double-click duplicates.") },
      { name: t("Validação (Direção)", "Validation (department)"), body: t("Prioridade e participantes, apenas da equipa directa. O departamento vem da organização da job assignment do diretor.", "Priority and participants, from the direct team only. The department comes from the director's job assignment organisation.") },
      { name: t("Receção (RH)", "Reception (HR)"), body: t("Aprovar ou rejeitar participantes, um a um ou em bloco, ou devolver à Direção com feedback obrigatório. O custo é recalculado só com os aprovados.", "Approve or reject participants, one by one or in bulk, or return to the department with mandatory feedback. Cost is recalculated from approved participants only.") },
      { name: t("Cronograma", "Schedule"), body: t("Vista anual, mensal ou em lista, com exportação CSV. Uma tarefa agendada inscreve os aprovados a partir da data de início de cada formação interna.", "Annual, monthly or list view, with CSV export. A scheduled task enrols approved participants from each internal course's start date.") },
      { name: t("Recolha para orçamento", "Budget collection"), body: t("Consolida as formações aprovadas por proposta, departamento e prioridade, e exporta para Excel ou CSV com os filtros do ecrã.", "Consolidates approved training by proposal, department and priority, and exports to Excel or CSV with the on-screen filters.") },
      { name: t("Eventos e notificações", "Events and notifications"), body: t("Cada passo gera um evento no registo do Totara. As notificações avisam quem tem de agir, nunca quem fez a acção, e só saem depois de a operação ficar gravada.", "Every step logs a Totara event. Notifications reach whoever has to act, never the person who acted, and only go out once the operation is saved.") },
      { name: t("RGPD", "GDPR"), body: t("Items de exportação e purga no totara_userdata. Onde o histórico tem de ficar, o utilizador eliminado é anonimizado.", "Export and purge items in totara_userdata. Where the history must stay, a deleted user is anonymised.") }
    ],
    decisions: [
      { title: t("Estado calculado, nunca editado", "Computed status, never edited"), body: t("O estado de uma proposta é recalculado a partir das validações e das decisões do RH sempre que algo muda, e cada estado tem uma explicação para o autor.", "A proposal's status is recalculated from validations and HR decisions whenever something changes, and every status comes with an explanation for its author.") },
      { title: t("A moeda fica com a proposta", "Currency stays with the proposal"), body: t("Cada proposta guarda a moeda em que o custo foi introduzido; a conversão usa taxas guardadas antes de qualquer soma. Euro, metical, escudo cabo-verdiano, kwanza e dólar, no formato do idioma de cada utilizador.", "Each proposal stores the currency its cost was entered in; conversion uses stored rates before any sum. Euro, metical, Cape Verdean escudo, kwanza and dollar, in each user's locale format.") },
      { title: t("A inscrição respeita decisões manuais", "Enrolment respects manual decisions"), body: t("Cada participante é inscrito uma só vez: quem for desinscrito à mão não volta a ser inscrito. Se o cron falhar um dia, a tarefa recupera na execução seguinte.", "Each participant is enrolled once: anyone unenrolled by hand is not enrolled again. If cron misses a day, the task catches up on the next run.") },
      { title: t("Aspecto nativo, substituível pelo tema", "Native look, overridable by the theme"), body: t("Todas as páginas em templates Mustache, com os componentes e as cores do tema e contraste AA. O CSS do plugin só se aplica às suas páginas.", "Every page in Mustache templates, with the theme's components and colours and AA contrast. The plugin's CSS only applies to its own pages.") },
      { title: t("Qualidade que bloqueia", "Quality that blocks"), body: t("Todo o código segue o moodle-cs e o CI falha com qualquer erro ou aviso.", "All code follows moodle-cs, and CI fails on any error or warning.") }
    ],
    results: t(
      [
        "Primeira versão estável (v1.4.3), seguida da v1.4.4.",
        "10 ficheiros de testes PHPUnit: workflow, integridade dos dados, segurança, token de submissão, estado das propostas, formulário, templates, anexos, RGPD e arquitectura."
      ],
      [
        "First stable release (v1.4.3), followed by v1.4.4.",
        "10 PHPUnit test files: workflow, data integrity, security, submission token, proposal status, form, templates, attachments, GDPR and architecture."
      ]
    ),
    notes: t(
      ["Produto da EDUdigital: o código está num repositório privado. Os ecrãs mostram dados de desenvolvimento."],
      ["An EDUdigital product: the code lives in a private repository. Screens show development data."]
    ),
    stack: ["PHP 8.1", "Totara 19", "Mustache", "JavaScript (AMD)", "External API", "Scheduled tasks", "totara_userdata", "PHPUnit", "moodle-cs", "CI"]
  },

  // Source: the live site (HTML + screenshots, 2026-11-14) and Kelsio.
  technologic: {
    context: t(
      "A Technologic é uma empresa angolana de tecnologia, fundada em 2025 em Luanda, que cria websites, design UI/UX e software à medida. Desenhei e desenvolvi o seu website, technologic.ao.",
      "Technologic is an Angolan technology company, founded in 2025 in Luanda, that builds websites, UI/UX design and custom software. I designed and built its website, technologic.ao."
    ),
    problem: t(
      "Uma empresa nova precisa de credibilidade imediata: uma identidade que se distinga, serviços explicados com clareza, preços que o cliente vê antes de contactar e regras de privacidade cumpridas desde o primeiro acesso.",
      "A new company needs instant credibility: an identity that stands out, clearly explained services, prices the client sees before getting in touch, and privacy rules respected from the first visit."
    ),
    solution: t(
      [
        "Um site em Next.js (App Router) com CSS Modules e Bootstrap, numa identidade escura com lima e tipografia larga.",
        "A home apresenta a proposta e os três serviços. A página de serviços mostra os pacotes de websites com preços em kwanzas, e há páginas institucionais, portfólio, contactos, rastreio de pedidos, termos e política de privacidade."
      ],
      [
        "A Next.js (App Router) site with CSS Modules and Bootstrap, in a dark and lime identity with wide typography.",
        "The home page presents the pitch and the three services. The services page lists website packages with prices in kwanzas, alongside company pages, portfolio, contacts, order tracking, terms and privacy policy."
      ]
    ),
    architecture: [
      { name: t("Home", "Home"), body: t("Hero com feixe de luz, serviços, chamada para o portfólio e apresentação da empresa.", "Hero with a beam of light, services, a call to the portfolio and the company intro.") },
      { name: t("Serviços", "Services"), body: t("Título com efeito de escrita, três pacotes de websites, acordeão de design UI/UX e software à medida.", "Typewriter headline, three website packages, a UI/UX design accordion and custom software.") },
      { name: t("Sobre nós", "About"), body: t("Visão geral, missão, visão, metas e equipa.", "Overview, mission, vision, goals and team.") },
      { name: t("Portfólio e contactos", "Portfolio and contacts"), body: t("Galeria de projectos e página de contacto.", "Project gallery and contact page.") },
      { name: t("Rastrear pedido", "Order tracking"), body: t("Página para o cliente acompanhar o seu pedido.", "A page where clients follow their order.") },
      { name: t("Termos e privacidade", "Terms and privacy"), body: t("Termos de utilização e política de privacidade, ligados no rodapé e no banner de cookies.", "Terms of use and privacy policy, linked from the footer and the cookie banner.") }
    ],
    decisions: [
      { title: t("Preços à vista", "Prices up front"), body: t("Os três pacotes mostram o preço e o que incluem, sem obrigar a um contacto prévio; o pacote recomendado está destacado.", "The three packages show their price and what's included without requiring contact first; the recommended package is highlighted.") },
      { title: t("Consentimento granular", "Granular consent"), body: t("O banner oferece Personalizar, Apenas essenciais e Aceitar todos, com ligação à política de privacidade, e um botão fixo permite rever a escolha.", "The banner offers Customise, Essential only and Accept all, links to the privacy policy, and a fixed button lets visitors revisit their choice.") },
      { title: t("Bootstrap como base, CSS Modules por componente", "Bootstrap as a base, CSS Modules per component"), body: t("A grelha e os componentes base vêm do Bootstrap; o estilo de cada componente fica isolado em CSS Modules.", "The grid and base components come from Bootstrap; each component's styling is scoped with CSS Modules.") },
      { title: t("SEO de base", "Baseline SEO"), body: t("Meta description e dados estruturados WebSite em JSON-LD.", "Meta description and WebSite structured data in JSON-LD.") }
    ],
    results: null,
    notes: null,
    stack: ["Next.js (App Router)", "React", "CSS Modules", "Bootstrap", "JSON-LD"]
  },

  // Source: Kelsio (2026-11-14), the Totara project sessions/memory (home,
  // crossselingedu, BBB) and the local_oidcgraphsync source. Never name the
  // deployment hosts, other client sites or people.
  "acores-platform": {
    context: t(
      "A plataforma de formação e capacitação online da Administração Pública Regional (APR) dos Açores corre em Totara e reúne várias entidades formadoras. Para a Direção Regional dos Açores fiz quatro entregas: a home pública, melhorias ao bloco Crossselling, a adaptação do BigBlueButton ao Totara 19 e um plugin de sincronização de atributos OIDC.",
      "The Azores Regional Public Administration (APR) online training platform runs on Totara and brings several training providers together. For the Direção Regional dos Açores I made four deliveries: the public home, improvements to the Crossselling block, BigBlueButton adapted to Totara 19 and an OIDC attribute sync plugin."
    ),
    problem: t(
      "Quatro problemas na mesma plataforma: uma oferta formativa repartida por páginas diferentes para cada público; um bloco de cursos em destaque com um modo remoto ligado a um marketplace já descontinuado; um módulo de videoconferência escrito para Moodle que falhava no Totara 19; e atributos do Microsoft Entra ID, como a empresa ou o departamento, que não chegavam ao perfil do Totara depois do login.",
      "Four problems on one platform: a course offer split across separate pages per audience; a featured-courses block with a remote mode tied to a discontinued marketplace; a video-conferencing module written for Moodle that broke on Totara 19; and Microsoft Entra ID attributes, such as company or department, that never reached the Totara profile after login."
    ),
    solution: t(
      [
        "Home pública: uma única página de formações, com filtros Todas, AP e Geral carregados por AJAX, filtros por entidade formadora e pesquisa. Os destaques mostram formações a começar ou iniciadas recentemente, por ordem cronológica, com \"Mostrar mais\".",
        "Bloco Crossselling, produto da EDUdigital que vai substituir a versão anterior em todas as plataformas: só mostra cursos que o utilizador pode ver, o autoplay respeita a escolha guardada, a cor personalizada fica no botão principal e o resto segue o tema.",
        "BigBlueButton no Totara 19: o mod_bigbluebuttonbn voltou a mostrar as gravações e o seletor de papéis na sessão voltou a funcionar.",
        "Sincronização de atributos OIDC (local_oidcgraphsync): depois de um login OpenID Connect, lê atributos adicionais do Microsoft Graph com o token guardado pelo auth_oidc e grava-os nos campos do Totara escolhidos pelo administrador."
      ],
      [
        "Public home: a single courses page, with All, AP and General filters loaded over AJAX, provider filters and search. Highlights show courses starting soon or recently started, in chronological order, with \"Show more\".",
        "Crossselling block, an EDUdigital product that will replace the previous version on every platform: it only shows courses the user can see, autoplay respects the saved choice, the custom colour stays on the main button and everything else follows the theme.",
        "BigBlueButton on Totara 19: mod_bigbluebuttonbn shows recordings again and the in-session role picker works again.",
        "OIDC attribute sync (local_oidcgraphsync): after an OpenID Connect login, it reads extra attributes from Microsoft Graph with the token stored by auth_oidc and writes them into the Totara fields the admin chose."
      ]
    ),
    architecture: [
      { name: t("Home pública", "Public home"), body: t("Uma index.php com os cursos servidos por AJAX e a lógica num só ficheiro, incluindo a definição dos campos personalizados do curso (público, tipologia, entidade formadora, ilha, carga horária...).", "One index.php with courses served over AJAX and the logic in a single file, including the definition of the custom course fields (audience, type, provider, island, workload...).") },
      { name: t("Bloco Crossselling", "Crossselling block"), body: t("Carrossel filtrado por totara_course_is_viewable, sem o curso do site. Relatório restrito a administradores e gestores por capability própria. Modo remoto removido.", "Carousel filtered by totara_course_is_viewable, without the site course. Report restricted to admins and managers by its own capability. Remote mode removed.") },
      { name: t("BigBlueButton", "BigBlueButton"), body: t("Módulos AMD recompilados com define anónimo, porque o loader do Totara transformava os módulos nomeados em texto. Renderers explícitos para as gravações, porque o render do Totara não recorre ao templatable.", "AMD modules rebuilt with anonymous define, because Totara's loader turned named modules into strings. Explicit renderers for recordings, because Totara's render doesn't fall back to templatable.") },
      { name: t("Sincronização OIDC", "OIDC sync"), body: t("Observer do evento user_loggedin → pedido a /v1.0/me com $select dos atributos mapeados → diferenças contra o perfil actual → actualização de campos base e personalizados → evento user_updated.", "user_loggedin observer → request to /v1.0/me with $select of the mapped attributes → diff against the current profile → update of core and custom fields → user_updated event.") }
    ],
    decisions: [
      { title: t("O login nunca falha por causa da sincronização", "Login never fails because of the sync"), body: t("Qualquer erro do Graph fica no debugging: o utilizador entra sempre. Só utilizadores OIDC são sincronizados, e só com um token válido do Microsoft Graph.", "Any Graph error goes to debugging: the user always gets in. Only OIDC users are synced, and only with a valid Microsoft Graph token.") },
      { title: t("Vazio não apaga", "Empty never erases"), body: t("Um atributo vazio no Entra ID nunca apaga um valor existente no Totara, e só se grava o que mudou.", "An empty attribute in Entra ID never erases an existing Totara value, and only what changed is written.") },
      { title: t("Atributos extra validados antes", "Extra attributes validated first"), body: t("Directory extensions do Entra Connect acrescentam-se nas definições e cada uma ganha um campo de mapeamento. Um script de CLI testa um nome com --probe e mostra as diferenças sem gravar, a menos que se peça --apply.", "Entra Connect directory extensions are added in settings and each gets its own mapping field. A CLI script tests a name with --probe and shows the diff without writing, unless --apply is passed.") },
      { title: t("Validar em produção sem a expor", "Validate in production without exposing it"), body: t("A nova home foi testada numa pasta paralela no servidor real antes de substituir a original. Por isso tudo usa URLs relativos.", "The new home was tested in a parallel folder on the real server before replacing the original. That's why everything uses relative URLs.") },
      { title: t("Um bloco vazio não aparece", "An empty block stays hidden"), body: t("Sem cursos seleccionados, o bloco fica oculto aos formandos; quem pode editar vê um botão para o configurar.", "With no courses selected, the block is hidden from learners; editors see a button to configure it.") }
    ],
    results: t(
      [
        "Bloco Crossselling publicado em produção e confirmado a funcionar.",
        "BigBlueButton validado em Totara 19.1.2: gravações e papéis na sessão."
      ],
      [
        "Crossselling block published to production and confirmed working.",
        "BigBlueButton validated on Totara 19.1.2: recordings and in-session roles."
      ]
    ),
    notes: t(
      ["Código privado: o bloco Crossselling e o plugin de sincronização pertencem à EDUdigital. Os nomes de pessoas nas capturas foram ocultados."],
      ["Private code: the Crossselling block and the sync plugin belong to EDUdigital. People's names in the screenshots are hidden."]
    ),
    stack: ["PHP", "Totara 19", "JavaScript (AMD)", "AJAX", "Mustache", "OpenID Connect", "Microsoft Graph", "Entra ID", "CLI"]
  },

  "lbs-demo": {
    context: t(
      "Demo de website para um centro de formação executiva, criada para mostrar ao cliente o que o seu site poderia entregar.",
      "A demo website for an executive training centre, built to show the client what their site could deliver."
    ),
    problem: t(
      "Antes de existir um projecto, era preciso uma demonstração convincente: uma experiência agradável e uma navegação fácil, que o cliente pudesse abrir e explorar.",
      "Before there was a project, a convincing demonstration was needed: a pleasant experience and easy navigation the client could open and explore."
    ),
    solution: t(
      ["Duas páginas estáticas - início e contactos - em HTML, CSS e JavaScript, sem dependências nem passo de build, publicadas no GitHub Pages."],
      ["Two static pages - home and contacts - in HTML, CSS and JavaScript, with no dependencies or build step, published on GitHub Pages."]
    ),
    architecture: [
      { name: t("index.html", "index.html"), body: t("Visão geral: hero, apresentação institucional, áreas de especialização, porquê escolher, testemunhos, parceiros e chamada para acção.", "Overview: hero, institutional intro, areas of specialisation, why choose us, testimonials, partners and call to action.") },
      { name: t("contactos.html", "contactos.html"), body: t("Localização, endereço e formulário de contacto.", "Location, address and contact form.") },
      { name: t("public/", "public/"), body: t("Uma folha de estilos por página e as imagens.", "One stylesheet per page, plus images.") },
      { name: t("Scripts", "Scripts"), body: t("Barra de progresso de leitura, navegação com estado de scroll, menu mobile, revelações, contadores e contagem decrescente.", "Reading progress bar, scroll-aware navigation, mobile menu, reveals, counters and a countdown.") }
    ],
    decisions: [
      { title: t("JavaScript nativo", "Vanilla JavaScript"), body: t("Sem frameworks: IntersectionObserver para revelações e contadores, listeners de scroll para a barra de progresso e o estado da navegação.", "No frameworks: IntersectionObserver for reveals and counters, scroll listeners for the progress bar and navigation state.") },
      { title: t("Formulário de demonstração", "Demo form"), body: t("Valida os campos e mostra um estado de sucesso, sem envio - adequado a uma demo, a ligar a um backend num projecto real.", "Validates fields and shows a success state, without sending - fine for a demo, to be wired to a backend in a real project.") }
    ],
    results: null,
    notes: null,
    stack: ["HTML", "CSS", "JavaScript", "IntersectionObserver", "GitHub Pages"]
  },

  "ozua-consultoria": {
    context: t(
      "Website single page para a Ozua, um centro de formação profissional - consultoria e treinamentos.",
      "A single-page website for Ozua, a professional training centre - consulting and training."
    ),
    problem: t(
      "Reconstruir um site que não chegou a ser lançado, com melhorias de detalhe, a partir de um design de outro autor.",
      "Rebuild a site that was never launched, refining the details, from a design by another author."
    ),
    solution: t(
      ["Uma página com apresentação, benefícios, cursos para empresas e para particulares, equipa, perguntas frequentes e contactos, em HTML, CSS e JavaScript sobre Bootstrap 5.3 e jQuery 3.7, publicada no GitHub Pages."],
      ["One page with an introduction, benefits, courses for companies and individuals, team, FAQ and contacts, in HTML, CSS and JavaScript on Bootstrap 5.3 and jQuery 3.7, published on GitHub Pages."]
    ),
    architecture: [
      { name: t("index.html", "index.html"), body: t("Todas as secções da página, com carrosséis, separadores, modais e acordeão do Bootstrap.", "Every section of the page, with Bootstrap carousels, tabs, modals and accordion.") },
      { name: t("js/index.js", "js/index.js"), body: t("Dados dos cursos e interacções: geração dos carrosséis, separadores, modais, cursor e botão de voltar ao topo.", "Course data and interactions: carousel generation, tabs, modals, cursor and back-to-top button.") },
      { name: t("css/ e assets/", "css/ and assets/"), body: t("Estilos próprios, fontes, ícones e imagens.", "Custom styles, fonts, icons and images.") }
    ],
    decisions: [
      { title: t("Carrosséis gerados a partir de dados", "Data-driven carousels"), body: t("Os cursos vivem num objecto JavaScript por público (empresas e particulares). Os slides são gerados agrupando três cursos por slide no desktop e um no mobile.", "Courses live in a JavaScript object per audience (companies and individuals). Slides are generated by grouping three courses per slide on desktop and one on mobile.") },
      { title: t("Separadores com estado", "Stateful tabs"), body: t("Os botões alternam o carrossel e a descrição de cada público e actualizam aria-selected.", "Buttons switch each audience's carousel and description and update aria-selected.") },
      { title: t("Vídeo que pára ao fechar", "Video that stops on close"), body: t("Ao fechar o modal, o src do iframe é reposto, o que interrompe a reprodução.", "When the modal closes, the iframe src is reset, which stops playback.") }
    ],
    results: null,
    notes: t(["O design é de outro autor; o meu trabalho foi a implementação e as melhorias."], ["The design is by another author; my work was the implementation and refinements."]),
    stack: ["HTML", "CSS", "JavaScript", "Bootstrap 5.3", "jQuery 3.7", "Lordicon", "GitHub Pages"]
  },

  "uor-website": {
    context: t(
      "Website para a Universidade Óscar Ribas - a universidade onde me licenciei.",
      "A website for Universidade Óscar Ribas - the university I graduated from."
    ),
    problem: t(
      "Reunir numa página a oferta da universidade - cursos, ensino semipresencial, números, testemunhos, acesso ao portal académico, notícias e contactos - utilizável em qualquer dispositivo.",
      "Bring the university's offer together on one page - courses, blended learning, key numbers, testimonials, access to the academic portal, news and contacts - usable on any device."
    ),
    solution: t(
      ["Uma página em HTML, CSS e JavaScript nativo, com carrossel principal, secções para cada tema e menu mobile, publicada no GitHub Pages."],
      ["One page in HTML, CSS and vanilla JavaScript, with a hero carousel, a section per topic and a mobile menu, published on GitHub Pages."]
    ),
    architecture: [
      { name: t("index.html", "index.html"), body: t("Carrossel principal e secções: porquê a UÓR, cursos, semipresencial, números, testemunhos, portal académico, notícias e contactos.", "Hero carousel and sections: why UÓR, courses, blended learning, numbers, testimonials, academic portal, news and contacts.") },
      { name: t("public/js/script.js", "public/js/script.js"), body: t("Navegação, menu mobile, carrossel, revelações, contadores e feedback do formulário.", "Navigation, mobile menu, carousel, reveals, counters and form feedback.") },
      { name: t("public/css e public/img", "public/css and public/img"), body: t("Estilos e imagens.", "Styles and images.") }
    ],
    decisions: [
      { title: t("Carrossel por vários meios", "Carousel, many ways in"), body: t("Avanço automático a cada 6 segundos, botões, pontos, swipe com limiar de 50px e setas do teclado. O temporizador reinicia após cada interacção.", "Auto-advance every 6 seconds, buttons, dots, swipe with a 50px threshold and arrow keys. The timer restarts after every interaction.") },
      { title: t("Menu mobile", "Mobile menu"), body: t("Fecha com Escape ou ao escolher um link, e bloqueia o scroll da página enquanto está aberto.", "Closes with Escape or on link selection, and locks page scroll while open.") },
      { title: t("Contadores com easing", "Eased counters"), body: t("requestAnimationFrame com ease-out cúbico, disparados por IntersectionObserver; o scroll da navegação usa um listener passivo.", "requestAnimationFrame with cubic ease-out, triggered by IntersectionObserver; the navigation's scroll uses a passive listener.") }
    ],
    results: null,
    notes: null,
    stack: ["HTML", "CSS", "JavaScript", "IntersectionObserver", "requestAnimationFrame", "GitHub Pages"]
  },

  "capstone-blog": {
    context: t(
      "Projecto capstone de aprendizagem: uma aplicação de blog completa, renderizada no servidor.",
      "A learning capstone project: a complete, server-rendered blog application."
    ),
    problem: t(
      "Criar, consultar, editar e eliminar publicações sem utilizar uma base de dados.",
      "Create, read, edit and delete posts without using a database."
    ),
    solution: t(
      ["Um servidor Express 5 com templates EJS e Bootstrap. Os posts ficam no ficheiro posts.json, lido no arranque e reescrito a cada alteração, com datas de criação e de edição."],
      ["An Express 5 server with EJS templates and Bootstrap. Posts live in posts.json, read at startup and rewritten on every change, with created and updated dates."]
    ),
    architecture: [
      { name: t("index.js", "index.js"), body: t("Servidor Express e rotas.", "Express server and routes.") },
      { name: t("Rotas", "Routes"), body: t("GET / (lista) · GET /detalhes · GET /create · POST /submit · GET /update · PUT /atualizar · DELETE /delete.", "GET / (list) · GET /detalhes · GET /create · POST /submit · GET /update · PUT /atualizar · DELETE /delete.") },
      { name: t("views/", "views/"), body: t("Templates EJS para lista, detalhe, criação e edição, com partials de cabeçalho e rodapé.", "EJS templates for list, detail, create and edit, with header and footer partials.") },
      { name: t("posts.json", "posts.json"), body: t("Persistência dos posts em ficheiro.", "File-based post persistence.") }
    ],
    decisions: [
      { title: t("Verbos HTTP a partir de formulários", "HTTP verbs from forms"), body: t("method-override permite usar PUT e DELETE a partir de formulários HTML, que só suportam GET e POST.", "method-override enables PUT and DELETE from HTML forms, which only support GET and POST.") },
      { title: t("JSON em vez de base de dados", "JSON instead of a database"), body: t("Escolha deliberada para o âmbito de aprendizagem e desenvolvimento local.", "A deliberate choice for the learning and local-development scope.") }
    ],
    results: null,
    notes: t(
      ["Limitações conhecidas: a persistência em ficheiro e a identificação dos posts pela posição na lista servem desenvolvimento local, não produção com vários utilizadores."],
      ["Known limitations: file persistence and identifying posts by list position suit local development, not multi-user production."]
    ),
    stack: ["Node.js", "Express 5", "EJS", "Bootstrap 5.3", "method-override", "body-parser"]
  }
};

export function getCaseStudy(slug) {
  return caseStudies[slug] ?? null;
}
