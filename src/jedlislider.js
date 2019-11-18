// JedliSlider v 0.11.16
// By Bar†łomiej Jedlikowski

class jedliSlider {
    constructor(item, options) {
        this.item = item;
        this.noOfSlides = this.countSlides();

        // Current transform value of slider, for drag event
        this.currentTransform = [0, 0];
        this.lastDirection = "next";

        // Default options
        this.defaultOptions = {
            "mode": "default",
            "infinite": "false",
            "slidesWidth": "equal",
            "visibleSlides": "1",
            "slidesToScroll": "1",
            "speed": "400",
            "arrows": "false",
            "infinite": "false",
            "autoplayDuration": "400",
            "draggable": "true",
            "dots": "false",
            "easing": "linear",
            "animationChange": "transform",
            "overflow": "hidden",
            "pauseOnHover": "false",
            "direction": "left",
            "preventOverScroll": "true",
            "draggable": "true",
            "arrows": "false",
            "arrowPrev": "",
            "arrowNext": "",
            "autoplay": "false",
            "autoplaySpeed": "1500",
            "autoplayDirection": "right",
            "generateNav": "false",
            "navContainer": "",
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
        this.eventBeforeInit();

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

        // Add arrows if 'arrows' option is set to true
        if (this.options.arrows === "true")
            this.createArrows();

        // Generate nav functionality if 'generateNav' option is set to true
        if (this.options.generateNav === "true")
            this.generateNav();


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
                    // Set tracksContainer height to be equal to tracks if mode is set to continuous
                    if (this.options.mode === "continuous")
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
                                // Reinit position of blocks
                                this.reInitInfiniteBlocksPosition();

                                // Update active slides
                                this.updateActiveSlides();

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
                                    this.destroyDefault();
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

    // Destroy handler
    destroyHandler() {
        return new Promise((resolve, reject) => {

            switch (this.options.mode) {
                case "default":
                    this.destroyDefault();

                    break;

                case "continuous":
                    this.destroyContinuous();
                    break;
            }

            resolve("destroyed");
        });
    }

    // Reinit
    reinitHandler() {
        this.destroyHandler().then(
            (resolve) => {
                // console.log("destroyed as cat");
                this.init();
            }
        );
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

    // Handle autplay
    autoplayHandler() {
        // Set interval, where time to repeat is option.autoplaySpeed
        window.setInterval(() => {
            // Check if slider has attr to prevent move
            // Or browser tab is inactive
            if (this.item.getAttribute("jedli-prevent-autoplay") === "true" || document.visibilityState === "hidden") {
                // If true, do nothing
                return false;
            }
            else {
                // If not, animate

                // Check direction
                // If right, trigger slideNext
                if (this.options.autoplayDirection === "right")
                    this.slideNext();

                // If left, trigger slidePrev
                if (this.options.autoplayDirection === "left")
                    this.slidePrev();
            }

        }, +this.options.autoplaySpeed);

        // If option pauseOnHover is set to true
        if (this.options.pauseOnHover === "true") {

            const track = this.item.querySelector("[data-jedli='track']");
            // Add attr to prevent autoplay on track hover, or focus on anything inside
            track.addEventListener("mouseover", () => {
                this.item.setAttribute("jedli-prevent-autoplay", "true");
            })

            track.addEventListener("mouseout", () => {
                this.item.setAttribute("jedli-prevent-autoplay", "false");
            })


            // Add listeners to every children, to handle 'pause on hover' when link inside is focused 
            // (for accessibility, people using keyboard to naviage)
            // Get all children
            let trackChildren = track.querySelectorAll("a, button");
            // Attach event listener to childrens
            trackChildren.forEach((e) => {
                e.addEventListener("focus", () => {
                    // Add class to stop slider on focus
                    this.item.setAttribute("jedli-prevent-autoplay", "true");
                });

                e.addEventListener("focusout", () => {
                    // Remove class to stop slider on focusout
                    this.item.setAttribute("jedli-prevent-autoplay", "false");
                });
            })
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

    createArrows() {
        let arrowPrev;
        let arrowNext;

        // Check if there is specified structure for arrows, if true, add them instead of default 
        if (this.options.arrowPrev.length > 0) {
            // If true, set arrowPrev as specified and add attr jedli-action='prev'
            arrowPrev = this.options.arrowPrev;
            arrowPrev = addToString(arrowPrev, " jedli-action='prev' ");
        }
        else
            arrowPrev = "<button type='button' class='jedli-arrow jedli-arrow-prev' jedli-action='prev' >PREV</button>";

        if (this.options.arrowNext.length > 0) {
            // If true, set arrowNext as specified and add attr jedli-action='next'
            arrowNext = this.options.arrowNext;
            arrowNext = addToString(arrowNext, " jedli-action='next' ");
        }
        else
            arrowNext = "<button type='button' class='jedli-arrow jedli-arrow-next' jedli-action='next' >NEXT</button>";

        // Add arrows to slider
        this.item.insertAdjacentHTML("afterbegin", arrowPrev);
        this.item.insertAdjacentHTML("beforeend", arrowNext);

        // Add event listener to arrows
        const arrowPrevElement = this.item.querySelector("[jedli-action='prev']");
        arrowPrevElement.addEventListener("click", () => {
            this.slidePrev();
        })

        const arrowNextElement = this.item.querySelector("[jedli-action='next']");
        arrowNextElement.addEventListener("click", () => {
            this.slideNext();
        })

        // Add wanted string right before end of '>' tag in other string
        function addToString(string, toAdd) {
            const position = string.search(">");
            // Replace 
            const output = [string.slice(0, position), toAdd, string.slice(position)].join('');

            return output;
        }
    }

    generateNav() {
        // Get nav container from options
        const navContainer = this.options.navContainer;
        // Check if navContainer exists
        if (navContainer) {
            // Find all elements with jedli target
            const navElements = navContainer.querySelectorAll("[jedli-target]");
            if (navElements.length > 0) {
                navElements.forEach((e) => {
                    // Add goToSlide functionality to this element
                    // Where wanted slidee is jedli-target
                    let target = +e.getAttribute("jedli-target");
                    e.addEventListener("click", () => {
                        this.goToSlide(target);
                    })
                })
            }
            else {
                console.warn("Nav elements not found. Add elements with attr jedli-target='Here Number of slide' to your nav");
            }
        }
    }

    // ### DEFAULT MODE
    // Initialize 'default' mode
    initDefault() {
        // Add class default to slider
        this.item.classList.add("jedli-mode-default");

        // If draggable set to true, init dragHandler
        if (this.options.draggable === "true") {
            this.dragHandler();
        }

        // Check if there is enough slides to rotate
        if (this.ifEnoughToRotate()) {
            // If true, create slider structure to rotate
            this.defaultStructure().then(
                (resolve) => {
                    // Update active (visible) slides
                    this.updateActiveSlides().then(
                        (resolve) => {
                            // Fire after init event
                            this.eventAfterInit();
                        }
                    );


                    // Check if autoplay is set to true
                    if (this.options.autoplay === "true") {
                        // If true, init autoplay
                        this.autoplayHandler();
                    }
                }
            )
        }
    }

    // Destroy default slider
    destroyDefault() {
        return new Promise((resolve, reject) => {
            // Remove cloned elements

            // console.log("destroy default");

            let cloned = this.item.querySelectorAll("[data-jedli='slides-block'][jedli-cloned='true']")
            cloned.forEach((e) => {
                e.remove();
            });



            resolve("default destroyed");
        });
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

                // Add attr that slide is not cloned
                e.setAttribute("jedli-cloned", "false");
            })

            // Add attr and styles with transform to track
            // Wherere default transform is number of slides * percentage * -1 width of slide
            let defaultTransform = "0%";
            track.setAttribute("jedli-transform", defaultTransform);
            track.style.transform = "translate3d(" + defaultTransform + ", 0, 0)";

            // create structure for infinite carousel
            if (this.options.infinite === "true") {
                // Wrap slides in block

                // Create block
                const block = document.createElement("div");

                // Add attrs and classes to block
                block.classList.add("jedli-slides-block");
                block.setAttribute("data-jedli", "slides-block");

                // Append block to track
                track.appendChild(block);

                // Append slides to block
                slides.forEach((e) => {
                    block.appendChild(e);
                })

                // Create cloned block
                const clonedBlock = block.cloneNode(true);
                // Add attr jedli-cloned to slides
                const clonedSlides = clonedBlock.querySelectorAll("[data-jedli='slide']");
                clonedSlides.forEach((e) => {
                    e.setAttribute("jedli-cloned", "true");
                })

                // Clone slides block to the start and end
                const clonedBlockStart = clonedBlock.cloneNode(true);
                const clonedBlockEnd = clonedBlock.cloneNode(true);

                // Add attributes and classes
                clonedBlockStart.classList.add("jedli-cloned");
                clonedBlockStart.classList.add("jedli-slides-block-start");
                clonedBlockStart.setAttribute("jedli-cloned", "true");
                clonedBlockStart.setAttribute("jedli-block", "start");

                clonedBlockEnd.classList.add("jedli-cloned");
                clonedBlockEnd.classList.add("jedli-slides-block-end");
                clonedBlockEnd.setAttribute("jedli-cloned", "true");
                clonedBlockEnd.setAttribute("jedli-block", "end");

                block.setAttribute("jedli-block", "default");


                // Append and prepend blocks to track
                track.prepend(clonedBlockStart);
                block.after(clonedBlockEnd);

                // Add wanted styles to both cloned blocks
                this.setInfnitePosition(clonedBlockStart, "start");
                this.setInfnitePosition(clonedBlockEnd, "end");

                // Calculate special index, for infinite mode
                const slidesAll = this.item.querySelectorAll("[data-jedli='slide']");
                slidesAll.forEach((e, i) => {
                    // Add index number to slide
                    e.setAttribute("jedli-infinite-index", i + 1);
                })
            }

            resolve("Continuous structure created");
        });
    }

    reInitInfiniteBlocksPosition() {
        // Get blockStart and blockEnd
        const blockStart = this.item.querySelectorAll("[data-jedli='slides-block'][jedli-block='start']");;
        const blockEnd = this.item.querySelectorAll("[data-jedli='slides-block'][jedli-block='end']");

        // Add wanted styles to both cloned blocks
        if (blockStart.length > 0)
            this.setInfnitePosition(blockStart[0], "start");

        if (blockEnd.length > 0)
            this.setInfnitePosition(blockEnd[0], "end");
    }

    // Set position of help blocks, calculating numbers of slides
    // Where distance = number of slides * percentage width of single slide
    setInfnitePosition(element, side) {
        const distance = +this.noOfSlides * +this.item.getAttribute("jedli-slide-size").replace("%", "");
        // Set attr with distance
        element.setAttribute("jedli-position", distance + "%");

        // Add distance depends of side,
        // If 'start' then add right = distance %
        if (side === "start") {
            element.style.left = "";
            element.style.right = distance + "%";
        }

        // If 'start' then add left = distance %
        if (side === "end") {
            element.style.right = "";
            element.style.left = distance + "%";
        }
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
                        this.initContinuousAnimation().then(
                            (resolve) => {
                                // Fire after init event
                                this.eventAfterInit();
                            }
                        );
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
        return new Promise((resolve, reject) => {
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

            resolve("Continuous animation initialized");
        })
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
                    this.updateActiveSlides().then(
                        (resolve) => {
                            // Check if infinite is set to true
                            if (this.options.infinite === "true") {
                                // Update position of track to keep feeling of infinite carousel
                                this.updateInfiniteTrackPosition();
                            }

                            // Remove attr preventing change and drag
                            this.item.setAttribute("jedli-prevent-change", "false");
                            this.item.setAttribute("jedli-prevent-drag", "false");

                            this.eventAfterChange();
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
                    this.updateActiveSlides().then(
                        (resolve) => {
                            // Check if infinite is set to true
                            if (this.options.infinite === "true") {
                                // Update position of track to keep feeling of infinite carousel
                                this.updateInfiniteTrackPosition();
                            }

                            // Remove attr preventing change and drag
                            this.item.setAttribute("jedli-prevent-change", "false");
                            this.item.setAttribute("jedli-prevent-drag", "false");

                            this.eventAfterChange();
                        }
                    );
                }
            );
        }
    }

    // Go to specific slide
    goToSlide(slideIndex, isDragEvent = false, specificDirection) {
        let wantedSlideDirection;

        // Check if specificDirection is set, if not calculate direction
        if (specificDirection) {
            wantedSlideDirection = specificDirection;
        }
        else {
            // Check if slider is in infinite option and is not drag event
            if (this.options.infinite === "true" && isDragEvent === false) {
                // If true, calculate which slide is closer (because every slide is cloned two times)
                // Get all slides with this index
                const wantedSlides = this.item.querySelectorAll("[data-jedli='slide'][jedli-index='" + slideIndex + "']");
                if (wantedSlides.length > 0) {
                    // Get index of first and last visible slide
                    const visibleSlides = this.item.querySelectorAll("[data-jedli='slide'][jedli-active='true']");
                    const firstVisible = +visibleSlides[0].getAttribute("jedli-infinite-index");
                    const lastVisible = +visibleSlides[visibleSlides.length - 1].getAttribute("jedli-infinite-index");
                    // Check if any of slides is currently active
                    let alreadyActive = false;
                    wantedSlides.forEach((e) => {
                        // If any of slides is currently active, add attr to prevent function
                        if (e.getAttribute("jedli-active") === "true") {
                            alreadyActive = true;
                        }
                    })

                    // Prevent function if any of wanted slides is currently active
                    if (alreadyActive === false) {
                        // Get indexes of wanted slides
                        // And:
                        // Calculate distance to currently active slides
                        let distancePrev = [+this.noOfSlides, 0];
                        let distanceNext = [+this.noOfSlides];
                        wantedSlides.forEach((e) => {
                            let elementIndex = +e.getAttribute("jedli-infinite-index");

                            // Distance prev
                            let currentDistance = Math.abs(firstVisible - elementIndex);
                            if (currentDistance < distancePrev[0]) {
                                distancePrev[0] = currentDistance;
                                distancePrev[1] = elementIndex;
                            }

                            // Distance next
                            currentDistance = Math.abs(elementIndex - lastVisible);
                            if (currentDistance < distanceNext[0]) {
                                distanceNext[0] = currentDistance;
                                distanceNext[1] = elementIndex;
                            }
                        });

                        // Update slideDirection and slideIndex to infinite index
                        if (distancePrev[0] === distanceNext[0]) {
                            wantedSlideDirection = 'next';
                            slideIndex = distanceNext[1];
                        }

                        if (distancePrev[0] < distanceNext[0]) {
                            wantedSlideDirection = 'prev';
                            slideIndex = distancePrev[1];
                        }

                        if (distancePrev[0] > distanceNext[0]) {
                            wantedSlideDirection = 'next';
                            slideIndex = distanceNext[1];
                        }
                    }
                    else {
                        // If wanted slide is already active, return false
                        wantedSlideDirection = false;
                    }
                }
                else {
                    // If there is no such slides, return false
                    wantedSlideDirection = false;
                }
            }
            else {
                // If not, calculate slide direction depends of given slide and if isDragEvent
                // Check if this slide is "next" or "prev" to current slider position
                wantedSlideDirection = this.checkWantedSlideDirection(slideIndex, isDragEvent);
            }
        }


        // Check if wantedslideDirection is "false" which means that slide is not found, or is currently active
        if (wantedSlideDirection === false) {
            return false;
        }
        else {
            // Check if track should move
            if (this.ifShouldMove(wantedSlideDirection, isDragEvent)) {
                // Calculate how much slides slider needs to scroll to specific slide
                const slidesToScroll = this.calculateDistanceInSlides(wantedSlideDirection, slideIndex, true);

                // Check if infinite is set to true and it's not drag event
                if (this.options.infinite == true && isDragEvent == false) {
                    // Update position of cloned blocks to keep feeling of infinite carousel
                    this.updateInfiniteBlocksPosition();
                }

                // Caluclate distance
                const distance = this.calculateChangeDistance(wantedSlideDirection, slidesToScroll);

                // Animate change
                this.animateTrackChange(distance, false, isDragEvent).then(
                    (resolve) => {
                        // Update active slides
                        this.updateActiveSlides().then(
                            (resolve) => {
                                // Check if infinite is set to true
                                if (this.options.infinite === "true") {
                                    // If it's drag event, update blocks position now
                                    if (isDragEvent === true) {
                                        this.updateInfiniteBlocksPosition();
                                    }

                                    // Update position of track to keep feeling of infinite carousel
                                    this.updateInfiniteTrackPosition();
                                    this.eventAfterChange();
                                }

                                // Remove attr preventing change and drag
                                this.item.setAttribute("jedli-prevent-change", "false");
                                this.item.setAttribute("jedli-prevent-drag", "false");
                            }
                        );
                    }
                );
            }
        }
    }

    // Check if this slide is "next" or "prev" to current slider position
    checkWantedSlideDirection(slideIndex, isDragEvent = false) {
        // Check if there is such slide
        // But if infiniteIndex is set to true, get by jedli-infinite-index instead of jedli-index
        let indexAttr;
        if (isDragEvent === true) {
            indexAttr = "jedli-infinite-index";
        }
        else {

            // Check if slider is 'infinite', if true, calculate which way will be shorter
            if (this.options.infinite === "true") {
                // Calculate which way will be shorter
                // Check if slide with this index exists
                if (this.item.querySelectorAll("[data-jedli='slide'][jedli-index='" + slideIndex + "']").length > 0) {
                    // If true, get currently active slides
                    const activeSlides = this.item.querySelectorAll("[data-jedli='slide'][jedli-active='true']");

                    // Check if infinite index of first active slide is 
                }
                else {
                    return false;
                }
            }
            else {
                indexAttr = "jedli-index";
            }
        }

        if (this.item.querySelectorAll("[data-jedli='slide'][" + indexAttr + "='" + slideIndex + "']").length > 0) {
            // If true
            // Get active slides
            const activeSlides = this.item.querySelectorAll("[data-jedli='slide'][jedli-active='true']");

            // Check if index of wanted slide is smaller than index of first active slide
            const firstActiveIndex = +activeSlides[0].getAttribute(indexAttr);
            if (slideIndex < firstActiveIndex) {
                // If true, return prev
                return "prev";
            }
            else {
                // If false, check if index of wanted slide is greater than index of last of active slide
                const lastActiveIndex = +activeSlides[activeSlides.length - 1].getAttribute(indexAttr);
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
    calculateDistanceInSlides(direction, slideIndex, getInfiniteIndex = false) {

        // Check depends of direciton, how much slides is between wanted one and currently last/first active
        // But if infiniteIndex is set to true, get by jedli-infinite-index instead of jedli-index
        let indexAttr;
        if (this.options.infinite === "true") {
            indexAttr = "jedli-infinite-index";
        }
        else {
            indexAttr = "jedli-index";
        }

        // Variable for distance
        let distance;

        // Get active slides
        const activeSlides = this.item.querySelectorAll("[data-jedli='slide'][jedli-active='true']");
        if (direction === "prev") {
            // If direction is prev, get first active slide
            const firstActiveIndex = +activeSlides[0].getAttribute(indexAttr);

            // Calculate difference between first and wanted slide
            distance = firstActiveIndex - slideIndex;
        }

        if (direction === "next") {
            // If direction is prev, get first active slide
            const lastActiveIndex = +activeSlides[activeSlides.length - 1].getAttribute(indexAttr);

            // Check if option.infinite is set to true
            // if(this.options.infinite === "true") {
            //     // If true, check if 
            // }
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
    ifShouldMove(direction, isDragEvent = false) {

        // If it's dragging, then return true
        if (isDragEvent === true) {
            return true;
        }

        // Check if slider currently is animating
        if (this.item.getAttribute("jedli-prevent-change") === "true") {
            return false;
        }
        else {
            // Add attr to prevent multiclick and drag
            this.item.setAttribute("jedli-prevent-change", "true");
            this.item.setAttribute("jedli-prevent-drag", "true");

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
                            this.item.setAttribute("jedli-prevent-change", "false");
                            this.item.setAttribute("jedli-prevent-drag", "false");
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
                            this.item.setAttribute("jedli-prevent-change", "false");
                            this.item.setAttribute("jedli-prevent-drag", "false");
                            return false;
                        }
                    }
                }

                if (this.options.infinite === "true") {
                    // if true, return true
                    return true;
                }
            }
        }
    }

    updateActiveSlides() {
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

    // Return indexes of all currently visible slides
    getVisibleSlides(getInfiniteIndex = false) {
        // Get slides
        const slides = this.item.querySelectorAll("[data-jedli='slide']");

        let visibleSlides = [];
        // Loop through slides
        slides.forEach((e, i) => {
            // Check if slides is in tracksContainer viewport
            if (this.ifVisible(e)) {
                // if in viewport add index go array of visible slides
                // If getInfiniteIndex is set to true, get infinite-index instead of index
                let index;
                if (getInfiniteIndex === true) {
                    index = e.getAttribute("jedli-infinite-index");
                }
                else {
                    index = e.getAttribute("jedli-index");
                }

                visibleSlides.push(index);
            }
        })

        return visibleSlides;
    }

    checkIfBlockIsVisible(whichBlock) {
        // Get blocks
        const blocks = this.item.querySelectorAll("[data-jedli='slides-block']");

        // Loop through slides
        // Get wanted block depends of which block was selected
        let wantedBlock;
        if (whichBlock === "start") {
            wantedBlock = blocks[0];
        }

        if (whichBlock === "end") {
            wantedBlock = blocks[blocks.length - 1];
        }

        const slides = wantedBlock.querySelectorAll("[data-jedli='slide']");
        let visibleSlides = [];

        slides.forEach((e, i) => {
            // Check if slides is in tracksContainer viewport
            if (this.ifVisible(e)) {
                // if in viewport add index to array of visible slides
                let index = e.getAttribute("jedli-index");

                visibleSlides.push(index);
            }
        })
        // If there are any visible slides, return true. If not return false
        if (visibleSlides.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    // Check if element is visible in slider container
    ifVisible(element) {
        // Get tracksContainer
        const tracksContainer = this.item.querySelector("[data-jedli='tracks-container']");
        // Get positions in viewport of tracksContainer
        let tracksContainerRect = tracksContainer.getBoundingClientRect();
        // Get tracksContainer width
        // const tracksContainerWidth = tracksContainer.innerWidth;
        const elementRect = element.getBoundingClientRect();
        const elementWidth = Math.round(element.offsetWidth);


        // Check if in biewport
        // Element is in viewport when:
        // Element left value + element width is greater or equal to tracksContainer left value
        // Or 
        // Element right value - element width is smaller or equal to tracksContainer right value
        if ((Math.round(elementRect.left) + elementWidth) > Math.round(tracksContainerRect.left) && (Math.round(elementRect.right) - elementWidth) < Math.round(tracksContainerRect.right)) {
            return true
        }
        else {
            return false;
        }
    }

    // Check if track should update itself, if true -> update position to keep feeling of infinite carousel
    updateInfiniteTrackPosition() {
        // Check if there is no active slide in default block
        const defaultBlock = this.item.querySelector("[jedli-block='default']");
        const activeSlides = defaultBlock.querySelectorAll("[data-jedli='slide'][jedli-active='true']");

        // If there are currently active slides check if there is enough slides on both sides to scroll
        if (activeSlides.length > 0) {
            // Move blocks with slides from one side to another, if there is no enough space to keep infinite carousel
            return false;
        }
        else {
            // If there is no active slides in default block, move track without animation to same position but in default track
            // Where slides to scroll is number of all slides

            // Check track currenly position if is negative number or not
            const currentTransform = this.item.querySelector("[data-jedli='track']").getAttribute("jedli-transform").replace("%", "");

            let direction;
            // If current transform value is negative number
            if (currentTransform < 0) {
                // Move in 'prev' direction
                direction = "prev";
            }
            else {
                // If current transform value is positive number
                // Move in 'next' direction
                direction = "next";
            }

            // Caluclate distance
            const distance = this.calculateChangeDistance(direction, this.noOfSlides);


            // Move track, but without transition
            this.animateTrackChange(distance, true).then(
                (resolve) => {
                    // Update active slides
                    this.updateActiveSlides().then(
                        (resolve) => {
                            // console.log("resolved boi");
                            // Remove attr preventing change and drag
                            this.item.setAttribute("jedli-prevent-change", "false");
                            this.item.setAttribute("jedli-prevent-drag", "false");

                            // Reset infinite blocks position
                            this.resetInfiniteblocksPosition();
                        }
                    );
                }
            );
        }
    }

    // Move blocks with slides from one side to another, if there is no enough space to keep infinite carousel
    updateInfiniteBlocksPosition(specified) {
        // Check if track was transformed in 'prev' or 'next' site
        // Get track transform
        const trackTransform = +this.item.querySelector("[data-jedli='track']").getAttribute("jedli-transform").replace("%", "");

        let direction;
        // Check if there is specified value of direction
        if (specified) {
            direction = specified;
        }
        else {
            // If not, calculate it depends of trackTransform
            // If track is negative number, direction is 'next'
            if (trackTransform < 0)
                direction = "next";

            // If track is positive number, direction is 'prev'
            if (trackTransform > 0)
                direction = "prev";

            // If track is equal to 0, direction is 'none'
            if (trackTransform === 0)
                direction = "none"
        }

        // Check if there is enough non-active slides
        // (if number of non active slides is greater or equal options.slidesToScroll)
        // Get slides
        let slides = this.item.querySelectorAll("[data-jedli='slide']");

        // Variable to store number of non active slides to scroll
        let noOfNonActive = 0;

        // depends of direction
        if (direction === "next") {
            // Get block
            const blockStart = this.item.querySelector("[data-jedli='slides-block'][jedli-block='start']");

            // Check if direction is specified
            if (specified) {
                // If true, don't check anything. Just move block to wanted position
                const distance = +blockStart.getAttribute("jedli-position").replace("%", "") * 2
                blockStart.style.right = "unset";
                blockStart.style.left = distance + "%";
            }
            else {
                // If not, calculate where block should be
                // Get last non active slides
                let lastActive;
                slides.forEach((e, i) => {
                    if (e.getAttribute("jedli-active") === "true")
                        lastActive = true;

                    if (lastActive === true && e.getAttribute("jedli-active") !== "true")
                        noOfNonActive++;
                    // If last active is set to true, but current elements is nont active,
                    // return number of non-active elements starting from current
                });

                // Check if number of non active slides is greater than sldies to scroll
                if (noOfNonActive < +this.options.slidesToScroll) {
                    // If true -> Move block to other side (where distance is number of slides * percentage width of every slides * 2)
                    const distance = +blockStart.getAttribute("jedli-position").replace("%", "") * 2
                    blockStart.style.right = "unset";
                    blockStart.style.left = distance + "%";
                }
                else {
                    // If not, move block back to his side
                    const distance = blockStart.getAttribute("jedli-position")
                    blockStart.style.left = "unset";
                    blockStart.style.right = distance;
                }
            }
        }

        if (direction === "prev") {
            const blockEnd = this.item.querySelector("[data-jedli='slides-block'][jedli-block='end']");
            // Check if direction is specified
            if (specified) {
                // If true, don't check anything. Just move block to wanted position
                const distance = +blockEnd.getAttribute("jedli-position").replace("%", "") * 2
                blockEnd.style.left = "unset";
                blockEnd.style.right = distance + "%";
            }
            else {
                // Get first non active slide
                let firstActive = false;
                slides.forEach((e, i) => {
                    if (e.getAttribute("jedli-active") === "true")
                        firstActive = true;

                    if (firstActive === false && e.getAttribute("jedli-active") !== "true")
                        noOfNonActive++;
                    // If last active is set to true, but current elements is nont active,
                    // return number of non-active elements starting from current
                });

                // Check if number of non active slides is greater than sldies to scroll
                if (noOfNonActive < +this.options.slidesToScroll) {
                    // If true -> Move block to other side (where distance is number of slides * percentage width of every slides * 2)
                    const distance = +blockEnd.getAttribute("jedli-position").replace("%", "") * 2
                    blockEnd.style.left = "unset";
                    blockEnd.style.right = distance + "%";
                }
                else {
                    // If not, move block back to his side
                    const distance = blockEnd.getAttribute("jedli-position")
                    blockEnd.style.right = "unset";
                    blockEnd.style.left = distance;
                }
            }
        }

        // If direction is 'none', then reset to default state
        if (direction === "none") {
            this.resetInfiniteblocksPosition();
        }
    }

    resetInfiniteblocksPosition(specified) {
        const blockEnd = this.item.querySelector("[data-jedli='slides-block'][jedli-block='end']");
        const blockStart = this.item.querySelector("[data-jedli='slides-block'][jedli-block='start']");
        const distance = blockEnd.getAttribute("jedli-position");

        // If specified, reset only one, specific block
        if (specified === "start") {
            blockStart.style.left = "unset";
            blockStart.style.right = distance;
        }

        if (specified === "end") {
            blockEnd.style.right = "unset";
            blockEnd.style.left = distance;
        }

        if (!specified) {
            blockStart.style.left = "unset";
            blockStart.style.right = distance;

            blockEnd.style.right = "unset";
            blockEnd.style.left = distance;
        }
    }

    // Filter slides, show only wanted category
    filter(category = 'all') {
        // Get all non cloned slides
        const slides = this.item.querySelectorAll("[data-jedli='slide'][jedli-cloned='false']");

        // Loop through slides
        slides.forEach((e) => {
            // Check if slide is from wanted category
            let slideCategory = e.getAttribute("jedli-category");

            // If element is from this category, or category is set to all
            if (slideCategory === category || category === "all") {
                // Remobe attr to ignore this slide
                e.setAttribute("jedli-ignore", "true");

                // Remobe class to hide
                e.classList.remove("jedli-hide");
            }
            else {
                // Add attr to ignore this slide
                e.setAttribute("jedli-ignore", "true");

                // Add class to hide
                e.classList.add("jedli-hide");
            }
        });

        // Reinit structure
        this.reinitHandler();
    };

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
    animateTrackChange(distance, prevAnimation, isDragEvent = false) {
        return new Promise((resolve, reject) => {
            // Get track
            const track = this.item.querySelector("[data-jedli='track']");

            // Fire event beforeChange
            this.eventBeforeChange();

            // Check if attr prevAnimation is set to true
            if (prevAnimation === true) {
                // If true, remove transition
                track.style.transition = "";
                moveTransform();
            }
            else {
                // If option animationChange is set to transform, add transition to track
                if (this.options.animationChange === "transform") {
                    // Add transition to track
                    track.style.transition = "transform " + this.options.speed / 1000 + "s " + this.options.easing;
                    moveTransform();
                }

                // If option animationChange is set to fade, animate with fade effect
                if (this.options.animationChange === "fade") {
                    // Add transition to animate opacity  by half of speed
                    track.style.transition = "opacity " + this.options.speed / 1000 / 2 + "s " + this.options.easing;
                    // Set opacity to 0
                    track.style.opacity = 0;

                    // Wait for element to hide
                    setTimeout(() => {
                        // Update transform

                        moveTransform().then(
                            (resolve) => {
                                // After track update his position, show track
                                track.style.opacity = 1;
                            }
                        );
                    }, (this.options.speed / 2));
                }
            }

            // Function to change transform position of track
            function moveTransform() {
                return new Promise((resolve, reject) => {
                    // Get current transform position
                    const currentPosition = +track.getAttribute("jedli-transform").replace("%", "");

                    // Calculate new position
                    const newPosition = currentPosition + distance + "%";

                    // Set new position
                    track.style.transform = "translate3d(" + newPosition + ", 0, 0)";

                    // Update jedli-transform attr
                    track.setAttribute("jedli-transform", newPosition);

                    resolve("Transform updated");
                });
            }

            // Check if infinite is set to true
            if (this.options.infinite === "true" && isDragEvent === false) {
                // Update position of track to keep feeling of infinite carousel
                this.updateInfiniteBlocksPosition();
            }

            // Wait for animation to finish and then resolve
            // But if prevAnimation is set to true, wait much briefly
            if (prevAnimation === true) {
                setTimeout(() => {
                    resolve("Animation finished");
                }, 15);
            }
            else {
                setTimeout(() => {
                    resolve("Animation finished");
                }, +this.options.speed + 20);
            }
        });
    }

    // ### DRAG SUPPORT ###

    // Handle dragging
    dragHandler() {
        // Add drag eventlistener to track
        const track = this.item.querySelector("[data-jedli='track']");

        // Variable for initial position of mouse/touch
        // First value of initial position is X position, second is Y position
        let initialPosition;

        // Drag start
        track.addEventListener("touchstart", (e) => {
            let dragStartValue;
            dragStartValue = this.dragStart(e, "touchstart");
            if (dragStartValue) {
                direction = dragStartValue[1];
                initialPosition = dragStartValue[0];
            }
        });

        track.addEventListener("mousedown", (e) => {
            let dragStartValue;
            dragStartValue = this.dragStart(e, "mousedown");
            if (dragStartValue) {
                direction = dragStartValue[1];
                initialPosition = dragStartValue[0];
            }
        });

        // Move

        // return direction of move
        var direction = false;
        track.addEventListener("touchmove", (e) => {
            // Check if drag has started
            if (this.item.getAttribute("jedli-drag") === "true")
                direction = this.dragMove(e, initialPosition, "touchmove", track);
        })

        track.addEventListener("mousemove", (e) => {
            // Check if drag has started
            if (this.item.getAttribute("jedli-drag") === "true")
                direction = this.dragMove(e, initialPosition, "mousemove", track);
        })

        // Drag end
        track.addEventListener("touchend", () => {
            this.dragEnd(direction, track);
        });

        track.addEventListener("mouseup", () => {
            this.dragEnd(direction, track);
        });
    }

    dragStart(event, type) {
        // Check if slider should move
        if (this.item.getAttribute("jedli-prevent-drag") !== "true") {
            // Reset direction
            const direction = false;

            // Add attr drag started to slider
            this.item.setAttribute("jedli-drag", "true");

            // Get initial position of mouse/touch
            // First value of initial position is X position, second is Y position
            let initialPosition = [];


            if (type === "touchstart") {
                initialPosition[0] = +event.touches[0].clientX;
                initialPosition[1] = +event.touches[0].clientY;
            } else {
                initialPosition[0] = +event.clientX;
                initialPosition[1] = +event.clientY;
            }

            // Round position
            initialPosition[0] = initialPosition[0].toFixed(2);
            initialPosition[1] = initialPosition[1].toFixed(2);

            // Update variable for custom transform
            this.currentTransform = initialPosition;

            return [initialPosition, direction];
        }
    }

    dragMove(event, initialPosition, type, track) {
        // Check if drag has started
        if (this.item.getAttribute("jedli-drag") === "true") {

            // Remove transition from track
            track.style.transition = "";

            // Get current position
            let currentPosition = [];

            if (type === "touchmove") {
                currentPosition[0] = +event.touches[0].clientX;
                currentPosition[1] = +event.touches[0].clientY;
            } else {
                currentPosition[0] = +event.clientX;
                currentPosition[1] = +event.clientY;
            }

            // Round position
            currentPosition[0] = currentPosition[0].toFixed(2);
            currentPosition[1] = currentPosition[1].toFixed(2);

            // Calculate difference between current and inital position
            const differenceX = (initialPosition[0] - currentPosition[0]);

            // Calculate difference between current and last position
            let differenceCurrent = (+this.currentTransform[0] - currentPosition[0]);

            // Calculate distance to move
            // where distance to move is current transform position (defined from normal change) + diffrenceX
            const currentTrackTransform = track.getAttribute("jedli-transform");

            const newDistance = "calc(" + currentTrackTransform + " - " + differenceX + "px)";

            // Add new transform to track
            const transform = "translate3d(" + newDistance + ", 0, 0)"
            // If animationChange is set to fade, disble transform update
            if (this.options.animationChange !== "fade") {
                track.style.transform = transform;
            };

            // Check direction of move
            // If there is no difference, return false
            let direction = false;

            // If direction is equal to 0, go to last known direction
            if (differenceCurrent === 0) {
                // direction = this.lastDirection;
                differenceCurrent = differenceX;
            }

            // Direction prev if differenceX is negative number
            if (differenceCurrent < 0) {
                direction = "prev";
                this.lastDirection = "prev"
                // Update position of infinite blocks, depends of direction
                if (this.options.infinite == "true") {
                    // Check if 'end' block is currently visible
                    if (this.checkIfBlockIsVisible("end") === false) {
                        // If not, update blocks position
                        this.updateInfiniteBlocksPosition("prev");
                        this.resetInfiniteblocksPosition("start");
                    }
                }
            }

            // Direction next if differenceX is positive number
            if (differenceCurrent > 0) {
                direction = "next";
                this.lastDirection = "next";
                // Update position of infinite blocks, depends of direction
                if (this.options.infinite == "true") {
                    // Check if 'start' block is currently visible
                    if (this.checkIfBlockIsVisible("start") === false) {
                        // If not, update blocks position
                        this.updateInfiniteBlocksPosition("next");
                        this.resetInfiniteblocksPosition("end");
                    }
                }
            }

            // Update current transform
            this.currentTransform = currentPosition;

            return direction;
        }
    }

    dragEnd(direction, track) {
        // Remove attr drag started to slider
        this.item.setAttribute("jedli-drag", "false");

        // Update position of slider depends of direction
        // If direction is false, then do nothing
        if (direction !== false) {
            // Get visible slides

            let ifInfinite;
            if (this.options.infinite == "true") {
                ifInfinite = true;
            }
            else {
                ifInfinite = false;
            }

            const visibleSlides = this.getVisibleSlides(ifInfinite);

            let preventGoto = false;

            // If there is no visible slides or all visible slides are currently active
            // BUT there was move (prev/next)
            // Then trigger slideNext()/slidePrev() function
            if (direction !== false) {
                // Get correct index attr
                let indexAttr;
                if (this.options.infinite === "true") {
                    indexAttr = "jedli-infinite-index";
                }
                else {
                    indexAttr = "jedli-index";
                }

                // Variable if all slides are already visible
                let allActive = true;

                // Get slides
                visibleSlides.map((e) => {
                    // Find map with correct index
                    let slide = this.item.querySelector("[" + indexAttr + "='" + e + "']");
                    if (slide.getAttribute("jedli-active" !== "true")) {
                        allActive = false;
                    }
                });

                // If all slides are currently active, but there is direction of change
                // trigger slideNext()/slidePrev() function
                if (allActive === false) {
                    // If not all slides are currently active allow normal goToSlide function
                    preventGoto = false;
                }
                else {
                    // Set attr to prevent normal 'goToSlide' function
                    preventGoto = true;

                    if (direction === "prev") {
                        // If direction is "prev", move to prev slide (slides if 'slidesToScroll' was greater than 1)
                        this.slidePrev();
                    }

                    if (direction === "next") {
                        // If direction is "next", move to next slide (slides if 'slidesToScroll' was greater than 1)
                        this.slideNext();
                    }
                }
            }


            // Check if attr to prevent goToSlide function is set, because slider already made slideNext/slidePrev action
            if (preventGoto === false) {
                if (direction === "prev") {
                    // If direction is "prev", move to first visible slide
                    this.goToSlide(+visibleSlides[0], true, "prev");
                }

                if (direction === "next") {
                    // If direction is "next", move to last visible slide
                    this.goToSlide(visibleSlides[visibleSlides.length - 1], true, "next");
                }
            }
        }
    }


    // EVENTS

    eventBeforeInit() {
        const eventBeforeInit = new CustomEvent(
            'beforeInit',
            {
                bubbles: false,
                cancelable: false,
            }
        )

        this.item.dispatchEvent(eventBeforeInit);
    }

    eventAfterInit() {
        const eventAfterInit = new CustomEvent(
            'afterInit',
            {
                bubbles: false,
                cancelable: false,
            }
        )

        this.item.dispatchEvent(eventAfterInit);
    }

    eventBeforeChange() {
        const eventBeforeChange = new CustomEvent(
            'beforeChange',
            {
                bubbles: false,
                cancelable: false,
            }
        )

        this.item.dispatchEvent(eventBeforeChange);
    }

    eventAfterChange() {
        const eventAfterChange = new CustomEvent(
            'afterChange',
            {
                bubbles: false,
                cancelable: false,
            }
        )

        this.item.dispatchEvent(eventAfterChange);
    }
}