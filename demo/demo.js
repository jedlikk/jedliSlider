import './demo.scss';
import jedliSlider from '../src-webpack/jedlislider.js';


// Initialize example sliders
window.addEventListener('load', () => {
    let sliderContinuousEqual = new jedliSlider(document.querySelector("[data-item='slider-continuous-equal']"), {
        "mode": "continuous",
        "slidesWidth": "equal",
        "visibleSlides": "4",
        "speed": "5",
        "direction": "right",
    })

    let sliderContinuousEqualLeft = new jedliSlider(document.querySelector("[data-item='slider-continuous-equal-left']"), {
        "mode": "continuous",
        "slidesWidth": "equal",
        "visibleSlides": "4",
        "speed": "5",
        "direction": "left",
        "pauseOnHover": "true"
    })


    let sliderContinuousAuto = new jedliSlider(document.querySelector("[data-item='slider-continuous-auto']"), {
        "mode": "continuous",
        "slidesWidth": "auto",
        "visibleSlides": "auto",
        "speed": "5",
        "direction": "right",
    })

    let sliderDefaultEqual = new jedliSlider(document.querySelector("[data-item='slider-default-equal']"), {
        "mode": "default",
        "slidesWidth": "equal",
        "visibleSlides": 5,
        "easing": "ease-out",
        "slidesToScroll": 2,
        "speed": "600",
        "preventOverScroll": "true",
    })

    // Nav for sliderDefaultEqual

    // Prev slide
    document.querySelector("[data-action='slider-default-equal-prev']").addEventListener("click", () => {
        sliderDefaultEqual.slidePrev();
    })

    // Next slide
    document.querySelector("[data-action='slider-default-equal-next']").addEventListener("click", () => {
        sliderDefaultEqual.slideNext();
    })

    // Go to specific slide
    let sliderDefaultEqualGoToSlide = document.querySelector("[data-action='slider-default-equal-to-slide']");
    sliderDefaultEqualGoToSlide.addEventListener('click', () => {

        // Get value from input number
        const value = +document.querySelector("[data-item='slider-default-equal-slide-index']").value;

        sliderDefaultEqual.goToSlide(value);
    })

    let sliderDefaultEqual2 = new jedliSlider(document.querySelector("[data-item='slider-default-equal-2']"), {
        "mode": "default",
        "slidesWidth": "equal",
        "visibleSlides": 5,
        "easing": "ease-out",
        "slidesToScroll": 2,
        "speed": "600",
        "preventOverScroll": "false",
    })

    // Nav for sliderDefaultEqual

    // Prev slide
    document.querySelector("[data-action='slider-default-equal-2-prev']").addEventListener("click", () => {
        sliderDefaultEqual2.slidePrev();
    })

    // Next slide
    document.querySelector("[data-action='slider-default-equal-2-next']").addEventListener("click", () => {
        sliderDefaultEqual2.slideNext();
    })
})


// ###################
// Continouous same init

// let sliderContinuousSameElement = document.querySelectorAll("[data-item='slider-continuous-same']")[0];

// let sliderContinuousSame = new jedliSlider(sliderContinuousSameElement, {
//     "mode": "continuous",
//     "slidesWidth": "equal",
//     "visibleSlides": "4",
//     "speed": "5",
//     'pauseOnHover': "true",
//     "responsive": [
//         {
//             "breakpoint": "992",
//             "options": {
//                 "visibleSlides": "3"
//             }
//         },
//         {
//             "breakpoint": "768",
//             "options": {
//                 "visibleSlides": "2"
//             }
//         }
//     ]
// })

// //  #########
// // Default init
// let sliderDefaultSameElement = document.querySelectorAll("[data-item='slider-default-same']")[0];

// let sliderDefaultSame = new jedliSlider(sliderDefaultSameElement, {
//     "mode": "default",
//     "slidesWidth": "equal",
//     "visibleSlides": 4,
//     "easing": "ease-out",
//     "slidesToScroll": 2,
//     "speed": "600",
// })

// // Get prev and next buttons and pin action to them
// let buttonNext = document.querySelector("[data-action='slider-default-next']");
// buttonNext.addEventListener('click', () => {
//     sliderDefaultSame.slideNext();
// })

// // Get prev and next buttons and pin action to them
// let buttonPrev = document.querySelector("[data-action='slider-default-prev']");
// buttonPrev.addEventListener('click', () => {
//     sliderDefaultSame.slidePrev();
// })


// // 
// let goToSlide = document.querySelector("[data-action='go-to-slide']");
// goToSlide.addEventListener('click', () => {

//     // Get value from input number
//     const value = +document.querySelector("[data-item='slide-index']").value;

//     sliderDefaultSame.goToSlide(value);
// })