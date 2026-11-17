# Handoff: Valued Crown Technologies — Marketing Website (Homepage v2)

## Overview
Premium marketing website for **Valued Crown Technologies**, a company that builds business software products (accounting, inventory, POS, HR/payroll, hospital management). This bundle covers the **homepage** in full. Product detail (`/products/[slug]`), Products index, About and Contact pages are to be built from the same system (see "Pages to build next").

Target stack (from client brief): **Next.js 14 App Router, TypeScript, Tailwind CSS, GSAP + ScrollTrigger, Framer Motion (route transitions / menu), Lenis, Lucide React, react-hook-form + zod.**

## About the Design Files
`Valued Crown Home v2.dc.html` is a **design reference built in HTML** — a working prototype showing the intended look, copy, layout and motion. It is **not production code to copy**. Recreate it in Next.js using proper components, Tailwind tokens and GSAP/ScrollTrigger. The prototype uses a hand-rolled rAF scroll loop; in production, map each effect to a ScrollTrigger (mapping table below). Open the file in a browser to see all behaviour.

## Fidelity
**High-fidelity.** Final colours, typography, spacing, copy and motion. Recreate pixel-accurately. All product names (Tally, Shelf, Till, Roster, Ward), statistics, client logos, testimonial attributions, photos, email/phone are **placeholders** — keep them clearly marked and data-driven so the client can replace them.

## Hard art-direction rules (client requirements)
- **No gradients anywhere** (no linear/radial/mesh, no gradient masks/fades).
- No glassmorphism, no glows, no floating shapes, no network/node patterns.
- **Square corners** on all UI (radius 0). Only exception: the phone device frame (26px).
- Solid colour fields, 1px hairlines, restrained shadows only on product screenshots.
- No purple/blue "AI SaaS" treatments. One accent: crown orange.

## Design Tokens

### Colours
| Token | Hex | Use |
|---|---|---|
| `ink` | `#041433` | Brand navy. Dark sections, primary buttons, text on light |
| `paper` | `#F2F1EC` | Default page background; text on ink |
| `accent` | `#F5A524` | Crown orange (from logo). Accent squares, CTA/Industries section bg, progress bars, cursor |
| `white` | `#FFFFFF` | Product panels, UI mockups, mega menu |
| `ink-2` | `#0A1E45` | Alternate plate shade (industries image placeholders) |
| `slate` | `#5B6B8A` | Secondary text inside UI mockups |
| `slate-2` | `#3A4660` | Tertiary text in mockups |
| `grey` | `#8A93A6` | Neutral data-viz colour |
| `line` | `#E3E4E8` | Hairlines inside mockups / mega menu |
| `amber-text` | `#B06F0A` | Warning text in mockups (low stock, variance) |

Section hairlines use `color-mix(in srgb, currentColor 18%, transparent)` so they adapt to the active theme. Muted text uses `opacity: .62–.68` on currentColor.

**Section themes** (root background + text colour animate between these):
- `paper`: bg `#F2F1EC`, fg `#041433`
- `ink`: bg `#041433`, fg `#F2F1EC`
- `accent`: bg `#F5A524`, fg `#041433`

### Typography
- **Display:** Cabinet Grotesk (Fontshare) — weights 500, 700, 800. Load via `next/font/local` (download from fontshare.com, free licence) or the Fontshare CSS.
- **Body/UI:** Switzer (Fontshare) — 300, 400, 500, 600.
- **Labels/data:** Geist Mono (Google / `geist` package) — 400, 500.

| Role | Font | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Hero H1 | Cabinet | `clamp(58px, 12.4vw, 224px)` | 800 | .84 | -0.062em |
| CTA H2 | Cabinet | `clamp(56px, 11.6vw, 212px)` | 800 | .84 | -0.065em |
| Section H2 | Cabinet | `clamp(48px, 7vw, 128px)` | 800 | .86 | -0.06em |
| Products intro H2 | Cabinet | `clamp(56px, 7.6vw, 140px)` | 800 | .86 | -0.06em |
| Product name (panel) | Cabinet | `clamp(72px, 9vw, 168px)` | 800 | .82 | -0.065em |
| Process step number | Cabinet | `clamp(120px, 22vw, 380px)` | 800 | .72 | -0.08em |
| Process step title | Cabinet | `clamp(40px, 4.6vw, 84px)` | 800 | .9 | -0.055em |
| Stat number | Cabinet | `clamp(76px, 8.4vw, 150px)` | 800 | .8 | -0.065em |
| Manifesto / quotes | Cabinet | `clamp(32px, 4.5vw, 76–80px)` | 500 | 1.02 | -0.035/-0.04em |
| Solutions row title | Cabinet | `clamp(28px, 3.6vw, 62px)` | 700 | 1 | -0.045em |
| Industries list item | Cabinet | `clamp(34px, 4.4vw, 80px)` | 800 | .98 | -0.055em |
| Footer wordmark | Cabinet | `clamp(60px, 15.8vw, 300px)` | 800 | .8 | -0.07em |
| Lead paragraph | Switzer | `clamp(17px, 1.3vw, 20px)` | 400 | 1.5 | 0 |
| Body | Switzer | 15–16px | 400 | 1.55 | 0 |
| Nav / buttons | Switzer | 14–15px | 500 | 20px | 0 |
| Mono label | Geist Mono | 11px | 400 | — | 0.08em, UPPERCASE |

Section labels follow the pattern `(0N) Label` in mono.

### Spacing / layout
- Horizontal page padding: `clamp(20px, 3.2vw, 48px)`. Full-bleed width (no max-width container) — editorial feel.
- Section vertical padding: `clamp(100px, 12vw, 180px)` typical; hero top `clamp(108px, 12vw, 150px)`.
- Header height 72px.
- Gaps: 8 (button groups), 20–24 (small), `clamp(24px,4vw,64px)` (columns), `clamp(48px,6vw,88px)` (heading → content).
- Buttons: height 56px (hero) / 60px (CTA) / 44px (header, panels); padding 0 24–26px; radius 0.

### Shadows
- Product mockups: `0 30px 60px rgba(4,20,51,.18)`; hero window `0 40px 80px rgba(0,0,0,.35)`; mega menu `0 30px 60px rgba(4,20,51,.12)`.

### Easing
- Standard: `cubic-bezier(0.22, 1, 0.36, 1)` (GSAP: `power3.out`-ish / CustomEase)
- Expo reveals: `cubic-bezier(0.16, 1, 0.3, 1)` (GSAP `expo.out`)
- Curtains/wipes: `cubic-bezier(0.76, 0, 0.24, 1)` (GSAP `power4.inOut`)

## Global Components & Behaviour

### Preloader (`<Preloader/>`)
Fixed, z 400. Five full-height ink columns side by side. Overlay UI: top mono row ("Valued Crown Technologies" / "Loading the suite"), centred logo lockup (max 320px / 64vw), bottom-left counter in Cabinet 800 `clamp(64px,10vw,160px)` counting `000→100` over 1.6s (ease-out cubic). On complete: UI fades (.5s), columns translate Y `-101%`, staggered 70ms starting 120ms, 1.1s `power4.inOut`. Hero reveals start 450ms after exit. Hard fallback: force exit at 2.8s. Skip when `prefers-reduced-motion`. Show once per session (sessionStorage) in production.

### Theme engine
Each `<section data-theme="paper|ink|accent">`. The section crossing 50% viewport height sets the root `background-color` and `color` (0.9s transition, standard easing). All section text uses `currentColor`, so the colour change is one continuous transition. In production: one ScrollTrigger per section, `start: "top 50%"`, `end: "bottom 50%"`, `onToggle` → set CSS vars on `<body>`.

### Header (`<SiteHeader/>`)
Fixed, 72px. Transparent at top; after 40px scroll its bg = current theme bg. 1px bottom hairline (currentColor, 14% opacity). Hides (`translateY(-100%)`, .8s) on scroll down past 200px; shows on scroll up. Never hides while the mega menu or mobile menu is open.
- Left: logo lockup PNG (26px tall) on a solid ink block 44px tall, padding 0 16px.
- Centre (≥1024px): Home, Products, Solutions, Industries, About us, Contact. 14px/500, gap 34px. **Roll hover:** each label is duplicated in a 20px-tall overflow-hidden box; on hover the inner stack translates -50% (.55s).
- Products hover opens the **mega menu**: full-width white panel under the header, 5 equal columns with 1px `#E3E4E8` dividers: `0N — Category` mono, product name Cabinet 800 34px, tagline 14px. Reveal: `clip-path inset(0 0 100% 0) → inset(0)` .7s `power4.inOut`. Row hover bg `#F2F1EC`. An orange 5px dot appears beside "Products" while it's open.
- Right: "Request a demo" — ink bg, paper text, 8px orange square, roll text, magnetic.
- <1024px: "Menu" outline button opens the mobile menu.

### Mobile menu
Fixed full-screen ink panel. Clip-path wipe down (.9s `power4.inOut`). Links in Cabinet 800 `clamp(40px,12vw,76px)`, each separated by a 1px hairline (paper 14%), index number in orange mono on the right. Links slide up from 110%, staggered 55ms after 300ms. Lenis stopped while open. Bottom: email (placeholder).

### Cursor (desktop, `(hover:hover) and (pointer:fine)` only)
A 10px orange circle that follows the pointer (lerp .2). Over links/buttons it grows to 34px; over `[data-cursor-label]` areas (hero plate "Crown Suite", product panels "View") it grows to 88px and shows the label in 10px mono ink. Size transition .5s. Keep the native cursor (the prototype doesn't hide it).

### Magnetic buttons
Primary CTAs translate toward the pointer: x × .18, y × .30 of the offset from centre; return with .9s ease on leave.

### Smooth scroll
Lenis `lerp: 0.08`. Wire it to GSAP: `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t*1000))`; `gsap.ticker.lagSmoothing(0)`. Anchor links use `lenis.scrollTo(target, {duration: 1.8})`.

### Text reveal (`<SplitText/>`)
Headings marked as split: each line sits in an overflow-hidden wrapper (padding-bottom .1em / margin-bottom -.1em to protect descenders). Each line is split into characters, kept as nowrap word groups. Start state `translateY(108%) rotate(4deg)`; animate to none, 1.25s `expo.out`, stagger 16ms per char across the heading. Triggered on entering the viewport (threshold .1). Use GSAP SplitText (now free) or a custom splitter; revert on unmount.

### Generic reveal (`<Reveal/>`)
opacity 0 → 1 (1.1s) + translateY 30px → 0 (1.3s `expo.out`), optional `delay` prop in ms.

### Counter (`<Counter/>`)
Counts 0 → value over 2.2s, easeOutExpo, on viewport entry. Keeps the suffix (`+`).

### Reduced motion
Disable the preloader, splits, reveals, parallax, plate clip, horizontal scrub (fall back to the vertical stack), stacking scale, manifesto dimming (all words at full opacity) and Lenis.

## Homepage Sections (in order)

### 01 Hero — theme `paper`
- Mono meta row with a bottom hairline: `(01) Valued Crown Technologies` · `Business software — designed, built & supported in-house` (62%) · `Scroll ↓` (62%).
- H1, 3 lines: "Software" / "for the way" (indented `max(0px, calc(25vw - 60px))`) / "you trade" followed by a solid orange square .17em as the full stop. On scroll the H1 block translates Y at `scrollY * 0.22` (parallax drift).
- Row (flex-wrap): lead paragraph (max 430px) · two buttons: **Explore our products →** (ink fill, orange arrow) and **Request a demo** (1px outline) · product index list (max 360px) with 5 rows `0N | Name | Category`, top hairlines; on hover a row's left padding grows by 10px.
- **Hero plate:** full-bleed navy block, height `min(86vh, 56vw)` desktop / 70vw tablet / 108vw mobile. Contains: caption "Fig. 01 — Crown Suite overview · UI mockup, replace with screenshot" (mono, 55% paper); a white app window (left 6vw, top 14%, width 64vw) showing the Crown Suite overview: a sidebar on paper bg with modules, 4 KPI cells separated by hairlines, an hourly sales bar chart (ink/grey, one orange bar), a branches table; plus a phone mockup (Till, desktop only) at right 6vw.
  - **Scroll effect:** the plate's clip-path goes from `inset(0 max(pagePad, 8vw))` to `inset(0)` as the plate travels from 95% to 15% of the viewport (ease-out quad), so it grows to full bleed. Inner content scales 1.08 → 1 and drifts Y at a factor of -0.12. The phone drifts Y at a factor of 0.18 (separate depth). In production: a ScrollTrigger with `scrub: true`.

### 02 Our position (manifesto) — theme `ink`, id `about`
- Left label `(02) Our position` (220px column). Right: a large statement in Cabinet 500. **Scroll-linked word highlight:** every word starts at opacity .16 and goes to 1 in order as the paragraph scrolls (progress from para top at 85%vh across height + 35%vh). ScrollTrigger scrub on a word stagger.
- Copy: "We don't resell software we bought. We write it, install it on your floor, sit with your cashiers on day one — and pick up the phone when something breaks, because we're the ones who built it."
- 3-column facts below a top hairline: A Designed in-house / B Installed on-site / C Supported by the authors (orange mono letter, 20px title, 15px body at 64%).

### 03 Products — theme `ink`, id `products` — **pinned horizontal scroll** (≥900px)
- Wrapper height = `trackWidth − 100vw + 100vh`; inner is sticky at 100vh; the track translates X by `-progress × (trackWidth − vw)`. Orange 3px progress bar at the bottom (scaleX = progress). Production: ScrollTrigger `pin` + `scrub`, or sticky + scrub as in the prototype.
- Track: padding 0 4vw, gap 20px. Intro panel (min(34vw,520px)): label `(03) The product line`, H2 "Five / products. / One system." (last line orange), paragraph.
- 5 product panels, each `min(88vw,1360px)` × `calc(100vh − 120px)`, 2-column grid (1fr / 1.1fr), padding `clamp(22px,2.6vw,40px)`:
  - Left: `0N / 05` + category (mono) · big name · tagline (20–26px/500) · 4 feature rows with hairlines and a `+` · industries line + **Learn more →** (filled in panel fg) / **Request demo** (outline).
  - Right: a white UI mockup (max 560px, shadow) with a chrome bar `name.valuedcrown.app` / `UI MOCKUP`. Mockup parallax: translateX = (panel centre − viewport centre) × -0.08.
  - Panel colours: Tally `#FFFFFF`/ink · Shelf `#F5A524`/ink · Till `#041433`/paper with a 1px inset paper-20% edge · Roster `#F2F1EC`/ink · Ward `#FFFFFF`/ink.
  - Mockups: Tally = invoice INV-2041 with line items, total, "matched to bank feed" · Shelf = stock table with level bars (low stock in orange) · Till = POS tile grid + cart + orange "Charge" · Roster = weekly shift grid (ink = day, grey = night, orange = leave) · Ward = patient chart with vitals grid + timeline.
- <900px: no pinning; the track becomes a vertical stack, panels full-width with auto height, single column.

### 04 Solutions — theme `paper`, id `solutions`
- H2 "Eight problems / we solve daily." + note on the right.
- 8 full-width rows (top hairlines, bottom hairline on the list). Desktop grid `60px | 1.5fr | 1fr | 140px`: index · title (Cabinet 700) · description · product tag `PRODUCT ↗` aligned right. Below 1024px: `40px | 1fr`, with description and tag in column 2 (`grid-column: 2 / -1`).
- **Hover:** other rows fade to .32; the active title shifts right 12px and grows a .32em orange square before it (width transition .5s). A **cursor-following preview** (360×250, fixed, lerp .1, slight rotation by velocity) shows that solution's mini screen: solid panel colour, product name, a white card with a metric and a 10-bar chart. Swap between previews: clip-path `inset(100% 0 0 0) → inset(0)` .6s. Desktop/hover devices only.
- Rows: Financial management (Tally) · Inventory & warehousing (Shelf) · Sales & transactions (Till) · People & payroll (Roster) · Patient & clinical (Ward) · Customer relationships (Till + Tally) · Workflow automation (Crown Suite) · Analytics & reporting (Crown Suite). Copy is in the prototype.

### 05 Industries — theme `accent` (orange), id `industries`
- Mono header row with a full-opacity bottom line: `(05) Industries we serve` / `Select an industry`.
- Left: 8 industries as large Cabinet 800 buttons (hover or click selects). Inactive at opacity .34; active at 1 and shifted 14px right.
- Right: a 4:3 image plate (photo placeholders stacked; the active one revealed with clip-path `inset(0 0 100% 0) → inset(0)` 1s `power4.inOut`), then a description (19–23px/500) and "PRODUCTS USED" chips (ink bg, paper text, square). The text crossfades with a 14px Y offset.
- Industries: Hospitality, Retail & supermarkets (default), Healthcare, Manufacturing, Education, Financial services, Logistics & distribution, Enterprise. Copy and product mappings are in the prototype.

### 06 Numbers + Clients — theme `paper`
- Mono header with a "Placeholder figures" note. 5-column auto-fit grid (min 230px), top full line, row hairlines: index · count-up number · label. Values (placeholders): 5 products, 120+ businesses, 8 industries, 10+ years, 4 countries.
- Client grid: 8 cells, auto-fill min 220px, hairline grid, cell height `clamp(96px,9vw,140px)`. Text "Client 0N" at 55%; hover fills the cell ink with paper text at 100%. Replace with real SVG logos (monochrome currentColor).

### 07 How we work — theme `paper` — **stacking panels**
- H2 "From first visit / to go-live." + label.
- 5 steps, each `position: sticky; top: 0; height: 100vh; padding: 72px 12–24px 12–24px`. As the next panel slides over, the current inner card scales 1 → .93, moves -2% Y and darkens (brightness 1 → .75), scrubbed.
- Card: top row `Step 0N / 05` + duration · huge step number bottom-left · right column: title, body, 3 deliverables with orange 7px squares and hairlines.
- Colours: 01 white · 02 ink · 03 orange · 04 paper (+ink 16% edge) · 05 ink.
- Steps: Sit in (Week 1) · Scope (Week 2) · Configure (Weeks 3–4) · Train (Week 5) · Run & refine (Ongoing). Copy is in the prototype.

### 08 Testimonials — theme `ink`
- Mono header ("Placeholder testimonials"). A single large quote (Cabinet 500 `clamp(32px,4.6vw,80px)`) with an orange opening mark; caption: 56px square avatar placeholder, `[Customer name]`, `[Position], [Company] — uses Product`.
- Quotes stacked in one grid cell; the active one at opacity 1, the others offset ±30px Y. Transition .7s/1s.
- Controls: `0N / 04` counter · a hairline progress track with an orange fill running 7s linear (autoplay) · ← → 52px square outline buttons (hover: paper fill, ink text). Manual navigation resets the timer.

### 09 CTA — theme `accent`, id `contact`
- Label `(09) Start a conversation`. H2 "Let's build a / smarter way (indented) / to work." split-reveal.
- A full-opacity top line, then a paragraph (18px/500, max 440) and buttons: **Explore our products →** (ink fill) · **Talk to our team** (ink outline, mailto).

### 10 Footer — explicit ink bg
- Logo lockup 210px, description, newsletter (an email input with only a paper bottom border, 17px; orange "Subscribe →" text button; shows "Subscribed" on submit).
- 4 link columns (Products / Solutions / Industries / Company): mono heading with a hairline, links with roll hover (the second copy is orange).
- Giant wordmark "Valued Crown" + orange square, overflow hidden; rises from translateY(70%) to 0 as it enters (scrub).
- Legal row: © 2026 Valued Crown Technologies. All rights reserved. · Privacy policy · Terms & conditions · socials.

## Effect → GSAP mapping
| Prototype effect | Production |
|---|---|
| Theme switch | ScrollTrigger per section `onToggle` → CSS vars on body |
| Hero plate clip/scale | `gsap.fromTo(plate,{clipPath:'inset(0 8vw)'},{clipPath:'inset(0 0vw)',scrollTrigger:{scrub:true,start:'top 95%',end:'top 15%'}})` |
| Manifesto words | SplitText words, `gsap.to(words,{opacity:1,stagger:.1,scrollTrigger:{scrub:true}})` |
| Products horizontal | `pin:true, scrub:1, end: () => '+=' + (track.scrollWidth - innerWidth)`; mockup parallax via `containerAnimation` |
| Stacking steps | per panel `scrub` tween on the previous card: scale .93, filter brightness(.75) |
| Footer wordmark | `from yPercent:70, scrub` |
| Splits/reveals/counters | ScrollTrigger `once:true` + timelines |
Use `gsap.context()` in `useLayoutEffect`/`useGSAP` and revert on unmount. Use `ScrollTrigger.matchMedia` for the ≥900 / ≥1024 / reduced-motion branches.

## State
- `menuOpen`, `megaOpen` (header) · `activeSolution` (-1 = none) · `activeIndustry` (default 1) · `activeQuote` + autoplay timer · newsletter `submitted`.
- Content from typed data: `/data/products.ts` (slug, name, category, tagline, description, features[], industries[], images[], colours {bg, fg, line}), `/data/solutions.ts`, `/data/industries.ts`, `/data/testimonials.ts`, `/data/steps.ts`, `/data/stats.ts`. Copy for each is in the prototype's `renderVals()`.

## Pages to build next (same system)
- **/products** — index: list version of the horizontal panels (vertical, alternating panel colours).
- **/products/[slug]** — product hero in the product's panel colour, overview, features, screenshots (reuse the plate clip effect), how it works (stacking panels), benefits, supported industries, related products, FAQ accordion (hairline rows, height + rotate-icon animation), demo CTA (accent theme).
- **/about**, **/contact** — contact form with react-hook-form + zod (name, company, email, phone, product interest, message) posting to `app/api/contact/route.ts` (stub).
- Route transitions: a five-column ink curtain (same as the preloader), 0.6s in / 0.6s out.

## Assets
- `assets/logo-lockup.png` — full "VC + { VALUED CROWN TECHNOLOGIES }" lockup, white on transparent (extracted from the client's navy JPG; not redrawn).
- `assets/logo-mark.png` — the VC + crown mark, transparent (favicon / small uses).
- Original client logo: `uploads/…JPG` (navy background).
- Fonts: Cabinet Grotesk and Switzer (fontshare.com, free licence), Geist Mono (Google Fonts / `geist`).
- All photos, screenshots and client logos are placeholders — mockups are built in HTML and should become real product screenshots (`next/image`, lazy below the fold).

## Files
- `Valued Crown Home v2.dc.html` — the final homepage prototype (open in a browser). Template = markup and inline styles; the logic class at the bottom holds all content data and the motion engine.
- `assets/` — logo files.
