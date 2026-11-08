import styles from "./Hero.module.css";

const C = 300; // viewBox centre
const ORBITS = [
  { rotate: -18, rx: 250, ry: 86, spin: "spinSlow", nodes: [0.6, 3.6] },
  { rotate: 42, rx: 232, ry: 74, spin: "spinMid", nodes: [1.9, 4.8] },
  { rotate: 102, rx: 214, ry: 62, spin: "spinFast", nodes: [0.2, 2.9] }
];
const LABELS = [
  { text: "FRONTEND", x: C, y: 22, anchor: "middle" },
  { text: "BACKEND", x: 578, y: C + 4, anchor: "end" },
  { text: "LMS", x: C, y: 586, anchor: "middle" },
  { text: "INFRA", x: 22, y: C + 4, anchor: "start" }
];

/**
 * Abstract "system" diagram: orbits = layers, nodes = services, core = the
 * integration point. Pure SVG (no WebGL, no JS). Strokes are drawn in by the
 * hero intro (pathLength=1), orbits rotate slowly via CSS, and the whole
 * figure parallaxes with scroll. Decorative → aria-hidden.
 */
export default function HeroVisual() {
  return (
    <svg className={styles.visualSvg} viewBox="0 0 600 600" fill="none" aria-hidden="true" focusable="false">
      <circle cx={C} cy={C} r="272" className={styles.ringOuter} pathLength="1" data-draw />
      <circle cx={C} cy={C} r="150" className={styles.ringInner} pathLength="1" data-draw />
      <line x1={C} y1="40" x2={C} y2="560" className={styles.axis} />
      <line x1="40" y1={C} x2="560" y2={C} className={styles.axis} />

      {ORBITS.map((o, i) => (
        <g key={i} className={`${styles.orbit} ${styles[o.spin]}`}>
          <g transform={`rotate(${o.rotate} ${C} ${C})`}>
            <ellipse cx={C} cy={C} rx={o.rx} ry={o.ry} className={styles.orbitPath} pathLength="1" data-draw />
            {o.nodes.map((t) => (
              <circle
                key={t}
                cx={C + o.rx * Math.cos(t)}
                cy={C + o.ry * Math.sin(t)}
                r="5"
                className={styles.node}
                data-node
              />
            ))}
          </g>
        </g>
      ))}

      <circle cx={C} cy={C} r="34" className={styles.coreHalo} data-node />
      <circle cx={C} cy={C} r="7" className={styles.core} data-node />

      {LABELS.map((l) => (
        <text key={l.text} x={l.x} y={l.y} textAnchor={l.anchor} className={styles.label} data-node>
          {l.text}
        </text>
      ))}
    </svg>
  );
}
