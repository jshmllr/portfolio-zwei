# Developer/Designer Portfolio Page Layout

A modern, interactive portfolio page concept with a developer/designer theme, featuring a special image-tiling effect, glitch animations, and mode-switching functionality. Built with HTML, CSS, and JavaScript, this project showcases a creative way to present a dual-identity portfolio (e.g., designer and coder) with smooth transitions and engaging visual effects.

## What This Project Does

This project creates a single-page portfolio layout that:

- Displays a tiled background image that tilts based on mouse movement
- Allows switching between "Designer" and "Coder" modes, each with unique styling and content
- Features glitch effects on text elements (title, contact link) for a dynamic, techy feel
- Animates content transitions (e.g., menu items, image pieces) when switching modes
- Provides an overlay effect during mode transitions for visual polish

The design is minimalistic yet striking, with a focus on interactivity and performance, making it ideal for developers or designers looking to showcase their work creatively.

## How It Works

### Core Components

#### HTML Structure (index.html):
- A single `<main>` element contains the image pieces (`.pieces`), overlay (`.overlay`), and content (`.content`)
- SVG icons enhance the UI (e.g., arrows, menu toggle)
- Content includes a title, mode switcher, menus, and a contact link

#### CSS Styling (css/):
- `normalize.css`: Resets browser styles for consistency
- `demo.css`: Defines the layout using modern CSS (Grid, Flexbox, logical properties) and custom properties for theming
- `pieces.css`: Styles the tiled image pieces with responsive sizing

#### JavaScript Logic (js/main.js):
- **PieceMaker Class**: Splits the background image into tiles, applies a tilt effect on mouse move, and animates pieces during mode switches or hover interactions
- **GlitchFx Class**: Adds a glitch animation to text elements, toggling between "design" and "code" styles randomly
- **Mode Switching**: Handles transitions between "Designer" and "Coder" modes, animating content and updating styles
- Uses Anime.js (v3.2.2) for smooth animations and imagesLoaded to ensure assets load before initialization

### Key Features

- **Tilt Effect**: The image tiles subtly rotate and translate based on mouse position, creating a 3D-like interaction
- **Glitch Animation**: Text elements flicker between modes with random transforms, controlled by timing intervals
- **Mode Switch**: Clicking "Designer" or "Coder" triggers animations (e.g., pieces flying out/in, menu fading) and updates the UI
- **Performance**: Leverages requestAnimationFrame, ResizeObserver, and GPU-accelerated transforms for smooth operation

### What to Expect

When you load the page:
1. A loading animation (`- - -` to `d - c`) appears briefly until images are ready
2. The tiled background image loads, tilting as you move your mouse
3. The "Designer" mode is active by default, showing a design-themed menu and styling
4. Hovering over "Work with me" triggers a custom piece animation (pieces shift left or right based on mode)
5. Clicking "Coder" switches to a code-themed UI with a different menu and glitch effects
6. The glitch animation runs periodically on the title and contact link, pausing on hover or mode switch

The experience is visually engaging, with a balance of subtle and bold effects, optimized for modern browsers (as of March 2025).

## Setup Instructions

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge, Safari) with JavaScript enabled
- Basic knowledge of HTML, CSS, and JavaScript for customization
- A local server (e.g., live-server or Node.js) for development to avoid CORS issues with file loading

### Project Structure
portfolio/
├── css/
│   ├── normalize.css
│   ├── demo.css
│   └── pieces.css
├── img/         # Background images
├── js/
│   ├── main.js
│   └── imagesloaded.pkgd.min.js
└── index.html
# portfolio-zwei
