# DESIGN.md: Luxury Jewelry E-commerce UI

Single source of truth for the frontend redesign. Every section must follow this file.
Backend is already done. Do NOT modify any backend code. Only the UI changes.

Replace `[BRAND_NAME]` with the real brand name. Never use third-party brand names or logos
(no Zales, no Tiffany & Co). Use placeholder logos and our own images.

---

## 1. Design Direction

- Mood: dark, warm, luxurious, editorial. Jewelry is the hero, UI stays quiet.
- Dark chocolate-brown canvas, cream text, taupe accent.
- Oversized wide headings, lots of whitespace, rounded surfaces, pill-shaped controls.
- Large imagery with soft overlaps (headings overlapping images, watermark text behind images).
- Calm, smooth motion. Nothing flashy or bouncy.

## 2. Tech Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- framer-motion (entry and scroll animations)
- swiper (carousels)
- lenis (smooth scrolling)
- next/image for all images
- If the existing project uses a different stack, adapt but keep the same tokens and structure.

## 3. Color Tokens

| Token        | Hex       | Usage                                  |
|--------------|-----------|----------------------------------------|
| background   | #1a1410   | Page background                        |
| surface      | #241c17   | Cards, input fields                    |
| surface-alt  | #2e231d   | Hover state of cards, raised surfaces  |
| accent       | #8b6b55   | Taupe: hero brand panel, watermark, highlights |
| accent-soft  | #a98468   | Hover for accent                       |
| text         | #f3ece4   | Primary text (cream)                   |
| muted        | #a89888   | Secondary text, labels                 |
| border       | rgba(243,236,228,0.12) | Hairline borders           |
| overlay      | rgba(26,20,16,0.6)     | Image overlays             |

Rules:
- Primary text on background must keep contrast of at least 4.5:1.
- Accent is used for surfaces and decoration, not for small body text.

## 4. Typography

- Heading font: **Unbounded** (wide, extended). Fallback: Syne, sans-serif.
- Body font: **Inter**.
- Headings: weight 500 to 600, tight line-height (1.05 to 1.15), slight negative letter-spacing.
- Some headings are UPPERCASE (OUR WORKS, NEW COLLECTION), some are Title Case
  (Category View, Customer Experiences). Follow the screenshot of each section.

| Role        | Desktop (1440) | Mobile (390) |
|-------------|----------------|--------------|
| Hero H1     | 56 to 72px     | 36 to 40px   |
| Section H2  | 64 to 96px     | 36 to 48px   |
| Card title  | 20 to 24px     | 18px         |
| Body        | 16px           | 15px         |
| Caption     | 12 to 13px     | 12px         |

Use `clamp()` for fluid sizes.

## 5. Spacing, Radius, Layout

- Container: max-width 1280px, horizontal padding 24px (mobile 16px).
- Section vertical spacing: 120px desktop, 72px mobile.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 120.
- Radius: pill buttons and inputs 9999px, cards 24px, large image cards 32px, small chips 12px.
- Breakpoints: mobile < 640, tablet 640 to 1023, desktop >= 1024.
- Design for mobile first.

## 6. Core Components

- **Button**: variants `primary` (filled cream or accent, dark text), `outline` (1px border, cream text),
  `ghost`. Pill shape. Sizes sm, md, lg. Optional trailing arrow icon.
  Hover: slight brightness change and arrow moves 4px right. Visible focus ring.
- **Container**: centered, max-width and padding as above.
- **SectionHeading**: heading with optional small description and optional right-side action button.
- **Card**: surface color, radius 24px, hairline border, optional hover lift.
- **IconButton**: circular 48px, outline, used for carousel arrows.
- **Input**: pill, surface background, inner submit icon button.
- **Navbar**: sticky, backdrop blur, transparent over hero.
- **Footer**.

## 7. Motion

- Easing: cubic-bezier(0.22, 1, 0.36, 1). Durations 300 to 700ms.
- Entry: fade-up (y: 24 to 0, opacity 0 to 1), stagger children 80 to 120ms.
- Scroll reveal: trigger once, at about 20% in view.
- Cards: hover lift of 6 to 8px, image zoom 1.05.
- Smooth scroll via lenis.
- Parallax: subtle only (max 40px travel).
- Respect `prefers-reduced-motion`: disable parallax and large transforms, keep simple fades.

## 8. Section Specs (top to bottom)

### 8.1 Navbar + Hero
- Navbar: logo left, nav links center, two small buttons right (outline + filled). Sticky with blur.
  Mobile: hamburger menu.
- Hero headline: "You deserve the most unique jewelry". Two pill buttons under it (one filled, one outline).
- Below hero: row of 3 info cards:
  1. Circular gemstone image with short text.
  2. "Design your own gemstone ring" card with button.
  3. "4.8K" reviews stat card.
- Mobile: cards stack vertically.

### 8.2 Shop Diamond by Shape
- Large heading "Shop Diamond by Shape" on left, small pill button on right.
- Horizontal row of diamond shape icons (round, emerald, cushion, pear, etc.) with labels.
- Selected shape ("Round") is larger and bright, others smaller and dimmed.
- Click changes selection with smooth scale transition. Icons are inline SVGs.
- Mobile: horizontal scroll.

### 8.3 Category View
- Oversized heading "Category View" overlapping the carousel image (z-index, negative margin).
- Swiper carousel: center slide large, side slides smaller and dimmed.
- Under active slide: category name and item count (e.g. "Necklaces, 210 items").
- Round left/right arrow buttons.
- Mobile: one slide visible.
- Data from an array, replaceable by API.

### 8.4 Our Works
- Small description on left, large heading "OUR WORKS".
- Row of 5 tall rounded cards with image and product name below.
- Center card larger and highlighted.
- Hover: lift and image zoom.
- Circular arrow button centered below.
- Mobile: horizontal scroll with snap.

### 8.5 New Collection
- Large right-aligned heading "NEW COLLECTION".
- Wide card: large rounded necklace image left, details right
  ("Introducing The ..." title, description, two small feature rows).
- Subtle parallax on image.
- Mobile: image on top, details below.

### 8.6 Watch on your hands
- Heading "Watch on your hands!" with a toggle/pill button on the right.
- Huge `[BRAND_NAME]` watermark text behind, taupe, low opacity.
- Hand image centered, overlapping the watermark.
- Centered paragraph below with small circular icon/emoji images inline between words.
- Paragraph reveals line by line on scroll.

### 8.7 Brands + Customer Experiences
- Brand strip: 4 to 5 placeholder logos, grayscale, low opacity, small star/diamond separators.
- "Customer Experiences": large heading, row of testimonial cards.
  Center cards fully visible, side cards blurred and dimmed.
  Each card: avatar, name, review text. Swiper with autoplay (pause on hover).

### 8.8 CTA + Footer
- CTA: large rounded card with dark image background, heading
  "Want to Design Your Own? Calm, we can do it!" and a pill button.
- Newsletter: heading "GET The Last Information From US", pill email input with inner arrow
  submit button, validation with success and error messages.
- Footer: small links row and copyright.

## 9. Images and Assets

- Use own product images. Use placeholders (neutral dark gradient or stock jewelry) until real ones are ready.
- Always use `next/image` with explicit sizes, WebP/AVIF, lazy loading below the fold.
- Every image has meaningful alt text. Decorative images use `alt=""`.
- Icons: inline SVG or lucide-react.

## 10. Data and Backend

- Components receive data via props, never fetch inside presentational components.
- Fetching happens in page or section containers.
- Every data section has three states: loading (skeleton), error (friendly message with retry),
  empty (clear empty state).
- Define TypeScript types for all API responses.
- Backend endpoints: `[LIST YOUR ENDPOINTS HERE]`

## 11. Accessibility

- Semantic HTML: header, nav, main, section, footer. One H1 per page.
- Keyboard navigable everywhere, visible focus rings.
- Carousels: arrow buttons have aria-labels, autoplay pauses on hover and focus.
- Color contrast at least 4.5:1 for text.
- Respect `prefers-reduced-motion`.

## 12. Performance

- Lazy-load below-the-fold sections and heavy libraries where possible.
- No layout shift: reserve image dimensions.
- Remove unused code and dependencies.
- Target Lighthouse: Performance 85+, Accessibility 95+.

## 13. Suggested File Structure

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    ui/        Button, Card, Container, SectionHeading, IconButton, Input
    layout/    Navbar, Footer
    sections/  Hero, ShapeSelector, CategoryCarousel, OurWorks,
               NewCollection, WatchOnHands, BrandsStrip, Testimonials,
               CtaBanner, Newsletter
  lib/         api.ts, types.ts, motion.ts
  data/        placeholder data (temporary)
```

## 14. Working Rules for the AI Agent

1. Read this file fully before every task.
2. Build one section at a time. Stop after each section and summarize changes.
3. Match the attached screenshot for layout, spacing, and proportions. Use the tokens above, never random colors or sizes.
4. Reuse existing components. Do not duplicate styles.
5. Do not touch backend code or unrelated files.
6. Always build responsive (390, 768, 1440).
7. Keep code typed, clean, and small. No inline magic numbers when a token exists.
8. If something in the screenshot conflicts with this file, follow the screenshot for layout and this file for tokens, and tell me about the conflict.