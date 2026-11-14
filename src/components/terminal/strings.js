/**
 * Terminal copy (PT/EN). Lives with the terminal because the terminal is a
 * lazily loaded client chunk: none of this ships until it is opened.
 * Style rule: hyphens, never em dashes, in user-facing text.
 */
export const strings = {
  pt: {
    title: "kelsio@portfolio: ~",
    prompt: "visitante@kelsio:~$",
    banner: "KELSIO MIGUEL · PORTFOLIO SHELL v2",
    welcome: "Bem-vindo. Escreve help para ver os comandos disponíveis.",
    hints: "Tab completa · ↑ ↓ histórico · Ctrl+L limpa · Esc fecha",
    dialogLabel: "Terminal interactivo",
    inputLabel: "Comando",
    close: "Fechar terminal",
    suggestions: "Sugestões",
    notFound: (cmd) => `comando não encontrado: ${cmd}`,
    didYouMean: (cmd) => `Querias dizer "${cmd}"?`,
    tryHelp: "Escreve help para ver a lista de comandos.",
    candidates: "Comandos possíveis:",
    aliases: "Atalhos: whoami, ls, cls, quit",
    opening: (name) => `A abrir ${name} num novo separador.`,
    fallback: "Se não abriu, usa o link:",
    projectsHint: "Abre um projecto para ver o case study completo.",
    clientsLine: (n) => `${n} projectos com clientes em Portugal e Angola (Moodle e Totara):`,
    status: { online: "online", shortcut: "Ctrl+K abre e fecha" },
    labels: { email: "email", linkedin: "linkedin", github: "github", location: "local", available: "estado" },
    descriptions: {
      help: "Lista os comandos disponíveis",
      about: "Quem sou, em poucas linhas",
      projects: "Projectos seleccionados, com link para o case study",
      skills: "Ferramentas e tecnologias por área",
      experience: "Percurso profissional e clientes",
      contact: "Email, LinkedIn, GitHub e localização",
      github: "Abre o meu GitHub",
      linkedin: "Abre o meu LinkedIn",
      clear: "Limpa o ecrã",
      exit: "Fecha o terminal"
    }
  },
  en: {
    title: "kelsio@portfolio: ~",
    prompt: "visitor@kelsio:~$",
    banner: "KELSIO MIGUEL · PORTFOLIO SHELL v2",
    welcome: "Welcome. Type help to see the available commands.",
    hints: "Tab completes · ↑ ↓ history · Ctrl+L clears · Esc closes",
    dialogLabel: "Interactive terminal",
    inputLabel: "Command",
    close: "Close terminal",
    suggestions: "Suggestions",
    notFound: (cmd) => `command not found: ${cmd}`,
    didYouMean: (cmd) => `Did you mean "${cmd}"?`,
    tryHelp: "Type help to see the list of commands.",
    candidates: "Possible commands:",
    aliases: "Aliases: whoami, ls, cls, quit",
    opening: (name) => `Opening ${name} in a new tab.`,
    fallback: "If it didn't open, use the link:",
    projectsHint: "Open a project to read the full case study.",
    clientsLine: (n) => `${n} client projects in Portugal and Angola (Moodle and Totara):`,
    status: { online: "online", shortcut: "Ctrl+K opens and closes" },
    labels: { email: "email", linkedin: "linkedin", github: "github", location: "location", available: "status" },
    descriptions: {
      help: "Lists the available commands",
      about: "Who I am, in a few lines",
      projects: "Selected projects, linking to each case study",
      skills: "Tools and technologies by area",
      experience: "Career path and clients",
      contact: "Email, LinkedIn, GitHub and location",
      github: "Opens my GitHub",
      linkedin: "Opens my LinkedIn",
      clear: "Clears the screen",
      exit: "Closes the terminal"
    }
  }
};
