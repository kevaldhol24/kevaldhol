import type { Config } from "@react-router/dev/config";

export default {
  // No loaders or server data anywhere, so every page is rendered to static HTML at build
  // time and the whole site deploys as files (Cloudflare Pages). Add new routes here.
  ssr: false,
  prerender: ["/"],
} satisfies Config;
