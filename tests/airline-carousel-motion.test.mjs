import assert from "node:assert/strict";
import test from "node:test";

import { getNextCarouselScrollLeft } from "../src/app/airline-carousel-motion.ts";

test("advances the carousel to the right without scrolling past the end", () => {
  assert.equal(getNextCarouselScrollLeft(0, 1_000, 400), 400);
  assert.equal(getNextCarouselScrollLeft(800, 1_000, 400), 1_000);
});

test("loops the carousel to the beginning after all logos have been shown", () => {
  assert.equal(getNextCarouselScrollLeft(1_000, 1_000, 400), 0);
  assert.equal(getNextCarouselScrollLeft(999, 1_000, 400), 0);
});

test("keeps a carousel without overflow at its starting position", () => {
  assert.equal(getNextCarouselScrollLeft(0, 0, 400), 0);
});
