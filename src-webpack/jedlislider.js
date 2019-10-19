// JedliSlider v 0.0.1
// By Bar†łomiej Jedlikowski

import './jedlislider.scss';

class jedliSlider {
    constructor(item, options) {
        this.item = item;
        this.noOfSlides = this.countSlides();

        // Default options
        this.defaultOptions = {
            "mode": "default",
            "infinite": "false",
            "visibleSlides": "1",
            "slidesToScroll": "1",
            "speed": "400",
            "arrows": "false",
            "autoplay": "false",
            "autoplayDuration": "400",
            "draggable": "true",
            "dots": "false",
            "slidesWidth": "equal",
            "easing": "linear",
            "overflow": "hidden",
            "pauseOnHover": "false",
            "direction": "left",
        }

        // Set options to default
        this.options = this.defaultOptions;

        // Get default user options
        this.initializedOptions = options;

        // Override options with given
        this.options = Object.assign(this.options, this.initializedOptions);

        // Check if there should be already breakpoint options
        this.breakpointHandler();

        // Init function 
        this.init();

        // Handle resize 
        window.addEventListener('resize', () => {
            this.resizeHandler();
        });
    }

    // Create basic structure of slider
    init() {
        // Add attributes and classes to slider container
        this.item.classList.add("jedli-slider");

        // Get all children and add attributes and classes
        let slides = [...this.item.children];

        slides.forEach((slide) => {
            slide.setAttribute("data-jedli", "slide");
            slide.classList.add("jedli-slide");
        })

        // Create track for slider
        let track = document.createElement("div");
        // Add attributes and classes
        track.setAttribute("data-jedli", "track");
        track.classList.add("jedli-track");

        // Wrap slides in track:

        // Append slides to track
        let slidesNode = this.item.querySelectorAll("[data-jedli='slide']");
        slidesNode.forEach((element) => {
            track.appendChild(element);
        });

        // insert wrapper in the DOM tree
        this.item.appendChild(track);

        // Wrap tracks inside special container
        let tracksContainer = document.createElement("div");
        // Add attributes and classes
        tracksContainer.setAttribute("data-jedli", "tracks-container");
        tracksContainer.classList.add("jedli-tracks-container");

        // Wrap slides in track:

        // insert wrapper in the DOM tree
        this.item.appendChild(tracksContainer);

        // Append trackContainer to slider
        tracksContainer.appendChild(track);

        // Set tracksContainer height to be equal to tracks
        this.setTracksContainerHeight();

        // Add overflow hidden or visible, depends of options.overflow
        switch (this.options.overflow) {
            case "hidden":
                this.item.classList.add("jedli-overflow-hidden");
                break;
        }

        // Init slider with right options
        this.slidesWidthHandler()
            .then(
                (resolve) => {
                    this.modeHandler();
                }
            )
    }

    // Handle resize
    resizeHandler() {
        // Check if there should be already breakpoint options
        this.breakpointHandler();

        // Handle slides resize
        this.slidesWidthHandler()
            .then(
                (resolve) => {

                    // Check if number of slides is greater than option.visibleSlides or options.visibleSlides is set to auto
                    if (this.noOfSlides > +this.options.visibleSlides || this.options.visibleSlides === "auto") {
                        switch (this.options.mode) {
                            case "default":
                                // Check if there is enouth slides to rotate
                                if (this.ifEnoughToRotate()) {
                                    // Check if slider has already created structure
                                    if (this.item.getAttribute("jedli-structure") === "created") {

                                    }
                                    else {
                                        // If not, create structure
                                        this.defaultStructure()
                                    }
                                }
                                else {
                                    this.destroyContinuous();
                                }
                                break;

                            case "continuous":
                                // Check if there is enouth slides to rotate
                                if (this.ifEnoughToRotate()) {
                                    // Check if slider has already created structure
                                    if (this.item.getAttribute("jedli-structure") === "created") {
                                        // If yes, just recalculate animation
                                        this.initContinuousAnimation();
                                    }
                                    else {
                                        // If not, create structure
                                        this.continuousStructure()
                                            .then(
                                                (resolve) => {
                                                    this.initContinuousAnimation();
                                                },
                                            );
                                    }
                                }
                                else {
                                    this.destroyContinuous();
                                }
                                break;
                        }
                    }
                    else {
                        // If not -> destroy animation
                        switch (this.options.mode) {
                            case "default":
                                this.destroyDefault();
                                break;

                            case "continuous":
                                this.destroyContinuous();
                                break;
                        }
                    }
                }
            )
    }

    // Breakpoint handler 
    breakpointHandler() {
        // Check breakpoint from options.responsive
        if (this.initializedOptions.responsive) {
            // Loop through all breakpoints
            this.initializedOptions.responsive.map((e, i, length) => {
                // Get defined breakpoint 
                let breakpoint = e.breakpoint;

                // Get window width
                let windowWidth = window.innerWidth;

                // Check if screen width is smaller than breakpoint 
                if (windowWidth <= breakpoint) {
                    // If true override options with asigned to breakpoint
                    this.options = Object.assign(this.options, e.options);
                }

                // Check screen width is greater than first breakpoint
                if (this.initializedOptions.responsive[0].breakpoint <= windowWidth) {
                    // If true override with default options connected with initialized
                    this.options = Object.assign(this.defaultOptions, this.initializedOptions);
                }
            });
        }
    }

    slidesWidthHandler() {
        return new Promise((resolve, reject) => {
            // Check if slides has specific size
            switch (this.options.slidesWidth) {
                case "equal":
                    // If true => make them same size
                    this.setSlidesWidth();
                    resolve("resolved width equal");
                    break;

                case "auto":
                    // If not, do nothing
                    resolve("resolved width auto");
                    break;
            }
        });
    }

    // Init slider with right mode
    modeHandler() {
        switch (this.options.mode) {
            case "default":
                this.initDefault();
                break;

            case "continuous":
                this.initContinuous();
                break;
        }
    }

    // Set all slides to same, specific width
    setSlidesWidth() {
        // If mode is continous
        if (this.options.mode === "continuous") {
            // size of one slide is tracks Container width / options.visibleSlides
            const tracksContainer = this.item.querySelectorAll("[data-jedli=tracks-container]")[0];

            const wantedSize = tracksContainer.offsetWidth / this.options.visibleSlides + "px";

            // Check if calculated size is different than current
            if (wantedSize != +this.item.getAttribute("jedli-slide-size")) {
                // Add thise size to slides
                const track = this.item.querySelectorAll("[data-jedli='track']")[0];
                const slides = track.querySelectorAll("[data-jedli='slide']");
                slides.forEach((element) => {
                    // Set specific styles
                    element.style.width = wantedSize;
                    element.style.minWidth = wantedSize;
                    element.style.maxWidth = wantedSize;
                });

                // Add this size to slider
                this.item.setAttribute("jedli-slide-size", wantedSize);
            }
        }
        else {
            // If not 
            // Size is percent value 100 / options.visibleSlides
            const wantedSize = (100 / +this.options.visibleSlides).toFixed(2) + "%";
            // Check if calculated size is different than current
            if (wantedSize != +this.item.getAttribute("jedli-slide-size")) {

                const slides = this.item.querySelectorAll("[data-jedli='slide']");
                slides.forEach((element) => {
                    // Set specific styles
                    element.style.width = wantedSize;
                    element.style.minWidth = wantedSize;
                    element.style.maxWidth = wantedSize;
                });
                // Add this size to slider
                this.item.setAttribute("jedli-slide-size", wantedSize);
            }
        }
    }

    // Get number of slides
    countSlides() {
        let slides = this.item.children;
        return slides.length;
    }

    // Calculate width of slides
    calculateSlidesWidth() {
        // Get slides
        let slides = this.item.querySelectorAll("[data-jedli='slide']");

        // Check if number of slides is specified, or is set to auto
        // If 'options.visibleSlides' is set to 'auto' set noOfSlides to all slides
        let visibleSlides = this.options.visibleSlides;

        if (this.options.visibleSlides === "auto")
            visibleSlides = this.noOfSlides;

        // Count width of slides
        let slidesWidth = 0;

        // Loop through specified number of slides
        slides.forEach((e, i) => {
            // Ignore cloned elements
            if (!e.getAttribute('jedli-cloned')) {
                // Add to slidesWidth only specific amount of slides
                if (i < visibleSlides)
                    slidesWidth += e.offsetWidth;
            }
        });

        return slidesWidth;
    }

    // Check if there is enough slides to rotate
    ifEnoughToRotate() {
        // Check if slides has specific size
        switch (this.options.slidesWidth) {
            case "equal":
                // Check if number of slides is greater than options.visibleSlides
                // If true -> return true
                if (this.noOfSlides > this.options.visibleSlides)
                    return true;
                else
                    return false;
                break;

            case "auto":
                // Get width of specified number of slides
                let slidesWidth = this.calculateSlidesWidth();
                // Get slider width
                let sliderWidth = this.item.offsetWidth;

                // Check if sum of first *option.noOfSlides* slides is greater than slider width
                if (slidesWidth > sliderWidth) {
                    // If true, return true
                    return true;
                }
                else {
                    return false;
                }

                break;
        }
    }

    // ### DEFAULT MODE
    // Initialize 'default' mode
    initDefault() {
        // Add class default to slider
        this.item.classList.add("jedli-mode-default");
        // Check if there is enough slides to rotate
        if (this.ifEnoughToRotate()) {
            // If true, create slider structure to rotate
            this.defaultStructure()
        }
    }

    // Create structure for default slider:
    defaultStructure() {
        return new Promise((resolve, reject) => {

            // Get track 
            const track = this.item.querySelectorAll("[data-jedli='track']")[0];

            // Add attr structure created to slider
            this.item.setAttribute("jedli-structure", "created");

            // Clone slides
            const slides = this.item.querySelectorAll("[data-jedli='slide']");
            slides.forEach((e, i) => {
                let clonedSlide = e.cloneNode(true);

                // Add attr cloned to slide
                clonedSlide.setAttribute("jedli-cloned", "true");
                // Clone cloned element to be able to prepend and append
                let clonedSlide2 = clonedSlide.cloneNode(true);

                // Set jedli-index attr to elements


                // Where index of default elements are they number in order + 1
                // ** 0 will be missing because if not two elements would have 0
                e.setAttribute("jedli-index", i + 1);

                // Element of cloned before are they negative number in order but in negative numbers
                // Slide will be i + amount of slides * -1)
                clonedSlide.setAttribute("jedli-index", (i + this.noOfSlides) * -1);

                // Element of cloned after are they number in order + amount of slides
                clonedSlide2.setAttribute("jedli-index", i + this.noOfSlides);



                // append and prepend to track
                // If its first element, prepend to track. 
                // If not first -> append to element with jedli-index equal to negative i + 1
                if (i === 0) {
                    track.prepend(clonedSlide);
                }
                else {
                    if (i === 0) {
                        track.prepend(clonedSlide);
                    }
                    else {
                        let currentIndex = (i) * -1;
                        track.querySelector("[jedli-cloned='true'][jedli-index='" + currentIndex + "']").after(clonedSlide);
                    }
                }

                track.appendChild(clonedSlide2);
            });

            // Add attr and styles with transform to track
            // Wherere default transform is number of slides * percentage * -1 width of slide
            let defaultTransform = -1 * +this.noOfSlides * +this.item.getAttribute("jedli-slide-size").replace('%', '') + '%';
            track.setAttribute("jedli-transform", defaultTransform);
            track.style.transform = "translate3d(" + defaultTransform + ", 0, 0)";

            // Add attr jedli-active to slides in viewport
            this.ifInViewportHandler();

            // Add easing after 50 ms to avoid animation on start
            setTimeout(() => {
                // Add easing to track
                this.easingHandler(track);
            }, 50)


            resolve("Continuous structure created");
        });
    }

    // ### END OF DEFAULT MODE ###

    // ### CONTINUOUS MODE ### 

    // Initialize 'continuous' mode
    initContinuous() {
        // Add class continous to slider
        this.item.classList.add("jedli-mode-continuous");

        // Check if there is enough slides to rotate
        if (this.ifEnoughToRotate()) {
            this.continuousStructure()
                .then(
                    (resolve) => {
                        this.initContinuousAnimation();
                    }
                );
        }
    }

    // Destroy continuous animation
    destroyContinuous() {
        // Remove cloned elements

        let cloned = this.item.querySelectorAll("[jedli-cloned='true']")
        cloned.forEach((e) => {
            e.remove();
        });

        // Remove animation
        let track = this.item.querySelectorAll("[data-jedli='track']")[0];
        track.style.animation = "";

        // Remove attr "jedli-structure='created" from slider
        this.item.removeAttribute("jedli-structure");
    }

    // Create structure for continuous animation:
    continuousStructure() {
        return new Promise((resolve, reject) => {

            // Get track 
            let track = this.item.querySelectorAll("[data-jedli='track']")[0];

            // Add attr structure created to slider
            this.item.setAttribute("jedli-structure", "created");

            // Clone slides
            let slides = this.item.querySelectorAll("[data-jedli='slide']");
            slides.forEach((e) => {
                let clonedSlide = e.cloneNode(true);

                // Add attr cloned to slide
                clonedSlide.setAttribute("jedli-cloned", "true");

                // And append to track
                track.appendChild(clonedSlide);
            });

            resolve("Continuous structure created");
        });
    }

    // Set size of tracksContainer to width of track
    setTracksContainerHeight() {
        // Get tracksContainer
        let tracksContainer = this.item.querySelectorAll("[data-jedli='tracks-container']")[0];

        // Get track
        let track = tracksContainer.querySelector("[data-jedli='track']");
        // Get height
        let trackHeight = track.offsetHeight;
        // Set height to trackscontainer
        tracksContainer.style.height = trackHeight + "px";
    }

    // Init continuous animation
    initContinuousAnimation() {

        // Get tracks
        let track = this.item.querySelector("[data-jedli='track']");

        // If option 'pause on hover' is declarated as 'true' then add class 'pause on hover'
        // and event listener to handle track hover on children focus
        if (this.options.pauseOnHover === "true") {
            track.classList.add("jedli-hover-pause");
            track.setAttribute("pauseOnHover", "true");


            // Add listeners to every children, to handle 'pause on hover' when link inside is focused 
            // (for accessibility, people using keyboard to naviage)


            // Get all children
            let trackChildren = track.querySelectorAll("a, button");
            // Attach event listener to childrens
            trackChildren.forEach((e) => {
                e.addEventListener("focus", () => {
                    // Add class to stop slider on focus
                    track.classList.add("hovered");
                });

                e.addEventListener("focusout", () => {
                    // Remove class to stop slider on focusout
                    track.classList.remove("hovered");
                });
            })
        }

        // Set direction of animation
        if (this.options.direction === "left") {
            track.style.animationDirection = "normal";
        }

        if (this.options.direction === "right") {
            track.style.animationDirection = "reverse";
        }

        // Add styles for animation purposes to track
        // If mode == continuous, options.speed is speed for every px of track width
        let speed = this.options.speed * track.offsetWidth
        let continuousSpeed = speed / 1000 + "s";
        track.style.animationDuration = continuousSpeed;
        track.style.animationTimingFunction = this.options.easing;

    }

    // ## NAVIGATION FUNCTIONS ##

    slideNext() {

        if (this.options.mode === "default") {

            // If slider should move -> do it
            if (this.ifShouldMoveHandler("next")) {
                // Caluclate distance 
                const distance = this.calculateChangeDistance('next', this.options.slidesToScroll);

                // Animate change
                this.animateTrackChange(distance).then(
                    (resolve) => {
                        this.ifInViewportHandler();

                        // Check if slider has option infinite set to true
                        if (this.options.infinite === "true") {
                            // If true move slider to better position to keep feeling of infinite
                            this.setBetterPositionHandler();
                        }
                    }
                )
            }
        }
    }

    // Check if slider should move
    ifShouldMoveHandler(direction) {
        // Check if mode is one of this where function should work
        // For this moment those mods are:
        // default, 

        if (this.options.mode === "default") {

            // And check if slider has option infinite set to true
            // If not, check if slider should move (active slide is not the last one)
            if (this.options.infinite === "false") {
                // Get active slides
                const activeslides = this.item.querySelectorAll("[data-jedli='slide'][jedli-active='true']");

                // Check if there is enough slides to rotate, depends of direction
                if (direction === "next") {
                    // If next -> Check if 
                    let indexOfActive = activeslides[0].index;
                    console.log(indexOfActive);
                }
            }
        }
        else {
            return false;
        }
    }

    // Calculate distance of single change
    calculateChangeDistance(direction, noOfSlides) {
        // Calculate width of single slide
        const slideWidth = this.item.getAttribute("jedli-slide-size").replace("%", "");

        // Multiple * number of noOfSlides
        let distanceToScroll = +slideWidth * +noOfSlides;

        // If direction == 'prev' multiple distane * -1
        direction === "prev" ? distanceToScroll *= -1 : '';

        // Return distance to scroll
        return distanceToScroll;
    }

    // Animate change of track
    animateTrackChange(distance) {
        return new Promise((resolve, reject) => {
            // Get track
            const track = this.item.querySelector("[data-jedli='track']");
            // Get current transform position
            const currentPosition = +track.getAttribute("jedli-transform").replace("%", "");

            // Calculate new position
            const newPosition = currentPosition + distance + "%";

            // Set new position
            track.setAttribute("jedli-transform", newPosition);
            track.style.transform = "translate3d(" + newPosition + ", 0, 0)";

            // Wait for animation to finish and return resolve
            // Where timout time is speed declarated in options
            setTimeout(() => {
                resolve("Animation finished");
            }, this.options.speed);
        });
    }

    // #####
    // HELPERS
    // #####

    // Set easing and speed to target element
    easingHandler(target) {
        // add this easing to slider class
        this.easing = "transform " + (this.options.speed / 1000) + "s " + this.options.easing;

        // And to track
        target.style.transition = this.easing;
    }

    // Check if elements is in viewport if true add attr jedli-active and remove jedli-active from other elements
    ifInViewportHandler() {
        const track = this.item.querySelectorAll("[data-jedli='track']")[0];

        // Get all slides
        const slides = this.item.querySelectorAll("[data-jedli='slide']");

        // Boolean variable to store if element is in viewport
        let ifInViewport = false;
        // Loop through all and get the ones that are in viewport
        slides.forEach((e) => {
            // Get informations about element
            let elementRect = e.getBoundingClientRect();
            // Get left position
            let left = elementRect.left;
            // Get right position
            let right = elementRect.right;

            // Check if in viewport
            // If element is in viewport add atrr jedli-active = true and class jedli-active
            // If not -> remove attr and class
            if (left >= 0 && right <= window.innerWidth) {
                e.setAttribute("jedli-active", "true");
                e.classList.add("jedli-active");
            }
            else {
                e.setAttribute("jedli-active", "false");
                e.classList.remove("jedli-active");
            }
        });
    }

    // Move slider to better position without transition to keep feeling of 'carousel'
    setBetterPositionHandler() {
        console.log("set better position");
    }
}

export default jedliSlider;
