# Enhancing and Customizing

Here are ways to enhance the project for your needs:

## 1. Change Images
Replace `img/normal.jpg`, `img/alt.jpg`, and `img/code.jpg` with your own images. Ensure they have the same aspect ratio (597x916) or adjust `pieces.css`:

```css
.pieces {
  inline-size: calc(58.6572vh * YOUR_ASPECT_RATIO); /* e.g., width/height */
}
```

## 2. Adjust Piece Count
Modify the PieceMaker options in `main.js` to change the grid:

```javascript
pm = new PieceMaker(DOM.pieces, { pieces: { rows: 20, columns: 15 } });
```

More pieces increase detail but may impact performance on low-end devices.

## 3. Customize Colors
Edit the CSS custom properties in `demo.css`:

```css
:root {
  --bg-color: #1a1a1a; /* Darker background */
  --accent-design: #ff6f61; /* New design accent */
  --accent-code: #4ecdc4; /* New code accent */
}
```

## 4. Add More Modes
Extend the mode-switching logic in `main.js`:
- Add a new mode (e.g., "hybrid") in `DOM.switchModeCtrls`
- Define new styles in `demo.css` (e.g., `.mode--hybrid`)
- Update `switchContent` to handle the new mode

## 5. Enhance Animations
Modify Anime.js parameters in `main.js` (e.g., duration, easing):

```javascript
anime({
  targets: this.pieces,
  duration: 1000, // Slower animation
  easing: 'easeInOutSine', // Different easing
  // ...
});
```

Explore Anime.js timelines for sequenced effects:

```javascript
const tl = anime.timeline({ loop: true });
tl.add({ targets: '.piece', opacity: 0, duration: 500 })
  .add({ targets: '.piece', opacity: 1, duration: 500 });
```

## 6. Add Interactivity
Introduce a toggle for the tilt effect:

```javascript
document.querySelector('#tilt-toggle').addEventListener('click', () => {
  pm.tilt ? pm.removeTilt() : pm.initTilt();
});
```

Add keyboard navigation for mode switching:

```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'd') DOM.switchModeCtrls.design.click();
  if (e.key === 'c') DOM.switchModeCtrls.code.click();
});
```

## 7. Improve Accessibility
Add ARIA attributes in `index.html`:

```html
<button class="btn btn--menu" aria-label="Toggle menu">
```

Ensure sufficient color contrast by testing with tools like WebAIM's Contrast Checker.

## 8. Optimize Performance
Use IntersectionObserver to lazy-load animations:

```javascript
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) pm.loopFx();
}, { threshold: 0.1 });
observer.observe(DOM.pieces);
```

Minify CSS/JS with tools like terser or cssnano.

## License
This project is licensed under the MIT License. See LICENSE for details.

## Credits
- Original concept by Codrops
- Modernized by [Your Name] in March 2025
- Images from Unsplash by Janko Ferlic (replace with your own)

