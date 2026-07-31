import assert from "node:assert/strict";

const targetUrl = process.env.TARGET_URL ?? "http://localhost:3000";
const response = await fetch(targetUrl);

assert.equal(response.status, 200, `Expected ${targetUrl} to return HTTP 200`);

const html = await response.text();
const requiredText = [
  "A simpler, more personal way to book your next flight.",
  "Chat with Arsenia on Messenger",
  "Personal guidance",
  "Local and international flights",
  "One simple Messenger thread",
  "Share your trip",
  "Review flight options",
  "Continue with Arsenia",
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

console.log(`Landing-page contract passed at ${targetUrl}`);
