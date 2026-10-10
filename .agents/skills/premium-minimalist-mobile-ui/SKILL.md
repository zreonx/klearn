---
name: premium-minimalist-mobile-ui
description: Design and implement premium, minimalist, modern mobile app interfaces with clean layouts, refined typography, restrained colors, purposeful whitespace, subtle borders, and polished interactions. Use whenever creating, reviewing, or refactoring mobile app UI.
---

# Premium Minimalist Mobile UI Design Skill

## 1. Role and Objective

Act as a senior mobile product designer and frontend/mobile UI engineer specializing in premium, minimalist, production-quality mobile applications.

Your goal is to create interfaces that feel:

- Premium, refined, and intentional.
- Clean and visually calm without feeling empty.
- Modern and professional rather than generic or template-generated.
- Easy to understand, navigate, and use.
- Consistent across screens, states, and user journeys.
- Appropriate for real-world applications rather than concept mockups.

Prioritize usability, clarity, accessibility, consistency, and visual hierarchy over decoration.

**Core principle:** Every visual element must have a purpose. Remove anything that does not improve comprehension, usability, hierarchy, or brand identity.

## 2. Design Philosophy

Follow a premium minimalist design language inspired by modern productivity applications, thoughtfully designed fintech products, and contemporary mobile operating systems.

### Visual characteristics

- Clean, structured layouts.
- Strong typographic hierarchy.
- Generous but purposeful whitespace.
- Restrained and consistent color palettes.
- Subtle dividers and low-contrast borders.
- Flat or near-flat surfaces.
- Carefully balanced proportions.
- Consistent alignment and spacing.
- Small, meaningful animations.
- Clear and predictable interactions.

Avoid copying any specific application. Establish a distinct visual identity appropriate to the product.

## 3. Color System

Build a semantic color system instead of choosing colors independently for each component.

### Default light theme

- Background: soft neutral white or a very light warm/cool gray (`#FAFAFA` / `#F8FAFC`).
- Primary text: deep charcoal or near-black (`#0F172A` / `#111827`).
- Secondary text: muted neutral gray (`#64748B` / `#6B7280`).
- Primary accent: one carefully selected brand color.
- Borders: subtle neutral gray with sufficient visibility (`#E2E8F0` / `#E5E7EB`).
- Surfaces: white or very lightly differentiated neutral tones.
- Success, warning, error, and informational colors: reserved for meaningful statuses.

### Default dark theme

- Background: deep charcoal or dark neutral, not necessarily pure black (`#0B0F17` / `#0F172A`).
- Surfaces: slightly differentiated dark neutrals (`#151D2A`, `#1E293B`).
- Primary text: soft white (`#F8FAFC`).
- Secondary text: muted light gray (`#94A3B8`).
- Borders: subtle dark-theme separators (`#27354A`, `#1E293B`).
- Accent: a brand color that remains legible against dark surfaces.

### Color rules

1. Use one primary brand accent unless the product genuinely requires more.
2. Use neutral colors for most of the interface.
3. Use semantic colors consistently.
4. Do not apply the accent color to every button, icon, heading, or card.
5. Avoid unnecessary gradients, neon colors, and decorative color blobs.
6. Never rely on color alone to communicate status.
7. Verify contrast in both light and dark themes (minimum 4.5:1 for body text).
8. If an existing product already has brand colors, preserve them unless a redesign is explicitly requested.

Use design tokens rather than hardcoding colors throughout the application.

## 4. Typography

Typography should establish hierarchy without requiring excessive font sizes.

### Typographic scale & hierarchy

- **Display:** 32–40pt, bold/semi-bold. Reserved for hero headers or primary counters.
- **Heading:** 22–26pt, bold/semi-bold. Screen titles and major section headers.
- **Title:** 17–19pt, semi-bold. Card titles, modal headers, subsection headers.
- **Body Large:** 16–17pt, regular/medium. Primary readable content and high-importance labels.
- **Body:** 14–15pt, regular. Standard body copy, descriptions, input values.
- **Label:** 13–14pt, medium/semi-bold. Buttons, tabs, metadata tags, form labels.
- **Caption:** 11–12pt, regular/medium. Timestamps, secondary hints, helper text.

### Typography rules

1. Limit font weights to 2–3 per screen (e.g., regular, medium, semi-bold).
2. Maintain comfortable line-heights (1.4–1.6 for body copy).
3. Ensure crisp font rendering across iOS, Android, and Web platforms.
4. For non-Latin scripts (e.g. Korean / Hangul, Japanese, Chinese), ensure line heights accommodate extended character heights without clipping.
5. Do not use decorative display fonts for functional UI controls.

## 5. Spacing and Layout

Use a strict, consistent spacing scale based on multiples of 4 or 8:

```text
Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
```

### Layout guidelines

- **Screen Padding:** Standard horizontal screen padding of 16–20pt on mobile.
- **Card Padding:** 16–20pt for standard cards, 12–14pt for compact list items.
- **Section Spacing:** 24–32pt between major distinct sections.
- **Element Spacing:** 8–12pt between related items (title and description, icon and label).
- **Safe Area Insets & System Bars:**
  - Always handle dynamic system insets (status bars, camera notches/cutouts, gesture indicators, and Android 3-button navigation).
  - Never use hardcoded device heights or arbitrary fixed top/bottom coordinates (`top: 40`, `bottom: 0`).
  - Lift bottom navigation bars and pinned footers using dynamic insets: `height: 56 + bottomInset`, `paddingBottom: bottomInset`.
  - Ensure tab screens suppress duplicate framework headers (`headerShown: false`) and provide safe top padding (`Math.max(insets.top + 12, theme.spacing.xl)`).
  - Pinned bottom action bars (e.g. quiz action bars, flashcard rating bars) must pad above the system navigation area with `paddingBottom: Math.max(insets.bottom, theme.spacing.lg)`.
  - Content beneath pinned footers must have matching bottom padding so the final items are never clipped.
- **Max Content Width:** On tablets and web viewports, cap content container width (e.g., 480–640pt) to preserve readability and prevent stretched horizontal layouts.

## 6. Surfaces, Borders, and Elevation

Minimalist interfaces rely on subtle borders, surface tone differentiation, and refined radii rather than heavy drop shadows.

- **Borders:** Thin (1pt / hair-line), subtle contrast with the background.
- **Corner Radii:** Consistent scale:
  - `sm`: 6–8pt (badges, small tags, tooltips)
  - `md`: 10–12pt (buttons, input fields)
  - `lg`: 16–20pt (cards, dialogs, action sheets)
  - `full`: 9999pt (pill buttons, circular icons)
- **Elevation:** Flat or near-flat. If shadows are used, keep them soft, low-opacity, and with large blur radiuses.

## 7. Component Interaction & State Design

Every interactive primitive must provide clear, subtle feedback:

- **Touch Targets:** Minimum 44x44pt on iOS and 48x48pt on Android.
- **States:** Define Default, Pressed, Focused, Disabled, Loading, and Error states for all controls.
- **Buttons:**
  - One primary filled button per primary action view.
  - Secondary actions use outline, subtle surface, or ghost styling.
  - Avoid competing visual weights.
- **Feedback:** Subtle opacity shifts (`0.8` on press) or micro-scale transitions rather than sudden color inversions.
- **Loading & Empty States:** Design calm, informative empty states with clear calls-to-action rather than blank screens or generic spinners.

## 8. Implementation Checklist

When reviewing or building mobile UI:

- [ ] Does every component consume semantic tokens (`colors`, `spacing`, `radii`, `typography`)?
- [ ] Is there clear visual hierarchy on the screen at first glance?
- [ ] Is the primary call-to-action unambiguous?
- [ ] Are touch targets comfortable and accessible on real touchscreens?
- [ ] Does the UI handle light and dark themes gracefully?
- [ ] Are safe areas and keyboard interactions handled smoothly?
- [ ] Have unnecessary decorative lines, gradients, and heavy shadows been eliminated?
