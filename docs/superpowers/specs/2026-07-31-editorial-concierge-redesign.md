# Arsenia Website — Editorial Concierge Redesign

## Status

Approved visual direction: **Direction A — Editorial concierge**.

## Objective

Recompose the entire landing page so it feels like a premium personal travel-consulting experience rather than a collection of cramped promotional cards. The sole conversion remains opening a Messenger conversation with `arsenia.balinario`.

The redesign must make three things immediately clear:

1. Arsenia is a real person who can help.
2. Her service is backed by Global Pinoy Travel & Tours and broad airline coverage.
3. Starting requires only one Messenger message.

## Experience Principles

- **Editorial, not card-heavy.** Use full-width page bands, strong typography, and intentional whitespace. Enclose content only when a boundary communicates something useful.
- **One idea per section.** Proof, preparation, and conversion must not compete inside the same horizontal cluster.
- **Human trust first.** Arsenia is the primary human anchor; Global Pinoy provides equal institutional credibility.
- **Recognizable proof, not decorative density.** The authentic flyer supports credibility but does not dominate the page or carry explanatory copy beside a second card.
- **One action.** Messenger is the only primary action. Phone and email remain fallback contact information in the footer.

## Page Composition

```mermaid
flowchart TD
    A[Minimal co-brand header] --> B[Hero: promise, CTA, Arsenia portrait]
    B --> C[Three-part trust strip]
    C --> D[Airline coverage band]
    D --> E[Authentic proof: flyer + concise supporting copy]
    E --> F[How it works: three spacious steps]
    F --> G[Dark closing CTA]
    G --> H[Contact footer]
```

### 1. Header

- Preserve equal co-branding: `Global Pinoy Travel & Tours | Arsenia`.
- Keep the header quiet and compact so it supports orientation without competing with the hero.
- Include one text-level Messenger action on larger screens.

### 2. Hero

- Use an asymmetric two-column layout with copy on the left and Arsenia on the right.
- Lead with the headline: **“A simpler, more personal way to book your next flight.”**
- Supporting copy: **“Chat directly with Arsenia for local and international flight options, fare questions, and clear booking guidance—all in Messenger.”**
- Keep one Messenger button and one reassurance line in the primary reading path.
- Primary CTA: **“Chat with Arsenia on Messenger.”** Reassurance: **“No forms. No signup. Start with a simple message.”**
- Use a newly generated, identity-preserving portrait derived from the supplied image. The result must remove the poster background, restore a natural complete shoulder line, and avoid looking like a crop or masked flyer asset.
- Keep the portrait presentation editorial and restrained: no boarding-pass motif, floating badges, artificial gradients, or overlapping information cards.

### 3. Trust Strip

- Present three short credibility statements in a single quiet band.
- Use thin dividers, not three separate cards.
- Each item gets one label and one supporting line.
- Use these three messages: **Personal guidance**, **Local and international flights**, and **One simple Messenger thread**.

### 4. Airline Coverage Band

- Give airline coverage its own compact, full-width section.
- Use a curated typographic list with generous horizontal spacing: Philippine Airlines, Cebu Pacific, AirAsia, Emirates, Qatar Airways, Singapore Airlines, and “more.” Do not source or fabricate a separate logo library in this pass.
- This section establishes breadth; it must not repeat the flyer or explain the booking process.

### 5. Authentic Proof

- Use a calm two-column editorial composition: the authentic flyer on the left, concise credibility copy on the right.
- Constrain the flyer to a deliberate supporting size so it reads as an artifact visitors may recognize, not as the page's main design language.
- Do not place the “What to send first” steps in this section.
- Copy must explain why the flyer matters in two short paragraphs at most.

### 6. How It Works

- Move preparation into a separate, spacious section titled around what happens next.
- Show three steps in one horizontal sequence on desktop and a vertical sequence on mobile.
- Use large step numbers, short headings, and one concise explanatory line per step.
- Use the sequence **Share your trip → Review flight options → Continue with Arsenia**.
- Do not enclose the entire sequence in a narrow card.

### 7. Closing CTA

- Use one dark, full-width section to create a clear visual conclusion.
- Include a short example message as supportive content, not a competing card.
- Repeat the primary Messenger button once.

### 8. Footer and Mobile CTA

- Keep phone and email as fallback contact details in the footer.
- Preserve a slim sticky Messenger action on mobile with safe-area spacing.
- Ensure the sticky action does not cover footer content or the final CTA.

## Visual System

### Layout and Spacing

- Main content width: approximately `1120–1200px`.
- Desktop section spacing: `96–120px` vertically.
- Mobile section spacing: `64–80px` vertically.
- Primary column gap: at least `64px` on wide screens.
- Component-internal spacing follows a consistent 8px-derived rhythm.
- Body-copy measure stays around `55–65` characters per line.
- Cards may not be used merely to fill a grid; every enclosure must have a semantic reason.

### Typography

- Use a confident editorial scale with restrained weights.
- H1: approximately `64–72px` desktop, `44–52px` mobile.
- H2: approximately `42–52px` desktop, `34–40px` mobile.
- Body copy: `17–19px` with generous line-height.
- Reserve uppercase tracking for small section labels only.
- Avoid making headings, labels, and cards equally bold.

### Color and Surfaces

- Keep a warm-white paper surface and deep navy text.
- Use Messenger blue only for interactive emphasis.
- Use a dark navy closing section to establish a strong end point.
- Avoid decorative gradient blobs, colored glows, excessive shadows, and multiple competing accent colors.
- Alternate white and warm-neutral section bands to create rhythm without relying on cards.

### Imagery

- Hero portrait: generated from the supplied reference with identity preserved, background removed or replaced with a subtle neutral editorial treatment, and the missing shoulder naturally reconstructed.
- Authentic flyer: retained as proof lower on the page.
- Neither asset should be stretched, over-cropped, or masked to hide obvious generation/cropping defects.

## Responsive Behavior

- Desktop hero remains a balanced two-column composition.
- Mobile hero keeps the copy and Messenger action first, followed immediately by the portrait.
- Trust items and process steps stack vertically with clear dividers.
- Airline coverage may become a horizontally scrollable rail if logos are used.
- The proof section stacks flyer first, explanation second, with generous separation.
- No section should create horizontal overflow or force text into narrow measures.

## Technical Shape

- Refactor the current single page into clearly named section components where that improves readability.
- Centralize repeated color, spacing, radius, and shadow decisions in the existing global styling layer rather than repeating arbitrary values throughout JSX.
- Reuse the current Next.js and Tailwind setup; add no UI or animation dependency.
- Generate the revised portrait as a new asset and replace the current cutout only after visual inspection.
- Preserve the existing Messenger URL, metadata intent, accessibility skip link, focus states, reduced-motion handling, and mobile safe-area behavior.

## Acceptance Criteria

- The proof area no longer combines headline copy, instructions, and the flyer in three cramped columns.
- “What happens next” is a standalone section with visibly more breathing room.
- The page uses one coherent spacing and typography system from hero through footer.
- Arsenia's portrait has no visibly missing shoulder, poster bleed, harsh mask edge, or improvised crop.
- The flyer reads as supporting proof and remains legible without dominating the page.
- Messenger is the only primary CTA and works from every placement.
- Phone and email remain accessible as fallback details.
- The layout is visually checked at approximately 375px, 768px, and 1440px widths.
- Keyboard focus, text contrast, touch targets, and reduced-motion behavior remain accessible.
- Lint and production build pass after implementation.

## Non-goals

- No booking form, scheduler, quote calculator, account, or backend.
- No fabricated testimonials, response-time guarantees, or airline partnerships.
- No new visual framework, animation library, or unrelated refactor.
