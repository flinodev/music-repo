import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Imports relativos y lectura directa del frontmatter: este modulo lo carga
// `astro.config.ts`, donde el alias "@/" y las content collections de Astro
// todavia no existen.
const BLOG_PATH = "src/data/blog";

/**
 * Fecha de ultima modificacion por ruta de post, para el `lastmod` del sitemap.
 *
 * Sin `lastmod` Google no sabe que ha cambiado y prioriza peor el rastreo, algo
 * que pesa cuando muchas URLs estan en "Descubierta: actualmente sin indexar".
 */
export function getPostLastmod(): Map<string, Date> {
  const lastmod = new Map<string, Date>();

  const files = readdirSync(BLOG_PATH, { withFileTypes: true })
    .filter(e => e.isFile() && /\.mdx?$/.test(e.name) && !e.name.startsWith("_"))
    .map(e => e.name);

  for (const file of files) {
    const frontmatter =
      readFileSync(join(BLOG_PATH, file), "utf8").split("---")[1] ?? "";
    if (/^draft:\s*true/m.test(frontmatter)) continue;

    const pick = (field: string) =>
      frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1].trim();

    const raw = pick("modDatetime") || pick("pubDatetime");
    if (!raw) continue;

    const date = new Date(raw.replace(/^["']|["']$/g, ""));
    if (Number.isNaN(date.getTime())) continue;

    lastmod.set(`/posts/${file.replace(/\.mdx?$/, "")}`, date);
  }

  return lastmod;
}
