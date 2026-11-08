import Hero from "@/components/sections/Hero";
import LegacyHome from "@/components/home/LegacyHome";
import PageTransition from "@/components/layout/PageTransition";
import { getDictionary } from "@/i18n/getDictionary";

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const t = {
    intro: dict.intro,
    sections: dict.sections,
    work: dict.work,
    about: dict.about,
    expertise: dict.expertise,
    contact: dict.contact
  };

  return (
    <PageTransition>
      <Hero lang={lang} t={dict.hero} />
      <LegacyHome lang={lang} t={t} />
    </PageTransition>
  );
}
