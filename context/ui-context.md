# UI Context

## Theme

Light mode default (warm paper aesthetic). The visual language is an editorial, trustworthy, and organic community directory—featuring warm paper backgrounds, clean structured grid cards, and distinctive accent highlights for key elements.

All colors are defined as CSS custom properties in `app.css`. Components must utilize these variables instead of hardcoded hex values to preserve theme mapping.

| Role                       | CSS Variable    | Hex / Value                       |
| -------------------------- | --------------- | --------------------------------- |
| Canvas Background          | `--bg`          | `#f4efe3` (warm light grey)       |
| Card/Sheet Background      | `--paper`       | `#fbf7ec` (off-white paper)       |
| Input Surface              | `--surface`     | `#ffffff` (pure white)            |
| Primary Ink / Typography   | `--ink`         | `#1c1a16` (near-black)            |
| Secondary Typography       | `--ink-2`       | `#3c3830` (dark charcoal)         |
| Muted Text                 | `--muted`       | `#7a7264` (stone grey)            |
| Primary Borders / Dividers | `--line`        | `#e3dccc` (light cream/tan)       |
| Secondary Borders          | `--line-2`      | `#d4cbb7` (subtle tan)            |
| Brand Accent               | `--accent`      | `#b54a2c` (terracotta orange)     |
| Brand Accent Ink           | `--accent-ink`  | `#7a2e18` (deep rust brown)       |
| Brand Soft Fill            | `--accent-soft` | `#f2d9cb` (pale terracotta cream) |
| HDB Approved Base          | `--hdb`         | `#4a6b4f` (sage green)            |
| HDB Approved Soft Fill     | `--hdb-soft`    | `#dbe6dc` (pale sage tint)        |

---

## Typography

The typography leans on editorial contrast, combining an elegant serif for content focus headings and a crisp, functional sans-serif for structured text and UI layouts.

| Role                    | Font Style                     | CSS Variable   |
| ----------------------- | ------------------------------ | -------------- |
| Heading / Editorial     | Newsreader, Georgia, serif     | `var(--serif)` |
| UI Controls / Body Text | DM Sans, system-ui, sans-serif | `var(--sans)`  |

- **Base Configuration:** The global `body` applies `var(--sans)` at a standard size of `15px` with a line-height of `1.5` and `-webkit-font-smoothing: antialiased`.
- **Editorial Emphasis:** Large thematic text headings use the class `.serif` accompanied by a medium weight (`500`) and a tight letter-spacing of `-0.01em`.

---

## Border Radius

Consistent corner rounding dictates layout hierarchy and helps define the visual boundaries of interactive panels.

| Context                  | Class / Value     | Description                                             |
| ------------------------ | ----------------- | ------------------------------------------------------- |
| Fine UI / Small Targets  | `--r-sm` (`6px`)  | Switches, indicators, or internal elements.             |
| Form Fields / Sub-panels | `--r-md` (`10px`) | Input bounding fields, tooltips, toggle boxes.          |
| Components / Outer Cards | `--r-lg` (`16px`) | Grid listing cards, main filter blocks, modal overlays. |

---

## Component Layouts & Interaction States

### Listing Cards (Dogs, Welfare Groups, Blog Posts)

- **Visual Styling:** Built using `.card`, `.group-card`, or `.post-card`. Utilizes `--paper` for internal fill on top of a standard `--line` border, framed with an outer layout radius of `var(--r-lg)`.
- **Hover State Behaviors:** Active card hovering applies a clean micro-interaction translation (`translateY(-2px)` or `translateY(-3px)`), a structural bounding drop shadow, and darkens borders toward `--line-2`.

### Directory Layout & Filter Architecture

- **Layout Matrix:** Operates on a standard two-column system via `.layout` with a fixed filter utility drawer on the left side (`280px`) and a flexible, responsive data grid stream container on the right.
- **Sticky Positioning:** The filter module features `.filters` pinned statically (`top: 96px`) to ensure accessibility remains constant during deep browsing scrolls.
- **Segmented Controls:** Group buttons employ `.seg` blocks with an `aria-pressed="true"` layer that dynamically shifts active buttons instantly to `--ink` fills to reverse contrast readability.

### Interaction Overlays & Action Sheets

- **Detail Drawers & Overlays:** The slide-out dynamic canvas sheet handles large data structures on a layered overlay (`.modal-backdrop`). The interactive presentation card loads gracefully utilizing transition values (`.modal-sheet` sliding left-to-right at `.28s cubic-bezier(.2,.7,.2,1)`).
- **Lightbox Experience:** Gallery modules switch to a heavy high-contrast light focus shroud (`rgba(18, 16, 12, 0.78)`) with a blur factor filter background (`backdrop-filter: blur(6px)`) to properly showcase dynamic pet image content previews without visual distraction.

---

## Icons

Lucide React handles inline illustrative elements. SVGs across menus, forms, and cards adjust dimensions contextually to respect design boundaries.

- **Inline Text Metadata Icons:** `w-3 h-3` or `w-4 h-4` (e.g., gender symbols, tiny location glyphs inside detail grid rows).
- **Button Interfaces / Status Flags:** `w-4 h-4` up to `w-5 h-5` (used on action bars, tooltips, and dynamic cross buttons).
- **Large Hero Structural States:** `w-14 h-14` or `w-16 h-16` (used inside high-contrast center states like empty queries or upload fields).
