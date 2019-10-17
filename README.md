# jedliSlider

![](https://img.shields.io/badge/version-0.6.4-blue.svg)

### What is jedliSlider?

jedliSlider is lightweight carousel to use on your page, created in pure javascript and css.

### Compatibility

Slider is built on css flexbox. So will be compatible with every browser that supports flexbox.

### Why jedliSlider?

Because it’s lightweight, easy to use and modern. Some popular carousels still use floats and a lot of unnecessary scripts/styles.
My intention was to create one slider, that will contain all things i missed in other carousels. With as low code and css that is possible. So you don't need to override some default styles.

## Status
There is one currently working mode - ‘continuous’.
More will be added soon.

### Features soon:

#### Demo website

#### Modes:
- default - normal, typical carousel, where you can change slides by arrows or by swap
- centered - where some slides are highlighted, with some levels of highlightness and animation between levels

## Available options

### Mode
- continuous - Infinite, smooth, infnite animation

### slidesWidth

- auto - width of every slides can be different, specifed from css, slider will animate if width of all slides is greater than container width
- equal - All slides have same, specified from js size

### visibleSlides
######Available when slidesWidth is set to “equal”. Determinate how much slides will be visible

### speed

- In mode “continuous” speed is amount of ms per every px

### direction
######determinate if carousel should rotate from left to right, or right to left)

- right
- left

### pauseOnHover
######if carousel should stop animation on hover, or for accessibility reasons - on focus at any element inside slider

- true
- false

### responsive
######breakpoints and new options to work from specified breakpoint

## How to use

### If you work with webpack
just import src-webpack/jedlislider.js

### If you work without webpack, add this files to your wesbite by <script> and <link> tag:

- dist/jedlislider.bundle.css
- src/jedlislider.js


###### Working examples from test.js

```javascript
let slider = new jedliSlider(document.querySelectorAll(“[data-item=‘slider’]“)[0], {
   “mode”: “continuous”,
   “slidesWidth”: “auto”,
   “speed”: “5",
   “direction”: “right”,
})

let sliderContinuousSame = new jedliSlider(document.querySelectorAll(“[data-item=‘slider-continuous-same’]“)[0], {
   “mode”: “continuous”,
   “slidesWidth”: “equal”,
   “visibleSlides”: “4",
   “speed”: “5",
   ‘pauseOnHover’: “true”,
   “responsive”: [
       {
           “breakpoint”: “992",
           “options”: {
               “visibleSlides”: “3”
           }
       },
       {
           “breakpoint”: “768”,
           “options”: {
               “visibleSlides”: “2"
           }
       }
   ]
})

```

