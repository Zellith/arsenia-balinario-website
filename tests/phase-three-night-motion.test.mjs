import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { gzipSync } from "node:zlib";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

function linearChannel(channel) {
  const value = channel / 255;
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance([red, green, blue]) {
  return (
    0.2126 * linearChannel(red) +
    0.7152 * linearChannel(green) +
    0.0722 * linearChannel(blue)
  );
}

function blend(base, overlay, alpha) {
  return base.map((channel, index) =>
    channel * (1 - alpha) + overlay[index] * alpha,
  );
}

test("animates one flight path on entry without creating a loop", async () => {
  const page = await read("src/app/page.tsx");
  const path = await read("src/app/flight-path.tsx");
  const styles = await read("src/app/globals.css");

  assert.equal((page.match(/<FlightPath/g) ?? []).length, 1);
  assert.match(path, /IntersectionObserver/);
  assert.match(path, /observer\.disconnect\(\)/);
  assert.match(path, /prefers-reduced-motion: reduce/);
  assert.match(path, /trip-route-line/);
  assert.match(path, /data-flight-state/);
  assert.match(styles, /@keyframes flight-path-draw/);
  assert.match(styles, /@keyframes flight-plane-travel/);
  assert.match(styles, /1600ms/);
  assert.match(styles, /cubic-bezier\(0\.22, 1, 0\.36, 1\)/);
  assert.doesNotMatch(styles, /trip-route span/);
});

test("adds one masked 24fps night-window canvas", async () => {
  const page = await read("src/app/page.tsx");
  const styles = await read("src/app/globals.css");
  const shader = await read("src/app/shaders/night.frag.ts");

  assert.equal((page.match(/<AtmosphereCanvas/g) ?? []).length, 2);
  assert.match(page, /closing-atmosphere/);
  assert.match(page, /fragmentShader=\{nightFragmentShader\}/);
  assert.match(page, /framesPerSecond=\{24\}/);
  assert.match(styles, /\.closing-atmosphere/);
  assert.match(styles, /linear-gradient/);
  assert.match(styles, /radial-gradient/);
  assert.match(shader, /for \(int i = 0; i < 90; i\+\+\)/);
  assert.match(shader, /auroraAlpha/);
  assert.match(shader, /0\.06/);
  assert.match(shader, /starAlpha/);
  assert.match(shader, /vignette/);
});

test("keeps the brightest modeled night frame above 14 to 1", () => {
  const night = [10, 32, 52];
  const messenger = [21, 95, 189];
  const star = [90, 122, 150];
  const withAurora = blend(night, messenger, 0.06);
  const brightestModeledPixel = blend(withAurora, star, 0.25 * 0.35);
  const contrast = 1.05 / (luminance(brightestModeledPixel) + 0.05);

  assert.ok(contrast >= 14, `Expected at least 14:1, received ${contrast}:1`);
});

test("uses the serif italic only for the two human-voice moments", async () => {
  const layout = await read("src/app/layout.tsx");
  const page = await read("src/app/page.tsx");
  const styles = await read("src/app/globals.css");

  assert.match(layout, /Newsreader/);
  assert.match(layout, /style: "italic"/);
  assert.match(layout, /display: "swap"/);
  assert.equal((page.match(/human-voice/g) ?? []).length, 2);
  assert.match(styles, /--font-serif/);
  assert.match(styles, /\.human-voice/);
  assert.match(styles, /font-style:\s*italic/);
});

test("keeps both atmosphere shaders and their runtime below 6 KB gzip", async () => {
  const source = await Promise.all([
    read("src/app/atmosphere-canvas.tsx"),
    read("src/app/shaders/hero.frag.ts"),
    read("src/app/shaders/night.frag.ts"),
  ]);
  const compressedBytes = gzipSync(source.join("\n")).byteLength;

  assert.ok(
    compressedBytes <= 6_000,
    `Expected atmosphere source below 6 KB gzip, received ${compressedBytes} bytes`,
  );
});
