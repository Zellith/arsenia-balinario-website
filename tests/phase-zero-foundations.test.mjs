import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("defines the Phase 0 color, rule, and shadow tokens", async () => {
  const styles = await read("src/app/globals.css");

  for (const token of [
    "--haze: #e8edef",
    "--muted: #566677",
    "--brass: #8c6127",
    "--line-soft: #e9eef1",
    "--night-deep: #071726",
    "--shadow-card:",
    "--shadow-lift:",
  ]) {
    assert.ok(styles.includes(token), `Missing design token: ${token}`);
  }
});

test("applies the Phase 0 display-weight and shadow foundations", async () => {
  const page = await read("src/app/page.tsx");
  const styles = await read("src/app/globals.css");
  const mediumDisplayRoles = page.match(/font-medium/g) ?? [];

  assert.ok(
    mediumDisplayRoles.length >= 5,
    "Expected the H1 and primary section headings to use the 500 weight",
  );
  assert.ok(
    page.includes("shadow-[var(--shadow-lift)]"),
    "Expected the portrait to use the shared lift shadow",
  );
  assert.ok(
    styles.includes("box-shadow: var(--shadow-card)"),
    "Expected the trip brief to use the shared card shadow",
  );
});

test("provides canonical metadata, an Open Graph image, and TravelAgency JSON-LD", async () => {
  const layout = await read("src/app/layout.tsx");
  const page = await read("src/app/page.tsx");
  const openGraphImage = await read("src/app/opengraph-image.tsx");

  assert.match(layout, /metadataBase:/);
  assert.match(layout, /alternates:\s*{\s*canonical:/s);
  assert.match(layout, /VERCEL_PROJECT_PRODUCTION_URL/);
  assert.match(page, /"@type":\s*"TravelAgency"/);
  assert.match(page, /areaServed:/);
  assert.match(page, /application\/ld\+json/);
  assert.match(openGraphImage, /new ImageResponse/);
  assert.match(openGraphImage, /width:\s*1200/);
  assert.match(openGraphImage, /height:\s*630/);
});

test("serves resized source images within the Phase 0 asset budget", async () => {
  const page = await read("src/app/page.tsx");
  const carousel = await read("src/app/airline-carousel.tsx");
  const sharp = (await import("sharp")).default;

  assert.ok(
    page.includes('src="/arsenia-portrait-editorial.webp"'),
    "Expected the portrait to use the compressed WebP source",
  );
  assert.ok(
    !carousel.includes("unoptimized"),
    "Expected raster airline marks to use Next.js image optimization",
  );

  const portraitPath = fileURLToPath(
    new URL("public/arsenia-portrait-editorial.webp", root),
  );
  const portraitMetadata = await sharp(portraitPath).metadata();
  const portraitStats = await stat(portraitPath);

  assert.ok((portraitMetadata.width ?? Infinity) <= 920);
  assert.ok(portraitStats.size <= 220_000);

  for (const filename of [
    "airswift.png",
    "china-airlines.png",
    "seair.png",
    "sunlight-air.png",
  ]) {
    const assetPath = fileURLToPath(
      new URL(`public/airlines/${filename}`, root),
    );
    const metadata = await sharp(assetPath).metadata();
    assert.ok(
      (metadata.width ?? Infinity) <= 320,
      `${filename} should be exported near its rendered size`,
    );
  }

  const publicPath = fileURLToPath(new URL("public/", root));
  const entries = await readdir(publicPath, { recursive: true, withFileTypes: true });
  let publicBytes = 0;

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const entryPath = path.join(entry.parentPath, entry.name);
    publicBytes += (await stat(entryPath)).size;
  }

  assert.ok(
    publicBytes < 500_000,
    `Expected public assets below 500 KB, received ${publicBytes} bytes`,
  );
});
