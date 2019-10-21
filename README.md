# jedliSlider

![](https://img.shields.io/badge/version-0.7.7-blue.svg)

### DEMO page
[DEMO](http://jedlikk.github.io/jedliSlider/)

### What is jedliSlider?

jedliSlider is lightweight carousel with multiple options and modes to use on your page, created in pure (vanilla) javascript and css.

### Compatibility

Slider is built on css flexbox. So will be compatible with every browser that supports flexbox.

### Why jedliSlider?

Because it’s lightweight, easy to use, modern and will have all options that you want. Some popular carousels still use floats and a lot of unnecessary scripts/styles. My intention was to create one slider, that will contain all things i missed in other carousels. With as low code and css as possible. So you don't need to override some default styles and download multiple libraries for specific types of carousels.

## Status
There are currently two working modes:

continuous - fully implemented
default - partial support, (check available options on [DEMO page](http://jedlikk.github.io/jedliSlider/#options))

## What's new?
### v. 0.7.7
- Created DEMO page
- Added default mode with 'infinity' set to false.
- #defaultMode - Added functionality for 'go to next slide'
- #defaultMode - Added functionality for 'go to prev slide'
- #defaultMode - Added functionality for 'go to specific slide'
- Added option 'overflow hidden'


### Features soon:

- Inifnite carousel for 'default' mode
- Touch (drag) support for default mode
- Creating arrows from options
- Creating nav from options
- 'Centered' mode, where some slides are bigger, smaller or highlighted by other way, with some levels of highlightness and animation between levels

## List of options

More info on [DEMO page](http://jedlikk.github.io/jedliSlider/#options)


| Option:           | Default: | Description:                                                                                                                                                                                                                                                                                                                                                               |
|-------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mode              | default  | jedliSlider contain few different modes, types of carousels\. Select wanted one\. This option define how almost all of other options will work                                                                                                                                                                                                                             |
| slidesWidth       | equal    | determinate if all slides should be same size, specified by slider; or width of every slides can be different, specifed from css                                                                                                                                                                                                                                           |
| visibleSlides     | 1        | This option works when "slidesWidth" is set to "equal"\. Determinate how much slides will be visible                                                                                                                                                                                                                                                                       |
| slidesToScroll    | 1        | By how many slides should slider move, on action "nextSlide" or "prevSlide"                                                                                                                                                                                                                                                                                                |
| speed             | 400      | Transition duration of one single change\. In "continuous" mode speed is amount of ms per every single px                                                                                                                                                                                                                                                                  |
| easing            | linear   | Define easing of slider move animation                                                                                                                                                                                                                                                                                                                                     |
| overflow          | hidden   | Define if slider should have overflow hidden or not                                                                                                                                                                                                                                                                                                                        |
| pauseOnHover      | false    | This option works in "continuous" mode\. Determinate if carousel should stop animation on hover, or for accessibility reasons \- on focus at any element inside slider                                                                                                                                                                                                     |
| direction         | left     | This option works in "continuous" mode\. determinate if carousel should rotate from left to right, or right to left                                                                                                                                                                                                                                                        |
| preventOverScroll | true     | This option works in "default" mode\. Determinate if slider should recalculate distance to animate when wanted amount of slides to scroll is greater than amount of slides\. For example: \(You are at 4th and 5th slide, there are 6 slides\. But your slides to scroll is 2\. With this option set to true instead of going 2 slides, slider will move only by 1 slide\. |
| responsive        | \-       | Set new options to work from specified breakpoint                                                                                                                                                                                                                                                                                                                          |


## How to use

### If you work with webpack
just import src-webpack/jedlislider.js

### If you work without webpack, add this files to your wesbite by script and link tag:

- dist/jedlislider.bundle.css
- src/jedlislider.js


