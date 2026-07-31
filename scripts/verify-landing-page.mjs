import assert from "node:assert/strict";

const targetUrl = process.env.TARGET_URL ?? "http://localhost:3000";
const response = await fetch(targetUrl);

assert.equal(response.status, 200, `Expected ${targetUrl} to return HTTP 200`);

const html = await response.text();
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

assert.ok(
  html.includes('data-motion="subtle"'),
  "Expected the restrained motion system marker",
);

console.log(`Landing-page contract passed at ${targetUrl}`);
