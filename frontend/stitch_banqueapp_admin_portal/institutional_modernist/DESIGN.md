---
name: Institutional Modernist
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#45464d'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#191c1e'
  on-tertiary-container: '#818486'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 32px
  gutter: 24px
  card-gap: 24px
  section-margin: 48px
---

## Brand & Style

The design system is engineered for a high-trust fintech environment where precision, clarity, and reliability are paramount. It follows a **Corporate Modern** aesthetic, blending the structural integrity of traditional banking with the fluidity of contemporary SaaS. 

The visual language emphasizes a "Premium Utility" feel—achieved through generous whitespace, meticulous typographic hierarchy, and a restrained use of depth. The emotional response should be one of calm control and absolute professional competence. There are no decorative elements without functional purpose; the interface serves as a quiet, sophisticated frame for complex financial data.

## Colors

The palette is anchored by "Deep Slate Blue," providing a sense of historical institutional stability. 

- **Primary:** Used for high-emphasis actions, navigation backgrounds, and active states.
- **Secondary:** Reserved for supporting text, icons, and non-critical interactive elements.
- **Backgrounds:** A tiered system of white and ultra-light grays to separate the dashboard surface from content cards.
- **Status Colors:** These are critical for the administration UX. Each status color must include a "Surface" variant (10-15% opacity) for badge backgrounds and a "Content" variant (100% opacity) for text and iconography to ensure AA/AAA accessibility.
- **Dark Mode:** While the default is light, the tokens are mapped to allow a semantic flip where surfaces become deeper slates and text moves to high-contrast whites.

## Typography

This design system utilizes **Inter** for its neutral, systematic character and exceptional legibility at small sizes. 

- **Hierarchy:** Use `Display` and `Headline` roles for dashboard overviews and page titles.
- **Data Display:** For transaction IDs, IBANs, and currency amounts, a secondary monospaced font (JetBrains Mono) is introduced to ensure character alignment and prevent "number jumping" during data refreshes.
- **Labels:** Small, all-caps labels with slight letter spacing are used for table headers and form input titles to distinguish them from user-generated content.
- **Weight:** Stick to 400 (Regular) for prose and 600 (Semibold) for interactive elements and emphasis. 700 (Bold) is reserved only for the highest level displays.

## Layout & Spacing

The layout utilizes a **Fixed-Fluid Hybrid Grid**. Content is housed in a centered container with a max-width of 1440px for desktop views, ensuring that data-heavy tables do not become unreadable on ultra-wide monitors.

- **Grid:** 12-column system on desktop, 8-column on tablet, and 4-column on mobile.
- **Rhythm:** An 8px linear scale (4, 8, 16, 24, 32, 48, 64) governs all padding and margins to maintain a strict visual cadence.
- **Dashboard Structure:** A persistent left-hand sidebar (280px) provides primary navigation, while the main content area utilizes "Surface" layering to group related financial metrics.

## Elevation & Depth

Hierarchy is communicated through **Tonal Layering** and **Soft Ambient Shadows**. 

- **Level 0 (Base):** The canvas color (`#F8FAFC`).
- **Level 1 (Cards):** White surfaces with a 1px border (`#E2E8F0`) and a very soft, diffused shadow (0px 4px 6px -1px rgba(0,0,0,0.05)).
- **Level 2 (Modals/Popovers):** Higher elevation with a more pronounced shadow (0px 20px 25px -5px rgba(0,0,0,0.1)) to indicate temporary interaction.
- **Interactive States:** Buttons and clickable cards do not use heavy "lifting" shadows; instead, they use a subtle scale-down (98%) or a slight darkening of the border color to signify a press.

## Shapes

The design system employs a **Rounded** shape language to soften the density of financial data.

- **Cards & Containers:** Use a 12px (`rounded-lg`) or 16px (`rounded-xl`) radius to create a contemporary, approachable frame for content.
- **Buttons & Inputs:** Set at 8px (`rounded-md`) to maintain a professional, slightly more structured appearance compared to the larger outer containers.
- **Status Badges:** These are strictly "Full Pill" (999px) to immediately distinguish them from buttons or other square UI elements.

## Components

### Buttons
- **Primary:** Solid Deep Blue background, white text. No gradient.
- **Secondary:** Ghost style with a 1px Slate border.
- **Tertiary/Ghost:** No border or background unless hovered. Use for low-priority actions in tables.

### Data Tables
- **Header:** Slate-50 background, uppercase `label-md` typography.
- **Rows:** 1px bottom border only. On hover, the entire row should take a subtle tint (`#F1F5F9`).
- **Alignment:** Numbers and currencies must be right-aligned; text should be left-aligned.

### Status Badges
- **Paid/Success:** Soft Green background (10% opacity), Dark Green text.
- **Pending/Warning:** Soft Amber background (10% opacity), Dark Amber text.
- **Rejected/Error:** Soft Red background (10% opacity), Dark Red text.

### Form Inputs
- **State:** Default border is 1px Light Gray. On focus, the border transitions to Primary Blue with a 3px "focus-ring" (Primary Blue at 10% opacity).
- **Validation:** Clear error text below the input in `body-sm` red.

### Navigation
- **Sidebar:** Dark background (Primary) with high-contrast active states. Active menu items should feature a vertical "indicator bar" on the far left or right to signify the current location.