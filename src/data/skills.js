/**
 * Technical toolkit grouped by area. Source: CV › Competências (2026-10-15).
 * No proficiency levels or progress bars by design.
 */
export const skillGroups = [
  {
    id: "development",
    label: { pt: "Desenvolvimento", en: "Development" },
    items: ["PHP", "Laravel", "JavaScript", "React", "Next.js", "Node.js", "Express", "EJS", "SQL", "CSS"]
  },
  {
    id: "integrations",
    label: { pt: "Integrações", en: "Integrations" },
    items: ["REST API", "SOAP", "LDAP", "SAML", "OAuth 2.0", "Microsoft Entra ID"]
  },
  {
    id: "lms",
    label: { pt: "LMS & CMS", en: "LMS & CMS" },
    items: ["Totara", "Moodle", "WordPress", "Joomla"]
  },
  {
    id: "infrastructure",
    label: { pt: "Infraestrutura", en: "Infrastructure" },
    items: ["Linux", "AlmaLinux", "Ubuntu", "CentOS", "Windows Server", "Apache", "MySQL", "MariaDB", "cPanel"]
  },
  {
    id: "tools",
    label: { pt: "DevOps & Ferramentas", en: "DevOps & Tools" },
    items: ["Git", "VirtualBox", "VMware", "VPN / IPsec", "Postman"]
  },
  {
    id: "platforms",
    label: { pt: "Outras plataformas", en: "Other platforms" },
    items: ["Zoom", "BigBlueButton", "Bitrix", "Odoo"]
  }
];
