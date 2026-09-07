import type { ContentEntry } from "./contentEntry";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

/**
 * Intérpretes únicos a partir del campo `composer` del frontmatter.
 * Es un eje distinto al de los tags: los tags describen el tema del himno,
 * `composer` dice quién lo interpreta.
 */
const getUniqueComposers = (posts: ContentEntry[]) => {
  const map = new Map<string, string>();

  for (const post of posts) {
    if (!postFilter(post)) continue;

    const composerName =
      "composer" in post.data ? post.data.composer : undefined;
    if (!composerName) continue;

    const composer = slugifyStr(composerName);
    if (!map.has(composer)) map.set(composer, composerName);
  }

  return Array.from(map.entries())
    .map(([composer, composerName]) => ({ composer, composerName }))
    .sort((a, b) => a.composerName.localeCompare(b.composerName, "es"));
};

export default getUniqueComposers;
