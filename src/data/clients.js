/**
 * Client engagements (professional work at EDUdigital).
 * Source: CV › Projetos (2026-10-15). Naming approved by Kelsio 2026-11-08.
 * Only what the CV states — no metrics, no internal details, no screenshots.
 * `market` mapping: PT = Portugal, AO = Angola (two markets confirmed by Kelsio).
 */
export const clients = [
  {
    id: "acores",
    name: "Direção Regional dos Açores",
    platform: "Totara",
    market: "PT",
    scope: {
      pt: "API REST, integração de sistemas, configuração de SSO, suporte multi-tenant, plugins à medida, formação de eFormadores e coordenadores e desenvolvimento de microaprendizagem.",
      en: "REST API, systems integration, SSO configuration, multi-tenant support, custom plugins, training for trainers and coordinators, and microlearning development."
    },
    tags: ["REST API", "SSO", "Multi-tenant", "Plugins"]
  },
  {
    id: "cin",
    name: "CIN",
    platform: "Totara",
    market: "PT",
    scope: {
      pt: "Endpoints REST personalizados e funções de integração com o Global HR e o Metacompliance.",
      en: "Custom REST endpoints and integration functions with Global HR and Metacompliance."
    },
    tags: ["REST API", "Global HR", "Metacompliance"]
  },
  {
    id: "champalimaud",
    name: "Champalimaud",
    platform: "Totara",
    market: "PT",
    scope: {
      pt: "Endpoints REST/SOAP personalizados, funções de integração com o PHC e suporte técnico na plataforma.",
      en: "Custom REST/SOAP endpoints, integration functions with PHC and technical support on the platform."
    },
    tags: ["REST", "SOAP", "PHC"]
  },
  {
    id: "renova",
    name: "Renova",
    platform: "Moodle",
    market: "PT",
    scope: {
      pt: "Resolução de problemas de produção, criação de um ambiente de teste em Windows Server 2022 e validação das soluções antes da implementação em produção.",
      en: "Production troubleshooting, a Windows Server 2022 test environment, and validation of fixes before rolling them out to production."
    },
    tags: ["Troubleshooting", "Windows Server"]
  },
  {
    id: "ordem-arquitetos",
    name: "Ordem dos Arquitetos",
    platform: "Moodle",
    market: "PT",
    scope: {
      pt: "Melhoria da experiência de utilização, suporte técnico e pedagógico.",
      en: "User experience improvements, technical and pedagogical support."
    },
    tags: ["UX", "Support"]
  },
  {
    id: "amnistia",
    name: "Amnistia",
    platform: "Moodle",
    market: "PT",
    scope: {
      pt: "Upgrade para Moodle 5.2, com adaptação da estrutura de directórios e da pasta public como document root em cPanel. Symlinks criados por script PHP, sem acesso a terminal.",
      en: "Upgrade to Moodle 5.2, adapting the directory structure and setting the public folder as document root in cPanel. Symlinks created through a PHP script, with no terminal access."
    },
    tags: ["Upgrade", "cPanel", "PHP"]
  },
  {
    id: "zap",
    name: "ZAP",
    platform: "Totara",
    market: "AO",
    scope: {
      pt: "Administração do LMS, SSO com LDAP e mapeamento de campos de utilizador, migração do servidor de CentOS para AlmaLinux 8/9, VPN IPsec e melhorias de UX.",
      en: "LMS administration, LDAP SSO and user field mapping, server migration from CentOS to AlmaLinux 8/9, IPsec VPN and UX improvements."
    },
    tags: ["LDAP", "AlmaLinux", "VPN IPsec", "Migration"]
  },
  {
    id: "omatapalo",
    name: "Omatapalo",
    platform: "Totara",
    market: "AO",
    scope: {
      pt: "Integração do Microsoft Entra ID por OAuth 2.0, configuração da hierarquia organizacional, painel de controlo personalizado e formação de eFormadores.",
      en: "Microsoft Entra ID integration via OAuth 2.0, organisational hierarchy set-up, custom dashboard and trainer training."
    },
    tags: ["OAuth 2.0", "Entra ID", "Hierarchy"]
  },
  {
    id: "etu-energias",
    name: "ETU Energias",
    platform: "Totara 20",
    market: "AO",
    scope: {
      pt: "Implementação inicial da plataforma, gestão de utilizadores e funções, configuração e formação de eFormadores.",
      en: "Initial platform implementation, user and role management, configuration and trainer training."
    },
    tags: ["Implementation", "Roles", "Training"]
  }
];
