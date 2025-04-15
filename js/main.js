// @ts-nocheck
// This is a JavaScript file
// Modernized main.js (March 2025)
// Licensed under MIT

// Utility functions
// Merges two objects together
const extend = (a, b) => ({ ...a, ...b });
// Generates a random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// Gets the mouse position from an event, handling different browser implementations
const getMousePos = (e) => ({
  x: e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
  y: e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop,
});
// Creates a debounced function that delays invoking func until after wait milliseconds
const debounce = (func, wait, immediate) => {
  let timeout;
  return (...args) => {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// PieceMaker class for image pieces and tilt effect
// Handles splitting an image into pieces and applying tilt effects based on mouse movement
class PieceMaker {
  constructor(el, options = {}) {
    // Store the DOM element and merge default options with provided options
    this.el = el;
    this.options = extend({
      pieces: { rows: 14, columns: 10 },
      tilt: { maxRotationX: -2, maxRotationY: 3, maxTranslationX: 6, maxTranslationY: -2 },
    }, options);
    this.fxCustomTriggered = false; // Tracks if custom animation is active
    this.isLoopFXActive = false;    // Tracks if loop animation is active
    this._init();                   // Initialize the PieceMaker
  }

  // Initialize the PieceMaker
  _init() {
    // Extract image source from background-image CSS property (use replace for consistency)
    this.imgsrc = this.el.style.backgroundImage.replace('url(','').replace(')','').replace(/\"/gi, "");
    // Store window dimensions for responsive calculations
    this.win = { width: window.innerWidth, height: window.innerHeight };
    // Store element dimensions for piece calculations
    this.dimensions = { width: this.el.offsetWidth, height: this.el.offsetHeight };
    this._layout();      // Create the grid of pieces
    this.initTilt();     // Initialize the tilt effect
    this._initEvents();  // Set up event listeners
  }

  // Create the layout of pieces
  _layout() {
    // Set the initial background image from data attribute
    this.el.style.backgroundImage = this.el.getAttribute('data-img-code');
    
    // Clear any existing pieces
    if (this.pieces && this.pieces.length) {
      this.pieces.forEach(piece => this.el.removeChild(piece));
    }
    
    // Initialize the pieces array
    this.pieces = [];
    
    // Create grid of pieces by iterating through rows and columns
    for (let r = 0; r < this.options.pieces.rows; r++) {
      for (let c = 0; c < this.options.pieces.columns; c++) {
        const piece = this._createPiece(r, c);
        this.pieces.push(piece);
      }
    }
    
    console.log(`Created grid with ${this.pieces.length} pieces (${this.options.pieces.rows} rows × ${this.options.pieces.columns} columns)`);
  }

  // Create a single piece of the image
  _createPiece(row, column) {
    // Calculate dimensions for each piece
    const w = Math.round(this.dimensions.width / this.options.pieces.columns);
    const h = Math.round(this.dimensions.height / this.options.pieces.rows);
    
    // Create a div element for the piece
    const piece = document.createElement('div');
    // Set the background image to the same as the main element
    piece.style.backgroundImage = `url(${this.imgsrc})`;
    piece.className = 'piece';
    // Set dimensions using standard properties for consistency with original
    piece.style.width = `${w}px`;
    piece.style.height = `${h}px`;
    // Set background size to ensure the entire image spans across all pieces
    piece.style.backgroundSize = `${w * this.options.pieces.columns}px auto`;
    // Set background position
    piece.style.backgroundPosition = `${-column * 100}% ${-row * 100}%`;
    // Store column information for filtering pieces later
    piece.dataset.column = column.toString();
    // Add random delay for staggered animations
    piece.dataset.delay = getRandomInt(-15, 15).toString();
    
    // Add the piece to the parent element
    this.el.appendChild(piece);
    
    // Update parent element dimensions to contain all pieces
    this.el.style.width = `${w * this.options.pieces.columns}px`;
    this.el.style.height = `${h * this.options.pieces.rows}px`;
    
    return piece;
  }

  // Initialize the tilt effect
  initTilt() {
    // Add smooth transition for tilt effect
    this.el.style.transition = 'transform 0.1s ease-out';
    this.tilt = true; // Enable tilt effect
  }

  // Remove the tilt effect
  removeTilt() {
    this.tilt = false; // Disable tilt effect
  }

  // Set up event listeners
  _initEvents() {
    // Handle mouse movement to create tilt effect
    const onMouseMove = (ev) => {
      requestAnimationFrame(() => {
        if (!this.tilt) {
          this.el.style.transform = 'none';
          return;
        }
        
        const { x, y } = getMousePos(ev);
        
        const rotX = 2 * this.options.tilt.maxRotationX / this.win.height * y - this.options.tilt.maxRotationX;
        const rotY = 2 * this.options.tilt.maxRotationY / this.win.width * x - this.options.tilt.maxRotationY;
        const transX = 2 * this.options.tilt.maxTranslationX / this.win.width * x - this.options.tilt.maxTranslationX;
        const transY = 2 * this.options.tilt.maxTranslationY / this.win.height * y - this.options.tilt.maxTranslationY;
        
        this.el.style.transform = `perspective(1000px) translate3d(${transX}px, ${transY}px, 0) rotate3d(1, 0, 0, ${rotX}deg) rotate3d(0, 1, 0, ${rotY}deg)`;
      });
    };

    // Handle window resizing to adjust piece sizes
    const onResize = debounce(() => {
      // Update window dimensions
      this.win = { width: window.innerWidth, height: window.innerHeight };
      // Reset container dimensions
      this.el.style.width = this.el.style.height = '';
      // Get new dimensions
      const { width, height } = this.el.getBoundingClientRect();
      this.dimensions = { width, height };
      
      // Recalculate piece dimensions
      const w = Math.round(width / this.options.pieces.columns);
      const h = Math.round(height / this.options.pieces.rows);
      
      // Loop through pieces and update each one
      let i = 0;
      for (let r = 0; r < this.options.pieces.rows; r++) {
        for (let c = 0; c < this.options.pieces.columns; c++) {
          const piece = this.pieces[i];
          if (piece) {
            // Update size
            piece.style.width = `${w}px`;
            piece.style.height = `${h}px`;
            // Update background size to ensure proper image scaling
            piece.style.backgroundSize = `${w * this.options.pieces.columns}px auto`;
            // Update background position to maintain alignment
            piece.style.backgroundPosition = `${-c * 100}% ${-r * 100}%`;
          }
          i++;
        }
      }
      
      // Update container dimensions
      this.el.style.width = `${w * this.options.pieces.columns}px`;
      this.el.style.height = `${h * this.options.pieces.rows}px`;
    }, 10);

    // Add event listeners
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
  }

  // Create a continuous loop animation effect
  loopFx() {
    try {
      this.isLoopFXActive = true;
      // Switch to alternate image for the effect - use getAttribute like original
      this.el.style.backgroundImage = this.el.getAttribute('data-img-alt');
      
      // Remove any existing animations
      anime.remove(this.pieces);
      
      // Convert pieces to an array
      const targetPieces = Array.from(this.pieces);
      
      if (targetPieces.length === 0) {
        console.error('No pieces found for loop animation');
        return;
      }
      
      // Animate pieces with random opacity changes - more like the original
      anime({
        targets: targetPieces,
        duration: 50, // Much shorter duration like original
        easing: 'linear',
        opacity: [
          // First keyframe: randomly set pieces to visible or invisible
          { 
            value: (t, i) => !getRandomInt(0, 5) ? 0 : 1, // Makes ~1/6 pieces invisible
            delay: (t, i) => getRandomInt(0, 2000) // Random delay up to 2 seconds
          }, 
          // Second keyframe: make all pieces visible with additional random delay
          { 
            value: 1, 
            delay: (t, i) => getRandomInt(200, 2000) // Random delay between 0.2-2 seconds
          }
        ],
        // Continue the loop if still active
        complete: () => {
          if (this.isLoopFXActive) {
            this.loopFx(); // Call immediately on complete like original
          }
        }
      });
    } catch (error) {
      console.error('Error in loopFx:', error);
    }
  }

  // Stop the loop animation effect
  stopLoopFx() {
    this.isLoopFXActive = false;
    // Set background to the code image - use getAttribute like original
    this.el.style.backgroundImage = this.el.getAttribute('data-img-code');
    // Remove any ongoing animations
    anime.remove(this.pieces);
    // Reset opacity of all pieces
    this.pieces.forEach((piece) => piece.style.opacity = 1);
  }

  // Animate pieces in or out
  animatePieces(dir, callback) {
    try {
      // Remove any existing animations
      anime.remove(this.pieces);
      
      // Convert to array - reverse for consistent animation direction with original
      const targetPieces = Array.from(this.pieces).reverse();
      
      if (targetPieces.length === 0) {
        console.error('No pieces found for animation');
        if (callback) callback();
        return;
      }
      
      // Apply animation with direction-based properties
      anime({
        targets: targetPieces,
        duration: dir === 'out' ? 600 : 500,
        // Use simple string values for animations
        translateX: {
          value: function(el) {
            const column = parseInt(el.dataset.column);
            // For 'out' animation, move left/right based on column position
            if (dir === 'out') {
              return column < this.options.pieces.columns/2 ? '75px' : '-75px';
            } 
            // For 'in' animation, start offset and return to 0
            return '0px';
          }.bind(this),
          duration: dir === 'out' ? 600 : 500
        },
        translateY: {
          value: dir === 'out' ? '-900px' : '0px', // Simple string values
          duration: dir === 'out' ? 600 : 500
        },
        opacity: {
          value: dir === 'out' ? 0 : 1,
          duration: dir === 'out' ? 600 : 300,
          easing: 'linear'
        },
        delay: function(el, i) {
          return Math.max(0, i * 6 + parseInt(el.dataset.delay || 0));
        },
        easing: 'easeOutExpo',
        begin: function(anim) {
          // If animating 'in', set initial translateY
          if (dir === 'in') {
            targetPieces.forEach(function(el) {
              el.style.transform = 'translateY(-900px)';
              // Make sure pieces are visible before animating in
              el.style.opacity = '0'; 
            });
          }
        },
        complete: callback
      });
    } catch (error) {
      console.error('Error in animatePieces:', error);
      if (callback) callback();
    }
  }

  // Custom animation effect for pieces
  fxCustom(dir) {
    // In code mode, we want to move pieces IN rather than OUT
    const animationDirection = mode === 'code' ? 'in' : 'out';
    console.log(`ANIMATION START: Moving ${dir === 'left' ? 'left' : 'right'} pieces ${animationDirection}`);
    
    this.fxCustomTriggered = true;
    // Set background image based on mode
    this.el.style.backgroundImage = this.el.getAttribute('data-img-code');
    
    try {
      // Filter pieces based on current direction 
      const allPieces = Array.from(this.pieces);
      const targetPieces = allPieces.filter(piece => {
        const column = parseInt(piece.dataset.column);
        return column < this.options.pieces.columns/2;
      });
      
      if (targetPieces.length === 0) {
        console.error('No target pieces found');
        return;
      }
      
      console.log(`Found ${targetPieces.length} ${dir === 'left' ? 'left' : 'right'} pieces for animation`);
      
      // Clear any existing animations
      anime.remove(targetPieces);
      
      // Remove any leftover debug borders
      targetPieces.forEach(piece => {
        piece.style.border = ''; 
      });
      
      // Apply animation with direction-based parameters
      anime({
        targets: targetPieces,
        duration: 250,
        easing: 'easeOutExpo',
        // Move left in design mode, left in code mode
        translateX: {
          value: function() {
            if (mode === 'code') {
              return '0px'; // Code mode: move TO inside (final position)
            } else {
              return dir === 'left' ? '-200px' : '200px'; // Design mode: move pieces OUT
            }
          },
          duration: 250
        },
        translateY: {
          value: function() {
            if (mode === 'code') {
              return '0px'; // Code mode: move TO center (final position)
            } else {
              return '50px'; // Design mode: add small Y offset
            }
          },
          duration: 250
        },
        opacity: {
          value: mode === 'code' ? 1 : 0, // In code mode, fade in; in design mode, fade out
          duration: 150,
          easing: 'linear'
        },
        delay: function(el, i) {
          return Math.max(0, i * 5 + parseInt(el.dataset.delay || 0));
        },
        begin: function() {
          // Set initial positions for pieces if in code mode (coming in)
          if (mode === 'code') {
            targetPieces.forEach(piece => {
              piece.style.transform = 'translateX(-200px) translateY(50px)';
              piece.style.opacity = '0';
            });
          }
        }
      });
      
    } catch (error) {
      console.error('Error in fxCustom:', error);
    }
  }

  // Reset the custom animation effect
  fxCustomReset(dir, callback) {
    const animationDirection = mode === 'code' ? 'out' : 'in';
    console.log(`ANIMATION RESET: Moving ${dir === 'left' ? 'left' : 'right'} pieces ${animationDirection}`);
    
    this.fxCustomTriggered = false;
    
    try {
      // Filter pieces based on current direction
      const allPieces = Array.from(this.pieces);
      const targetPieces = allPieces.filter(piece => {
        const column = parseInt(piece.dataset.column);
        return column < this.options.pieces.columns/2;
      });
      
      if (targetPieces.length === 0) {
        console.error('No target pieces found for reset');
        if (callback) callback();
        return;
      }
      
      console.log(`Resetting ${targetPieces.length} ${dir === 'left' ? 'left' : 'right'} pieces`);
      
      // Clear any existing animations
      anime.remove(targetPieces);
      
      // Remove any leftover debug borders
      targetPieces.forEach(piece => {
        piece.style.border = '';
      });
      
      // Apply reset animation - completely different for code vs design mode
      anime({
        targets: targetPieces,
        duration: 250,
        easing: 'easeOutExpo',
        // Different reset animations for code vs design mode
        translateX: {
          value: mode === 'code' ? '-200px' : '0px', // Code: animate OUT, Design: return to center
          duration: 250
        },
        translateY: {
          value: mode === 'code' ? '50px' : '0px', // Code: small Y offset, Design: return to center
          duration: 250
        },
        opacity: {
          value: mode === 'code' ? 0 : 1, // Code: fade out, Design: fade in
          duration: 150,
          easing: 'linear'
        },
        delay: function(el, i, l) {
          return Math.max(0, (l-i-1) * 2 + parseInt(el.dataset.delay || 0));
        },
        complete: callback
      });
      
    } catch (error) {
      console.error('Error in fxCustomReset:', error);
      if (callback) callback();
    }
  }
}

// GlitchFx class for glitch animation
// Creates a glitch effect by toggling classes and applying random transformations
class GlitchFx {
  constructor(elems, options = {}) {
    // Store elements and merge default options
    this.elems = Array.from(elems);
    this.options = extend({
      glitchStart: { min: 500, max: 4000 },     // Time range before glitch starts
      glitchState: { min: 50, max: 250 },       // Duration range for each glitch state
      glitchTotalIterations: 6,                 // Number of glitch iterations per cycle
    }, options);
    this.glitch(); // Start the glitch effect
  }

  // Start the glitch effect
  glitch() {
    this.isInactive = false;
    // Clear any existing timeout
    clearTimeout(this.glitchTimeout);
    // Set random timeout before starting glitch
    this.glitchTimeout = setTimeout(() => {
      this.iteration = 0;
      // Start glitch state changes, with callback to restart cycle
      this._glitchState(() => !this.isInactive && this.glitch());
    }, getRandomInt(this.options.glitchStart.min, this.options.glitchStart.max));
  }

  // Handle individual glitch state changes
  _glitchState(callback) {
    if (this.iteration < this.options.glitchTotalIterations) {
      // Set timeout for this glitch state
      this.glitchStateTimeout = setTimeout(() => {
        this.elems.forEach((el) => {
          // Toggle classes for the glitch effect
          if (el.classList.contains('mode--code')) {
            el.classList.remove('mode--code');
            el.classList.add('mode--design');
          } else {
            el.classList.remove('mode--design');
            el.classList.add('mode--code');
          }
          
          // Apply random translation on even iterations
          el.style.transform = this.iteration % 2 !== 0 
            ? 'translate3d(0,0,0)' 
            : `translate3d(${getRandomInt(-5, 5)}px, ${getRandomInt(-5, 5)}px, 0)`;
        });
        
        this.iteration++;
        // Continue to next iteration if not inactive
        if (!this.isInactive) this._glitchState(callback);
      }, getRandomInt(this.options.glitchState.min, this.options.glitchState.max));
    } else {
      // All iterations complete, call callback to restart cycle
      callback();
    }
  }

  // Stop the glitch effect
  stopGlitch() {
    this.isInactive = true;
    // Clear all timeouts
    clearTimeout(this.glitchTimeout);
    clearTimeout(this.glitchStateTimeout);
    // Reset all elements to design mode
    this.elems.forEach((el) => {
      if (el.classList.contains('mode--code')) {
        el.classList.remove('mode--code');
        el.classList.add('mode--design');
        el.style.transform = 'translate3d(0,0,0)';
      }
    });
  }
}

// DOM setup and initialization
// Stores references to all important DOM elements
const DOM = {
  body: document.body,
  loading: document.querySelector('.loading'),
  switchCtrls: document.querySelector('.switch'),
  switchModeCtrls: {
    design: document.querySelector('#switch-design'),
    code: document.querySelector('#switch-code'),
    divider: document.querySelector('.switch__divider')
  },
  pieces: document.querySelector('.pieces'),
  glitchElems: document.querySelectorAll('[data-glitch]'),
  contact: { el: document.querySelector('.contact-link') },
  title: { el: document.querySelector('.title > .title__inner') },
  menusContainer: document.querySelector('.menus-container'),
  menu: {
    design: {
      wrapper: document.querySelector('.menus-container .menu'),
      items: document.querySelector('.menus-container .menu').querySelectorAll('.menu__inner a'),
    },
    code: {
      wrapper: document.querySelector('.menus-container .menu--code'),
      items: document.querySelectorAll('.menus-container .menu--code > .menu__inner a'),
    },
  },
  overlay: document.querySelector('.overlay'),
};

let mode = 'design'; // Current mode (design or code)
let disablePageFx = false; // Flag to disable page effects
let isAnimating = false; // Flag to track if animation is in progress
let pm, gfx; // PieceMaker and GlitchFx instances

// Modernized charming.js
// Splits text into individual characters wrapped in spans
function charming(element) {
    const text = element.textContent.trim();
    element.innerHTML = '';
    
    // Split by words first, then characters
    const words = text.split(' ');
    
    words.forEach((word, wordIndex) => {
        // Add each character of the word
        word.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.className = `char${wordIndex * 100 + i + 1}`; // Ensure unique class names
            span.textContent = char;
            element.appendChild(span);
        });
        
        // Add a non-breaking space between words (except for the last word)
        if (wordIndex < words.length - 1) {
            const space = document.createElement('span');
            space.className = 'space';
            space.innerHTML = '&nbsp;'; // Use non-breaking space
            element.appendChild(space);
        }
    });
}

// Initialize the application
function init() {
  // Wait for all images to load (including background images)
  imagesLoaded(DOM.body, { background: true }, () => {
    // Hide loading screen
    DOM.loading.classList.add('loading--hide');
    
    // Debug: Verify DOM references
    console.log('Designer switch:', DOM.switchModeCtrls.design);
    console.log('Coder switch:', DOM.switchModeCtrls.code);
    
    // Make sure all elements with data-glitch attribute have mode--design class
    document.querySelectorAll('[data-glitch]').forEach(el => {
      if (!el.classList.contains('mode--design')) {
        el.classList.add('mode--design');
      }
    });
    
    // Make sure the Coder switch item has the data-glitch attribute
    if (!DOM.switchModeCtrls.code.hasAttribute('data-glitch')) {
      DOM.switchModeCtrls.code.setAttribute('data-glitch', '');
    }
    
    // Initialize PieceMaker and effects
    pm = new PieceMaker(DOM.pieces);
    pm.loopFx();
    
    // Initialize glitch effect on all elements with data-glitch attribute
    gfx = new GlitchFx(document.querySelectorAll('[data-glitch]'));
    
    // Add mode classes to elements
    document.querySelectorAll('[data-switch]').forEach(el => {
      if (!el.classList.contains('mode--design')) {
        el.classList.add('mode--design');
      }
    });
    
    wordsToLetters(); // Split text into individual letters
    initEvents();     // Set up event listeners
  });
}

// Convert words to individual letters for animation
function wordsToLetters() {
  // Split title text into letters
  charming(DOM.title.el);
  DOM.title.letters = Array.from(DOM.title.el.querySelectorAll('span'));
  
  // Split contact link text into letters
  charming(DOM.contact.el);
  DOM.contact.letters = Array.from(DOM.contact.el.querySelectorAll('span'));
  
  // Split menu items text into letters
  DOM.menuCodeItemLetters = Array.from(DOM.menu.code.items).map((item) => {
    charming(item);
    return Array.from(item.querySelectorAll('span'));
  });
}

// Set up event listeners
function initEvents() {
  // Make sure both mode controls have click listeners
  DOM.switchModeCtrls.design.addEventListener('click', (ev) => {
    switchMode(ev);
  });
  
  // Coder switch
  DOM.switchModeCtrls.code.addEventListener('click', (ev) => {
    switchMode(ev);
  });

  // Add keyboard navigation for arrow keys only
  document.addEventListener('keydown', (ev) => {
    // Arrow keys to switch modes
    if (ev.key === 'ArrowLeft' && mode === 'code') {
      ev.preventDefault();
      DOM.switchModeCtrls.design.dispatchEvent(new Event('click'));
    }
    if (ev.key === 'ArrowRight' && mode === 'design') {
      ev.preventDefault();
      DOM.switchModeCtrls.code.dispatchEvent(new Event('click'));
    }
  });

  // Contact link hover effects
  DOM.contact.el.addEventListener('mouseenter', (ev) => {
    if (isAnimating) return false;
    
    try {
      // Pause effects in design mode only
      if (mode === 'design') {
        pauseFx();
      }
      // Apply custom animation - direction based on current mode
      pm.fxCustom(mode === 'design' ? 'left' : 'right');
      
      // In code mode, set background to code.jpg for hover animation
      if (mode === 'code') {
        pm.el.style.backgroundImage = pm.el.getAttribute('data-img-code');
      }
    } catch (error) {
      console.error('Error during contact mouseenter:', error);
    }
  });

  DOM.contact.el.addEventListener('mouseleave', (ev) => {
    if (isAnimating || !pm.fxCustomTriggered) return false;
    
    try {
      // Reset the custom animation - direction based on current mode
      pm.fxCustomReset(mode === 'design' ? 'left' : 'right', () => {
        if (!disablePageFx) {
          // In code mode, maintain code.jpg background after reset
          if (mode === 'code') {
            pm.el.style.backgroundImage = pm.el.getAttribute('data-img-code');
          } else {
            playFx();
          }
        }
      });
    } catch (error) {
      console.error('Error during contact mouseleave:', error);
    }
  });
  
  // Switch controls hover effects
  DOM.switchCtrls.addEventListener('mouseenter', () => {
    if (disablePageFx || isAnimating) return;
    pauseFx();
  });
  
  DOM.switchCtrls.addEventListener('mouseleave', () => {
    if (disablePageFx || isAnimating) return;
    playFx();
  });
}

// Helper functions to pause and play effects
const pauseFx = () => {
  try {
    pm.stopLoopFx(); // This will set background to code.jpg from data-img-code
    gfx.stopGlitch();
    pm.removeTilt();
  } catch (error) {
    console.error('Error in pauseFx:', error);
  }
};

const playFx = () => {
  try {
    pm.loopFx(); // This will set background to alt.jpg from data-img-alt
    if (gfx.isInactive) {
      gfx.glitch();
    }
    pm.initTilt();
  } catch (error) {
    console.error('Error in playFx:', error);
  }
};

// Switch between design and code modes
function switchMode(ev) {
  ev.preventDefault();
  
  if (isAnimating) {
    console.log('Animation in progress, ignoring mode switch');
    return false;
  }
  
  isAnimating = true;
  
  // Get the clicked element
  const clickedEl = ev.target.closest('.switch__item');
  
  // Set mode based on which switch was clicked
  mode = clickedEl === DOM.switchModeCtrls.code ? 'code' : 'design';
  console.log('Switching to mode:', mode);

  // Update switch classes first
  DOM.switchModeCtrls.design.classList.remove('switch__item--current');
  DOM.switchModeCtrls.code.classList.remove('switch__item--current');
  DOM.switchModeCtrls[mode].classList.add('switch__item--current');

  // Handle the mode switch
  switchOverlay();
  
  if (mode === 'code') {
    disablePageFx = true;
    pm.removeTilt();
    pm.stopLoopFx();
    gfx.stopGlitch();
  }
  
  // Switch content
  switchContent();
  
  // Animate pieces
  try {
    console.log('Animating pieces for mode:', mode);
    pm.animatePieces(mode === 'code' ? 'out' : 'in', () => {
      isAnimating = false;
      
      // Set the appropriate background image for the current mode
      if (mode === 'design') {
        pm.initTilt();
        pm.loopFx(); // This will set background to alt.jpg
        gfx.glitch();
        disablePageFx = false;
      } else {
        // For code mode, ensure we show code.jpg
        pm.el.style.backgroundImage = pm.el.getAttribute('data-img-code');
      }
      
      console.log('Animation complete, isAnimating set to false');
    });
  } catch (error) {
    console.error('Error during animation:', error);
    // Ensure we don't get stuck
    isAnimating = false;
  }
}

// Toggle the overlay when switching modes
function switchOverlay() {
  anime.remove(DOM.overlay);
  anime({
    targets: DOM.overlay,
    duration: 200, 
    easing: 'linear',
    opacity: mode === 'code' ? 1 : 0, // Show overlay in code mode, hide in design mode
  });
}

// Switch content between design and code modes
function switchContent() {
  // Remove the old mode class and add the new one to the switch controls
  DOM.switchCtrls.classList.remove(`mode--${mode === 'code' ? 'design' : 'code'}`);
  DOM.switchCtrls.classList.add(`mode--${mode}`);
  
  // Update the divider to match the current mode
  if (DOM.switchModeCtrls.divider) {
    DOM.switchModeCtrls.divider.classList.remove('mode--design', 'mode--code');
    DOM.switchModeCtrls.divider.classList.add(`mode--${mode}`);
  }
  
  // Call the appropriate mode transition function
  mode === 'code' ? switchToCode() : switchToDesign();
}

// Switch from design mode to code mode
function switchToCode() {
  const hideDesign = (target, callback) => {
    // Configure animation options based on target type
    const animeOpts = typeof target === 'string'
      ? {
          // For string targets (title, contact), scale down and fade out
          targets: DOM[target].el || DOM[target],
          duration: 300,
          easing: 'easeInQuint',
          scale: 0.3,
          opacity: { value: 0, easing: 'linear' },
          complete: callback,
        }
      : {
          // For array targets (menu items), slide up and fade out
          targets: target,
          duration: 100,
          delay: (_, i) => i * 100,
          easing: 'easeInQuad',
          translateY: '-75%',
          opacity: { value: 0, easing: 'linear' },
          complete: callback,
        };
    anime.remove(animeOpts.targets);
    anime(animeOpts);
  };
  
  const showCode = (target) => {
    const el = DOM[target].el || DOM[target];
    
    // Apply mode--code class to elements that need it
    if (['title', 'contact'].includes(target)) {
      // Ensure we remove design mode class and add code mode class
      if (el.classList.contains('mode--design')) {
        el.classList.remove('mode--design');
      }
      el.classList.add('mode--code');
    }
    
    // Animate the letters if the element has them
    if (DOM[target].letters) {
      animateLetters(DOM[target].letters, 'in', {
        begin: () => {
          el.style.opacity = 1;
          el.style.transform = 'none';
        },
      });
    } else {
      el.style.opacity = 1;
      el.style.transform = 'none';
    }
  };

  hideDesign('title', () => showCode('title'));
  hideDesign('contact', () => showCode('contact'));
  hideDesign(DOM.menu.design.items, () => {
    DOM.menu.design.wrapper.style.display = 'none';
    DOM.menu.code.wrapper.style.display = 'block';
    animateLetters(DOM.menuCodeItemLetters, 'in', {
      delay: (_, i) => i * 30,
    });
  });
}

// Switch from code mode to design mode
function switchToDesign() {
  const showDesign = (target) => {
    const animeOpts = typeof target === 'string'
      ? {
          targets: DOM[target].el || DOM[target],
          duration: 400,
          easing: 'easeOutQuint',
          scale: [0.3, 1],
          opacity: { value: [0, 1], easing: 'linear' },
          begin: () => {
            const el = DOM[target].el || DOM[target];
            // Ensure we remove code mode class and add design mode class
            if (el.classList.contains('mode--code')) {
              el.classList.remove('mode--code');
            }
            el.classList.add('mode--design');
            if (DOM[target].letters) DOM[target].letters.forEach((letter) => letter.style.opacity = 1);
          },
        }
      : {
          targets: target,
          duration: 400,
          delay: (_, i, c) => (c - i - 1) * 100,
          easing: 'easeOutExpo',
          translateY: ['-75%', '0%'],
          opacity: { value: [0, 1], easing: 'linear' },
        };
    anime.remove(animeOpts.targets);
    anime(animeOpts);
  };

  animateLetters(DOM.title.letters, 'out', { complete: () => showDesign('title') });
  animateLetters(DOM.contact.letters, 'out', { complete: () => showDesign('contact') });
  
  // Show design menu items
  showDesign(DOM.menu.design.items);
  
  // Hide code menu items
  animateLetters(DOM.menuCodeItemLetters, 'out', {
    delay: (_, i, c) => (c - i - 1) * 10,
    duration: 20,
    complete: () => {
      DOM.menu.code.wrapper.style.display = 'none';
      DOM.menu.design.wrapper.style.display = 'block';
    },
  });
}

// Animate individual letters in or out
function animateLetters(letters, dir, extraAnimeOpts = {}) {
  try {
    // Make sure letters is an array
    const targetLetters = Array.from(letters);
    
    if (targetLetters.length === 0) {
      console.error('No letters found for animation');
      return;
    }
    
    // Remove any existing animations
    anime.remove(targetLetters);
    
    // Use a simpler animation with stagger
    anime({
      targets: targetLetters,
      opacity: dir === 'in' ? [0, 1] : [1, 0],
      duration: 200,
      delay: anime.stagger(20),
      easing: dir === 'in' ? 'easeInOutQuad' : 'easeInOutQuad',
      ...extraAnimeOpts
    });
  } catch (error) {
    console.error('Error in animateLetters:', error);
  }
}

// Initialize the application when the page loads
init();