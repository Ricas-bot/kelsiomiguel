import Hero from "@/components/sections/Hero";
import Introduction from "@/components/sections/Introduction";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Expertise from "@/components/sections/Expertise";
import Contact from "@/components/sections/Contact";
import PageTransition from "@/components/layout/PageTransition";
import { getDictionary } from "@/i18n/getDictionary";

/**
 * Home — a Server Component composing the sections. Each section receives
 * only its own strings; motion lives in small client islands inside them.
 */
export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <PageTransition>
      <Hero lang={lang} t={dict.hero} />
      <Introduction t={dict.intro} />
      <Projects lang={lang} t={dict.work} a11y={dict.a11y} />
      <About lang={lang} t={dict.about} />
      <Experience lang={lang} t={dict.experience} />
      <Expertise lang={lang} t={dict.expertise} />
      <Contact lang={lang} t={dict.contact} a11y={dict.a11y} />
    </PageTransition>
  );
}
