// Genera la descripción de YouTube de cada himno a partir de su .mdx: enlace al
// post, tono, compás, intérprete, letra y hashtags con sus tags.
// Uso: npm run yt:descripciones [-- <carpeta-del-blog> <carpeta-de-salida>]
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { basename, join } from "path";

const [blogDir = "src/data/blog", outDir = "youtube-descripciones"] =
  process.argv.slice(2);
const SITE = "https://www.music-repo.com";
// YouTube rechaza descripciones con "<" o ">" y las corta a los 5000 caracteres
const MAX = 5000;

const unquote = value => value.trim().replace(/^(['"])(.*)\1$/, "$2");
const field = (fm, name) => {
  const m = fm.match(new RegExp(`^${name}:\\s*(.*)$`, "m"));
  return m ? unquote(m[1]) : "";
};
const list = (fm, name) => {
  const m = fm.match(new RegExp(`^${name}:\\s*\\n((?:\\s+-.*\\n?)+)`, "m"));
  if (!m) return [];
  return m[1]
    .split("\n")
    .map(line => unquote(line.replace(/^\s*-\s*/, "")))
    .filter(Boolean);
};
const hashtag = tag => "#" + tag.replace(/[^\p{L}\p{N}]/gu, "");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const skipped = [];
let count = 0;

for (const file of readdirSync(blogDir)
  .filter(f => f.endsWith(".mdx"))
  .sort()) {
  const slug = basename(file, ".mdx");
  const src = readFileSync(join(blogDir, file), "utf8");
  const fm = src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  if (slug === "template" || field(fm, "draft") === "true") continue;

  const block = src.match(/<div class="text-center">([\s\S]*?)<\/div>/)?.[1];
  if (!block) {
    skipped.push(slug);
    continue;
  }

  const title = field(fm, "title");
  const composer = field(fm, "composer");
  const tags = list(fm, "tags");
  const tono = src.match(/^- Tono:\s*(.+)$/m)?.[1].trim();
  const compas = src.match(/^- Compás:\s*(.+)$/m)?.[1].trim();
  const details = [tono && `Tono: ${tono}`, compas && `Compás: ${compas}`]
    .filter(Boolean)
    .join(" · ");

  const lyrics = block
    .split("\n")
    .map(line => line.replace(/\*+/g, "").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const header = [
    composer ? `${title} — ${composer}` : title,
    "",
    "Letra completa, notas musicales y acordes:",
    `${SITE}/posts/${slug}`,
    "",
    details || null,
    composer ? `Interpretado por: ${composer}` : null,
  ].filter(line => line !== null);
  const footer = [
    "",
    "────────────",
    "music~repo — Letras, notas musicales y acordes de himnos espirituales.",
    SITE,
    "",
    [...tags.map(hashtag), "#Himnos", "#MusicaCristiana"].slice(0, 5).join(" "),
  ];
  const build = body =>
    [...header, "", "LETRA", "", body, ...footer]
      .join("\n")
      .replace(/[<>]/g, "");

  let text = build(lyrics);
  if (text.length > MAX) {
    text = build("La letra completa está en el enlace de arriba.");
  }

  writeFileSync(join(outDir, `${slug}.txt`), text + "\n");
  count++;
}

process.stdout.write(`${count} descripciones generadas en ${outDir}/\n`);
if (skipped.length) {
  process.stdout.write(`Sin sección de letra (omitidos): ${skipped.join(", ")}\n`);
}
