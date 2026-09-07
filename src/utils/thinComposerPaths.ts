import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { slugifyStr } from "./slugify";
// Imports relativos a proposito: este modulo lo carga `astro.config.ts`, donde
// el alias "@/" y los modulos virtuales de Astro todavia no estan disponibles
// (por eso tampoco se importa BLOG_PATH desde content.config).
import { SITE } from "../config";

const BLOG_PATH = "src/data/blog";

/**
 * Rutas de intérprete que se marcan `noindex` por tener pocos himnos.
 *
 * Se usa desde `astro.config.ts` para excluirlas también del sitemap: anunciar
 * en el sitemap una URL que luego dice `noindex` es una señal contradictoria y
 * ensucia el informe de indexación. Lee el frontmatter directamente porque en
 * tiempo de configuración las content collections aún no existen.
 */
export function getThinComposerPaths(): Set<string> {
  const counts = new Map<string, number>();

  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
      entry.name.startsWith("_")
        ? []
        : entry.isDirectory()
          ? walk(join(dir, entry.name))
          : /\.mdx?$/.test(entry.name)
            ? [join(dir, entry.name)]
            : []
    );

  for (const file of walk(BLOG_PATH)) {
    const frontmatter = readFileSync(file, "utf8").split("---")[1] ?? "";
    if (/^draft:\s*true/m.test(frontmatter)) continue;

    const match = frontmatter.match(/^composer:\s*(?:"(.*)"|'(.*)'|(.*))\s*$/m);
    const name = (match?.[1] ?? match?.[2] ?? match?.[3])?.trim();
    if (!name) continue;

    const slug = slugifyStr(name);
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  return new Set(
    Array.from(counts.entries())
      .filter(([, count]) => count < SITE.minPostsToIndexInterprete)
      .map(([slug]) => `/interpretes/${slug}`)
  );
}
