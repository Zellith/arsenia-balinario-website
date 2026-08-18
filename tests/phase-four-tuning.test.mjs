import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

function rgb(hex) {
  return hex
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16));
}

function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(color) {
  const [red, green, blue] = rgb(color).map(channel);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(first, second) {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

function mix(first, second, amount) {
  return first.map(
    (value, index) => value * (1 - amount) + second[index] * amount,
  );
}

function lightness(color) {
  const measured =
    0.2126 * channel(color[0] * 255) +
    0.7152 * channel(color[1] * 255) +
    0.0722 * channel(color[2] * 255);
  const threshold = 216 / 24389;
  return measured > threshold
    ? 116 * Math.cbrt(measured) - 16
    : (24389 / 27) * measured;
}

function contrastAgainstWhite(color) {
  const measured =
    0.2126 * channel(color[0] * 255) +
    0.7152 * channel(color[1] * 255) +
    0.0722 * channel(color[2] * 255);
  return 1.05 / (measured + 0.05);
}

test("keeps every production text token above its contrast floor", () => {
  const pairs = [
    ["muted on paper", "#566677", "#fbfaf7", 4.5],
    ["muted on surface", "#566677", "#ffffff", 4.5],
    ["muted on haze", "#566677", "#e8edef", 4.5],
    ["muted on mist", "#566677", "#f1f4f3", 4.5],
    ["brass on paper", "#8c6127", "#fbfaf7", 4.5],
    ["brass on haze", "#8c6127", "#e8edef", 4.5],
    ["Messenger blue on white", "#155fbd", "#ffffff", 4.5],
    ["white on Messenger blue", "#ffffff", "#155fbd", 4.5],
    ["white on night", "#ffffff", "#0a2034", 14],
    ["white on night deep", "#ffffff", "#071726", 14],
  ];

  for (const [label, foreground, background, floor] of pairs) {
    const measured = contrast(foreground, background);
    assert.ok(
      measured >= floor,
      `${label} measured ${measured.toFixed(2)}:1, below ${floor}:1`,
    );
  }
});

test("keeps shader extreme frames inside the measured luminance budgets", async () => {
  const hero = await read("src/app/shaders/hero.frag.ts");
  const nightShader = await read("src/app/shaders/night.frag.ts");
  const paper = rgb("#fbfaf7").map((value) => value / 255);
  const heroColors = [
    [0.82, 0.62, 0.38],
    [0.48, 0.7, 0.82],
  ];

  for (const color of heroColors) {
    const brightestMovementFrame = mix(paper, color, 0.023);
    const delta = Math.abs(lightness(brightestMovementFrame) - lightness(paper));
    assert.ok(delta <= 3, `Hero extreme measured ${delta.toFixed(2)} L*, above 3 L*`);
  }

  const brightestNightBase = [0.039, 0.125, 0.204];
  const messenger = [0.082, 0.373, 0.741];
  const star = [0.353, 0.478, 0.588];
  const auroraExtreme = mix(brightestNightBase, messenger, 0.06);
  const starAndAuroraExtreme = mix(auroraExtreme, star, 0.25 * 0.35);

  assert.ok(
    contrastAgainstWhite(starAndAuroraExtreme) >= 14,
    "Closing shader extreme fell below the 14:1 white-text floor",
  );
  assert.match(hero, /0\.008 \+ movement \* 0\.015/);
  assert.match(nightShader, /auroraWave \* 0\.06/);
  assert.match(nightShader, /min\(stars, 0\.25\) \* 0\.35/);
});

test("consolidates interaction, entrance, and narrative motion tokens", async () => {
  const styles = await read("src/app/globals.css");

  for (const contract of [
    "--duration-fast: 180ms",
    "--duration-entrance: 680ms",
    "--duration-narrative: 1600ms",
    "--ease-out: cubic-bezier(0.2, 0, 0, 1)",
    "--ease-entrance: cubic-bezier(0.22, 1, 0.36, 1)",
    "--ease-narrative: cubic-bezier(0.22, 1, 0.36, 1)",
  ]) {
    assert.ok(styles.includes(contract), `Missing motion token: ${contract}`);
  }

  assert.match(
    styles,
    /animation: hero-rise var\(--duration-entrance\) var\(--ease-entrance\)/,
  );
  assert.match(styles, /transition:[\s\S]*var\(--duration-fast\)/);
});

test("retains brass only as a non-interactive editorial signal", async () => {
  const page = await read("src/app/page.tsx");
  const carousel = await read("src/app/airline-carousel.tsx");
  const styles = await read("src/app/globals.css");

  assert.match(page, /bg-brass/);
  assert.match(carousel, /text-brass/);
  assert.match(styles, /\.trip-route[\s\S]*color: var\(--brass\)/);
  assert.match(styles, /\.process-step-number[\s\S]*color: var\(--brass\)/);
  assert.doesNotMatch(page, /(?:button|href)[^\n]*brass/);
  assert.doesNotMatch(carousel, /(?:button|href)[^\n]*brass/);
});

test("keeps the serif as a selective human-voice accent", async () => {
  const layout = await read("src/app/layout.tsx");
  const page = await read("src/app/page.tsx");
  const styles = await read("src/app/globals.css");

  assert.match(layout, /style: "italic"/);
  assert.match(layout, /weight: "400"/);
  assert.equal(page.match(/human-voice/g)?.length, 2);
  assert.doesNotMatch(page, /display-heading/);
  assert.doesNotMatch(styles, /serif-prototype/);
});
