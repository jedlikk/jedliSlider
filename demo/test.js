import './test.scss';
import '../src/jedlislider.js';
import jedliSlider from '../src/jedlislider.js';

let sliderElement = document.querySelectorAll("[data-item='slider']")[0];

let slider = new jedliSlider(sliderElement, {
    "mode": "continuous",
    "slidesWidth": "auto",
    "visibleSlides": "auto",
    "speed": "5",
    "direction": "right",
})

// ###################
// Continouous same init

let sliderContinuousSameElement = document.querySelectorAll("[data-item='slider-continuous-same']")[0];

let sliderContinuousSame = new jedliSlider(sliderContinuousSameElement, {
    "mode": "continuous",
    "slidesWidth": "equal",
    "visibleSlides": "4",
    "speed": "5",
    'pauseOnHover': "true",
    "responsive": [
        {
            "breakpoint": "992",
            "options": {
                "visibleSlides": "3"
            }
        },
        {
            "breakpoint": "768",
            "options": {
                "visibleSlides": "2"
            }
        }
    ]
})

//  #########
// Default init
let sliderDefaultSameElement = document.querySelectorAll("[data-item='slider-default-same']")[0];

let sliderDefaultSame = new jedliSlider(sliderDefaultSameElement, {
    "mode": "default",
    "slidesWidth": "equal",
    "visibleSlides": "4",
    "speed": "600",
})
