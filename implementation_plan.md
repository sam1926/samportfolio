# Videography Portfolio Implementation Plan

This document outlines the architectural and design plan to replicate the premium, high-contrast Behance videography portfolio (Duy Anh Nguyễn style). This plan is intended to be handed over to Claude Code for execution.

## Goal Description
Build a striking, highly visual web portfolio utilizing a minimalist but loud aesthetic. The design relies heavily on stark contrasts (Deep Black vs. Soft Cream), ultra-bold glowing neon typography, sharp geometric grids, and a brutalist/architectural structure. We will implement this as a single-page React application using Vite and Vanilla CSS.

## Project Context for Claude
**To Claude:** You are building a *Videography Portfolio* inspired by a premium Behance aesthetic. 
The portfolio must highlight the videographer's work across categories like "COMMERCIALS" and "MUSIC VIDEOS". The vibe is high-end, dark, moody, and highly professional. The structural elements (black/cream backgrounds, neon red glowing text, sharp images) are critical to conveying this specific videography aesthetic. Give special attention to realistic videography placeholder text (e.g., "Director of Photography", "Brand Campaigns", "2024 Demo Reel", "Short Films") so the design feels authentic immediately.

## User Review Required
> [!IMPORTANT]
> **Aesthetic Approval Needed:** The proposed design uses `Archivo Black` for headers with a strong red neon glow (`#FF3131`), sharp edges (`border-radius: 0`), and a strict black/cream alternating background strategy. Please confirm if this matches your vision before Claude begins implementation.

## Proposed Changes

### Configuration & Global Setup
#### [NEW] `index.css`
Will define the entire design system via CSS variables to ensure strict aesthetic enforcement.
*   **Colors**: `--bg-dark: #000;`, `--bg-light: #F5F5F0;`, `--accent-neon: #FF3131;`
*   **Typography**: Imports for `Archivo Black` (for bold glowing headers), `Inter` (for clean, readable body paragraphs), and `Roboto Mono` (for technical metadata like dates/locations).
*   **Utilities**: Utility classes for glowing text (`.text-glow`), strict un-rounded containers (`.sharp-edges`), and thin standard dividers (`.thin-divider`).

### Core Page Components
#### [NEW] `src/App.jsx`
The main orchestrator. Will structure the page in large, full-width alternating sections: Dark Hero -> Light Bio -> Dark Grid Header -> Dark Grid -> Light Footer.

#### [NEW] `src/components/Hero.jsx`
*   **Layout:** 100vh, pure black background.
*   **Content:** Giant, screen-spanning title text set in `Archivo Black, italic`, entirely uppercase, styled with dropping red `text-shadow`. Subtle metadata anchored absolutely to the corners (top-left, bottom-right).

#### [NEW] `src/components/AboutSplit.jsx`
*   **Layout:** Cream background, 50/50 CSS Flexbox split.
*   **Content:** Left side features a sharp-edged portrait image. Right side contains highly structured, clean typography describing the videographer's background and services.

#### [NEW] `src/components/ProjectGallery.jsx`
*   **Layout:** Black background. Starts with a massive glowing category header.
*   **Grid:** A standard `display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;` layout.
*   **Images:** Strict 0px border-radius. Includes hover interactions (e.g., revealing text on hover or transitioning from dim to full brightness).

#### [NEW] `src/components/FooterTable.jsx`
*   **Layout:** Cream background.
*   **Design:** A stark, brutalist table layout. Uses 1px solid black borders to create horizontal rows containing contact endpoints (Email / Phone / Socials).

## Verification Plan

### Manual Verification
Since this is heavily reliant on visual styling and CSS execution:
1.  Run the local development server: `npm run dev`
2.  Open the application in the browser.
3.  **Contrast Check:** Verify that alternating sections switch cleanly between `#000` and `#F5F5F0`.
4.  **Typography Check:** Ensure the hero text and category headers are heavy, italicized, and have a distinct red glowing effect.
5.  **Grid Check:** Validate the gallery grid has 3 equal columns on desktop, 1 column on mobile, with sharp un-rounded image edges.
6.  **Responsive Check:** Resize the browser window to ensure the split-screen collapses into a single column gracefully.
