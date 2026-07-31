# SkyBound Editorial Concierge Landing Page Implementation Plan

**Status:** Implemented and verified on 2026-07-31.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Arsenia Messenger landing page as the approved Direction A editorial-concierge experience, then apply the approved SkyBound Travel Hub identity, airline-logo rail, and subtle motion refinement.

**Architecture:** Keep the site as a static Next.js App Router page with local, named server components inside `src/app/page.tsx`; no client-side state or new runtime dependencies are needed. Centralize the visual and motion systems in `src/app/globals.css`, reuse verified airline marks from the supplied source artwork as a local sprite treatment, and gate the generated portrait through image inspection before it is referenced by the page.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, `next/image`, Node's built-in runtime for the landing-page contract check, built-in image generation for the portrait edit, temporary Playwright CLI for screenshots only.

## Global Constraints

- Messenger URL remains exactly `https://m.me/arsenia.balinario`.
- Primary headline remains exactly “A simpler, more personal way to book your next flight.”
- Primary CTA remains exactly “Chat with Arsenia on Messenger.”
- Agency identity is `SkyBound Travel Hub`; the former agency name must not render anywhere on the page or metadata.
- Use the approved section order: header → hero → trust strip → airline logo band → example trip brief → how it works → closing CTA → footer.
- Messenger blue is the only interactive accent; phone and email are footer fallbacks.
- Add no UI framework, animation package, booking form, scheduler, backend, testimonial, or fabricated airline partnership.
- Use six accessible airline marks, label them as frequently requested, and pair the section with an availability caveat.
- Motion is CSS-only, non-looping, limited to opacity/transform, and neutralized by the existing reduced-motion rule.
- Preserve the accessibility skip link, focus states, and reduced-motion handling.
- Do not discard or overwrite unrelated working-tree changes.

## File Map

- Create `public/arsenia-portrait-editorial.png`: identity-preserving hero portrait with a natural complete shoulder line.
- Create `scripts/verify-landing-page.mjs`: dependency-free rendered-content contract check.
- Modify `package.json`: expose the contract check as `npm run verify:landing`.
- Rewrite `src/app/page.tsx`: named section components, SkyBound copy, airline marks, example trip brief, and approved content hierarchy.
- Modify `src/app/globals.css`: centralized Direction A tokens, logo-sprite treatment, and restrained motion behavior.
- Modify `src/app/layout.tsx`: metadata copy only if needed to match the approved message.

---

### Task 1: Add a Failing Landing-Page Contract Check

**Files:**
- Create: `scripts/verify-landing-page.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: a running site URL from `TARGET_URL`, defaulting to `http://localhost:3000`.
- Produces: exit code `0` when the rendered page contains the approved content and structure; non-zero with a specific assertion failure otherwise.

- [ ] **Step 1: Create the rendered-content verification script**

```js
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

for (const section of ["hero", "trust", "airlines", "proof", "process", "closing"]) {
  assert.ok(html.includes(`data-section=\"${section}\"`), `Missing section marker: ${section}`);
}

const messengerLinks = html.match(/https:\/\/m\.me\/arsenia\.balinario/g) ?? [];
assert.ok(messengerLinks.length >= 4, "Expected at least four Messenger conversion links");
assert.ok(!html.includes("Usually replies within the hour"), "Unverified response-time claim must be removed");

console.log(`Landing-page contract passed at ${targetUrl}`);
```

- [ ] **Step 2: Add the npm script**

```json
"verify:landing": "node scripts/verify-landing-page.mjs"
```

- [ ] **Step 3: Run the check against the existing page and confirm RED**

Run: `npm run verify:landing`

Expected: FAIL with `Missing required rendered text: A simpler, more personal way to book your next flight.`

- [ ] **Step 4: Commit the safety net**

```bash
git add package.json package-lock.json scripts/verify-landing-page.mjs
git commit -m "test: define editorial landing page contract"
```

### Task 2: Produce the Corrected Editorial Portrait

**Files:**
- Inspect: `public/arsenia-travel-poster.jpg`
- Create: `public/arsenia-portrait-editorial.png`
- Preserve: `public/arsenia-cutout.png` until the new asset passes inspection.

**Interfaces:**
- Consumes: the supplied travel poster as the identity reference.
- Produces: a portrait PNG suitable for `next/image`, with the subject centered in an upper-body editorial crop and no visible poster residue.

- [ ] **Step 1: Inspect the reference at original detail**

Run the image viewer on `public/arsenia-travel-poster.jpg` and note the face, blazer color, posture, and original shoulder truncation.

- [ ] **Step 2: Generate one identity-preserving edit**

Use built-in image generation with this production prompt:

```text
Use case: identity-preserve
Asset type: premium travel-consultant landing-page hero portrait
Input image: the supplied Global Pinoy travel poster is the identity and wardrobe reference
Primary request: create a clean upper-body editorial portrait of the same woman, preserving her face, age, expression, hair, teal blazer, white blouse, and seated professional posture; naturally reconstruct the shoulder and upper arm cut off by the poster edge
Scene/backdrop: simple soft warm-gray studio background with no objects
Composition/framing: vertical 4:5 portrait, head and complete shoulders visible, generous space around the silhouette, subject centered slightly right
Lighting/mood: soft natural studio light, warm, trustworthy, premium consultant portrait
Constraints: preserve identity and clothing; realistic anatomy; complete both shoulders; no text, logo, aircraft, airline graphics, poster fragments, jewelry changes, watermark, or beauty retouching that changes identity
Avoid: cutout look, clipped limbs, extra fingers, synthetic plastic skin, dramatic fashion lighting, promotional-flyer styling
```

- [ ] **Step 3: Inspect the generated portrait before integration**

Check at original resolution for identity fidelity, complete shoulders, realistic hands/arms if visible, natural blazer edges, and absence of poster residue or generated text.

Expected: clean 4:5 editorial portrait with no obvious mask or reconstruction defect.

- [ ] **Step 4: Save the accepted asset non-destructively**

Copy the accepted built-in output to `public/arsenia-portrait-editorial.png`; do not overwrite the old cutout yet.

- [ ] **Step 5: Commit the accepted asset**

```bash
git add public/arsenia-portrait-editorial.png public/arsenia-travel-poster.jpg
git commit -m "feat: add editorial Arsenia portrait"
```

### Task 3: Rebuild the Page as Direction A

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Modify if required: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `public/arsenia-portrait-editorial.png`, `public/arsenia-travel-poster.jpg`, and the global constraints above.
- Produces: the approved section markers and four or more Messenger links required by `scripts/verify-landing-page.mjs`.

- [ ] **Step 1: Define a compact Direction A token system in `globals.css`**

```css
:root {
  --paper: #fbfaf7;
  --surface: #ffffff;
  --ink: #0b2238;
  --muted: #5f6f80;
  --line: #dbe2e7;
  --messenger: #1b74e4;
  --messenger-hover: #155fbd;
  --night: #0a2034;
}
```

Map these tokens through Tailwind's existing `@theme inline` block and keep the current selection, reduced-motion, and tap behavior.

- [ ] **Step 2: Replace the current page composition with named server components**

Keep these local interfaces in `src/app/page.tsx`:

```tsx
function MessengerLink(props: Readonly<{ children: React.ReactNode; compact?: boolean; className?: string }>)
function SiteHeader()
function HeroSection()
function TrustStrip()
function AirlineBand()
function ProofSection()
function ProcessSection()
function ClosingSection()
function SiteFooter()
```

The `Home` component must render them in the approved order. Do not add an always-visible mobile overlay beside the hero CTA.

- [ ] **Step 3: Implement the hero and credibility rhythm**

Use `data-section="hero"`, a two-column desktop grid, the exact approved H1 and CTA, the new portrait asset, and a quiet caption tying Arsenia to SkyBound Travel Hub. Follow with `data-section="trust"` as a divider-led band and `data-section="airlines"` as an accessible airline-logo rail.

- [ ] **Step 4: Separate authentic proof from the process**

Use `data-section="proof"` for a two-column example-trip-brief/copy composition. Use `data-section="process"` as its own full-width section with the exact sequence `Share your trip → Review flight options → Continue with Arsenia` and no enclosing card.

- [ ] **Step 5: Complete the conversion conclusion and footer**

Use `data-section="closing"` for the dark full-width CTA, retain the example message as inline supporting content, and keep real phone/email fallbacks in the footer with full-size touch targets.

- [ ] **Step 6: Run the contract check and confirm GREEN**

Run: `npm run verify:landing`

Expected: `Landing-page contract passed at http://localhost:3000`

- [ ] **Step 7: Run static verification**

Run: `npm run lint && npm run build`

Expected: both commands exit `0` with no warnings introduced by the redesign.

- [ ] **Step 8: Commit the Direction A rebuild**

```bash
git add src/app/page.tsx src/app/globals.css src/app/layout.tsx
git commit -m "feat: rebuild landing page as editorial concierge"
```

### Task 4: Responsive Visual QA and Final Cleanup

**Files:**
- Inspect: `src/app/page.tsx`
- Inspect: `src/app/globals.css`
- Inspect: `public/arsenia-portrait-editorial.png`
- Remove only if unused after verification: `public/arsenia-cutout.png`

**Interfaces:**
- Consumes: the completed Direction A page served locally.
- Produces: evidence screenshots at 375px, 768px, and 1440px, plus final clean lint/build/contract results.

- [ ] **Step 1: Start the production build locally**

Run: `npm run build && npm run start`

Expected: Next.js serves the page without runtime errors.

- [ ] **Step 2: Capture full-page screenshots without adding a project dependency**

Use a temporary Playwright CLI/browser installation and capture:

```text
tmp/visual-qa/landing-375.png
tmp/visual-qa/landing-768.png
tmp/visual-qa/landing-1440.png
```

Set exact viewports of `375×812`, `768×1024`, and `1440×1100`; capture the full scrollable page.

- [ ] **Step 3: Inspect all three screenshots**

Check that the hero remains balanced, body text does not become narrow, the proof section is no longer a three-column cluster, the trip brief is spacious, airline marks remain readable, motion does not distract, and the initial mobile viewport contains only one primary CTA.

- [ ] **Step 4: Verify interaction and accessibility essentials**

Confirm all Messenger links resolve to `https://m.me/arsenia.balinario`, keyboard focus is visible, touch targets are at least 44px, heading order is logical, images have meaningful alt text, contrast remains AA, and reduced-motion rules remain present.

- [ ] **Step 5: Remove obsolete image assets only after reference checks**

Run: `grep -R "arsenia-cutout" src public --exclude='arsenia-cutout.png'`

Expected: no references. Then remove only `public/arsenia-cutout.png`; preserve the source poster as archival/logo-source material and preserve the new editorial portrait.

- [ ] **Step 6: Run the final verification sequence**

Run: `npm run verify:landing && npm run lint && npm run build && npm audit --omit=dev`

Expected: contract, lint, and build pass; production audit reports zero vulnerabilities.

- [ ] **Step 7: Commit verification-driven refinements**

```bash
git add src/app public package.json package-lock.json scripts
git commit -m "fix: polish responsive landing page composition"
```

### Task 5: Apply the Approved SkyBound Brand, Logo, and Motion Revision

**Files:**
- Modify: `scripts/verify-landing-page.mjs`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Extend the rendered contract and confirm RED**

Require `SkyBound Travel Hub`, six `data-airline-logo` markers, `Airlines frequently requested`, `Example trip brief`, and `data-motion="subtle"`; reject rendered `Global Pinoy Travel` text.

- [ ] **Step 2: Replace the agency identity and metadata**

Update the header lockup, portrait caption, footer, document title, description, and Open Graph copy to SkyBound Travel Hub while retaining Arsenia as the named consultant.

- [ ] **Step 3: Upgrade the airline band**

Render six accessible, recognizable marks at a consistent optical size using crops from the supplied poster as the local source image. Keep the section open and divider-led rather than card-heavy.

- [ ] **Step 4: Replace the old-branded proof panel**

Stop rendering the old flyer and create a single spacious example trip brief using route, dates, and traveler count. Preserve the original source asset in `public/`.

- [ ] **Step 5: Add restrained motion**

Add one staggered hero entrance and small logo/link interactions using CSS opacity and transform only. Preserve the reduced-motion override and avoid continuous animation.

- [ ] **Step 6: Verify and visually inspect**

Run the rendered contract, lint, production build, production audit, accessibility scan, and screenshot inspection at 375px, 768px, and 1440px.
