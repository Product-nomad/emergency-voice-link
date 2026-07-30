#!/usr/bin/env node
// Post-build step: writes an absolute-URL sitemap.xml (and upgrades
// robots.txt's Sitemap: line to match) into dist/, scoped to whichever
// domain this build is being deployed to.
//
// Each of the three production domains is its own Vercel project (see
// README), so VITE_SITE_URL must be set per-project, e.g.
// VITE_SITE_URL=https://999callbuddy.com
//
// If it's not set (local/dev builds), this is a no-op: dist/robots.txt
// keeps the relative "Sitemap: /sitemap.xml" fallback copied from public/,
// and no sitemap.xml is written. A relative Sitemap: line is non-standard
// but every major crawler resolves it against the fetching domain, so it
// degrades safely rather than pointing at the wrong site.
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROUTES = [
  "/",
  "/feedback",
  "/guide",
  "/scripts",
  "/protocol",
  "/faq",
  "/resources",
  "/about",
  "/privacy",
];

const siteUrl = process.env.VITE_SITE_URL;
const distDir = resolve(process.cwd(), "dist");

if (!siteUrl) {
  console.warn(
    "[generate-sitemap] VITE_SITE_URL not set — skipping sitemap.xml generation for this build.",
  );
  process.exit(0);
}

if (!existsSync(distDir)) {
  console.warn("[generate-sitemap] dist/ not found — run after `vite build`.");
  process.exit(0);
}

const base = siteUrl.replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const urlEntries = ROUTES.map(
  (route) =>
    `  <url>\n    <loc>${base}${route}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

writeFileSync(resolve(distDir, "sitemap.xml"), sitemap);

const robotsPath = resolve(distDir, "robots.txt");
const existingRobots = existsSync(robotsPath)
  ? readFileSync(robotsPath, "utf8")
  : "User-agent: *\nAllow: /\n";
const robots = existingRobots.replace(
  /Sitemap:.*\n?/,
  `Sitemap: ${base}/sitemap.xml\n`,
);
writeFileSync(robotsPath, robots);

console.log(`[generate-sitemap] Wrote dist/sitemap.xml and dist/robots.txt for ${base}`);
