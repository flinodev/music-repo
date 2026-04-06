import { defineConfig, envField, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeSlug from "rehype-slug";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import vercel from '@astrojs/vercel';
import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  adapter: vercel({
    webAnalytics: {
      enabled: true, // set to false when using @vercel/analytics@1.4.0
    },
  }),
  integrations: [
    mdx({
      extendMarkdownConfig: true,
    }),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    pagefind(),
  ],
  markdown: {
    remarkPlugins: [
      [remarkToc, { maxDepth: 3, tight: true, heading: "Tabla de contenidos" }],
      [remarkCollapse, { test: "Tabla de contenidos" }]
    ],
    rehypePlugins: [rehypeSlug],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "github-dark-default" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },

  fonts: [
    {
      name: "Wotfard",
      cssVariable: "--font-wotfard",
      fallbacks: ["sans-serif"],
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/wotfard.woff2"],
          },
        ],
      },
    },
    {
      name: "Sriracha",
      cssVariable: "--font-sriracha",
      fallbacks: ["cursive"],
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/sriracha.woff2"],
          },
        ],
      },
    },
    {
      name: "Cartograph CF",
      cssVariable: "--font-cartograph",
      fallbacks: ["monospace"],
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/cartograph-cf.woff2"],
          },
        ],
      },
    },
    {
      name: "Cascadia Code",
      cssVariable: "--font-cascadia-code",
      fallbacks: ["monospace"],
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/cascadia-code.woff2"],
          },
        ],
      },
    },
  ],
});
