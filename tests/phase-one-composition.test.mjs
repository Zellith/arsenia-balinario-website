import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("keeps Messenger within thumb reach and resolves the hero composition", async () => {
  const page = await read("src/app/page.tsx");

  assert.match(page, /aria-label="Message Arsenia on Messenger"/);
  assert.match(page, /sm:hidden/);
  assert.match(page, /border-line-soft bg-paper\/85/);
  assert.match(page, /30 airlines · local and international/);
  assert.match(
    page,
    /<MessengerLink>Chat with Arsenia on Messenger<\/MessengerLink>[\s\S]*No forms\. No signup\./,
  );
});

test("strengthens the trust strip without introducing icon cards", async () => {
  const page = await read("src/app/page.tsx");

  assert.match(page, /data-section="trust"[\s\S]*bg-paper/);
  assert.match(page, /h-px w-6[^>]*bg-brass/);
  assert.match(page, /text-lg font-semibold/);
});

test("uses one segmented airline carousel with no autoplay", async () => {
  const page = await read("src/app/page.tsx");
  const carousel = await read("src/app/airline-carousel.tsx");
  const styles = await read("src/app/globals.css");

  assert.equal((page.match(/<AirlineCarousel/g) ?? []).length, 1);
  assert.match(carousel, /role="tablist"/);
  assert.match(carousel, /IntersectionObserver/);
  assert.ok(!carousel.includes("setInterval"));
  assert.ok(!carousel.includes("data-autoplay"));
  assert.match(styles, /saturate\(0\.15\) contrast\(0\.95\)/);
  assert.match(styles, /opacity:\s*0\.72/);
  assert.match(styles, /mask-image:\s*linear-gradient/);
});

test("turns the process into a timeline and the closing quote into a message", async () => {
  const page = await read("src/app/page.tsx");
  const styles = await read("src/app/globals.css");

  assert.match(page, /className="process-timeline/);
  assert.match(page, /className="process-step/);
  assert.match(page, /className="process-step-number/);
  assert.match(page, /className="closing-section/);
  assert.match(page, /rounded-\[1\.25rem_1\.25rem_1\.25rem_\.25rem\]/);
  assert.match(page, /bg-white\/\[\.06\]/);
  assert.match(page, /lg:items-center/);
  assert.match(styles, /--tw-ring-offset-color:\s*var\(--night\)/);
  assert.doesNotMatch(
    styles,
    /\.process-step-number\s*{[^}]*margin-left:\s*-4rem/s,
    "Mobile timeline ticks must not cross through sequence numerals",
  );
});
