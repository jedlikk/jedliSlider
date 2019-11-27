# jedliSlider

![](https://img.shields.io/badge/version-0.12.19-blue.svg)

### DEMO page
[DEMO](http://jedlikk.github.io/jedliSlider/)

### What is jedliSlider?

jedliSlider is interactive carousel with multiple options and modes to use on your page, created in pure (vanilla) javascript and css.

### Compatibility

Slider is built on css flexbox. So will be compatible with every browser that supports flexbox.

### Why jedliSlider?

Because it’s easy to use, modern and will have all options that you want. Some popular carousels still use floats and a lot of unnecessary scripts/styles. My intention was to create one slider, that will contain all things i missed in other carousels. With as low code and css as possible. So you don't need to override some default styles and download multiple libraries for specific types of carousels.

## Status
There are currently two working modes:

- continuous - fully implemented
- default - check available options on [DEMO page](http://jedlikk.github.io/jedliSlider/#options)

## What's new?
### v. 0.12.19
- Fixed bug with 'auto' width of slides in 'countinous' mode after last update

### Previous update
- Added functionality to filter slides, show all or only from wanted category, with option to
    change category to show [See example here](http://jedlikk.github.io/jedliSlider/#filtering)
- Added events 'dragStart', 'dragEnd
- Added functionality to keep dragging slider when mouse is outside slider box
- Fixed bug when after drag there is no visible slides. Slider will now reset to first/last slide
- Fixed bug with dragging, and blocking of slider when slider was at start/end with infinite
    option set to fals

### Features soon:

- Creating dots from options
- Creating dots with custom html
- Custom animation of changing slides
- Lazy load for images
- 'Centered' mode, where some slides are bigger, smaller or highlighted by other way, with some levels of highlightness and animation between levels

## How to use

### Instal via npm

"npm install jedlislider"

[NPM](https://www.npmjs.com/package/jedlislider)


### If you work with webpack
Import slider:
import jedliSlider from 'jedlislider/src-webpack/jedlislider.js'

and import styles (one of this):
- CSS: import 'jedlislider/dist/jedlislider.bundle.css'
- SCSS: import 'jedlislider/src-webpack/jedlislider.scss'

### If you work without webpack, add this files to your wesbite by script and link tag:

- JS: jedlislider/src/jedlislider.js

And one of this:
- CSS: jedlislider/dist/jedlislider.bundle.css
- SCSS: jedlislider/src/jedlislider.scss

## Events
See more [here](http://jedlikk.github.io/jedliSlider/#events)

- beforeInit
- afterInit
 (it's important to declarate init events before initialization of slider)
- beforeChange
- afterChange
- dragStart
- dragEnd
- beforeFilter
- afterFilter

### How to catch events?
1. get your html element (for example by document.getElementById())
2. add event listener (for example element.addEventListener('beforeChange), () => {}))
3. ??
4. Profit

## Functions
See more [here](http://jedlikk.github.io/jedliSlider/#functions)

- prevSlide() -> Go to prev slide or slides if 'slidesToScroll is greater than 1'
- nextSlide() -> Go to next slide or slides if 'slidesToScroll is greater than 1'
- goToSlide(Number of slide) -> Go to specific slide
- filter(Here category name or "all" to see all slides)

## List of options

More info on [DEMO page](http://jedlikk.github.io/jedliSlider/#options)


| Option:           | Default: | Description:                                                                                                                                                                                                                                                                                                                                                               |
|-------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mode              | default  | jedliSlider contain few different modes, types of carousels\. Select wanted one\. This option define how almost all of other options will work                                                                                                                                                                                                                             |
| slidesWidth       | equal    | determinate if all slides should be same size, specified by slider; or width of every slides can be different, specifed from css                                                                                                                                                                                                                                           |
| visibleSlides     | 1        | This option works when "slidesWidth" is set to "equal"\. Determinate how much slides will be visible                                                                                                                                                                                                                                                                       |
| slidesToScroll    | 1        | By how many slides should slider move, on action "nextSlide" or "prevSlide"                                                                                                                                                                                                                                                                                                |
| draggable          | true   | Works only in 'default'mode, turn on/off touch/drag support                                                                                                                                                                                                                                                                                                                     |
| speed             | 400      | Transition duration of one single change\. In "continuous" mode speed is amount of ms per every single px                                                                                                                                                                                                                                                                  |
| easing            | linear   | Define easing of slider move animation                                                                                                                                                                                                                                                                                                                                     |
| overflow          | hidden   | Define if slider should have overflow hidden or not                                                                                                                                                                                                                                                                                                                        |
| pauseOnHover      | false    | This option works in "continuous" mode\. Determinate if carousel should stop animation on hover, or for accessibility reasons \- on focus at any element inside slider                                                                                                                                                                                                     |
| direction         | left     | This option works in "continuous" mode\. determinate if carousel should rotate from left to right, or right to left                                                                                                                                                                                                                                                        |
| preventOverScroll | true     | This option works in "default" mode\. Determinate if slider should recalculate distance to animate when wanted amount of slides to scroll is greater than amount of slides\. For example: \(You are at 4th and 5th slide, there are 6 slides\. But your slides to scroll is 2\. With this option set to true instead of going 2 slides, slider will move only by 1 slide\. |
| responsive        | \-       | Set new options to work from specified breakpoint                                                                                                                                                                                                                                                                                                                          |
| infinite              | false | This option works in "default" mode\. Set carousel to work as infinite, without end\.                                                                    |
| autoplay              | false | Slider will automatically go to next/prev slide after specified time\. Slider will stop change on track hover                                            |
| autoplaySpeed         | 1500  | Time after next/prev event will be triggered                                                                                                             |
| autoplayDirection     | right | Determinate if slider after specified amount of time should go to next or prev slide                                                                     |
| arrows                | false | Determinate if slider should create arrows to navigate                                                                                                   |
| arrowPrev / arrowNext | \-    | Allows to create arrows with custom html\. Attr to handle next/prev action will be added automatically\. It's necessary to set "arrows" option to true\. |
| generateNav                | false | Determinate if slider should look for navContainer to generate nav                                                                                                 |
| navContainer                | \- | Html element in which slider will look for elements with jedli-target attributes. Value of jedli-target in those elements will determinate index of slider to go To.                                                                                                 |
| animationChange                | transform | Allows to define animation of changing slide                                                                                                  |
| filterDelay                | 0 | Set delay before filtering, so you could add custom animation of change or anything                                                                                                  |


