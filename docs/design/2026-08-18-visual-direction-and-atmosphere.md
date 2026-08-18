# SkyBound Travel Hub — Visual Direction & Atmosphere

**Status:** Proposed — guiding document
**Date:** 2026-08-18
**Supersedes:** nothing. **Extends:** `docs/superpowers/specs/2026-07-31-editorial-concierge-redesign.md`
**Scope:** the single landing page at `src/app/page.tsx`, its styles in `src/app/globals.css`, and the carousel client component.

---

## 0. How to use this document

The July redesign spec answered *"what goes on the page."* It was executed well and should not be relitigated. This document answers the next question: *"why does the executed page still feel flatter than it should, and what do we change to fix it."*

Rules for anyone working from this doc:

1. **Every change must name its goal.** If a proposed tweak cannot be traced to a numbered goal in §3, it does not ship.
2. **Composition before atmosphere.** Phases are ordered in §10 for a reason. Shaders applied to an unresolved layout produce a shimmering unresolved layout.
3. **The conversion is unchanged.** One Messenger thread with Arsenia. Nothing in here adds a form, a scheduler, a quote engine, or a second primary action.
4. **The budgets in §9 are hard limits**, not aspirations. A change that violates a budget is reverted, not negotiated.

---

## 1. Where the page stands today

### What is genuinely working

- **The information architecture is right.** Header → hero → trust → airlines → trip brief → process → closing → footer is a correct narrative for a personal-service landing page. Do not reorder it.
- **The typographic scale is confident.** `clamp(3rem, 6vw, 4.8rem)` on the H1 with `-0.055em` tracking is a real editorial move and it lands.
- **Discipline is exemplary.** Zero runtime dependencies, CSS-only motion, tokens centralised in `@theme inline`, `prefers-reduced-motion` handled with a blanket override, a skip link, focus-visible rings everywhere, and a rendered-content contract check in `scripts/verify-landing-page.mjs`. This is a codebase worth building on rather than replacing.
- **The trip brief is the best object on the page.** It is the only element that shows rather than tells.

### What is not working

The page is *correct* and *quiet*. It is not yet *atmospheric*, and for a travel brand — where the product is literally sky, distance, and departure — that is the gap. Six specific failures follow in §3.

### Current system, for reference

| Token | Value | L\* (approx) | Used for |
| --- | --- | --- | --- |
| `--paper` | `#fbfaf7` | 98.3 | hero, process bands |
| `--surface` | `#ffffff` | 100.0 | trust, airlines, footer, cards |
| `--mist` | `#f1f4f3` | 95.9 | proof band |
| `--ink` | `#0b2238` | 12.6 | all headings and strong text |
| `--muted` | `#5f6f80` | 46.1 | all body copy — **4.94:1 on paper** |
| `--line` | `#dbe2e7` | 89.5 | every rule and border |
| `--messenger` | `#155fbd` | 41.2 | the only interactive colour |
| `--night` | `#0a2034` | 11.6 | closing section |

All L\* and contrast figures in this document are computed from the sRGB values above, not estimated.

Type: Geist Sans for everything, Geist Mono for eyebrows and micro-labels. One weight in practice (`600`) for every heading, label, and lockup.

---

## 2. Design principles

Carried forward from the July spec, unchanged:

- Editorial, not card-heavy. One idea per section. Human trust first. One action. Motion with purpose.

Added by this document:

- **P7 — Air is the brand.** The subject is flight. The page should feel like it has altitude and light in it, not just navy text on white. This is what the atmosphere layer in §7 exists to deliver.
- **P8 — Depth belongs to negative space.** Any atmospheric or decorative treatment lives where there is no content. It never sits under body copy, never under a logo, never under a control.
- **P9 — Restraint is measurable.** "Subtle" is not a taste argument. It is a luminance delta, a frame budget, and a contrast floor. Numbers are in §9.
- **P10 — The second visit test.** A visitor should notice the atmosphere on their second visit, not their first. If they can describe the effect to you, it is too strong.

---

## 3. The six problems, and the goal for each

### Problem 1 — Sectional monotony

Every band after the hero uses the identical recipe: mono uppercase eyebrow → large semibold heading → muted body. Six times in a row. Section padding is also near-uniform (`py-20 sm:py-24 lg:py-28` on four of six sections). There is no compression, no release, no change of instrument. At 1440px the page is 4017px tall; at 375px it is 5700px tall, and on mobile the sameness is severe.

> **Goal 1 — Give the page a rhythm.** A visitor scrolling without reading should feel the page change tempo at least three times before the closing CTA.

### Problem 2 — Band alternation that does not read

The rhythm strategy in the July spec was "alternate white and warm-neutral bands." But `#fbfaf7`, `#ffffff` and `#f1f4f3` span only 4.1 L\* in total, and the adjacent pair `--paper` → `--mist` differs by just 2.3 L\*. On a laptop at 60% brightness the boundaries are invisible. The strategy is sound; the values defeat it.

> **Goal 2 — Make surface changes legible without becoming noisy.** Adjacent bands should differ by ≥ 4 L\*, and the page should contain one genuinely warm surface, one genuinely cool surface, and one dark surface.

### Problem 3 — The hero bottoms out

The hero's left column ends at the CTA, roughly 55% down the hero's height, leaving a large empty region in the lower left of an otherwise carefully balanced two-column composition. The reassurance line (`max-w-[14rem]`, sitting to the right of the button) wraps to two ragged lines and reads as an orphan rather than as support.

This dead zone is not a flaw to be filled with more content — the copy discipline is correct. It is the single best home on the page for atmosphere.

> **Goal 3 — Resolve the hero composition.** The hero should feel weighted and complete at every breakpoint, without adding a word of copy.

### Problem 4 — The airline band shouts loudest and persuades least

Two stacked carousels produce two headings, two count labels, and two pairs of arrow controls — four rows of chrome. The logos are the most saturated, highest-contrast objects on the entire page (full-colour brand marks at `saturate(0.94)`, which is visually indistinguishable from full colour). They out-compete the Messenger button for attention while carrying the weakest persuasive load: recognition, not trust.

Two further issues:

- **The autoplay contradicts the governing spec.** `src/app/airline-carousel.tsx` autoplays on a 2.8s interval (added in `ad6a4f9`). The still-current spec says: *"Do not autoplay or create a continuously moving marquee. Motion occurs only when the visitor navigates."* The spec was not amended.
- **It is a WCAG 2.2.2 (Pause, Stop, Hide) failure.** Content moves automatically for longer than five seconds with no pause control. Hover and focus pause it; a keyboard-only user who never focuses the track, and every touch user, cannot stop it.

> **Goal 4 — Demote the airline band to a supporting role, and make its motion user-owned.** It should read as calm, recognisable breadth that rewards a hover — not as a logo wall in motion.

### Problem 5 — No conversion path in the middle of the page

The header CTA is `hidden sm:inline-flex`. On mobile — where the majority of Messenger traffic will arrive — there is **no persistent CTA at all**. Between the hero button and the closing button there are roughly 3,000px (desktop) / 4,500px (mobile) containing exactly one text link.

The July spec deliberately ruled out an always-visible mobile overlay, and that judgement was right — a floating bar would cheapen an editorial page. But "no overlay" was implemented as "no mobile CTA," which is a different and worse thing.

> **Goal 5 — Restore mobile conversion access without a floating bar.** A visitor at any scroll depth on any device should be at most one thumb-reach and one screen from a Messenger action.

### Problem 6 — One weight, one family, one colour

Every heading, label, brand lockup, and step number is `font-semibold`. There is one typeface family plus its mono sibling. There is one non-neutral colour on the page, and it is reserved for interaction, which means **nothing on the page carries editorial colour at all.** The result reads as a competent SaaS landing page. The brief was concierge travel.

> **Goal 6 — Introduce contrast in weight, and one non-interactive editorial accent.** Enough voice to feel curated; not enough to break the one-primary-action discipline.

---

## 4. Colour and surface system

### 4.1 Widen the surface ladder

Keep `--paper` and `--surface`. Replace the proof band's surface and add one deeper neutral:

```css
:root {
  --paper:   #fbfaf7;  /* unchanged — warm base, hero + process */
  --surface: #ffffff;  /* unchanged — cards, trust, footer */
  --haze:    #e8edef;  /* NEW — proof band. L* 93.4, a 4.8 L* step down from paper */
  --mist:    #f1f4f3;  /* retained for card interiors and hover states only */
  --night:   #0a2034;  /* unchanged */
  --night-deep: #071726; /* NEW — lower stop of the closing gradient */
}
```

**Goal served:** Goal 2. The proof band becomes an unmistakable change of ground, which also isolates the trip brief — the page's best object — instead of letting it float in near-white.

**This forces a text-colour change.** `--muted #5f6f80` measures 4.94:1 on `--paper` — already only 0.44 above the AA floor — and drops to **4.37:1 on `--haze`, which fails AA.** The proof band carries two paragraphs of body copy, so the new surface cannot ship without darkening body text:

```css
--muted: #566677;  /* was #5f6f80. L* 42.5 */
```

Measured: **5.65:1** on paper, **5.89:1** on white, **4.99:1** on haze, **5.33:1** on mist. This passes AA on every surface with real headroom, and the slightly deeper body colour independently helps the flatness described in Problem 6. Do not introduce `--haze` without this change.

### 4.2 Add one editorial accent

```css
:root {
  --brass: #8c6127;  /* NEW — non-interactive editorial accent. L* 44.6 */
}
```

Measured: **5.22:1** on paper, **5.45:1** on white, **4.62:1** on haze — AA-safe even at the 10px micro-label size, which the more obvious brighter brass (`#a3742f`, 3.95:1 on paper) is not. One token only; no tint variant, deliberately — see the numerals note in §6.6.

**This colour is never interactive.** It is permitted on exactly four things and nowhere else:

1. The rule or tick that precedes a section eyebrow.
2. The oversized process step numerals (§6.6).
3. The trip-brief route line and plane glyph.
4. The airline count micro-label.

Messenger blue remains the only colour that indicates "you can click this." That separation is the whole point: today, blue is doing double duty as *both* the interaction signal *and* the only spot of life on the page, which dilutes it. Splitting those jobs makes the CTA read **more** clickable, not less.

This is a deliberate amendment to the July spec's *"avoid multiple competing accent colors."* The spec's concern was competing *emphasis*, not a second hue used at 10px in four places. If the accent is rejected in review, the fallback is `--ink` at 45% opacity for the same four uses — which fixes nothing but breaks nothing.

**Goal served:** Goal 6.

### 4.3 Rules and borders

`--line: #dbe2e7` is used for every divider at full strength, which makes hairlines the third most prominent element on the page after headings and logos. Introduce two weights:

```css
--line:      #dbe2e7;  /* structural: band boundaries, card edges */
--line-soft: #e9eef1;  /* internal: list dividers, table rules, carousel cells */
```

**Goal served:** Goal 1 — quieting internal rules is a cheap way to let the structural ones create rhythm.

---

## 5. Typography

### 5.1 Establish a weight ladder

Large text needs less weight; small text needs more. The page currently gives everything 600.

| Role | Size | Weight | Tracking |
| --- | --- | --- | --- |
| H1 | `clamp(3rem, 6vw, 4.8rem)` | **500** | `-0.05em` |
| H2 | `clamp(2.25rem, 4vw, 3.5rem)` | **500** | `-0.04em` |
| H3 / card titles | `1.125–1.5rem` | **600** | `-0.02em` |
| Eyebrow / mono label | `0.75rem` | **600** | `0.16em` |
| Body | `1.0625–1.1875rem` | **400** | `0` |
| Button | `1rem` | **600** | `0` |

Dropping display headings to 500 makes them read as *typeset* rather than *bolded* — the single highest-leverage typographic change available here, and it costs one class per heading. Geist is variable; there is no additional font weight to download.

### 5.2 The serif question — two options

**Option A — Surgical (recommended for Phase 1).** Keep Geist for all headings. Introduce one serif italic, used in exactly two places: the portrait caption and the example-message blockquote in the closing section. Both are places where a human voice is being quoted or attributed. Cost: one additional `next/font` family, subset to latin, `display: "swap"`, loaded non-blocking.

**Option B — Full re-voicing (evaluate in Phase 4).** Move H1/H2 to an editorial serif (Newsreader, Fraunces at low optical size, or Instrument Serif) and keep Geist for UI and body. This delivers "concierge" far more decisively but changes the page's entire character and invalidates the current screenshot baselines.

Recommendation: ship A, then prototype B at 1440/768/375 and compare side by side before committing. Do not ship B blind.

**Goal served:** Goal 6.

---

## 6. Section directives

### 6.1 Header

- **Show a Messenger action on mobile.** Below `sm`, render an icon-only Messenger button (44×44 minimum, `aria-label="Message Arsenia on Messenger"`) at the right of the header. The header is already `sticky top-0`, so this alone satisfies Goal 5 on mobile with no floating bar and no new element on desktop.
- Change the header ground from `bg-white/90` to `bg-paper/85`. The header currently sits as white over `--paper` in the hero, producing a faint seam at the exact top of the page.
- Drop the header's bottom border to `--line-soft` until the page is scrolled; the hard rule at rest fights the hero.

**Goals: 5, 2.**

### 6.2 Hero

- **Move the reassurance line beneath the CTA at all breakpoints** and let it run one line (`max-w-none`, or shorten to "No forms. No signup."). The current side-by-side placement produces a two-line ragged orphan next to a button.
- **Add a quiet anchor line to the lower left**, below the CTA and separated by generous space: the airline breadth, stated once. e.g. a hairline rule with `30 airlines · local and international` in mono micro-type. This gives the left column a floor, pre-announces the airline section, and adds no persuasive claim.
- **Add the hero atmosphere field** (§7.3). This is the primary fix for the dead zone.
- Portrait: keep the frame and the caption. Reduce the shadow from a single `0 22px 60px` to a two-layer contact + ambient shadow (§6.9).

**Goals: 3, 1.**

### 6.3 Trust strip

Currently the quietest element on the page — three small text blocks in a thin band that read as fine print immediately below a large hero. It is carrying the credibility argument and losing.

- Move it onto `--surface` with the band above and below on `--paper`, so it reads as a deliberate inset.
- Increase label size from `text-base` to `text-lg`, and increase band padding by ~40%.
- Precede each label with a short `--brass` rule (24px × 1px) rather than an icon. Icons here would push the page toward the card-heavy look the spec rejects; a rule reads as editorial.
- On mobile, the three items currently stack with `divide-y` and no breathing room. Give each item `py-8`.

**Goals: 1, 6.**

### 6.4 Airline band

This section needs the most work. Four changes, in priority order:

1. **Desaturate at rest.** Change `.airline-logo-image` from `filter: saturate(0.94); opacity: 0.94` to `filter: saturate(0.15) contrast(0.95); opacity: 0.72`, and on cell hover/focus go to full colour and full opacity over 260ms. The current values are a no-op — 0.94 saturation is not perceptibly different from 1.0. Desaturating properly does three things at once: it demotes the band to the supporting role it should have, it removes 30 competing brand colours from the page, and it turns hover into a genuine reward. **This is the single highest-impact change in this document that is not a shader.**
2. **Replace autoplay with user-owned motion.** Remove the 2.8s interval. On first scroll into view, drift each track by one cell over ~900ms with an ease-out, then stop permanently — enough to communicate "this scrolls" without becoming a marquee. This satisfies the July spec, resolves the WCAG 2.2.2 failure, and reads as more premium than a loop. If stakeholders insist on retaining autoplay, a visible pause/play control becomes mandatory, not optional.
3. **Halve the chrome.** Either (a) merge to a single carousel with a Local / International segmented control above it, or (b) keep two tracks but share one pair of arrow controls that act on whichever track was last interacted with. Option (a) is cleaner and is the recommendation; it also lets the count label become a single `30 airlines` line in `--brass`.
4. **Fade the rails.** Add `mask-image: linear-gradient(90deg, transparent 0, #000 3.5rem, #000 calc(100% - 3.5rem), transparent 100%)` to `.airline-carousel-track`. Logos currently terminate against a hard border mid-glyph. A mask reads as depth and removes the guillotine.

Also: drop `unoptimized` from the carousel `<Image>` calls (see §9.3).

**Goals: 4, 1.**

### 6.5 Proof / trip brief

The strongest section. Changes are additive only.

- Move the band to `--haze` (§4.1) so the white card separates cleanly.
- **Animate the route once.** Replace the two dashed `<span>` elements in `.trip-route` with a single inline SVG path. On scroll into view: animate `stroke-dashoffset` so the dashes travel from CEB toward SIN, and translate the plane glyph along the path via `offset-path`/`offset-distance`. Duration ~1.6s, ease-out, **runs once and settles.** No loop, no replay on re-entry. Colour the line and glyph `--brass`.
- Give the card a two-layer shadow and a 1px inner top highlight (`inset 0 1px 0 rgb(255 255 255 / .9)`) so it reads as a physical card on a coloured ground.

This is the page's one permitted moment of narrative delight, and it sits 40px from a Messenger link — the best possible placement for it.

**Goals: 1, 6, and indirectly 5.**

### 6.6 Process

Three items with a top border each, and 14px mono numerals. It communicates "three things" but not "a sequence."

- **Make it a timeline.** One continuous hairline across the full row on desktop, with three tick marks where the steps sit, replacing three separate `border-t` segments. On mobile, a single vertical rule down the left with three ticks.
- **Scale the numerals to 48–64px**, weight 500, in `--brass` at **full opacity**, positioned to overlap the rule slightly. This is the classic editorial device for a sequence, costs nothing, and immediately breaks the sectional monotony of Problem 1.
  *Do not fade them.* The instinct is to drop them to ~35% opacity so they read as decoration, but `01/02/03` is sequence information, not ornament — a faded numeral both fails contrast and lies about what it is. `--brass` at full strength on `--paper` is 5.22:1 and reads quiet enough at that size. This is why §4.2 defines no tint variant.
- Reduce heading size from `text-2xl` to `text-xl` so the numerals lead.

**Goals: 1, 6.**

### 6.7 Closing CTA

The page's only dark surface and its conversion moment. Today it is a flat navy rectangle with a left-bordered blockquote.

- **Add the night-window atmosphere** (§7.4).
- **Treat the example message as a message.** The blockquote currently uses a left border, which reads as a pull quote. A restrained bubble — `border-radius: 1.25rem 1.25rem 1.25rem .25rem`, `background: rgb(255 255 255 / .06)`, no shadow, no avatar, no timestamp — communicates *"this is what you would send in Messenger"* instantly, in a way a pull quote never will. This is a small change with an outsized effect on comprehension of the CTA, and it does not create a competing card because it carries no action of its own.
- The two columns are `lg:items-end`, which leaves the left column's copy floating well above the right column's button. Align to `items-center` or add a baseline anchor.
- Verify focus rings on this ground: `ring-offset-4` currently resolves to a white offset against `--night`, which is loud. Set `--tw-ring-offset-color: var(--night)` within this section.

**Goals: 5, 1, 3.**

### 6.8 Footer

- Group the two phone numbers and the email under one micro-label (`Direct contact`) rather than presenting four sibling links of equal weight.
- Each footer link currently carries `min-h-11` which makes the footer taller than its content warrants on desktop. Keep the touch target on mobile only.

### 6.9 Shadow system

Replace ad-hoc shadow strings with two tokens:

```css
--shadow-card:  0 1px 2px rgb(10 32 52 / .06), 0 12px 32px -8px rgb(10 32 52 / .10);
--shadow-lift:  0 1px 2px rgb(10 32 52 / .08), 0 20px 48px -12px rgb(10 32 52 / .14);
```

A single large-blur shadow (the current `0 22px 60px`) makes objects look like they are hovering in fog. Two layers — a tight contact shadow plus a wide ambient one — makes them look like they are resting on a surface. This matters more than it sounds on a page whose only imagery is a portrait and a card.

---

## 7. The atmosphere layer (shaders)

### 7.1 Philosophy

The shader is **atmosphere, not decoration.** Its job is to make flat brand colour feel like air and light, on a page whose subject is literally sky. It is not there to be impressive.

Three rules govern every shader on this site:

- **R1 — Negative space only.** No shader pixel is ever rendered beneath body copy, a heading, a logo, or a control. Masks enforce this (§7.3, §7.4), not luck.
- **R2 — The ±3% rule.** A shader may modulate background luminance by no more than **±3 L\*** on light surfaces and **±6 L\*** on the dark surface. Amplitude is tuned against a measurement, not against a feeling.
- **R3 — Loop-free slowness.** Two incommensurable drift rates, so the field never visibly repeats. Anything a visitor can perceive as "looping" has failed P10.

### 7.2 Technical approach

Three options were considered:

| Approach | Cost | Verdict |
| --- | --- | --- |
| Pure CSS (`@property` gradients, conic, mask, blur) | 0 KB | **Fallback only.** Banding on large light gradients is visible on 8-bit panels, and large-area `filter: blur()` is expensive on mid-range Android. |
| Hand-rolled WebGL2 fragment shader, one client component | ~3 KB gz | **Recommended.** Full control, no dependency, matches the repo's existing zero-runtime-dependency discipline. |
| `three` / `@react-three/fiber` / `@paper-design/shaders-react` | 150–600 KB | **Rejected.** Two orders of magnitude of payload for one full-screen quad. |

Ship **WebGL2, hand-rolled**, with the **CSS gradient as the static fallback** — and critically, the fallback must be the shader's *t=0 frame*, so that no-WebGL users, reduced-motion users, and the pre-hydration paint all see the same colours. There is no pop-in, ever.

### 7.3 Shared runtime contract — `<AtmosphereCanvas>`

One component, two instances. Non-negotiable behaviours:

```
src/app/atmosphere-canvas.tsx   "use client"
src/app/shaders/hero.frag.ts    template-literal GLSL
src/app/shaders/night.frag.ts
```

- Renders `<canvas aria-hidden="true" />`, `position:absolute; inset:0; pointer-events:none; z-index:-1`. The parent section carries the CSS fallback as its `background`, so the canvas only ever *adds* to a correct static ground.
- **Never affects layout.** Absolutely positioned in an already-sized parent. CLS contribution must be exactly 0.
- Context: `webgl2` with `{ alpha: true, antialias: false, powerPreference: "low-power", preserveDrawingBuffer: false, depth: false, stencil: false }`. A full-screen triangle, not a quad. No textures, no framebuffers.
- **Internal resolution capped at `min(devicePixelRatio, 1.5) × 0.5`.** These fields are low-frequency; rendering at half resolution and letting the GPU upscale is visually identical and quarters fill cost.
- **Frame throttling: 30fps for the hero, 24fps for the closing.** Motion this slow gains nothing from 60fps and costs double.
- **Mounts after LCP.** Gate on `requestIdleCallback` (with a `setTimeout(…, 800)` fallback). The shader must never compete with the portrait for main thread or GPU during load, and must never be the LCP element.
- **Pauses aggressively.** `cancelAnimationFrame` on: `IntersectionObserver` exit (rootMargin `10%`), `document.visibilitychange` to hidden, and `matchMedia("(prefers-reduced-motion: reduce)")` matching. When paused, the last frame stays on screen — no fade, no clear.
- **Refuses to run** when: `prefers-reduced-motion: reduce`, no WebGL2 context, `navigator.deviceMemory < 4`, or `document.documentElement.dataset.atmosphere === "off"`. In every case the CSS fallback is already painted and nothing further happens.
- **`data-atmosphere="off"` on `<html>` is a global kill switch.** Ship it. It is how we debug, how we screenshot deterministically, and how we turn the feature off in production without a deploy if a device class misbehaves.

**Hard cap: two WebGL canvases per page, never both animating at once.** The hero and closing sections are ~3,000px apart, so the IntersectionObserver guarantees this.

### 7.4 Placement 1 — Hero: *Cabin light*

**Goal served: 3** (resolve the hero composition) **and 7/P7** (air is the brand).

- **Field:** two-octave value noise with a single domain-warp pass, mapped through a three-stop ramp: `--paper` `#fbfaf7` → warm sand `#f4efe6` → cool sky tint `#eef3f8`. Blue never exceeds ~8% saturation; this must read as *light through a window*, not as a blue gradient.
- **Motion:** two noise layers drifting at `0.006` and `-0.011` units/s. Incommensurable rates give a beat period measured in minutes (R3).
- **Mask — this is the important part.** A radial falloff peaking in the **lower-left third** of the hero, decaying to zero within 240px of the headline block and to zero behind the portrait frame. Type always sits on flat `--paper` (R1). The visible effect is confined almost exactly to the dead zone identified in Problem 3.
- **Optional second element:** one very soft light bloom (≤ 4% white, ~400px radius) anchored near the portrait frame's top-left corner. Sells "window light falling across the room" and ties the two columns together. Cut this first if the hero starts to feel busy.
- **Amplitude:** ±2.5 L\*, inside the ±3 budget with headroom.

### 7.5 Placement 2 — Closing CTA: *Night window*

**Goal served: 5** (make the final CTA pull harder) **and 1** (a genuine destination at the end of the scroll).

The dark section can carry more, because dark grounds hide banding and because this is the conversion moment. Budget is ±6 L\*.

- **Base:** a slow vertical flow between `--night` `#0a2034` and `--night-deep` `#071726`, drifting over ~120s.
- **Aurora band:** messenger blue at ≤ 6% alpha, constrained by a `smoothstep` to the **top 35% and the right third**, drifting left-to-right over ~90s. It must never cross the headline.
- **Star field:** ~90 hash-generated points, brightness 0.10–0.25, with per-star twinkle at very low amplitude and randomised phase. Density falls to zero in the lower-left where the headline and paragraph sit (R1).
- **Vignette:** a soft darkening over the right column so the Messenger button's blue remains the single brightest object in the section. This is the whole reason the shader is here.
- **Contrast floor:** white on `--night` measures **16.55:1** (and 18.11:1 on `--night-deep`). On the shader's brightest frame it must remain ≥ **14:1**. Measure, do not assume.

### 7.6 Placement 3 — Trip brief: *Flight path* (SVG/CSS, not WebGL)

Specified in §6.5. Listed here so the atmosphere work is reviewed as one body: this is the third and last motion moment on the page, it uses no WebGL, and it runs exactly once.

### 7.7 Placement 4 — Carousel rail fade (CSS mask, not WebGL)

Specified in §6.4.4.

### 7.8 Where shaders must not go

Explicitly, and for the avoidance of future debate: **no atmosphere on** the trust strip, the airline band, the process section, the footer, the sticky header, or as a global page background. **No shader beneath any text at any amplitude.** No parallax, no scroll-driven shader parameters, no pointer-tracking distortion, no grain overlay on the whole page.

Total: **two WebGL canvases, one SVG animation, one CSS mask.** That is the entire atmosphere surface area of this site, and it should stay that way.

---

## 8. Motion system

Consolidate the current ad-hoc durations into a small set and apply it consistently.

| Token | Duration | Easing | Used for |
| --- | --- | --- | --- |
| `--ease-out` | 180ms | `cubic-bezier(.2,0,0,1)` | hover, focus, colour changes |
| `--ease-entrance` | 680ms | `cubic-bezier(.22,1,.36,1)` | hero reveal (existing, keep) |
| `--ease-narrative` | 1600ms | `cubic-bezier(.22,1,.36,1)` | flight path, carousel first-drift |

Rules:

- Motion is opacity, transform, filter, and `stroke-dashoffset` only. Never layout properties.
- Every scroll-triggered animation runs **once** and does not replay on re-entry.
- The existing blanket `prefers-reduced-motion` override in `globals.css` stays exactly as written. Extend it to set `[data-atmosphere-canvas] { display: none }` so the CSS fallback is what reduced-motion users see.

---

## 9. Budgets and quality gates

### 9.1 Performance

| Metric | Budget |
| --- | --- |
| LCP (mid-tier mobile, 4G) | < 2.0s |
| CLS | 0.00 — the canvas is absolutely positioned and contributes nothing |
| INP | < 200ms |
| Total JS added by all atmosphere work | ≤ 6 KB gzip |
| Longest task during shader init | ≤ 50ms |
| Sustained GPU frame time, hero, M1 @ 1440p | ≤ 4ms |
| Sustained GPU frame time, mid-range Android | ≤ 8ms |
| Lighthouse Performance / A11y / Best Practices / SEO | ≥ 95 each |

### 9.2 Accessibility

- Every text/background pair ≥ **4.5:1**, measured against **both the brightest and darkest shader frames**, not the static fallback. The closing section holds ≥ **14:1**. Note that shipping `--haze` requires the `--muted` darkening in §4.1 to stay above the floor.
- Zero axe-core violations at 375, 768, 1440.
- WCAG 2.2.2 satisfied — after §6.4.2 there is no auto-moving content longer than 5s anywhere on the page.
- Full keyboard traversal with a visible focus ring on every interactive element, including on `--night`.
- All canvases `aria-hidden="true"` and `pointer-events: none`.
- `prefers-reduced-motion` renders a page that is pixel-identical across any two frames.

### 9.3 Asset debt (fix in Phase 0, independent of everything else)

- `public/arsenia-portrait-editorial.png` is **1.73 MB** and is the LCP element. Re-export at 2× the largest rendered size (~920px wide) and let `next/image` handle format negotiation. Expect an 85–90% reduction.
- The carousel passes `unoptimized` to all 30 `<Image>` calls, so raw sources are served: `sunlight-air.png` at **141 KB** and `emirates.svg` at **99 KB** are both rendered into a 144×60 box. Drop `unoptimized`, and separately re-export the four PNG marks at ~300px wide.
- Total `public/` is 2.6 MB; a realistic target after both fixes is under 500 KB.

### 9.4 Verification

`scripts/verify-landing-page.mjs` is a good contract check and should grow with the work:

- Assert every canvas carries `aria-hidden="true"`.
- Assert no `data-autoplay` attribute remains after §6.4.2.
- Add a Playwright pass that screenshots with `data-atmosphere="off"` for deterministic visual diffs, and separately samples the shader's extreme frames for the contrast assertions in §9.2.

---

## 10. Roadmap

Ordered deliberately. **Atmosphere is Phase 2, not Phase 1** — a shimmering unresolved layout is worse than a flat resolved one.

### Phase 0 — Foundations *(no visible design change)*
Token widening (§4), weight ladder (§5.1), shadow tokens (§6.9), line-weight split (§4.3), asset debt (§9.3), plus the missing platform basics: an `opengraph-image` file convention (this page's primary share surface is *Messenger* — a bare link preview is a real conversion cost), `TravelAgency` JSON-LD with name, telephone, email and `areaServed`, and a canonical URL.
*Risk: none. Unblocks every later phase.*

### Phase 1 — Composition and hierarchy *(most of the UX gain lives here)*
Mobile header CTA (§6.1), hero resolution (§6.2), trust strip (§6.3), airline desaturation + autoplay removal + rail mask + chrome reduction (§6.4), process timeline (§6.6), closing alignment and message bubble (§6.7).
*Risk: low. Re-baseline the 375/768/1440 screenshots at the end.*

### Phase 2 — Atmosphere runtime + hero field
Build `<AtmosphereCanvas>` to the §7.3 contract, ship the CSS fallback first and verify it alone looks correct, then layer the hero shader (§7.4) behind `data-atmosphere`.
*Risk: medium — this is the phase where device testing is mandatory. Do not skip the mid-range Android check.*

### Phase 3 — Night window + narrative motion
Closing shader (§7.5), flight-path animation (§7.6), serif Option A (§5.2).
*Risk: low, given Phase 2's runtime is proven.*

### Phase 4 — Tune and decide
Amplitude tuning against the §9.2 contrast measurements on real hardware. Prototype serif Option B and compare side by side. Decide whether the `--brass` accent survived contact with the live page.

---

## 11. Success criteria

The work is successful when all of the following are true:

1. A visitor scrolling the page without reading perceives at least three distinct changes of tempo.
2. Adjacent surface bands are distinguishable on a laptop panel at 60% brightness.
3. The hero reads as compositionally complete at 375, 768, and 1440 with no copy added.
4. The Messenger button is the most salient interactive object in every viewport it appears in — including the airline band's viewport.
5. A mobile visitor at any scroll depth is one thumb-reach from a Messenger action, with no floating overlay on the page.
6. Nothing on the page moves automatically for longer than five seconds.
7. Every budget in §9 passes on real hardware, including a mid-range Android.
8. With `prefers-reduced-motion: reduce`, the page is static, complete, and beautiful — not a degraded version of something else.
9. **The second visit test:** someone who has seen the page twice notices the atmosphere but cannot describe it.

---

## 12. Non-goals

Unchanged from the July spec, and reaffirmed:

- No booking form, scheduler, quote calculator, account, or backend.
- No fabricated testimonials, response-time claims, or implied airline partnerships.
- No UI framework and no animation library. The atmosphere layer is hand-rolled specifically to keep this true.
- No floating mobile CTA bar.
- **No dark mode.** Stated explicitly so nobody builds it by accident: this is a light editorial piece whose dark beat is the closing section. A full dark theme would remove the closing section's entire reason for existing.
- No page-wide grain, noise overlay, parallax, scroll-jacking, or pointer-reactive distortion.

---

## 13. Open decisions

These need a call from Chris before the phase that depends on them:

| # | Decision | Needed by | Recommendation |
| --- | --- | --- | --- |
| 1 | Adopt the `--brass` editorial accent (`#8c6127`), or fall back to `--ink` at 45%? | Phase 0 | Adopt. |
| 2 | Serif Option A now, Option B later — or go straight to B? | Phase 3 | A now, prototype B in Phase 4. |
| 3 | Merge the two carousels into one with a segmented filter, or keep two with shared controls? | Phase 1 | Merge. |
| 4 | Remove carousel autoplay entirely, or keep it with a visible pause control? | Phase 1 | Remove. It contradicts the governing spec and fails WCAG 2.2.2. |
| 5 | Message-bubble treatment for the closing quote — acceptable, or too literal? | Phase 1 | Acceptable and worth it. |
