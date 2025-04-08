# Josh Miller - Designer & Coder Portfolio

A modern, interactive portfolio page with a dual-identity theme that showcases my work as both a designer and developer. This personal site features special image-tiling effects, glitch animations, and seamless mode-switching functionality - creating an engaging and unique browsing experience.

## About Me

I'm Josh Miller, a designer and coder based in Tennessee. I blend creative design principles with technical coding expertise to create memorable digital experiences. Visit my full portfolio at [jshmllr.com](https://jshmllr.com) to see more of my work.

## What This Portfolio Does

My portfolio creates an immersive single-page experience that:

- Displays a tiled background image that responds to mouse movement with a subtle 3D tilt effect
- Allows visitors to switch between "Designer" and "Coder" modes, each with unique styling and content
- Features dynamic glitch effects on text elements for a distinctive tech-inspired aesthetic
- Animates content transitions when switching modes for a polished user experience
- Uses modern CSS features including logical properties, container queries, and custom properties for responsive design

The minimalist approach puts focus on content while the interactive elements create a memorable impression.

## Technical Implementation

### Core Components

#### HTML Structure (index.html):
- A clean `<main>` element containing image pieces, overlay, and content
- Content structure with a title, mode switcher, navigation menus, and contact link

#### CSS Styling (css/):
- `normalize.css`: Ensures consistent rendering across browsers
- `style.css`: Implements modern CSS with logical properties, container queries, and custom properties
- `pieces.css`: Controls the tiled image pieces with responsive sizing

#### JavaScript Logic (js/main.js):
- **PieceMaker Class**: Handles image tiling, applies tilt effects, and manages animations
- **GlitchFx Class**: Creates text glitch animations with random timing
- **Mode Switching**: Manages transitions between "Designer" and "Coder" modes
- Uses modern libraries: Anime.js for smooth animations, imagesLoaded for asset management, and charming for text effects

### Modern Features (2025 Updates)

- **Improved Performance**: Uses ResizeObserver and requestAnimationFrame for fluid animations
- **Better Responsiveness**: Implemented container queries for more precise layout control
- **Enhanced Accessibility**: Proper focus states and keyboard navigation
- **Mobile Optimizations**: Responsive design adjustments for various screen sizes
- **Code Improvements**: Modern ES6+ syntax and cleaner codebase structure

## Links

- Portfolio: [jshmllr.com](https://jshmllr.com)
- Projects: [jshmllr.com/projects](https://jshmllr.com/projects)
- Journal: [jshmllr.com/journal](https://jshmllr.com/journal)
- Experiments: [codepen.io/jshmllr](https://codepen.io/jshmllr)
- GitHub: [github.com/jshmllr](https://github.com/jshmllr)

## Project Structure
```
portfolio/
├── css/
│   ├── normalize.css
│   ├── style.css
│   └── pieces.css
├── img/
│   ├── normal.jpg
│   ├── alt.jpg
│   └── code.jpg
├── js/
│   └── main.js
└── index.html
```
