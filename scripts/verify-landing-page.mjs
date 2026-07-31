import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const targetUrl = process.env.TARGET_URL ?? "http://localhost:3000";
const response = await fetch(targetUrl);

assert.equal(response.status, 200, `Expected ${targetUrl} to return HTTP 200`);

const html = await response.text();
const styles = await readFile(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);
const requiredText = [
  "SkyBound Travel Hub",
  "A simpler, more personal way to book your next flight.",
  "Chat with Arsenia on Messenger",
  "Personal guidance",
  "Local and international flights",
  "One simple Messenger thread",
  "Share your trip",
  "Review flight options",
  "Continue with Arsenia",
  "Airlines frequently requested",
  "Example trip brief",
];

for (const text of requiredText) {
  assert.ok(html.includes(text), `Missing required rendered text: ${text}`);
}

for (const section of [
  "hero",
  "trust",
  "airlines",
  "proof",
  "process",
  "closing",
]) {
  assert.ok(
    html.includes(`data-section="${section}"`),
    `Missing section marker: ${section}`,
  );
}

const messengerLinks =
  html.match(/https:\/\/m\.me\/arsenia\.balinario/g) ?? [];

assert.ok(
  messengerLinks.length >= 4,
  "Expected at least four Messenger conversion links",
);
assert.ok(
  !html.includes("Usually replies within the hour"),
  "Unverified response-time claim must be removed",
);
assert.ok(
  !html.includes("Global Pinoy Travel"),
  "Retired agency branding must not be rendered",
);
assert.ok(
  !/<img[^>]+arsenia-travel-poster\.jpg/i.test(html),
  "The retired flyer must not be rendered as an image",
);

const airlineLogos = html.match(/data-airline-logo=/g) ?? [];
assert.ok(
  airlineLogos.length >= 6,
  "Expected at least six recognizable airline logo treatments",
);

for (const airlineAsset of [
  "/airlines/philippine-airlines.svg",
  "/airlines/cebu-pacific.svg",
  "/airlines/airasia.svg",
  "/airlines/singapore-airlines.svg",
  "/airlines/emirates.svg",
  "/airlines/qatar-airways.svg",
]) {
  assert.ok(
    html.includes(airlineAsset),
    `Missing locally hosted airline asset: ${airlineAsset}`,
  );
}

assert.ok(
  !styles.includes("airline-logo-sprite"),
  "Airline marks must use dedicated image assets rather than a poster sprite",
);
assert.ok(
  !styles.includes("arsenia-travel-poster.jpg"),
  "The low-resolution poster must not supply rendered airline marks",
);

assert.ok(
  html.includes('data-motion="subtle"'),
  "Expected the restrained motion system marker",
);

console.log(`Landing-page contract passed at ${targetUrl}`);
