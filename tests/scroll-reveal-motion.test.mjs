import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("progressively enhances visible server content with a once-only observer", async () => {
  const reveal = await read("src/app/scroll-reveal.tsx");

  assert.match(reveal, /^"use client";/);
  assert.match(reveal, /data-reveal-state="visible"/);
  assert.match(reveal, /getBoundingClientRect\(\)/);
  assert.match(reveal, /window\.innerHeight/);
  assert.match(reveal, /revealState = "pending"/);
  assert.match(reveal, /new IntersectionObserver/);
  assert.match(reveal, /observer\.observe/);
  assert.match(reveal, /observer\.disconnect\(\)/);
  assert.match(reveal, /requestAnimationFrame/);
});

test("skips reveal movement for reduced motion and unsupported observers", async () => {
  const reveal = await read("src/app/scroll-reveal.tsx");
  const styles = await read("src/app/globals.css");

  assert.match(reveal, /prefers-reduced-motion: reduce/);
  assert.match(reveal, /!\("IntersectionObserver" in window\)/);
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\[data-scroll-reveal\][\s\S]*opacity:\s*1/,
  );
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\[data-scroll-reveal\][\s\S]*transform:\s*none/,
  );
});

test("uses restrained transform-only variants and the entrance motion token", async () => {
  const reveal = await read("src/app/scroll-reveal.tsx");
  const styles = await read("src/app/globals.css");

  for (const variant of ["rise", "route", "card", "checkpoint", "message", "rule"]) {
    assert.ok(reveal.includes(`"${variant}"`), `Missing reveal variant: ${variant}`);
    assert.match(
      styles,
      new RegExp(`data-reveal-variant="${variant}"`),
      `Missing CSS for reveal variant: ${variant}`,
    );
  }

  assert.match(styles, /--reveal-delay:\s*0ms/);
  assert.match(
    styles,
    /transition:[\s\S]*opacity var\(--duration-entrance\)[\s\S]*transform var\(--duration-entrance\)/,
  );
  assert.doesNotMatch(styles, /data-scroll-reveal[^}]*animation:/);
});

test("sequences only the approved journey moments", async () => {
  const page = await read("src/app/page.tsx");

  assert.match(page, /import \{ ScrollReveal \} from "\.\/scroll-reveal"/);
  assert.equal((page.match(/variant="checkpoint"/g) ?? []).length, 1);
  assert.match(page, /delay=\{index \* 90\}/);
  assert.match(page, /variant="card"[\s\S]*className="trip-brief/);
  assert.match(page, /variant="route"/);
  assert.match(
    page,
    /variant="message"[\s\S]*blockquote[\s\S]*delay=\{90\}[\s\S]*MessengerLink/,
  );
  assert.doesNotMatch(page, /hero-reveal[^\n]*ScrollReveal/);
  assert.doesNotMatch(page, /airline-carousel-cell[^\n]*ScrollReveal/);
});
