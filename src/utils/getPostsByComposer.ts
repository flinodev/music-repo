import type { ContentEntry } from "./contentEntry";
import getSortedPosts from "./getSortedPosts";
import { slugifyStr } from "./slugify";

const getPostsByComposer = (posts: ContentEntry[], composer: string) =>
  getSortedPosts(
    posts.filter(post => {
      const composerName =
        "composer" in post.data ? post.data.composer : undefined;
      return composerName ? slugifyStr(composerName) === composer : false;
    })
  );

export default getPostsByComposer;
