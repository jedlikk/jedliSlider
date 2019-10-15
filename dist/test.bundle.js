/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./demo/test.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./demo/test.js":
/*!**********************!*\
  !*** ./demo/test.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _test_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./test.scss */ \"./demo/test.scss\");\n/* harmony import */ var _test_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_test_scss__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _src_jedlislider_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/jedlislider.js */ \"./src/jedlislider.js\");\n\n\n\nvar sliderElement = document.querySelectorAll(\"[data-item='slider']\")[0];\nvar slider = new _src_jedlislider_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](sliderElement, {\n  \"mode\": \"continuous\",\n  \"slidesWidth\": \"auto\",\n  \"visibleSlides\": \"auto\",\n  \"speed\": \"5\",\n  \"direction\": \"right\"\n}); // ###################\n// Continouous same init\n\nvar sliderContinuousSameElement = document.querySelectorAll(\"[data-item='slider-continuous-same']\")[0];\nvar sliderContinuousSame = new _src_jedlislider_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](sliderContinuousSameElement, {\n  \"mode\": \"continuous\",\n  \"slidesWidth\": \"equal\",\n  \"visibleSlides\": \"4\",\n  \"speed\": \"5\",\n  'pauseOnHover': \"true\",\n  \"responsive\": [{\n    \"breakpoint\": \"992\",\n    \"options\": {\n      \"visibleSlides\": \"3\"\n    }\n  }, {\n    \"breakpoint\": \"768\",\n    \"options\": {\n      \"visibleSlides\": \"2\"\n    }\n  }]\n}); //  #########\n// Default init\n\nvar sliderDefaultSameElement = document.querySelectorAll(\"[data-item='slider-default-same']\")[0];\nvar sliderDefaultSame = new _src_jedlislider_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](sliderDefaultSameElement, {\n  \"mode\": \"default\",\n  \"slidesWidth\": \"equal\",\n  \"visibleSlides\": \"4\",\n  \"speed\": \"600\"\n});\n\n//# sourceURL=webpack:///./demo/test.js?");

/***/ }),

/***/ "./demo/test.scss":
/*!************************!*\
  !*** ./demo/test.scss ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./demo/test.scss?");

/***/ }),

/***/ "./src/jedlislider.js":
/*!****************************!*\
  !*** ./src/jedlislider.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _jedlislider_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./jedlislider.scss */ \"./src/jedlislider.scss\");\n/* harmony import */ var _jedlislider_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jedlislider_scss__WEBPACK_IMPORTED_MODULE_0__);\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n// JedliSlider v 0.0.1\n// By Bar†łomiej Jedlikowski\n\n\nvar jedliSlider =\n/*#__PURE__*/\nfunction () {\n  function jedliSlider(item, options) {\n    var _this = this;\n\n    _classCallCheck(this, jedliSlider);\n\n    this.item = item;\n    this.noOfSlides = this.countSlides(); // Default options\n\n    this.defaultOptions = {\n      \"mode\": \"default\",\n      \"visibleSlides\": \"1\",\n      \"slidesToScroll\": \"1\",\n      \"speed\": \"400\",\n      \"arrows\": \"false\",\n      \"autoplay\": \"false\",\n      \"autoplayDuration\": \"400\",\n      \"draggable\": \"true\",\n      \"dots\": \"false\",\n      \"slidesWidth\": \"equal\",\n      \"easing\": \"linear\",\n      \"overflow\": \"hidden\",\n      \"pauseOnHover\": \"false\",\n      \"direction\": \"left\"\n    }; // Set options to default\n\n    this.options = this.defaultOptions; // Get default user options\n\n    this.initializedOptions = options; // Override options with given\n\n    this.options = Object.assign(this.options, this.initializedOptions); // Check if there should be already breakpoint options\n\n    this.breakpointHandler(); // Init function \n\n    this.init(); // Handle resize \n\n    window.addEventListener('resize', function () {\n      _this.resizeHandler();\n    });\n  } // Create basic structure of slider\n\n\n  _createClass(jedliSlider, [{\n    key: \"init\",\n    value: function init() {\n      var _this2 = this;\n\n      // Add attributes and classes to slider container\n      this.item.classList.add(\"jedli-slider\"); // Get all children and add attributes and classes\n\n      var slides = _toConsumableArray(this.item.children);\n\n      slides.forEach(function (slide) {\n        slide.setAttribute(\"data-jedli\", \"slide\");\n        slide.classList.add(\"jedli-slide\");\n      }); // Create track for slider\n\n      var track = document.createElement(\"div\"); // Add attributes and classes\n\n      track.setAttribute(\"data-jedli\", \"track\");\n      track.classList.add(\"jedli-track\"); // Wrap slides in track:\n      // Append slides to track\n\n      var slidesNode = this.item.querySelectorAll(\"[data-jedli='slide']\");\n      slidesNode.forEach(function (element) {\n        track.appendChild(element);\n      }); // insert wrapper in the DOM tree\n\n      this.item.appendChild(track); // Wrap tracks inside special container\n\n      var tracksContainer = document.createElement(\"div\"); // Add attributes and classes\n\n      tracksContainer.setAttribute(\"data-jedli\", \"tracks-container\");\n      tracksContainer.classList.add(\"jedli-tracks-container\"); // Wrap slides in track:\n      // insert wrapper in the DOM tree\n\n      this.item.appendChild(tracksContainer); // Append trackContainer to slider\n\n      tracksContainer.appendChild(track); // Set tracksContainer height to be equal to tracks\n\n      this.setTracksContainerHeight(); // Add overflow hidden or visible, depends of options.overflow\n\n      switch (this.options.overflow) {\n        case \"hidden\":\n          this.item.classList.add(\"jedli-overflow-hidden\");\n          break;\n      } // Init slider with right options\n\n\n      this.slidesWidthHandler().then(function (resolve) {\n        _this2.modeHandler();\n      });\n    } // Handle resize\n\n  }, {\n    key: \"resizeHandler\",\n    value: function resizeHandler() {\n      var _this3 = this;\n\n      // Check if there should be already breakpoint options\n      this.breakpointHandler(); // Handle slides resize\n\n      this.slidesWidthHandler().then(function (resolve) {\n        // Check if number of slides is greater than option.visibleSlides or options.visibleSlides is set to auto\n        if (_this3.noOfSlides > +_this3.options.visibleSlides || _this3.options.visibleSlides === \"auto\") {\n          switch (_this3.options.mode) {\n            case \"default\":\n              _this3.initDefault();\n\n              break;\n\n            case \"continuous\":\n              // Check if there is enouth slides to rotate\n              if (_this3.ifEnoughToRotate()) {\n                // Check if slider has already created structure\n                if (_this3.item.getAttribute(\"jedli-structure\") === \"created\") {\n                  // If yes, just recalculate animation\n                  _this3.initContinuousAnimation();\n                } else {\n                  // If not, create structure\n                  _this3.continuousStructure().then(function (resolve) {\n                    _this3.initContinuousAnimation();\n                  });\n                }\n              } else {\n                _this3.destroyContinuous();\n              }\n\n              break;\n          }\n        } else {\n          // If not -> destroy animation\n          switch (_this3.options.mode) {\n            case \"default\":\n              _this3.destroyDefault();\n\n              break;\n\n            case \"continuous\":\n              _this3.destroyContinuous();\n\n              break;\n          }\n        }\n      });\n    } // Breakpoint handler \n\n  }, {\n    key: \"breakpointHandler\",\n    value: function breakpointHandler() {\n      var _this4 = this;\n\n      // Check breakpoint from options.responsive\n      if (this.initializedOptions.responsive) {\n        // Loop through all breakpoints\n        this.initializedOptions.responsive.map(function (e, i, length) {\n          // Get defined breakpoint \n          var breakpoint = e.breakpoint; // Get window width\n\n          var windowWidth = window.innerWidth; // Check if screen width is smaller than breakpoint \n\n          if (windowWidth <= breakpoint) {\n            // If true override options with asigned to breakpoint\n            _this4.options = Object.assign(_this4.options, e.options);\n          } // Check screen width is greater than first breakpoint\n\n\n          if (_this4.initializedOptions.responsive[0].breakpoint <= windowWidth) {\n            // If true override with default options connected with initialized\n            _this4.options = Object.assign(_this4.defaultOptions, _this4.initializedOptions);\n          }\n        });\n      }\n    }\n  }, {\n    key: \"slidesWidthHandler\",\n    value: function slidesWidthHandler() {\n      var _this5 = this;\n\n      return new Promise(function (resolve, reject) {\n        // Check if slides has specific size\n        switch (_this5.options.slidesWidth) {\n          case \"equal\":\n            // If true => make them same size\n            _this5.setSlidesWidth();\n\n            resolve(\"resolved width equal\");\n            break;\n\n          case \"auto\":\n            // If not, do nothing\n            resolve(\"resolved width auto\");\n            break;\n        }\n      });\n    } // Init slider with right mode\n\n  }, {\n    key: \"modeHandler\",\n    value: function modeHandler() {\n      // Check if number of slides is greater than option.visibleSlides or options.visibleSlides is set to auto\n      if (this.noOfSlides > +this.options.visibleSlides || this.options.visibleSlides === \"auto\") {\n        switch (this.options.mode) {\n          case \"default\":\n            this.initDefault();\n            break;\n\n          case \"continuous\":\n            this.initContinuous();\n            break;\n        }\n      }\n    } // Set all slides to same, specific width\n\n  }, {\n    key: \"setSlidesWidth\",\n    value: function setSlidesWidth() {\n      // Calculate wanted size\n      // Where size of one slide is tracks Container width / options.visibleSlides\n      var tracksContainer = this.item.querySelectorAll(\"[data-jedli=tracks-container]\")[0];\n      var wantedSize = tracksContainer.offsetWidth / this.options.visibleSlides + \"px\"; // Add those size to slides\n\n      var track = this.item.querySelectorAll(\"[data-jedli='track']\")[0];\n      var slides = track.querySelectorAll(\"[data-jedli='slide']\");\n      slides.forEach(function (element) {\n        // Set specific styles\n        element.style.width = wantedSize;\n        element.style.minWidth = wantedSize;\n        element.style.maxWidth = wantedSize;\n      });\n    } // Get number of slides\n\n  }, {\n    key: \"countSlides\",\n    value: function countSlides() {\n      var slides = this.item.children;\n      return slides.length;\n    } // Calculate width of slides\n\n  }, {\n    key: \"calculateSlidesWidth\",\n    value: function calculateSlidesWidth() {\n      // Get slides\n      var slides = this.item.querySelectorAll(\"[data-jedli='slide']\"); // Check if number of slides is specified, or is set to auto\n      // If 'options.visibleSlides' is set to 'auto' set noOfSlides to all slides\n\n      var visibleSlides = this.options.visibleSlides;\n      if (this.options.visibleSlides === \"auto\") visibleSlides = this.noOfSlides; // Count width of slides\n\n      var slidesWidth = 0; // Loop through specified number of slides\n\n      slides.forEach(function (e, i) {\n        // Ignore cloned elements\n        if (!e.getAttribute('jedli-cloned')) {\n          // Add to slidesWidth only specific amount of slides\n          if (i < visibleSlides) slidesWidth += e.offsetWidth;\n        }\n      });\n      return slidesWidth;\n    } // Check if there is enough slides to rotate\n\n  }, {\n    key: \"ifEnoughToRotate\",\n    value: function ifEnoughToRotate() {\n      // Check if slides has specific size\n      switch (this.options.slidesWidth) {\n        case \"equal\":\n          // Check if number of slides is greater than options.visibleSlides\n          // If true -> return true\n          if (this.noOfSlides > this.options.visibleSlides) return true;else return false;\n          break;\n\n        case \"auto\":\n          // Get width of specified number of slides\n          var slidesWidth = this.calculateSlidesWidth(); // Get slider width\n\n          var sliderWidth = this.item.offsetWidth; // Check if sum of first *option.noOfSlides* slides is greater than slider width\n\n          if (slidesWidth > sliderWidth) {\n            // If true, return true\n            return true;\n          } else {\n            return false;\n          }\n\n          break;\n      }\n    } // ### DEFAULT MODE\n    // Initialize 'default' mode\n\n  }, {\n    key: \"initDefault\",\n    value: function initDefault() {\n      // Add class default to slider\n      this.item.classList.add(\"jedli-mode-continuous\"); // Check if there is enough slides to rotate\n\n      this.defaultStructure();\n    } // Create structure for default slider:\n\n  }, {\n    key: \"defaultStructure\",\n    value: function defaultStructure() {\n      var _this6 = this;\n\n      return new Promise(function (resolve, reject) {\n        // Get track \n        var track = _this6.item.querySelectorAll(\"[data-jedli='track']\")[0]; // Add attr structure created to slider\n\n\n        _this6.item.setAttribute(\"jedli-structure\", \"created\"); // Clone slides\n\n\n        var slides = _this6.item.querySelectorAll(\"[data-jedli='slide']\");\n\n        slides.forEach(function (e) {\n          var clonedSlide = e.cloneNode(true); // Add attr cloned to slide\n\n          clonedSlide.setAttribute(\"jedli-cloned\", \"true\"); // Clone cloned element to be able to prepend and append\n\n          var clonedSlide2 = clonedSlide.cloneNode(true); // append and prepend to track\n          // track.prepend(clonedSlide);\n          // track.appendChild(clonedSlide2);\n        });\n        resolve(\"Continuous structure created\");\n      });\n    } // ### END OF DEFAULT MODE ###\n    // ### CONTINUOUS MODE ### \n    // Initialize 'continuous' mode\n\n  }, {\n    key: \"initContinuous\",\n    value: function initContinuous() {\n      var _this7 = this;\n\n      // Add class continous to slider\n      this.item.classList.add(\"jedli-mode-continuous\"); // Check if there is enough slides to rotate\n\n      if (this.ifEnoughToRotate()) {\n        this.continuousStructure().then(function (resolve) {\n          _this7.initContinuousAnimation();\n        });\n      }\n    } // Destroy continuous animation\n\n  }, {\n    key: \"destroyContinuous\",\n    value: function destroyContinuous() {\n      // Remove cloned elements\n      var cloned = this.item.querySelectorAll(\"[jedli-cloned='true']\");\n      cloned.forEach(function (e) {\n        e.remove();\n      }); // Remove animation\n\n      var track = this.item.querySelectorAll(\"[data-jedli='track']\")[0];\n      track.style.animation = \"\"; // Remove attr \"jedli-structure='created\" from slider\n\n      this.item.removeAttribute(\"jedli-structure\");\n    } // Create structure for continuous animation:\n\n  }, {\n    key: \"continuousStructure\",\n    value: function continuousStructure() {\n      var _this8 = this;\n\n      return new Promise(function (resolve, reject) {\n        // Get track \n        var track = _this8.item.querySelectorAll(\"[data-jedli='track']\")[0]; // Add attr structure created to slider\n\n\n        _this8.item.setAttribute(\"jedli-structure\", \"created\"); // Clone slides\n\n\n        var slides = _this8.item.querySelectorAll(\"[data-jedli='slide']\");\n\n        slides.forEach(function (e) {\n          var clonedSlide = e.cloneNode(true); // Add attr cloned to slide\n\n          clonedSlide.setAttribute(\"jedli-cloned\", \"true\"); // And append to track\n\n          track.appendChild(clonedSlide);\n        });\n        resolve(\"Continuous structure created\");\n      });\n    } // Set size of tracksContainer to width of track\n\n  }, {\n    key: \"setTracksContainerHeight\",\n    value: function setTracksContainerHeight() {\n      // Get tracksContainer\n      var tracksContainer = this.item.querySelectorAll(\"[data-jedli='tracks-container']\")[0]; // Get track\n\n      var track = tracksContainer.querySelector(\"[data-jedli='track']\"); // Get height\n\n      var trackHeight = track.offsetHeight; // Set height to trackscontainer\n\n      tracksContainer.style.height = trackHeight;\n    } // Init continuous animation\n\n  }, {\n    key: \"initContinuousAnimation\",\n    value: function initContinuousAnimation() {\n      // Get tracks\n      var track = this.item.querySelector(\"[data-jedli='track']\"); // If option 'pause on hover' is declarated as 'true' then add class 'pause on hover'\n      // and event listener to handle track hover on children focus\n\n      if (this.options.pauseOnHover === \"true\") {\n        track.classList.add(\"jedli-hover-pause\");\n        track.setAttribute(\"pauseOnHover\", \"true\"); // Add listeners to every children, to handle 'pause on hover' when link inside is focused \n        // (for accessibility, people using keyboard to naviage)\n        // Get all children\n\n        var trackChildren = track.querySelectorAll(\"a, button\"); // Attach event listener to childrens\n\n        trackChildren.forEach(function (e) {\n          e.addEventListener(\"focus\", function () {\n            console.log(\"hovered\");\n            track.classList.add(\"hovered\");\n          });\n          e.addEventListener(\"focusout\", function () {\n            console.log(\"hovered out\");\n            track.classList.remove(\"hovered\");\n          });\n        });\n      } // Set direction of animation\n\n\n      if (this.options.direction === \"left\") {\n        track.style.animationDirection = \"normal\";\n      }\n\n      if (this.options.direction === \"right\") {\n        track.style.animationDirection = \"reverse\";\n      } // Add styles for animation purposes to track\n      // If mode == continuous, options.speed is speed for every px of track width\n\n\n      var speed = this.options.speed * track.offsetWidth;\n      var continuousSpeed = speed / 1000 + \"s\";\n      track.style.animationDuration = continuousSpeed;\n      track.style.animationTimingFunction = this.options.easing;\n    }\n  }]);\n\n  return jedliSlider;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (jedliSlider);\n\n//# sourceURL=webpack:///./src/jedlislider.js?");

/***/ }),

/***/ "./src/jedlislider.scss":
/*!******************************!*\
  !*** ./src/jedlislider.scss ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/jedlislider.scss?");

/***/ })

/******/ });