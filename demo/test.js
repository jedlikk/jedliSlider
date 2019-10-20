import './test.scss';
import jedliSlider from '../src-webpack/jedlislider.js';


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
    "visibleSlides": 4,
    "easing": "ease-out",
    "slidesToScroll": 2,
    "speed": "600",
})

// Get prev and next buttons and pin action to them
let buttonNext = document.querySelector("[data-action='slider-default-next']");
buttonNext.addEventListener('click', () => {
    sliderDefaultSame.slideNext();
})

// Get prev and next buttons and pin action to them
let buttonPrev = document.querySelector("[data-action='slider-default-prev']");
buttonPrev.addEventListener('click', () => {
    sliderDefaultSame.slidePrev();
})


// 
let goToSlide = document.querySelector("[data-action='go-to-slide']");
goToSlide.addEventListener('click', () => {

    // Get value from input number
    const value = +document.querySelector("[data-item='slide-index']").value;

    sliderDefaultSame.goToSlide(value);
})