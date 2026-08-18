# Scroll Reveal Personality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the landing page more personality while scrolling through a restrained, once-only “journey unfolding” reveal system.

**Architecture:** Keep `page.tsx` as a Server Component and introduce one small Client Component boundary that accepts server-rendered children. The client component progressively enhances below-fold content with `IntersectionObserver`, while CSS owns all visual variants and reduced-motion behavior.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS, Node test runner

**Spec:** `docs/design/2026-08-18-visual-direction-and-atmosphere.md`

## Global Constraints

- Add no dependencies.
- Reveals run once and never loop.
- Use only opacity and transform for scroll-reveal movement.
- Keep reveal duration within the existing `--duration-entrance: 680ms` token.
- Use 70–100ms stagger intervals only where sequence communicates a journey.
- Do not add parallax, scroll-jacking, or scroll-linked shader controls.
- Preserve complete static content for reduced motion and no-JavaScript rendering.

---

### Task 1: Lock the Reveal Contract

**Files:**
- Create: `tests/scroll-reveal-motion.test.mjs`

**Interfaces:**
- Consumes: existing source-file contract tests and motion tokens
- Produces: regression coverage for progressive enhancement, once-only observation, variants, stagger limits, and reduced motion

- [ ] **Step 1: Write failing source-contract tests**
  Assert that `ScrollReveal` uses `IntersectionObserver`, disconnects after entry, respects `prefers-reduced-motion`, renders visible server markup, exposes a typed variant API, and uses the entrance motion token.
- [ ] **Step 2: Run the focused test**
  Run `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test tests/scroll-reveal-motion.test.mjs`; expect failure because `src/app/scroll-reveal.tsx` does not exist.

### Task 2: Implement the Progressive Reveal Primitive

**Files:**
- Create: `src/app/scroll-reveal.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: serializable `children`, `className`, `variant`, and `delay` props
- Produces: `ScrollReveal` with `rise`, `route`, `card`, `checkpoint`, `message`, and `rule` variants

- [ ] **Step 1: Add the minimal Client Component**
  Render children with no hidden server state. On mount, skip animation for reduced motion or missing observer support; otherwise mark only offscreen content as pending, observe it, reveal it once, and disconnect.
- [ ] **Step 2: Add transform-only visual variants**
  Use `--duration-entrance`, `--ease-entrance`, and a `--reveal-delay` custom property. Keep distances between 10px and 18px and scale offsets at or above `0.985`.
- [ ] **Step 3: Run the focused test**
  Expect the reveal contract tests to pass.

### Task 3: Apply the Journey Beats

**Files:**
- Modify: `src/app/page.tsx`
- Test: `tests/scroll-reveal-motion.test.mjs`

**Interfaces:**
- Consumes: `ScrollReveal`
- Produces: selective reveals for airline introduction, trip brief and guidance, process checkpoints, and closing message sequence

- [ ] **Step 1: Add failing placement assertions**
  Require three process-step reveals at 90ms intervals, one trip-brief card reveal, one route-origin guidance reveal, and a message-before-CTA closing sequence.
- [ ] **Step 2: Wrap only the approved below-fold moments**
  Do not wrap the hero or individual carousel cells. Use 0/90/180ms for process steps and 0/90ms for the closing message and CTA.
- [ ] **Step 3: Run all automated tests**
  Run `npm test`, `npm run lint`, and `npx tsc --noEmit`.

### Task 4: Verify the Experience

**Files:**
- Verify: `src/app/page.tsx`
- Verify: `src/app/globals.css`
- Verify: `src/app/scroll-reveal.tsx`

**Interfaces:**
- Consumes: completed implementation
- Produces: fresh static, build, responsive, once-only, and reduced-motion evidence

- [ ] **Step 1: Run production build**
  Run `npm run build`; expect a successful Next.js production build.
- [ ] **Step 2: Verify responsive scrolling**
  Inspect at 375px, 768px, and 1440px. Confirm no horizontal overflow, no obscured content, and restrained sequencing.
- [ ] **Step 3: Verify accessibility settings**
  Emulate `prefers-reduced-motion: reduce` and confirm all content is immediately visible with no reveal transforms.
- [ ] **Step 4: Verify once-only behavior**
  Scroll a revealed element out and back into view and confirm its state remains visible.
