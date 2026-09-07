/**
 * Extrae la letra en texto plano desde el cuerpo MDX de un post, para usarla
 * en el JSON-LD (MusicComposition.lyrics). Toma la sección "## Letra" y limpia
 * imports, JSX y marcas de markdown.
 */
export function extractLyrics(body: string | undefined): string | undefined {
  if (!body) return undefined;

  const sections = body.split(/^##\s+/m);
  const section = sections.find(s => /^Letra\s*$/m.test(s.split("\n")[0]));
  if (!section) return undefined;

  const text = section
    .split("\n")
    .slice(1) // descarta el encabezado "Letra"
    .join("\n")
    .replace(/^import\s.+$/gm, "") // imports de MDX
    .replace(/<[^>]+>/g, "") // etiquetas JSX/HTML
    .replace(/\*\*|__|\/\//g, "") // negritas y separadores //
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .join("\n");

  return text || undefined;
}
