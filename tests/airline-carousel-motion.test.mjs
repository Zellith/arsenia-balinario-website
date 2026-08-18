import assert from "node:assert/strict";
import test from "node:test";

import {
  easeOutCubic,
  getIntroCarouselScrollLeft,
} from "../src/app/airline-carousel-motion.ts";

test("drifts one airline cell without scrolling past the rail", () => {
  assert.equal(getIntroCarouselScrollLeft(0, 1_000, 240), 240);
  assert.equal(getIntroCarouselScrollLeft(900, 1_000, 240), 1_000);
});

test("keeps a carousel without overflow at its starting position", () => {
  assert.equal(getIntroCarouselScrollLeft(0, 0, 240), 0);
});

test("uses an ease-out curve that starts and settles exactly", () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.ok(easeOutCubic(0.5) > 0.5);
});
