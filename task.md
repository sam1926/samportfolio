# Videography Portfolio Checklist

Detailed step-by-step tasks for Claude Code to execute to build the premium Behance-style portfolio layout.

## Phase 1: Setup & Design System Foundation
- [ ] Initialize React project using Vite (`npx create-vite@latest . --template react`). Do this in the current directory if empty, or in a specific subfolder.
- [ ] Remove default boilerplate (App.css, default assets).
- [ ] Configure `index.css`:
    - Setup CSS variables: `--color-bg-black: #000000;`, `--color-bg-cream: #F5F5F0;`, `--color-neon-red: #FF3131;`
    - Apply global reset (`margin: 0; padding: 0; box-sizing: border-box;`).
    - Import Google Fonts: `Archivo Black` (Headdings), `Inter` (Body), `Roboto Mono` (Metadata).
    - Set base typography and a global `.grain-overlay` utility class for texture if desired.

## Phase 2: Core Components Construction
- [ ] **Navbar Component**: Minimalist fixed top nav. White text on black / black on cream depending on scroll, or a simple hidden hamburger menu.
- [ ] **Hero Section**: 
    - Full viewport height (`100vh`), black background.
    - Giant centralized glowing red text ("PORTFOLIO") using `Archivo Black`, uppercase with `text-shadow: 0 0 15px var(--color-neon-red)`.
    - Corner positioning for small monospaced metadata (e.g., Name top-left, Year bottom-right).
- [ ] **About / Profile Section**:
    - Cream background.
    - Split-screen flex/grid layout (50/50). Left: Large portrait image. Right: Clean `Inter` body typography describing the creator.
- [ ] **Category Headers**: Solid black background with full-width glowing red titles (e.g., "COMMERCIALS", "MUSIC VIDEOS").
- [ ] **Project Grid Section**:
    - High-contrast black background.
    - 3-column CSS Grid.
    - Sharp corners for all images (`border-radius: 0`).
    - Tight gutters (gap: `8px` to `12px`).
- [ ] **Footer Section**:
    - Cream background.
    - Table-like layout using thin 1px black borders (`border-top: 1px solid #000`, etc.) to separate contact fields (Email, Instagram, Phone).

## Phase 3: Assembly & Polish
- [ ] Assemble the page in `App.jsx`, ensuring alternating color themes (Black -> Cream -> Black -> Cream).
- [ ] Implement hover effects on project grid (e.g., images transition from grayscale to full color, or slight scaling).
- [ ] Ensure mobile responsiveness:
    - Stack split-screens to single columns.
    - Change 3-column grid to 1-column on mobile strings.
    - Scale down the giant hero typography to fit viewport width.
