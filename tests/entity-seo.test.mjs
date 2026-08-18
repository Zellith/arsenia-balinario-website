import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = async (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8").catch(() => "");

test("publishes one linked entity graph for Arsenia and SkyBound", async () => {
  const seo = await read("src/app/seo.ts");

  assert.match(seo, /"@graph":/);
  assert.match(seo, /"@type":\s*"Person"/);
  assert.match(seo, /name:\s*"Arsenia Balinario"/);
  assert.match(seo, /https:\/\/www\.facebook\.com\/arsenia\.balinario/);
  assert.match(seo, /worksFor:\s*{\s*"@id":\s*organizationId\s*}/s);
  assert.match(seo, /"@type":\s*"TravelAgency"/);
  assert.match(seo, /employee:\s*{\s*"@id":\s*personId\s*}/s);
  assert.match(seo, /mainEntity:\s*{\s*"@id":\s*personId\s*}/s);
  assert.match(seo, /logo:\s*{\s*"@id":\s*logoId\s*}/s);
});

test("makes Arsenia's public identity explicit in search metadata", async () => {
  const layout = await read("src/app/layout.tsx");

  assert.match(
    layout,
    /title:\s*"Arsenia Balinario \| SkyBound Travel Hub Flight Assistance"/,
  );
  assert.match(layout, /description:[\s\S]*Arsenia Balinario/);
  assert.match(layout, /alternates:\s*{\s*canonical:\s*"\/"/s);
});

test("renders the entity graph as escaped server-side JSON-LD", async () => {
  const page = await read("src/app/page.tsx");

  assert.match(page, /import\s*{[\s\S]*entityJsonLd[\s\S]*}\s*from\s*"\.\/seo"/);
  assert.match(page, /JSON\.stringify\(entityJsonLd\)\.replace\(\/<\/g,\s*"\\\\u003c"\)/);
  assert.match(page, /type="application\/ld\+json"/);
});

test("keeps Arsenia's public name visible on the page", async () => {
  const page = await read("src/app/page.tsx");

  assert.match(page, /Arsenia Balinario · Travel Consultant/);
  assert.match(page, /alt="Arsenia Balinario, travel consultant/);
});

test("advertises the canonical page to crawlers", async () => {
  const sitemap = await read("src/app/sitemap.ts");
  const robots = await read("src/app/robots.ts");

  assert.match(sitemap, /MetadataRoute\.Sitemap/);
  assert.match(sitemap, /url:\s*canonicalUrl/);
  assert.match(sitemap, /images:\s*\[personImageUrl\]/);
  assert.match(robots, /MetadataRoute\.Robots/);
  assert.match(robots, /userAgent:\s*"\*"/);
  assert.match(robots, /allow:\s*"\/"/);
  assert.match(robots, /sitemap:\s*new URL\("\/sitemap\.xml",\s*siteUrl\)\.toString\(\)/);
});
