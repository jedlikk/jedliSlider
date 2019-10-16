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
                                this.initDefault();
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
        // Check if number of slides is greater than option.visibleSlides or options.visibleSlides is set to auto
        if (this.noOfSlides > +this.options.visibleSlides || this.options.visibleSlides === "auto") {
            switch (this.options.mode) {
                case "default":
                    this.initDefault();
                    break;

                case "continuous":
                    this.initContinuous();
                    break;
            }
        }
    }

    // Set all slides to same, specific width
    setSlidesWidth() {
        // Calculate wanted size
        // Where size of one slide is tracks Container width / options.visibleSlides
        let tracksContainer = this.item.querySelectorAll("[data-jedli=tracks-container]")[0];

        let wantedSize = tracksContainer.offsetWidth / this.options.visibleSlides + "px";

        // Add those size to slides
        let track = this.item.querySelectorAll("[data-jedli='track']")[0];
        let slides = track.querySelectorAll("[data-jedli='slide']");
        slides.forEach((element) => {
            // Set specific styles
            element.style.width = wantedSize;
            element.style.minWidth = wantedSize;
            element.style.maxWidth = wantedSize;
        });
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
        this.item.classList.add("jedli-mode-continuous");

        // Check if there is enough slides to rotate
        this.defaultStructure()

    }

    // Create structure for default slider:
    defaultStructure() {
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
                // Clone cloned element to be able to prepend and append
                let clonedSlide2 = clonedSlide.cloneNode(true);

                // append and prepend to track
                // track.prepend(clonedSlide);
                // track.appendChild(clonedSlide2);
            });

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
                    console.log("hovered");
                    track.classList.add("hovered");
                });

                e.addEventListener("focusout", () => {
                    console.log("hovered out");
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
}
