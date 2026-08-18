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
  "Trip brief",
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
  html.includes('aria-label="Message Arsenia on Messenger"'),
  "Expected the sticky header to expose a mobile Messenger action",
);
assert.ok(
  html.includes("30 airlines · local and international"),
  "Expected the hero airline-breadth anchor",
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
  !html.includes("Logos are shown for airline identification only"),
  "The airline-identification disclaimer must not be rendered",
);
for (const redundantQualifier of [
  "Example trip brief",
  "Illustrative",
  "Example only",
]) {
  assert.ok(
    !html.includes(redundantQualifier),
    `Trip graphic should not render redundant qualifier: ${redundantQualifier}`,
  );
}
assert.ok(
  !/<img[^>]+arsenia-travel-poster\.jpg/i.test(html),
  "The retired flyer must not be rendered as an image",
);

const expectedAirlines = [
  "Philippine Airlines",
  "Cebu Pacific",
  "AirAsia",
  "Sunlight Air",
  "SKY express",
  "Philippine Airlines Express",
  "PAL Express",
  "AirSWIFT",
  "SEAir",
  "Cebgo",
  "Singapore Airlines",
  "Emirates",
  "Qatar Airways",
  "Cathay Pacific",
  "Etihad Airways",
  "Turkish Airlines",
  "EVA Air",
  "Korean Air",
  "China Airlines",
  "Japan Airlines",
  "ANA",
  "Lufthansa",
  "Thai Airways",
  "Malaysia Airlines",
  "British Airways",
  "Air France",
  "KLM",
  "Delta Air Lines",
  "United Airlines",
  "Qantas",
];

const airlineLogos = html.match(/data-airline-logo=/g) ?? [];
assert.equal(
  airlineLogos.length,
  expectedAirlines.length,
  "Expected every airline logo from the supplied poster",
);

for (const airline of expectedAirlines) {
  assert.ok(
    html.includes(`data-airline-logo="${airline}"`),
    `Missing poster airline: ${airline}`,
  );
}

assert.ok(
  html.includes('data-airline-carousel="segmented"'),
  "Expected one segmented airline carousel",
);
assert.ok(
  !html.includes("data-autoplay"),
  "Airline motion must not use autoplay",
);
assert.ok(
  /<canvas[^>]+aria-hidden="true"[^>]+data-atmosphere-canvas=/i.test(html),
  "Expected decorative atmosphere canvases to be hidden from accessibility APIs",
);
assert.equal(
  (html.match(/data-atmosphere-canvas=/g) ?? []).length,
  2,
  "Expected exactly the hero and closing atmosphere canvases",
);
assert.ok(
  html.includes("data-flight-path="),
  "Expected the one-shot trip flight path",
);

for (const category of ["local", "international"]) {
  assert.ok(
    html.includes(`data-airline-category="${category}"`),
    `Missing ${category} airline category panel`,
  );
}

for (const direction of ["Previous", "Next"]) {
  assert.ok(
    html.includes(`aria-label="${direction} local airlines"`),
    `Missing initial ${direction.toLowerCase()} airline control`,
  );
}

for (const airlineAsset of [
  "/airlines/philippine-airlines.svg",
  "/airlines/cebu-pacific.svg",
  "/airlines/airasia.svg",
  "/airlines/singapore-airlines.svg",
  "/airlines/emirates.svg",
  "/airlines/qatar-airways.svg",
  "/airlines/sunlight-air.png",
  "/airlines/sky-express.svg",
  "/airlines/pal-express.svg",
  "/airlines/airswift.png",
  "/airlines/seair.png",
  "/airlines/cebgo.svg",
  "/airlines/cathay-pacific.svg",
  "/airlines/etihad-airways.svg",
  "/airlines/turkish-airlines.svg",
  "/airlines/eva-air.svg",
  "/airlines/korean-air.svg",
  "/airlines/china-airlines.png",
  "/airlines/japan-airlines.svg",
  "/airlines/ana.svg",
  "/airlines/lufthansa.svg",
  "/airlines/thai-airways.svg",
  "/airlines/malaysia-airlines.svg",
  "/airlines/british-airways.svg",
  "/airlines/air-france.svg",
  "/airlines/klm.svg",
  "/airlines/delta.svg",
  "/airlines/united-airlines.svg",
  "/airlines/qantas.svg",
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
