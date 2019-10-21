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
            "slidesWidth": "equal",
            "visibleSlides": "1",
            "slidesToScroll": "1",
            "speed": "400",
            "arrows": "false",
            "autoplay": "false",
            "infinite": "false",
            "autoplayDuration": "400",
            "draggable": "true",
            "dots": "false",
            "easing": "linear",
            "overflow": "hidden",
            "pauseOnHover": "false",
            "direction": "left",
            "preventOverScroll": "true",
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


        // Check if slider should have overflow hidden
        if (this.options.overflow === "hidden") {
            // If hidden -> add overflow hidden to trackscontainer
            tracksContainer.style.overflow = "hidden";
        }

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
                    // Set tracksContainer height to be equal to tracks
                    this.setTracksContainerHeight();
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

            // Add attr structure-created to slider
            this.item.setAttribute("jedli-structure", "created");

            // Add attr jedli-active to first (options.visibleSlides) slides
            // And add numeric index to sldies
            const slides = this.item.querySelectorAll("[data-jedli='slide']");
            slides.forEach((e, i) => {
                // Add index number to slide
                e.setAttribute("jedli-index", i + 1);

                // Check if i + 1 is smaller then visible slides
                if (i < +this.options.visibleSlides) {
                    // If true, add attr active to element
                    e.setAttribute("jedli-active", "true");
                }
            })

            // Add attr and styles with transform to track
            // Wherere default transform is number of slides * percentage * -1 width of slide
            let defaultTransform = 0;
            track.setAttribute("jedli-transform", defaultTransform);
            track.style.transform = "translate3d(" + defaultTransform + ", 0, 0)";

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

    // Set size of tracksContainer to height of track
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

    // Go to next slide
    slideNext() {
        // Check if track should move
        if (this.ifShouldMove("next")) {
            // Caluclate distance 
            const distance = this.calculateChangeDistance('next', this.options.slidesToScroll);

            // Animate change
            this.animateTrackChange(distance).then(
                (resolve) => {
                    // Update active slides
                    this.updateActiveSldies().then(
                        (resolve) => {
                            // Remove attr preventing change
                            this.item.setAttribute("jedli-prevent-change", "false");
                        }
                    );
                }
            );
        }
    }

    // Go to prev slide
    slidePrev() {
        // Check if track should move
        if (this.ifShouldMove("prev")) {
            // Caluclate distance 
            const distance = this.calculateChangeDistance('prev', this.options.slidesToScroll);

            // Animate change
            this.animateTrackChange(distance).then(
                (resolve) => {
                    // Update active slides
                    this.updateActiveSldies().then(
                        (resolve) => {
                            // Remove attr preventing change
                            this.item.setAttribute("jedli-prevent-change", "false");
                        }
                    );
                }
            );
        }
    }

    // Go to specific slide
    goToSlide(slideIndex) {
        // Check if this slide is "next" or "prev" to current slider position
        const wantedSlideDirection = this.checkWantedSlideDirection(slideIndex);

        // Check if wantedslideDirection is "false" which means that slide is not found, or is currently active
        if (wantedSlideDirection === "false") {
            return false;
        }
        else {
            // Check if track should move
            if (this.ifShouldMove(wantedSlideDirection)) {
                // Calculate how much slides slider needs to scroll to specific slide
                const slidesToScroll = this.calculateDistanceInSlides(wantedSlideDirection, slideIndex);

                // Caluclate distance 
                const distance = this.calculateChangeDistance(wantedSlideDirection, slidesToScroll);

                // Animate change
                this.animateTrackChange(distance).then(
                    (resolve) => {
                        // Update active slides
                        this.updateActiveSldies().then(
                            (resolve) => {
                                // Remove attr preventing change
                                this.item.setAttribute("jedli-prevent-change", "false");
                            }
                        );
                    }
                );
            }
        }
    }

    // Check if this slide is "next" or "prev" to current slider position
    checkWantedSlideDirection(slideIndex) {
        // Check if there is such slide
        if (this.item.querySelectorAll("[data-jedli='slide'][jedli-index='" + slideIndex + "']").length > 0) {
            // If true
            // Get active slides 
            const activeSlides = this.item.querySelectorAll("[data-jedli='slide'][jedli-active='true']");

            // Check if index of wanted slide is smaller than index of first active slide
            const firstActiveIndex = +activeSlides[0].getAttribute("jedli-index");
            if (slideIndex < firstActiveIndex) {
                // If true, return prev
                return "prev";
            }
            else {
                // If false, check if index of wanted slide is greater than index of last of active slide
                const lastActiveIndex = +activeSlides[activeSlides.length - 1].getAttribute("jedli-index");
                if (slideIndex > lastActiveIndex) {
                    return "next";
                }
                else {
                    // If slide is not any of those, return false to stop change
                    return false;
                }
            }
        }
        else {
            // If not return false to stop change
            return false;
        }
    }

    // Calculate how much slides slider needs to scroll to specific slide
    calculateDistanceInSlides(direction, slideIndex) {
        // Check depends of direciton, how much slides is between wanted one and currently last/first active

        // Variable for distance
        var distance;

        // Get active slides
        const activeSlides = this.item.querySelectorAll("[data-jedli='slide'][jedli-active='true']");
        if (direction === "prev") {
            // If direction is prev, get first active slide
            const firstActiveIndex = +activeSlides[0].getAttribute("jedli-index");

            // Calculate difference between first and wanted slide
            distance = firstActiveIndex - slideIndex;
        }

        if (direction === "next") {
            // If direction is prev, get first active slide
            const lastActiveIndex = +activeSlides[activeSlides.length - 1].getAttribute("jedli-index");

            // Calculate difference between first and wanted slide
            distance = slideIndex - lastActiveIndex;
        }


        // If direction is not next and prev, then return 0. And slider wont move
        if (direction != "prev" && direction != "next") {
            distance = 0;
        }

        return distance;
    }

    // Check if track should move
    ifShouldMove(direction) {
        // Check if slider currently is animating
        if (this.item.getAttribute("jedli-prevent-change") === "true") {
            return false;
        }
        else {
            // Check if mode is one of this where function should work
            // For this moment those mods are:
            // default, 
            if (this.options.mode === "default") {
                // Check if options.infinite is set to true
                if (this.options.infinite === "false") {
                    // If not, check if next/prev slide is the last one to move
                    // Get active slides 
                    const activeSlides = this.item.querySelectorAll("[data-jedli='slide'][jedli-active='true']");

                    if (direction === "next") {
                        // If direction is set to next
                        // Check if there is  any slide after last with jedli-active

                        // get last active slide
                        const lastActive = activeSlides[activeSlides.length - 1];

                        // Get index of last active
                        const index = +lastActive.getAttribute("jedli-index");

                        // Check if there is slide with bigger index
                        if (this.item.querySelectorAll("[data-jedli='slide'][jedli-index='" + (index + 1) + "']").length > 0) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }

                    if (direction === "prev") {
                        // If direction is set to prev
                        // Check if there is  any slide before first with jedli-active

                        // get last active slide
                        const firstActive = activeSlides[0];

                        // Get index of first active
                        const index = +firstActive.getAttribute("jedli-index");

                        // Check if there is slide with bigger index
                        if (this.item.querySelectorAll("[data-jedli='slide'][jedli-index='" + (index - 1) + "']").length > 0) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
            }
        }
    }

    updateActiveSldies(direction) {
        return new Promise((resolve, reject) => {
            // Get slides that are in 'viewport' of slides container
            const tracksContainer = this.item.querySelector("[data-jedli='tracks-container']");
            // Get positions in viewport of tracksContainer
            let tracksContainerRect = tracksContainer.getBoundingClientRect();

            // Get slides
            const slides = this.item.querySelectorAll("[data-jedli='slide']");
            // Loop through slides
            slides.forEach((e, i) => {
                // Check if slides is in tracksContainer viewport
                let slideRect = e.getBoundingClientRect();

                // Check if in biewport
                // Slide is in viewport when:
                // Slide left value is greater or equal to tracksContainer left value
                // Slide right value is smaller or equal to tracksContainer right value
                if (Math.round(slideRect.left) >= Math.round(tracksContainerRect.left) && Math.round(slideRect.right) <= Math.round(tracksContainerRect.right)) {
                    // if in viewport add attr jedli-active
                    e.setAttribute("jedli-active", "true");
                }
                else {
                    // if not in viewport remove attr jedli-active
                    e.setAttribute("jedli-active", "false");
                }
            })

            resolve("activeSlidesUpdated");
        })
    }

    // Prevent slider from overScroll - fix distance to scroll, so first/last slide will always at start/end of container
    preventOverScroll(direction, slidesToScroll) {
        // Get active slides
        const activeSlides = this.item.querySelectorAll("[data-jedli='slide'][jedli-active='true']");
        // Get slides 
        const slides = this.item.querySelectorAll("[data-jedli='slide']");

        // Variable for fixed amount of slides to scroll
        let fixedSlidesToScroll

        if (direction === "prev") {
            // If direction is prev, get first active slide and first slide
            const firstIndex = +slides[0].getAttribute("jedli-index");
            const firstActiveIndex = +activeSlides[0].getAttribute("jedli-index");

            // Check if there is enough slides to scroll wanted amount of slides
            if (firstActiveIndex - slidesToScroll >= firstIndex) {
                // If true -> don't change amount of slidesToScroll
                fixedSlidesToScroll = slidesToScroll;
            }
            else {
                // If there is not enough slides, than set left amount of slides as slidesToScroll
                fixedSlidesToScroll = firstActiveIndex - firstIndex;
            }
        }

        if (direction === "next") {
            // If direction is prev, get first active slide and first slide
            const lastIndex = +slides[slides.length - 1].getAttribute("jedli-index");
            const lastActiveIndex = +activeSlides[activeSlides.length - 1].getAttribute("jedli-index");

            // Check if there is enough slides to scroll wanted amount of slides
            if (lastActiveIndex + slidesToScroll <= lastIndex) {
                // If true -> don't change amount of slidesToScroll
                fixedSlidesToScroll = slidesToScroll;
            }
            else {
                // If there is not enough slides, than set left amount of slides as slidesToScroll
                fixedSlidesToScroll = lastIndex - lastActiveIndex;
            }
        }

        // Return fixed value
        return fixedSlidesToScroll;
    }

    // Calculate distance of single change
    calculateChangeDistance(direction, slidesToScroll) {
        // Check if options.preventOverScroll is set to true
        if (this.options.preventOverScroll === "true") {
            // If true, fix amount of slides to scroll
            slidesToScroll = this.preventOverScroll(direction, slidesToScroll);
        }

        // Calculate width of single slide
        const slideWidth = +this.item.getAttribute("jedli-slide-size").replace("%", "");

        // Multiple * number of slides to scroll
        let distanceToScroll = slideWidth * +slidesToScroll;

        // If direction == 'prev' multiple distane * -1
        direction === "next" ? distanceToScroll *= -1 : '';

        // Return distance to scroll
        return distanceToScroll;
    }

    // Animate change of track
    animateTrackChange(distance) {
        return new Promise((resolve, reject) => {
            // Get track
            const track = this.item.querySelector("[data-jedli='track']");

            // Add transition to track
            track.style.transition = "transform " + this.options.speed / 1000 + "s " + this.options.easing;

            // Add attr to prevent multiclick
            this.item.setAttribute("jedli-prevent-change", "true");

            // Get current transform position
            const currentPosition = +track.getAttribute("jedli-transform").replace("%", "");

            // Calculate new position
            const newPosition = currentPosition + distance + "%";

            // Set new position
            track.style.transform = "translate3d(" + newPosition + ", 0, 0)";

            // Update jedli-transform attr
            track.setAttribute("jedli-transform", newPosition);

            // Wait for animation to finish and then resolve
            setTimeout(() => {
                resolve("Animation finished");
            }, +this.options.speed + 50);
        });
    }
}

export default jedliSlider;
