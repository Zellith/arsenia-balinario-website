import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { gzipSync } from "node:zlib";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("provides a static, masked cabin-light fallback", async () => {
  const page = await read("src/app/page.tsx");
  const styles = await read("src/app/globals.css");

  assert.match(page, /hero-atmosphere/);
  assert.match(styles, /\.hero-atmosphere::before/);
  assert.match(styles, /radial-gradient/);
  assert.match(styles, /pointer-events:\s*none/);
  assert.match(styles, /z-index:\s*-1/);
});

test("implements the low-power, post-LCP WebGL2 runtime contract", async () => {
  const runtime = await read("src/app/atmosphere-canvas.tsx");

  for (const contract of [
    '"use client"',
    'getContext("webgl2"',
    'powerPreference: "low-power"',
    "antialias: false",
    "preserveDrawingBuffer: false",
    "requestIdleCallback",
    "800",
    "IntersectionObserver",
    'rootMargin: "10%"',
    'visibilitychange',
    'prefers-reduced-motion: reduce',
    "deviceMemory",
    'dataset.atmosphere === "off"',
    "Math.min(window.devicePixelRatio, 1.5) * 0.5",
    "gl.drawArrays(gl.TRIANGLES, 0, 3)",
  ]) {
    assert.ok(runtime.includes(contract), `Missing runtime contract: ${contract}`);
  }

  assert.match(runtime, /aria-hidden="true"/);
  assert.match(runtime, /data-atmosphere-canvas/);
});

test("integrates one accessible, 30fps hero atmosphere canvas", async () => {
  const layout = await read("src/app/layout.tsx");
  const page = await read("src/app/page.tsx");
  const styles = await read("src/app/globals.css");
  const shader = await read("src/app/shaders/hero.frag.ts");

  assert.equal(
    (page.match(/fragmentShader=\{heroFragmentShader\}/g) ?? []).length,
    1,
  );
  assert.match(page, /fragmentShader={heroFragmentShader}/);
  assert.match(page, /framesPerSecond=\{30\}/);
  assert.match(page, /activationMedia="\(min-width: 1024px\)"/);
  assert.match(layout, /data-atmosphere=/);
  assert.match(styles, /data-atmosphere="off"/);
  assert.match(
    styles,
    /prefers-reduced-motion:[\s\S]*data-atmosphere-canvas[\s\S]*display:\s*none/,
  );
  assert.match(shader, /valueNoise/);
  assert.match(shader, /domainWarp/);
  assert.match(shader, /0\.006/);
  assert.match(shader, /-0\.011/);
});

test("keeps the complete atmosphere source below the 6 KB gzip budget", async () => {
  const source = await Promise.all([
    read("src/app/atmosphere-canvas.tsx"),
    read("src/app/shaders/hero.frag.ts"),
  ]);
  const compressedBytes = gzipSync(source.join("\n")).byteLength;

  assert.ok(
    compressedBytes <= 6_000,
    `Expected atmosphere source below 6 KB gzip, received ${compressedBytes} bytes`,
  );
});
