import { profile } from "@/data/profile";

/** /robots.txt - everything is public; the sitemap is listed once a site URL is known. */
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(profile.siteUrl && { sitemap: `${profile.siteUrl}/sitemap.xml`, host: profile.siteUrl })
  };
}
