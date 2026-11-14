/** /manifest.webmanifest - name, colours and icons for "add to home screen". */
export default function manifest() {
  return {
    name: "Kelsio Miguel - Full-Stack Developer & LMS Engineer",
    short_name: "Kelsio Miguel",
    description: "Portfolio of Kelsio Miguel: full-stack development, Moodle and Totara engineering, integrations and infrastructure.",
    start_url: "/",
    display: "browser",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" }
    ]
  };
}
