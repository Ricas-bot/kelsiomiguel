/**
 * Case studies, keyed by project slug (see ./projects.js).
 *
 * Source rule: every statement traces to the project's code/README (public
 * repos, verified 2026-11-08) or to material Kelsio provided (Progress
 * Recovery README). Sections without verifiable content are omitted
 * (`results: null`, `notes: null`) — never filled with invented metrics.
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
      "Num Totara multi-tenant, cada tenant é isolado: um utilizador de uma organização não vê nem acede aos cursos de outra. Esse isolamento é o que torna a plataforma segura — mas há casos legítimos em que um formando ou formador de um tenant precisa de frequentar um curso específico de outro.",
      "In multi-tenant Totara, every tenant is isolated: a user from one organisation can't see or access another's courses. That isolation is what makes the platform safe — but there are legitimate cases where a learner or trainer from one tenant needs to attend a specific course in another."
    ),
    problem: t(
      "Abrir esse acesso sem enfraquecer o isolamento. A autorização tinha de ser explícita, limitada a um curso, com papel controlado, expiração e auditoria — sem nunca alterar a pertença do utilizador ao seu tenant original. E tinha de chegar a tudo o que o curso serve, actividades e ficheiros incluídos, não só à página do curso.",
      "Opening that access without weakening isolation. Authorisation had to be explicit, scoped to one course, with a controlled role, expiry and auditing — never changing the user's membership of their original tenant. And it had to reach everything the course serves, activities and files included, not just the course page."
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
      { name: t("Ponto de extensão no core", "Core extension point"), body: t("is_user_access_prevented() consulta o callback do plugin — o único ponto de decisão do isolamento.", "is_user_access_prevented() calls the plugin's callback — the single decision point for isolation.") },
      { name: t("access_manager", "access_manager"), body: t("Decide o acesso para contextos de curso e de actividade (módulos e ficheiros herdam o tenant do curso). Recusa categorias, blocos e sistema.", "Decides access for course and activity contexts (modules and files inherit the course's tenant). Refuses categories, blocks and system.") },
      { name: t("authorization_manager", "authorization_manager"), body: t("grant(), revoke() e expire_due(): idempotentes e na mesma transacção que a inscrição.", "grant(), revoke() and expire_due(): idempotent and in the same transaction as the enrolment.") },
      { name: t("enrolment_manager", "enrolment_manager"), body: t("Uma instância de inscrição dedicada por curso, por onde passam todas as inscrições concedidas pelo plugin.", "One dedicated enrolment instance per course, through which every plugin-granted enrolment goes.") },
      { name: t("Funções externas", "External functions"), body: t("Quatro endpoints AJAX — conceder, revogar, listar e pesquisar — formam a fronteira de segurança: parâmetros, contexto e capability são validados antes de qualquer serviço.", "Four AJAX endpoints — grant, revoke, list and search — form the security boundary: parameters, context and capability are validated before any service runs.") },
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
      "Desenvolvido para a plataforma Totara 19 da Zurich: recuperar, na instalação de destino, o progresso formativo exportado de outra instalação — contas, tentativas SCORM, conclusões, notas, registos de eventos e certificados.",
      "Built for Zurich's Totara 19 platform: restoring, on the target site, learning progress exported from another installation — accounts, SCORM attempts, completions, grades, event logs and certificates."
    ),
    problem: t(
      "Escrever directamente em dados académicos é arriscado: um pacote adulterado, um utilizador mal identificado ou uma recuperação interrompida podem corromper notas e conclusões. O processo tinha de ser verificável, retomável e conservador — nunca sobrepor dados mais recentes do destino.",
      "Writing straight into academic data is risky: a tampered package, a misidentified user or an interrupted run can corrupt grades and completions. The process had to be verifiable, resumable and conservative — never overwriting newer data on the target."
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
      { name: t("Comparação", "Comparison"), body: t("Cada registo é Novo, Idêntico, Alterado, Conflito, Inválido, Destino mais recente ou Ignorado — sem alterar dados. Relatório com filtros e exportação em CSV e JSON.", "Every record is New, Identical, Changed, Conflict, Invalid, Target newer or Ignored — without changing data. Report with filters and CSV/JSON export.") },
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
      ["Duas páginas estáticas — início e contactos — em HTML, CSS e JavaScript, sem dependências nem passo de build, publicadas no GitHub Pages."],
      ["Two static pages — home and contacts — in HTML, CSS and JavaScript, with no dependencies or build step, published on GitHub Pages."]
    ),
    architecture: [
      { name: t("index.html", "index.html"), body: t("Visão geral: hero, apresentação institucional, áreas de especialização, porquê escolher, testemunhos, parceiros e chamada para acção.", "Overview: hero, institutional intro, areas of specialisation, why choose us, testimonials, partners and call to action.") },
      { name: t("contactos.html", "contactos.html"), body: t("Localização, endereço e formulário de contacto.", "Location, address and contact form.") },
      { name: t("public/", "public/"), body: t("Uma folha de estilos por página e as imagens.", "One stylesheet per page, plus images.") },
      { name: t("Scripts", "Scripts"), body: t("Barra de progresso de leitura, navegação com estado de scroll, menu mobile, revelações, contadores e contagem decrescente.", "Reading progress bar, scroll-aware navigation, mobile menu, reveals, counters and a countdown.") }
    ],
    decisions: [
      { title: t("JavaScript nativo", "Vanilla JavaScript"), body: t("Sem frameworks: IntersectionObserver para revelações e contadores, listeners de scroll para a barra de progresso e o estado da navegação.", "No frameworks: IntersectionObserver for reveals and counters, scroll listeners for the progress bar and navigation state.") },
      { title: t("Formulário de demonstração", "Demo form"), body: t("Valida os campos e mostra um estado de sucesso, sem envio — adequado a uma demo, a ligar a um backend num projecto real.", "Validates fields and shows a success state, without sending — fine for a demo, to be wired to a backend in a real project.") }
    ],
    results: null,
    notes: null,
    stack: ["HTML", "CSS", "JavaScript", "IntersectionObserver", "GitHub Pages"]
  },

  "ozua-consultoria": {
    context: t(
      "Website single page para a Ozua, um centro de formação profissional — consultoria e treinamentos.",
      "A single-page website for Ozua, a professional training centre — consulting and training."
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
      "Website para a Universidade Óscar Ribas — a universidade onde me licenciei.",
      "A website for Universidade Óscar Ribas — the university I graduated from."
    ),
    problem: t(
      "Reunir numa página a oferta da universidade — cursos, ensino semipresencial, números, testemunhos, acesso ao portal académico, notícias e contactos — utilizável em qualquer dispositivo.",
      "Bring the university's offer together on one page — courses, blended learning, key numbers, testimonials, access to the academic portal, news and contacts — usable on any device."
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
