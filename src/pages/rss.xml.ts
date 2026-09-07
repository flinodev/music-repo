import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getEntryPath } from "@/utils/contentEntry";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export async function GET() {
  const [blogPosts, galleryPosts] = await Promise.all([
    getCollection("blog"),
    SITE.showGalleries && SITE.showGalleriesInIndex
      ? getCollection("galleries")
      : Promise.resolve([]),
  ]);
  const sortedPosts = getSortedPosts([...blogPosts, ...galleryPosts]);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    // Sin slash final, igual que el canonical y el sitemap (@astrojs/rss lo
    // añade por defecto).
    trailingSlash: false,
    items: sortedPosts.map(entry => ({
      link: getEntryPath(entry),
      title: entry.data.title,
      description: entry.data.description,
      pubDate: new Date(
        "modDatetime" in entry.data && entry.data.modDatetime
          ? entry.data.modDatetime
          : entry.data.pubDatetime
      ),
    })),
  });
}
