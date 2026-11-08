"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Terminal as TerminalIcon } from "lucide-react";

const output = {
  pt: {
    welcome: "Bem-vindo ao terminal de Kelsio Miguel. Escreve 'help' para ver os comandos disponíveis.",
    help: "Comandos disponíveis: help, about, projects, skills, experience, contact, clear, exit",
    about: "Sou Full-Stack Developer e LMS Engineer. Desenvolvo aplicações web, integrações e soluções Moodle/Totara.",
    projects: "Explora os projetos selecionados na secção WORK ou visita github.com/Ricas-bot.",
    skills: "PHP · Laravel · JavaScript · React · Next.js · SQL · Moodle · Totara · REST/SOAP · Linux · Git",
    experience: "Customer Solutions Developer na EDUdigital. Experiência em desenvolvimento, integrações, suporte e infraestrutura.",
    contact: "Email: kelsiomiguel2000@hotmail.com | LinkedIn: linkedin.com/in/kelsio-miguel-3437801a3",
    unknown: "Comando não reconhecido. Escreve 'help' para consultar os comandos."
  },
  en: {
    welcome: "Welcome to Kelsio Miguel's terminal. Type 'help' to see available commands.",
    help: "Available commands: help, about, projects, skills, experience, contact, clear, exit",
    about: "I'm a Full-Stack Developer and LMS Engineer building web applications, integrations and Moodle/Totara solutions.",
    projects: "Explore selected work in the WORK section or visit github.com/Ricas-bot.",
    skills: "PHP · Laravel · JavaScript · React · Next.js · SQL · Moodle · Totara · REST/SOAP · Linux · Git",
    experience: "Customer Solutions Developer at EDUdigital. Working across software development, integrations, support and infrastructure.",
    contact: "Email: kelsiomiguel2000@hotmail.com | LinkedIn: linkedin.com/in/kelsio-miguel-3437801a3",
    unknown: "Command not found. Type 'help' to see available commands."
  }
};

export default function Terminal({ language, onClose }) {
  const [history, setHistory] = useState([]);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const t = output[language];

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  const runCommand = (event) => {
    event.preventDefault();
    const command = value.trim().toLowerCase();
    if (!command) return;
    if (command === "exit") { onClose(); return; }
    if (command === "clear") { setHistory([]); setValue(""); return; }
    setHistory((items) => [...items, { command, response: t[command] || t.unknown }]);
    setValue("");
  };

  return (
    <motion.div className="terminal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="terminal-window" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} role="dialog" aria-modal="true" aria-label="Interactive terminal">
        <div className="terminal-bar"><div className="terminal-dots"><i /><i /><i /></div><span><TerminalIcon size={13} /> KELSiO@PORTFOLIO:~</span><button onClick={onClose} aria-label="Close terminal"><X size={18} /></button></div>
        <div className="terminal-body" data-lenis-prevent onClick={() => inputRef.current?.focus()}>
          <p className="terminal-muted">PORTFOLIO SHELL [VERSION 1.0.0]</p>
          <p>{t.welcome}</p>
          {history.map((item, index) => <div key={`${item.command}-${index}`} className="terminal-entry"><p><b>visitor@kelsio:~$</b> {item.command}</p><p className="terminal-response">{item.response}</p></div>)}
          <form onSubmit={runCommand} className="terminal-form"><label htmlFor="terminal-input">visitor@kelsio:~$</label><input id="terminal-input" ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" spellCheck="false" aria-label="Terminal command" /><span className="terminal-caret" /></form>
          <div ref={bottomRef} />
        </div>
        <div className="terminal-status"><span>● ONLINE</span><span>{"TYPE 'HELP' TO START"}</span><span>ESC / EXIT TO CLOSE</span></div>
      </motion.div>
    </motion.div>
  );
}
