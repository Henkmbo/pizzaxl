// Utility function
function Util () {};

/* class manipulation functions */
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* DOM manipulation */
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length;

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* Animate height of an element */
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* Smooth Scroll */
Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* Move Focus */
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* Misc */

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  return CSS.supports(property, value);
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* Animation curves */
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_accordion
// Usage: codyhouse.co/license
(function() {
	var Accordion = function(element) {
		this.element = element;
		this.items = getChildrenByClassName(this.element, 'js-accordion__item');
		this.version = this.element.getAttribute('data-version') ? '-'+this.element.getAttribute('data-version') : '';
		this.showClass = 'accordion'+this.version+'__item--is-open';
		this.animateHeight = (this.element.getAttribute('data-animation') == 'on');
		this.multiItems = !(this.element.getAttribute('data-multi-items') == 'off'); 
		// deep linking options
		this.deepLinkOn = this.element.getAttribute('data-deep-link') == 'on';
		// init accordion
		this.initAccordion();
	};

	Accordion.prototype.initAccordion = function() {
		//set initial aria attributes
		for( var i = 0; i < this.items.length; i++) {
			var button = this.items[i].getElementsByTagName('button')[0],
				content = this.items[i].getElementsByClassName('js-accordion__panel')[0],
				isOpen = this.items[i].classList.contains(this.showClass) ? 'true' : 'false';
			button.setAttribute('aria-expanded', isOpen);
			button.setAttribute('aria-controls', 'accordion-content-'+i);
			button.setAttribute('id', 'accordion-header-'+i);
			button.classList.add('js-accordion__trigger');
			content.setAttribute('aria-labelledby', 'accordion-header-'+i);
			content.setAttribute('id', 'accordion-content-'+i);
		}

		//listen for Accordion events
		this.initAccordionEvents();

		// check deep linking option
		this.initDeepLink();
	};

	Accordion.prototype.initAccordionEvents = function() {
		var self = this;

		this.element.addEventListener('click', function(event) {
			var trigger = event.target.closest('.js-accordion__trigger');
			//check index to make sure the click didn't happen inside a children accordion
			if( trigger && Array.prototype.indexOf.call(self.items, trigger.parentElement) >= 0) self.triggerAccordion(trigger);
		});
	};

	Accordion.prototype.triggerAccordion = function(trigger) {
		var bool = (trigger.getAttribute('aria-expanded') === 'true');

		this.animateAccordion(trigger, bool, false);

		if(!bool && this.deepLinkOn) {
			history.replaceState(null, '', '#'+trigger.getAttribute('aria-controls'));
		}
	};

	Accordion.prototype.animateAccordion = function(trigger, bool, deepLink) {
		var self = this;
		var item = trigger.closest('.js-accordion__item'),
			content = item.getElementsByClassName('js-accordion__panel')[0],
			ariaValue = bool ? 'false' : 'true';

		if(!bool) item.classList.add(this.showClass);
		trigger.setAttribute('aria-expanded', ariaValue);
		self.resetContentVisibility(item, content, bool);

		if( !this.multiItems && !bool || deepLink) this.closeSiblings(item);
	};

	Accordion.prototype.resetContentVisibility = function(item, content, bool) {
		item.classList.toggle(this.showClass, !bool);
		content.removeAttribute("style");
		if(bool && !this.multiItems) { // accordion item has been closed -> check if there's one open to move inside viewport 
			this.moveContent();
		}
	};

	Accordion.prototype.closeSiblings = function(item) {
		//if only one accordion can be open -> search if there's another one open
		var index = Array.prototype.indexOf.call(this.items, item);
		for( var i = 0; i < this.items.length; i++) {
			if(this.items[i].classList.contains(this.showClass) && i != index) {
				this.animateAccordion(this.items[i].getElementsByClassName('js-accordion__trigger')[0], true, false);
				return false;
			}
		}
	};

	Accordion.prototype.moveContent = function() { // make sure title of the accordion just opened is inside the viewport
		var openAccordion = this.element.getElementsByClassName(this.showClass);
		if(openAccordion.length == 0) return;
		var boundingRect = openAccordion[0].getBoundingClientRect();
		if(boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
			var windowScrollTop = window.scrollY || document.documentElement.scrollTop;
			window.scrollTo(0, boundingRect.top + windowScrollTop);
		}
	};

	Accordion.prototype.initDeepLink = function() {
		if(!this.deepLinkOn) return;
		var hash = window.location.hash.substr(1);
		if(!hash || hash == '') return;
		var trigger = this.element.querySelector('.js-accordion__trigger[aria-controls="'+hash+'"]');
		if(trigger && trigger.getAttribute('aria-expanded') !== 'true') {
			this.animateAccordion(trigger, false, true);
			setTimeout(function(){trigger.scrollIntoView(true);});
		}
	};

	function getChildrenByClassName(el, className) {
		var children = el.children,
    childrenByClass = [];
		for (var i = 0; i < children.length; i++) {
			if (children[i].classList.contains(className)) childrenByClass.push(children[i]);
		}
		return childrenByClass;
	};

	window.Accordion = Accordion;
	
	//initialize the Accordion objects
	var accordions = document.getElementsByClassName('js-accordion');
	if( accordions.length > 0 ) {
		for( var i = 0; i < accordions.length; i++) {
			(function(i){new Accordion(accordions[i]);})(i);
		}
	}
}());
// File#: _1_alert-card
// Usage: codyhouse.co/license
(function() {
  function initAlertCard(card) {
    card.addEventListener('click', function(event) {
      if(event.target.closest('.js-alert-card__close-btn')) Util.addClass(card, 'is-hidden');
    });
  };

  var alertCards = document.getElementsByClassName('js-alert-card');
  if(alertCards.length > 0) {
    for(var i = 0; i < alertCards.length; i++) {
      (function(i){initAlertCard(alertCards[i])})(i);
    }
  }
}());
// File#: _1_choice-tags
// Usage: codyhouse.co/license
(function() {
  var ChoiceTags = function(element) {
    this.element = element;
    this.labels = this.element.getElementsByClassName('js-choice-tag');
    this.inputs = getChoiceInput(this);
    this.isRadio = this.inputs[0].type.toString() == 'radio';
    this.checkedClass = 'choice-tag--checked';
    initChoiceTags(this);
    initChoiceTagEvent(this);
  }

  function getChoiceInput(element) {
    var inputs = [];
    for(var i = 0; i < element.labels.length; i++) {
      inputs.push(element.labels[i].getElementsByTagName('input')[0]);
    }
    return inputs;
  };

  function initChoiceTags(element) {
    // if tag is selected by default - add checkedClass to the label element
    for(var i = 0; i < element.inputs.length; i++) {
      Util.toggleClass(element.labels[i], element.checkedClass, element.inputs[i].checked);
    }
  };

  function initChoiceTagEvent(element) {
    element.element.addEventListener('change', function(event) {
      var inputIndex = Util.getIndexInArray(element.inputs, event.target);
      if(inputIndex < 0) return;
      Util.toggleClass(element.labels[inputIndex], element.checkedClass, event.target.checked);
      if(element.isRadio && event.target.checked) resetRadioTags(element, inputIndex);
    });
  };

  function resetRadioTags(element, index) {
    // when a radio input is checked - reset all the others
    for(var i = 0; i < element.labels.length; i++) {
      if(i != index) Util.removeClass(element.labels[i], element.checkedClass);
    }
  };

  //initialize the ChoiceTags objects
  var choiceTags = document.getElementsByClassName('js-choice-tags');
  if( choiceTags.length > 0 ) {
    for( var i = 0; i < choiceTags.length; i++) {
      (function(i){new ChoiceTags(choiceTags[i]);})(i);
    }
  };
}());
// File#: _1_circular-progress-bar
// Usage: codyhouse.co/license
(function() {	
  var CProgressBar = function(element) {
    this.element = element;
    this.fill = this.element.getElementsByClassName('c-progress-bar__fill')[0];
    this.fillLength = getProgressBarFillLength(this);
    this.label = this.element.getElementsByClassName('js-c-progress-bar__value');
    this.value = parseFloat(this.element.getAttribute('data-progress'));
    // before checking if data-animation is set -> check for reduced motion
    updatedProgressBarForReducedMotion(this);
    this.animate = this.element.hasAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on';
    this.animationDuration = this.element.hasAttribute('data-duration') ? this.element.getAttribute('data-duration') : 1000;
    // animation will run only on browsers supporting IntersectionObserver
    this.canAnimate = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    // this element is used to announce the percentage value to SR
    this.ariaLabel = this.element.getElementsByClassName('js-c-progress-bar__aria-value');
    // check if we need to update the bar color
    this.changeColor =  Util.hasClass(this.element, 'c-progress-bar--color-update') && Util.cssSupports('color', 'var(--color-value)');
    if(this.changeColor) {
      this.colorThresholds = getProgressBarColorThresholds(this);
    }
    initProgressBar(this);
    // store id to reset animation
    this.animationId = false;
  };

  // public function
  CProgressBar.prototype.setProgressBarValue = function(value) {
    setProgressBarValue(this, value);
  };

  function getProgressBarFillLength(progressBar) {
    return parseFloat(2*Math.PI*progressBar.fill.getAttribute('r')).toFixed(2);
  };

  function getProgressBarColorThresholds(progressBar) {
    var thresholds = [];
    var i = 1;
    while (!isNaN(parseInt(getComputedStyle(progressBar.element).getPropertyValue('--c-progress-bar-color-'+i)))) {
      thresholds.push(parseInt(getComputedStyle(progressBar.element).getPropertyValue('--c-progress-bar-color-'+i)));
      i = i + 1;
    }
    return thresholds;
  };

  function updatedProgressBarForReducedMotion(progressBar) {
    // if reduced motion is supported and set to reduced -> remove animations
    if(osHasReducedMotion) progressBar.element.removeAttribute('data-animation');
  };

  function initProgressBar(progressBar) {
    // set shape initial dashOffset
    setShapeOffset(progressBar);
    // set initial bar color
    if(progressBar.changeColor) updateProgressBarColor(progressBar, progressBar.value);
    // if data-animation is on -> reset the progress bar and animate when entering the viewport
    if(progressBar.animate && progressBar.canAnimate) animateProgressBar(progressBar);
    else setProgressBarValue(progressBar, progressBar.value);
    // reveal fill and label -> --animate and --color-update variations only
    setTimeout(function(){Util.addClass(progressBar.element, 'c-progress-bar--init');}, 30);

    // dynamically update value of progress bar
    progressBar.element.addEventListener('updateProgress', function(event){
      // cancel request animation frame if it was animating
      if(progressBar.animationId) window.cancelAnimationFrame(progressBar.animationId);
      
      var final = event.detail.value,
        duration = (event.detail.duration) ? event.detail.duration : progressBar.animationDuration;
      var start = getProgressBarValue(progressBar);
      // trigger update animation
      updateProgressBar(progressBar, start, final, duration, function(){
        emitProgressBarEvents(progressBar, 'progressCompleted', progressBar.value+'%');
        // update value of label for SR
        if(progressBar.ariaLabel.length > 0) progressBar.ariaLabel[0].textContent = final+'%';
      });
    });
  }; 

  function setShapeOffset(progressBar) {
    var center = progressBar.fill.getAttribute('cx');
    progressBar.fill.setAttribute('transform', "rotate(-90 "+center+" "+center+")");
    progressBar.fill.setAttribute('stroke-dashoffset', progressBar.fillLength);
    progressBar.fill.setAttribute('stroke-dasharray', progressBar.fillLength);
  };

  function animateProgressBar(progressBar) {
    // reset inital values
    setProgressBarValue(progressBar, 0);
    
    // listen for the element to enter the viewport -> start animation
    var observer = new IntersectionObserver(progressBarObserve.bind(progressBar), { threshold: [0, 0.1] });
    observer.observe(progressBar.element);
  };

  function progressBarObserve(entries, observer) { // observe progressBar position -> start animation when inside viewport
    var self = this;
    if(entries[0].intersectionRatio.toFixed(1) > 0 && !this.animationTriggered) {
      updateProgressBar(this, 0, this.value, this.animationDuration, function(){
        emitProgressBarEvents(self, 'progressCompleted', self.value+'%');
      });
    }
  };

  function setProgressBarValue(progressBar, value) {
    var offset = ((100 - value)*progressBar.fillLength/100).toFixed(2);
    progressBar.fill.setAttribute('stroke-dashoffset', offset);
    if(progressBar.label.length > 0 ) progressBar.label[0].textContent = value;
    if(progressBar.changeColor) updateProgressBarColor(progressBar, value);
  };

  function updateProgressBar(progressBar, start, to, duration, cb) {
    var change = to - start,
      currentTime = null;

    var animateFill = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      var val = parseInt((progress/duration)*change + start);
      // make sure value is in correct range
      if(change > 0 && val > to) val = to;
      if(change < 0 && val < to) val = to;
      if(progress >= duration) val = to;

      setProgressBarValue(progressBar, val);
      if(progress < duration) {
        progressBar.animationId = window.requestAnimationFrame(animateFill);
      } else {
        progressBar.animationId = false;
        cb();
      }
    };
    if ( window.requestAnimationFrame && !osHasReducedMotion ) {
      progressBar.animationId = window.requestAnimationFrame(animateFill);
    } else {
      setProgressBarValue(progressBar, to);
      cb();
    }
  };

  function updateProgressBarColor(progressBar, value) {
    var className = 'c-progress-bar--fill-color-'+ progressBar.colorThresholds.length;
    for(var i = progressBar.colorThresholds.length; i > 0; i--) {
      if( !isNaN(progressBar.colorThresholds[i - 1]) && value <= progressBar.colorThresholds[i - 1]) {
        className = 'c-progress-bar--fill-color-' + i;
      } 
    }
    
    removeProgressBarColorClasses(progressBar);
    Util.addClass(progressBar.element, className);
  };

  function removeProgressBarColorClasses(progressBar) {
    var classes = progressBar.element.className.split(" ").filter(function(c) {
      return c.lastIndexOf('c-progress-bar--fill-color-', 0) !== 0;
    });
    progressBar.element.className = classes.join(" ").trim();
  };

  function getProgressBarValue(progressBar) {
    return (100 - Math.round((parseFloat(progressBar.fill.getAttribute('stroke-dashoffset'))/progressBar.fillLength)*100));
  };

  function emitProgressBarEvents(progressBar, eventName, detail) {
    progressBar.element.dispatchEvent(new CustomEvent(eventName, {detail: detail}));
  };

  window.CProgressBar = CProgressBar;

  //initialize the CProgressBar objects
  var circularProgressBars = document.getElementsByClassName('js-c-progress-bar');
  var osHasReducedMotion = Util.osHasReducedMotion();
  if( circularProgressBars.length > 0 ) {
    for( var i = 0; i < circularProgressBars.length; i++) {
      (function(i){new CProgressBar(circularProgressBars[i]);})(i);
    }
  }
}());
// File#: _1_custom-select
// Usage: codyhouse.co/license
(function() {
  // NOTE: you need the js code when using the --custom-dropdown/--minimal variation of the Custom Select component. Default version does nor require JS.
  
  var CustomSelect = function(element) {
    this.element = element;
    this.select = this.element.getElementsByTagName('select')[0];
    this.optGroups = this.select.getElementsByTagName('optgroup');
    this.options = this.select.getElementsByTagName('option');
    this.selectedOption = getSelectedOptionText(this);
    this.selectId = this.select.getAttribute('id');
    this.trigger = false;
    this.dropdown = false;
    this.customOptions = false;
    this.arrowIcon = this.element.getElementsByTagName('svg');
    this.label = document.querySelector('[for="'+this.selectId+'"]');
    this.labelContent = '';
    if(this.label) this.labelContent = ', '+this.label.textContent;

    this.optionIndex = 0; // used while building the custom dropdown

    initCustomSelect(this); // init markup
    initCustomSelectEvents(this); // init event listeners
  };
  
  function initCustomSelect(select) {
    // create the HTML for the custom dropdown element
    select.element.insertAdjacentHTML('beforeend', initButtonSelect(select) + initListSelect(select));
    
    // save custom elements
    select.dropdown = select.element.getElementsByClassName('js-select__dropdown')[0];
    select.trigger = select.element.getElementsByClassName('js-select__button')[0];
    select.customOptions = select.dropdown.getElementsByClassName('js-select__item');
    
    // hide default select
    select.select.classList.add('is-hidden');
    if(select.arrowIcon.length > 0 ) select.arrowIcon[0].style.display = 'none';

    // store drowdown min width
    select.minWidth = parseInt(getComputedStyle(select.dropdown).getPropertyValue('min-width'));

    // place dropdown
    placeDropdown(select);
  };

  function initCustomSelectEvents(select) {
    // option selection in dropdown
    initSelection(select);

    // click events
    select.trigger.addEventListener('click', function(){
      toggleCustomSelect(select, false);
    });
    if(select.label) {
      // move focus to custom trigger when clicking on <select> label
      select.label.addEventListener('click', function(){
        moveFocus(select.trigger);
      });
    }
    // keyboard navigation
    select.dropdown.addEventListener('keydown', function(event){
      if(event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
        keyboardCustomSelect(select, 'prev', event);
      } else if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
        keyboardCustomSelect(select, 'next', event);
      }
    });
    // native <select> element has been updated -> update custom select as well
    select.element.addEventListener('select-updated', function(event){
      resetCustomSelect(select);
    });
  };

  function toggleCustomSelect(select, bool) {
    var ariaExpanded;
    if(bool) {
      ariaExpanded = bool;
    } else {
      ariaExpanded = select.trigger.getAttribute('aria-expanded') == 'true' ? 'false' : 'true';
    }
    select.trigger.setAttribute('aria-expanded', ariaExpanded);
    if(ariaExpanded == 'true') {
      var selectedOption = getSelectedOption(select);
      moveFocus(selectedOption); // fallback if transition is not supported
      select.dropdown.addEventListener('transitionend', function cb(){
        moveFocus(selectedOption);
        select.dropdown.removeEventListener('transitionend', cb);
      });
      placeDropdown(select); // place dropdown based on available space
    }
  };

  function placeDropdown(select) {
    // remove placement classes to reset position
    select.dropdown.classList.remove('select__dropdown--right', 'select__dropdown--up');
    var triggerBoundingRect = select.trigger.getBoundingClientRect();
    select.dropdown.classList.toggle('select__dropdown--right', (document.documentElement.clientWidth - 5 < triggerBoundingRect.left + select.dropdown.offsetWidth));
    // check if there's enough space up or down
    var moveUp = (window.innerHeight - triggerBoundingRect.bottom - 5) < triggerBoundingRect.top;
    select.dropdown.classList.toggle('select__dropdown--up', moveUp);
    // set max-height based on available space
    var maxHeight = moveUp ? triggerBoundingRect.top - 20 : window.innerHeight - triggerBoundingRect.bottom - 20;
    if(select.minWidth < triggerBoundingRect.width) { // check if we need to set a min-width
      select.dropdown.setAttribute('style', 'max-height: '+maxHeight+'px; min-width: '+triggerBoundingRect.width+'px;');
    } else {
      select.dropdown.setAttribute('style', 'max-height: '+maxHeight+'px;');
    }
  };

  function keyboardCustomSelect(select, direction, event) { // navigate custom dropdown with keyboard
    event.preventDefault();
    var index = Array.prototype.indexOf.call(select.customOptions, document.activeElement);
    index = (direction == 'next') ? index + 1 : index - 1;
    if(index < 0) index = select.customOptions.length - 1;
    if(index >= select.customOptions.length) index = 0;
    moveFocus(select.customOptions[index]);
  };

  function initSelection(select) { // option selection
    select.dropdown.addEventListener('click', function(event){
      var option = event.target.closest('.js-select__item');
      if(!option) return;
      selectOption(select, option);
    });
  };
  
  function selectOption(select, option) {
    if(option.hasAttribute('aria-selected') && option.getAttribute('aria-selected') == 'true') {
      // selecting the same option
      select.trigger.setAttribute('aria-expanded', 'false'); // hide dropdown
    } else { 
      var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
      if(selectedOption) selectedOption.setAttribute('aria-selected', 'false');
      option.setAttribute('aria-selected', 'true');
      select.trigger.getElementsByClassName('js-select__label')[0].textContent = option.textContent;
      select.trigger.setAttribute('aria-expanded', 'false');
      // new option has been selected -> update native <select> element _ arai-label of trigger <button>
      updateNativeSelect(select, option.getAttribute('data-index'));
      updateTriggerAria(select); 
    }
    // move focus back to trigger
    select.trigger.focus();
  };

  function updateNativeSelect(select, index) {
    select.select.selectedIndex = index;
    select.select.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
    select.select.dispatchEvent(new CustomEvent('input', {bubbles: true})); // trigger change event
  };

  function updateTriggerAria(select) {
    select.trigger.setAttribute('aria-label', select.options[select.select.selectedIndex].innerHTML+select.labelContent);
  };

  function getSelectedOptionText(select) {// used to initialize the label of the custom select button
    var label = '';
    if('selectedIndex' in select.select) {
      label = select.options[select.select.selectedIndex].text;
    } else {
      label = select.select.querySelector('option[selected]').text;
    }
    return label;

  };
  
  function initButtonSelect(select) { // create the button element -> custom select trigger
    // check if we need to add custom classes to the button trigger
    var customClasses = select.element.getAttribute('data-trigger-class') ? ' '+select.element.getAttribute('data-trigger-class') : '';

    var label = select.options[select.select.selectedIndex].innerHTML+select.labelContent;
  
    var button = '<button type="button" class="js-select__button select__button'+customClasses+'" aria-label="'+label+'" aria-expanded="false" aria-controls="'+select.selectId+'-dropdown"><span aria-hidden="true" class="js-select__label select__label">'+select.selectedOption+'</span>';
    if(select.arrowIcon.length > 0 && select.arrowIcon[0].outerHTML) {
      var clone = select.arrowIcon[0].cloneNode(true);
      clone.classList.remove('select__icon');
      button = button +clone.outerHTML;
    }
    
    return button+'</button>';

  };

  function initListSelect(select) { // create custom select dropdown
    var list = '<div class="js-select__dropdown select__dropdown" aria-describedby="'+select.selectId+'-description" id="'+select.selectId+'-dropdown">';
    list = list + getSelectLabelSR(select);
    if(select.optGroups.length > 0) {
      for(var i = 0; i < select.optGroups.length; i++) {
        var optGroupList = select.optGroups[i].getElementsByTagName('option'),
          optGroupLabel = '<li><span class="select__item select__item--optgroup">'+select.optGroups[i].getAttribute('label')+'</span></li>';
        list = list + '<ul class="select__list" role="listbox">'+optGroupLabel+getOptionsList(select, optGroupList) + '</ul>';
      }
    } else {
      list = list + '<ul class="select__list" role="listbox">'+getOptionsList(select, select.options) + '</ul>';
    }
    return list;
  };

  function getSelectLabelSR(select) {
    if(select.label) {
      return '<p class="sr-only" id="'+select.selectId+'-description">'+select.label.textContent+'</p>'
    } else {
      return '';
    }
  };
  
  function resetCustomSelect(select) {
    // <select> element has been updated (using an external control) - update custom select
    var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
    if(selectedOption) selectedOption.setAttribute('aria-selected', 'false');
    var option = select.dropdown.querySelector('.js-select__item[data-index="'+select.select.selectedIndex+'"]');
    option.setAttribute('aria-selected', 'true');
    select.trigger.getElementsByClassName('js-select__label')[0].textContent = option.textContent;
    select.trigger.setAttribute('aria-expanded', 'false');
    updateTriggerAria(select); 
  };

  function getOptionsList(select, options) {
    var list = '';
    for(var i = 0; i < options.length; i++) {
      var selected = options[i].hasAttribute('selected') ? ' aria-selected="true"' : ' aria-selected="false"',
        disabled = options[i].hasAttribute('disabled') ? ' disabled' : '';
      list = list + '<li><button type="button" class="reset js-select__item select__item select__item--option" role="option" data-value="'+options[i].value+'" '+selected+disabled+' data-index="'+select.optionIndex+'">'+options[i].text+'</button></li>';
      select.optionIndex = select.optionIndex + 1;
    };
    return list;
  };

  function getSelectedOption(select) {
    var option = select.dropdown.querySelector('[aria-selected="true"]');
    if(option) return option;
    else return select.dropdown.getElementsByClassName('js-select__item')[0];
  };

  function moveFocusToSelectTrigger(select) {
    if(!document.activeElement.closest('.js-select')) return
    select.trigger.focus();
  };
  
  function checkCustomSelectClick(select, target) { // close select when clicking outside it
    if( !select.element.contains(target) ) toggleCustomSelect(select, 'false');
  };

  function moveFocus(element) {
    element.focus();
    if (document.activeElement !== element) {
      element.setAttribute('tabindex','-1');
      element.focus();
    }
  };
  
  //initialize the CustomSelect objects
  var customSelect = document.getElementsByClassName('js-select');
  if( customSelect.length > 0 ) {
    var selectArray = [];
    for( var i = 0; i < customSelect.length; i++) {
      (function(i){selectArray.push(new CustomSelect(customSelect[i]));})(i);
    }

    // listen for key events
    window.addEventListener('keyup', function(event){
      if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        // close custom select on 'Esc'
        selectArray.forEach(function(element){
          moveFocusToSelectTrigger(element); // if focus is within dropdown, move it to dropdown trigger
          toggleCustomSelect(element, 'false'); // close dropdown
        });
      } 
    });
    // close custom select when clicking outside it
    window.addEventListener('click', function(event){
      selectArray.forEach(function(element){
        checkCustomSelectClick(element, event.target);
      });
    });
  }
}());
// File#: _1_date-picker
// Usage: codyhouse.co/license
(function() {
  var DatePicker = function(opts) {
    this.options = extendProps(DatePicker.defaults , opts);
    this.element = this.options.element;
    this.input = this.element.getElementsByClassName('js-date-input__text')[0];
    this.trigger = this.element.getElementsByClassName('js-date-input__trigger')[0];
    this.triggerLabel = this.trigger.getAttribute('aria-label');
    this.datePicker = this.element.getElementsByClassName('js-date-picker')[0];
    this.body = this.datePicker.getElementsByClassName('js-date-picker__dates')[0];
    this.navigation = this.datePicker.getElementsByClassName('js-date-picker__month-nav')[0];
    this.heading = this.datePicker.getElementsByClassName('js-date-picker__month-label')[0];
    this.pickerVisible = false;
    // date format
    this.dateIndexes = getDateIndexes(this); // store indexes of date parts (d, m, y)
    // set initial date
    resetCalendar(this);
    // selected date
    this.dateSelected = false;
    this.selectedDay = false;
    this.selectedMonth = false;
    this.selectedYear = false;
    // focus trap
    this.firstFocusable = false;
    this.lastFocusable = false;
    // date value - for custom control variation
    this.dateValueEl = this.element.getElementsByClassName('js-date-input__value');
    if(this.dateValueEl.length > 0) {
      this.dateValueLabelInit = this.dateValueEl[0].textContent; // initial input value
    }
    initCalendarAria(this);
    initCalendarEvents(this);
    // place picker according to available space
    placeCalendar(this);
  };

  DatePicker.prototype.showCalendar = function() {
    showCalendar(this);
  };

  DatePicker.prototype.showNextMonth = function() {
    showNext(this, true);
  };

  DatePicker.prototype.showPrevMonth = function() {
    showPrev(this, true);
  };

  function initCalendarAria(datePicker) {
    // reset calendar button label
    resetLabelCalendarTrigger(datePicker);
    if(datePicker.dateValueEl.length > 0) {
      resetCalendar(datePicker);
      resetLabelCalendarValue(datePicker);
    }
    // create a live region used to announce new month selection to SR
    var srLiveReagion = document.createElement('div');
    srLiveReagion.setAttribute('aria-live', 'polite');
    srLiveReagion.classList.add('sr-only', 'js-date-input__sr-live');
    datePicker.element.appendChild(srLiveReagion);
    datePicker.srLiveReagion = datePicker.element.getElementsByClassName('js-date-input__sr-live')[0];
  };

  function initCalendarEvents(datePicker) {
    datePicker.input.addEventListener('focus', function(event){
      toggleCalendar(datePicker, true); // toggle calendar when focus is on input
    });
    if(datePicker.trigger) {
      datePicker.trigger.addEventListener('click', function(event){ // open calendar when clicking on calendar button
        event.preventDefault();
        datePicker.pickerVisible = false;
        toggleCalendar(datePicker);
        datePicker.trigger.setAttribute('aria-expanded', 'true');
      });
    }

    // select a date inside the date picker
    datePicker.body.addEventListener('click', function(event){
      event.preventDefault();
      var day = event.target.closest('button');
      if(day) {
        datePicker.dateSelected = true;
        datePicker.selectedDay = day.innerText;
        datePicker.selectedMonth = datePicker.currentMonth;
        datePicker.selectedYear = datePicker.currentYear;
        setInputValue(datePicker);
        datePicker.input.focus(); // focus on the input element and close picker
        resetLabelCalendarTrigger(datePicker);
        resetLabelCalendarValue(datePicker);
      }
    });

    // navigate using month nav
    datePicker.navigation.addEventListener('click', function(event){
      event.preventDefault();
      var btn = event.target.closest('.js-date-picker__month-nav-btn');
      if(btn) {
        btn.classList.contains('js-date-picker__month-nav-btn--prev') ? showPrev(datePicker, true) : showNext(datePicker, true);
      }
    });

    // hide calendar
    window.addEventListener('keydown', function(event){ // close calendar on esc
      if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
        if(document.activeElement.closest('.js-date-picker')) {
          datePicker.input.focus(); //if focus is inside the calendar -> move the focus to the input element 
        } else { // do not move focus -> only close calendar
          hideCalendar(datePicker); 
        }
      }
    });
    window.addEventListener('click', function(event){
      if(!event.target.closest('.js-date-picker') && !event.target.closest('.js-date-input') && datePicker.pickerVisible) {
        hideCalendar(datePicker);
      }
    });

    // navigate through days of calendar
    datePicker.body.addEventListener('keydown', function(event){
      var day = datePicker.currentDay;
      if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
        day = day + 7;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
        day = day + 1;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
        day = day - 1;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
        day = day - 7;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 35 || event.key && event.key.toLowerCase() == 'end') { // move focus to last day of week
        event.preventDefault();
        day = day + 6 - getDayOfWeek(datePicker.currentYear, datePicker.currentMonth, day);
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 36 || event.key && event.key.toLowerCase() == 'home') { // move focus to first day of week
        event.preventDefault();
        day = day - getDayOfWeek(datePicker.currentYear, datePicker.currentMonth, day);
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 34 || event.key && event.key.toLowerCase() == 'pagedown') {
        event.preventDefault();
        showNext(datePicker); // show next month
      } else if(event.keyCode && event.keyCode == 33 || event.key && event.key.toLowerCase() == 'pageup') {
        event.preventDefault();
        showPrev(datePicker); // show prev month
      }
    });

    // trap focus inside calendar
    datePicker.datePicker.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside modal
        trapFocus(event, datePicker);
      }
    });

    datePicker.input.addEventListener('keydown', function(event){
      if(event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {
        // update calendar on input enter
        resetCalendar(datePicker);
        resetLabelCalendarTrigger(datePicker);
        resetLabelCalendarValue(datePicker);
        hideCalendar(datePicker);
      } else if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown' && datePicker.pickerVisible) { // move focus to calendar using arrow down
        datePicker.body.querySelector('button[tabindex="0"]').focus();
      };
    });
  };

  function getCurrentDay(date) {
    return (date) 
      ? getDayFromDate(date)
      : new Date().getDate();
  };

  function getCurrentMonth(date) {
    return (date) 
      ? getMonthFromDate(date)
      : new Date().getMonth();
  };

  function getCurrentYear(date) {
    return (date) 
      ? getYearFromDate(date)
      : new Date().getFullYear();
  };

  function getDayFromDate(date) {
    var day = parseInt(date.split('-')[2]);
    return isNaN(day) ? getCurrentDay(false) : day;
  };

  function getMonthFromDate(date) {
    var month = parseInt(date.split('-')[1]) - 1;
    return isNaN(month) ? getCurrentMonth(false) : month;
  };

  function getYearFromDate(date) {
    var year = parseInt(date.split('-')[0]);
    return isNaN(year) ? getCurrentYear(false) : year;
  };

  function showNext(datePicker, bool) {
    // show next month
    datePicker.currentYear = (datePicker.currentMonth === 11) ? datePicker.currentYear + 1 : datePicker.currentYear;
    datePicker.currentMonth = (datePicker.currentMonth + 1) % 12;
    datePicker.currentDay = checkDayInMonth(datePicker);
    showCalendar(datePicker, bool);
    datePicker.srLiveReagion.textContent = datePicker.options.months[datePicker.currentMonth] + ' ' + datePicker.currentYear;
  };

  function showPrev(datePicker, bool) {
    // show prev month
    datePicker.currentYear = (datePicker.currentMonth === 0) ? datePicker.currentYear - 1 : datePicker.currentYear;
    datePicker.currentMonth = (datePicker.currentMonth === 0) ? 11 : datePicker.currentMonth - 1;
    datePicker.currentDay = checkDayInMonth(datePicker);
    showCalendar(datePicker, bool);
    datePicker.srLiveReagion.textContent = datePicker.options.months[datePicker.currentMonth] + ' ' + datePicker.currentYear;
  };

  function checkDayInMonth(datePicker) {
    return (datePicker.currentDay > daysInMonth(datePicker.currentYear, datePicker.currentMonth)) ? 1 : datePicker.currentDay;
  };

  function daysInMonth(year, month) {
    return 32 - new Date(year, month, 32).getDate();
  };

  function resetCalendar(datePicker) {
    var currentDate = false,
      selectedDate = datePicker.input.value;

    datePicker.dateSelected = false;
    if( selectedDate != '') {
      var date = getDateFromInput(datePicker);
      datePicker.dateSelected = true;
      currentDate = date;
    } 
    datePicker.currentDay = getCurrentDay(currentDate);
    datePicker.currentMonth = getCurrentMonth(currentDate); 
    datePicker.currentYear = getCurrentYear(currentDate); 
    
    datePicker.selectedDay = datePicker.dateSelected ? datePicker.currentDay : false;
    datePicker.selectedMonth = datePicker.dateSelected ? datePicker.currentMonth : false;
    datePicker.selectedYear = datePicker.dateSelected ? datePicker.currentYear : false;
  };

  function showCalendar(datePicker, bool) {
    // show calendar element
    var firstDay = getDayOfWeek(datePicker.currentYear, datePicker.currentMonth, '01');
    datePicker.body.innerHTML = '';
    datePicker.heading.innerHTML = datePicker.options.months[datePicker.currentMonth] + ' ' + datePicker.currentYear;

    // creating all cells
    var date = 1,
      calendar = '';
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          calendar = calendar + '<li></li>';
        } else if (date > daysInMonth(datePicker.currentYear, datePicker.currentMonth)) {
          break;
        } else {
          var classListDate = '',
            tabindexValue = '-1';
          if (date === datePicker.currentDay) {
            tabindexValue = '0';
          } 
          if(!datePicker.dateSelected && getCurrentMonth() == datePicker.currentMonth && getCurrentYear() == datePicker.currentYear && date == getCurrentDay()){
            classListDate = classListDate+' date-picker__date--today'
          }
          if (datePicker.dateSelected && date === datePicker.selectedDay && datePicker.currentYear === datePicker.selectedYear && datePicker.currentMonth === datePicker.selectedMonth) {
            classListDate = classListDate+'  date-picker__date--selected';
          }
          calendar = calendar + '<li><button class="date-picker__date'+classListDate+'" tabindex="'+tabindexValue+'" type="button">'+date+'</button></li>';
          date++;
        }
      }
    }
    datePicker.body.innerHTML = calendar; // appending days into calendar body
    
    // show calendar
    if(!datePicker.pickerVisible) datePicker.datePicker.classList.add('date-picker--is-visible');
    datePicker.pickerVisible = true;

    //  if bool is false, move focus to calendar day
    if(!bool) datePicker.body.querySelector('button[tabindex="0"]').focus();

    // store first/last focusable elements
    getFocusableElements(datePicker);

    //place calendar
    placeCalendar(datePicker);
  };

  function hideCalendar(datePicker) {
    datePicker.datePicker.classList.remove('date-picker--is-visible');
    datePicker.pickerVisible = false;

    // reset first/last focusable
    datePicker.firstFocusable = false;
    datePicker.lastFocusable = false;

    // reset trigger aria-expanded attribute
    if(datePicker.trigger) datePicker.trigger.setAttribute('aria-expanded', 'false');
  };

  function toggleCalendar(datePicker, bool) {
    if(!datePicker.pickerVisible) {
      resetCalendar(datePicker);
      showCalendar(datePicker, bool);
    } else {
      hideCalendar(datePicker);
    }
  };

  function getDayOfWeek(year, month, day) {
    var weekDay = (new Date(year, month, day)).getDay() - 1;
    if(weekDay < 0) weekDay = 6;
    return weekDay;
  };

  function getDateIndexes(datePicker) {
    var dateFormat = datePicker.options.dateFormat.toLowerCase().replace(/-/g, '');
    return [dateFormat.indexOf('d'), dateFormat.indexOf('m'), dateFormat.indexOf('y')];
  };

  function setInputValue(datePicker) {
    datePicker.input.value = getDateForInput(datePicker);
  };

  function getDateForInput(datePicker) {
    var dateArray = [];
    dateArray[datePicker.dateIndexes[0]] = getReadableDate(datePicker.selectedDay);
    dateArray[datePicker.dateIndexes[1]] = getReadableDate(datePicker.selectedMonth+1);
    dateArray[datePicker.dateIndexes[2]] = datePicker.selectedYear;
    return dateArray[0]+datePicker.options.dateSeparator+dateArray[1]+datePicker.options.dateSeparator+dateArray[2];
  };

  function getDateFromInput(datePicker) {
    var dateArray = datePicker.input.value.split(datePicker.options.dateSeparator);
    return dateArray[datePicker.dateIndexes[2]]+'-'+dateArray[datePicker.dateIndexes[1]]+'-'+dateArray[datePicker.dateIndexes[0]];
  };

  function getReadableDate(date) {
    return (date < 10) ? '0'+date : date;
  };

  function resetDayValue(day, datePicker) {
    var totDays = daysInMonth(datePicker.currentYear, datePicker.currentMonth);
    if( day > totDays) {
      datePicker.currentDay = day - totDays;
      showNext(datePicker, false);
    } else if(day < 1) {
      var newMonth = datePicker.currentMonth == 0 ? 11 : datePicker.currentMonth - 1;
      datePicker.currentDay = daysInMonth(datePicker.currentYear, newMonth) + day;
      showPrev(datePicker, false);
    } else {
      datePicker.currentDay = day;
      datePicker.body.querySelector('button[tabindex="0"]').setAttribute('tabindex', '-1');
      // set new tabindex to selected item
      var buttons = datePicker.body.getElementsByTagName("button");
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent == datePicker.currentDay) {
          buttons[i].setAttribute('tabindex', '0');
          buttons[i].focus();
          break;
        }
      }
      getFocusableElements(datePicker); // update first focusable/last focusable element
    }
  };

  function resetLabelCalendarTrigger(datePicker) {
    if(!datePicker.trigger) return;
    // reset accessible label of the calendar trigger
    (datePicker.selectedYear && datePicker.selectedMonth !== false && datePicker.selectedDay) 
      ? datePicker.trigger.setAttribute('aria-label', datePicker.triggerLabel+', selected date is '+ new Date(datePicker.selectedYear, datePicker.selectedMonth, datePicker.selectedDay).toDateString())
      : datePicker.trigger.setAttribute('aria-label', datePicker.triggerLabel);
  };

  function resetLabelCalendarValue(datePicker) {
    // this is used for the --custom-control variation -> there's a label that should be updated with the selected date
    if(datePicker.dateValueEl.length < 1) return;
    (datePicker.selectedYear && datePicker.selectedMonth !== false && datePicker.selectedDay) 
      ? datePicker.dateValueEl[0].textContent = getDateForInput(datePicker)
      : datePicker.dateValueEl[0].textContent = datePicker.dateValueLabelInit;
  };

  function getFocusableElements(datePicker) {
    var allFocusable = datePicker.datePicker.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    getFirstFocusable(allFocusable, datePicker);
    getLastFocusable(allFocusable, datePicker);
  }

  function getFirstFocusable(elements, datePicker) {
    for(var i = 0; i < elements.length; i++) {
			if( (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) &&  elements[i].getAttribute('tabindex') != '-1') {
				datePicker.firstFocusable = elements[i];
				return true;
			}
		}
  };

  function getLastFocusable(elements, datePicker) {
    //get last visible focusable element inside the modal
		for(var i = elements.length - 1; i >= 0; i--) {
			if( (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) &&  elements[i].getAttribute('tabindex') != '-1' ) {
				datePicker.lastFocusable = elements[i];
				return true;
			}
		}
  };

  function trapFocus(event, datePicker) {
    if( datePicker.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of calendar
			event.preventDefault();
			datePicker.lastFocusable.focus();
		}
		if( datePicker.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of calendar
			event.preventDefault();
			datePicker.firstFocusable.focus();
		}
  };

  function placeCalendar(datePicker) {
    // reset position
    datePicker.datePicker.style.left = '0px';
    datePicker.datePicker.style.right = 'auto';
    
    //check if you need to modify the calendar postion
    var pickerBoundingRect = datePicker.datePicker.getBoundingClientRect();

    if(pickerBoundingRect.right > window.innerWidth) {
      datePicker.datePicker.style.left = 'auto';
      datePicker.datePicker.style.right = '0px';
    }
  };

  var extendProps = function () {
    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;
    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
    }
    // Merge the object into the extended object
    var merge = function (obj) {
      for ( var prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = extend( true, extended[prop], obj[prop] );
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };
    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
      var obj = arguments[i];
      merge(obj);
    }
    return extended;
  };

  DatePicker.defaults = {
    element : '',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dateFormat: 'd-m-y',
    dateSeparator: '/'
  };

  window.DatePicker = DatePicker;

  var datePicker = document.getElementsByClassName('js-date-input'),
    flexSupported = CSS.supports('align-items', 'stretch');
  if( datePicker.length > 0 ) {
		for( var i = 0; i < datePicker.length; i++) {(function(i){
      if(!flexSupported) {
        datePicker[i].classList.add('date-input--hide-calendar');
        return;
      }
      var opts = {element: datePicker[i]};
      if(datePicker[i].getAttribute('data-date-format')) {
        opts.dateFormat = datePicker[i].getAttribute('data-date-format');
      }
      if(datePicker[i].getAttribute('data-date-separator')) {
        opts.dateSeparator = datePicker[i].getAttribute('data-date-separator');
      }
      if(datePicker[i].getAttribute('data-months')) {
        opts.months = datePicker[i].getAttribute('data-months').split(',').map(function(item) {return item.trim();});
      }
      new DatePicker(opts);
    })(i);}
	}
}());


// File#: _1_diagonal-movement
// Usage: codyhouse.co/license
/*
  Modified version of the jQuery-menu-aim plugin
  https://github.com/kamens/jQuery-menu-aim
  - Replaced jQuery with Vanilla JS
  - Minor changes
*/
(function() {
  var menuAim = function(opts) {
    init(opts);
  };

  window.menuAim = menuAim;

  function init(opts) {
    var activeRow = null,
      mouseLocs = [],
      lastDelayLoc = null,
      timeoutId = null,
      options = Util.extend({
        menu: '',
        rows: false, //if false, get direct children - otherwise pass nodes list 
        submenuSelector: "*",
        submenuDirection: "right",
        tolerance: 75,  // bigger = more forgivey when entering submenu
        enter: function(){},
        exit: function(){},
        activate: function(){},
        deactivate: function(){},
        exitMenu: function(){}
      }, opts),
      menu = options.menu;

    var MOUSE_LOCS_TRACKED = 3,  // number of past mouse locations to track
      DELAY = 300;  // ms delay when user appears to be entering submenu

    /**
     * Keep track of the last few locations of the mouse.
     */
    var mousemoveDocument = function(e) {
      mouseLocs.push({x: e.pageX, y: e.pageY});

      if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
        mouseLocs.shift();
      }
    };

    /**
     * Cancel possible row activations when leaving the menu entirely
     */
    var mouseleaveMenu = function() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // If exitMenu is supplied and returns true, deactivate the
      // currently active row on menu exit.
      if (options.exitMenu(this)) {
        if (activeRow) {
          options.deactivate(activeRow);
        }

        activeRow = null;
      }
    };

    /**
     * Trigger a possible row activation whenever entering a new row.
     */
    var mouseenterRow = function() {
      if (timeoutId) {
        // Cancel any previous activation delays
        clearTimeout(timeoutId);
      }

      options.enter(this);
      possiblyActivate(this);
    },
    mouseleaveRow = function() {
      options.exit(this);
    };

    /*
     * Immediately activate a row if the user clicks on it.
     */
    var clickRow = function() {
      activate(this);
    };  

    /**
     * Activate a menu row.
     */
    var activate = function(row) {
      if (row == activeRow) {
        return;
      }

      if (activeRow) {
        options.deactivate(activeRow);
      }

      options.activate(row);
      activeRow = row;
    };

    /**
     * Possibly activate a menu row. If mouse movement indicates that we
     * shouldn't activate yet because user may be trying to enter
     * a submenu's content, then delay and check again later.
     */
    var possiblyActivate = function(row) {
      var delay = activationDelay();

      if (delay) {
        timeoutId = setTimeout(function() {
          possiblyActivate(row);
        }, delay);
      } else {
        activate(row);
      }
    };

    /**
     * Return the amount of time that should be used as a delay before the
     * currently hovered row is activated.
     *
     * Returns 0 if the activation should happen immediately. Otherwise,
     * returns the number of milliseconds that should be delayed before
     * checking again to see if the row should be activated.
     */
    var activationDelay = function() {
      if (!activeRow || !Util.is(activeRow, options.submenuSelector)) {
        // If there is no other submenu row already active, then
        // go ahead and activate immediately.
        return 0;
      }

      function getOffset(element) {
        var rect = element.getBoundingClientRect();
        return { top: rect.top + window.pageYOffset, left: rect.left + window.pageXOffset };
      };

      var offset = getOffset(menu),
          upperLeft = {
              x: offset.left,
              y: offset.top - options.tolerance
          },
          upperRight = {
              x: offset.left + menu.offsetWidth,
              y: upperLeft.y
          },
          lowerLeft = {
              x: offset.left,
              y: offset.top + menu.offsetHeight + options.tolerance
          },
          lowerRight = {
              x: offset.left + menu.offsetWidth,
              y: lowerLeft.y
          },
          loc = mouseLocs[mouseLocs.length - 1],
          prevLoc = mouseLocs[0];

      if (!loc) {
        return 0;
      }

      if (!prevLoc) {
        prevLoc = loc;
      }

      if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x || prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
        // If the previous mouse location was outside of the entire
        // menu's bounds, immediately activate.
        return 0;
      }

      if (lastDelayLoc && loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
        // If the mouse hasn't moved since the last time we checked
        // for activation status, immediately activate.
        return 0;
      }

      // Detect if the user is moving towards the currently activated
      // submenu.
      //
      // If the mouse is heading relatively clearly towards
      // the submenu's content, we should wait and give the user more
      // time before activating a new row. If the mouse is heading
      // elsewhere, we can immediately activate a new row.
      //
      // We detect this by calculating the slope formed between the
      // current mouse location and the upper/lower right points of
      // the menu. We do the same for the previous mouse location.
      // If the current mouse location's slopes are
      // increasing/decreasing appropriately compared to the
      // previous's, we know the user is moving toward the submenu.
      //
      // Note that since the y-axis increases as the cursor moves
      // down the screen, we are looking for the slope between the
      // cursor and the upper right corner to decrease over time, not
      // increase (somewhat counterintuitively).
      function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
      };

      var decreasingCorner = upperRight,
        increasingCorner = lowerRight;

      // Our expectations for decreasing or increasing slope values
      // depends on which direction the submenu opens relative to the
      // main menu. By default, if the menu opens on the right, we
      // expect the slope between the cursor and the upper right
      // corner to decrease over time, as explained above. If the
      // submenu opens in a different direction, we change our slope
      // expectations.
      if (options.submenuDirection == "left") {
        decreasingCorner = lowerLeft;
        increasingCorner = upperLeft;
      } else if (options.submenuDirection == "below") {
        decreasingCorner = lowerRight;
        increasingCorner = lowerLeft;
      } else if (options.submenuDirection == "above") {
        decreasingCorner = upperLeft;
        increasingCorner = upperRight;
      }

      var decreasingSlope = slope(loc, decreasingCorner),
        increasingSlope = slope(loc, increasingCorner),
        prevDecreasingSlope = slope(prevLoc, decreasingCorner),
        prevIncreasingSlope = slope(prevLoc, increasingCorner);

      if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
        // Mouse is moving from previous location towards the
        // currently activated submenu. Delay before activating a
        // new menu row, because user may be moving into submenu.
        lastDelayLoc = loc;
        return DELAY;
      }

      lastDelayLoc = null;
      return 0;
    };

    /**
     * Hook up initial menu events
     */
    menu.addEventListener('mouseleave', mouseleaveMenu);  
    var rows = (options.rows) ? options.rows : menu.children;
    if(rows.length > 0) {
      for(var i = 0; i < rows.length; i++) {(function(i){
        rows[i].addEventListener('mouseenter', mouseenterRow);  
        rows[i].addEventListener('mouseleave', mouseleaveRow);
        rows[i].addEventListener('click', clickRow);  
      })(i);}
    }

    document.addEventListener('mousemove', function(event){
    (!window.requestAnimationFrame) ? mousemoveDocument(event) : window.requestAnimationFrame(function(){mousemoveDocument(event);});
    });
  };
}());


// File#: _1_dialog
// Usage: codyhouse.co/license
(function() {
  var Dialog = function(element) {
    this.element = element;
    this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.selectedTrigger = null;
    this.showClass = "dialog--is-visible";
    initDialog(this);
  };

  function initDialog(dialog) {
    if ( dialog.triggers ) {
      for(var i = 0; i < dialog.triggers.length; i++) {
        dialog.triggers[i].addEventListener('click', function(event) {
          event.preventDefault();
          dialog.selectedTrigger = event.target;
          showDialog(dialog);
          initDialogEvents(dialog);
        });
      }
    }
    
    // listen to the openDialog event -> open dialog without a trigger button
    dialog.element.addEventListener('openDialog', function(event){
      if(event.detail) self.selectedTrigger = event.detail;
      showDialog(dialog);
      initDialogEvents(dialog);
    });
  };

  function showDialog(dialog) {
    Util.addClass(dialog.element, dialog.showClass);
    getFocusableElements(dialog);
    dialog.firstFocusable.focus();
    // wait for the end of transitions before moving focus
    dialog.element.addEventListener("transitionend", function cb(event) {
      dialog.firstFocusable.focus();
      dialog.element.removeEventListener("transitionend", cb);
    });
    emitDialogEvents(dialog, 'dialogIsOpen');
  };

  function closeDialog(dialog) {
    Util.removeClass(dialog.element, dialog.showClass);
    dialog.firstFocusable = null;
    dialog.lastFocusable = null;
    if(dialog.selectedTrigger) dialog.selectedTrigger.focus();
    //remove listeners
    cancelDialogEvents(dialog);
    emitDialogEvents(dialog, 'dialogIsClose');
  };
  
  function initDialogEvents(dialog) {
    //add event listeners
    dialog.element.addEventListener('keydown', handleEvent.bind(dialog));
    dialog.element.addEventListener('click', handleEvent.bind(dialog));
  };

  function cancelDialogEvents(dialog) {
    //remove event listeners
    dialog.element.removeEventListener('keydown', handleEvent.bind(dialog));
    dialog.element.removeEventListener('click', handleEvent.bind(dialog));
  };
  
  function handleEvent(event) {
    // handle events
    switch(event.type) {
      case 'click': {
        initClick(this, event);
      }
      case 'keydown': {
        initKeyDown(this, event);
      }
    }
  };
  
  function initKeyDown(dialog, event) {
    if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
      //close dialog on esc
      closeDialog(dialog);
    } else if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
      //trap focus inside dialog
      trapFocus(dialog, event);
    }
  };

  function initClick(dialog, event) {
    //close dialog when clicking on close button
    if( !event.target.closest('.js-dialog__close') ) return;
    event.preventDefault();
    closeDialog(dialog);
  };

  function trapFocus(dialog, event) {
    if( dialog.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of dialog
      event.preventDefault();
      dialog.lastFocusable.focus();
    }
    if( dialog.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of dialog
      event.preventDefault();
      dialog.firstFocusable.focus();
    }
  };

  function getFocusableElements(dialog) {
    //get all focusable elements inside the dialog
    var allFocusable = dialog.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    getFirstVisible(dialog, allFocusable);
    getLastVisible(dialog, allFocusable);
  };

  function getFirstVisible(dialog, elements) {
    //get first visible focusable element inside the dialog
    for(var i = 0; i < elements.length; i++) {
      if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
        dialog.firstFocusable = elements[i];
        return true;
      }
    }
  };

  function getLastVisible(dialog, elements) {
    //get last visible focusable element inside the dialog
    for(var i = elements.length - 1; i >= 0; i--) {
      if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
        dialog.lastFocusable = elements[i];
        return true;
      }
    }
  };

  function emitDialogEvents(dialog, eventName) {
    var event = new CustomEvent(eventName, {detail: dialog.selectedTrigger});
    dialog.element.dispatchEvent(event);
  };

  //initialize the Dialog objects
  var dialogs = document.getElementsByClassName('js-dialog');
  if( dialogs.length > 0 ) {
    for( var i = 0; i < dialogs.length; i++) {
      (function(i){new Dialog(dialogs[i]);})(i);
    }
  }
}());
// File#: _1_drawer
// Usage: codyhouse.co/license
(function() {
	var Drawer = function(element) {
		this.element = element;
		this.content = document.getElementsByClassName('js-drawer__body')[0];
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.selectedTrigger = null;
		this.isModal = this.element.classList.contains('js-drawer--modal');
		this.showClass = "drawer--is-visible";
		this.preventScrollEl = this.getPreventScrollEl();
		this.initDrawer();
	};

	Drawer.prototype.getPreventScrollEl = function() {
		var scrollEl = false;
		var querySelector = this.element.getAttribute('data-drawer-prevent-scroll');
		if(querySelector) scrollEl = document.querySelector(querySelector);
		return scrollEl;
	};

	Drawer.prototype.initDrawer = function() {
		var self = this;
		//open drawer when clicking on trigger buttons
		if ( this.triggers ) {
			for(var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					if(self.element.classList.contains(self.showClass)) {
						self.closeDrawer(event.target);
						return;
					}
					self.selectedTrigger = event.target;
					self.showDrawer();
					self.initDrawerEvents();
				});
			}
		}

		// if drawer is already open -> we should initialize the drawer events
		if(this.element.classList.contains(this.showClass)) this.initDrawerEvents();
	};

	Drawer.prototype.showDrawer = function() {
		var self = this;
		this.content.scrollTop = 0;
		this.element.classList.add(this.showClass);
		this.getFocusableElements();
		moveFocus(this.element);
		// wait for the end of transitions before moving focus
		this.element.addEventListener("transitionend", function cb(event) {
			moveFocus(self.element);
			self.element.removeEventListener("transitionend", cb);
		});
		this.emitDrawerEvents('drawerIsOpen', this.selectedTrigger);
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
	};

	Drawer.prototype.closeDrawer = function(target) {
		this.element.classList.remove(this.showClass);
		this.firstFocusable = null;
		this.lastFocusable = null;
		if(this.selectedTrigger) this.selectedTrigger.focus();
		//remove listeners
		this.cancelDrawerEvents();
		this.emitDrawerEvents('drawerIsClose', target);
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = '';
	};

	Drawer.prototype.initDrawerEvents = function() {
		//add event listeners
		this.element.addEventListener('keydown', this);
		this.element.addEventListener('click', this);
	};

	Drawer.prototype.cancelDrawerEvents = function() {
		//remove event listeners
		this.element.removeEventListener('keydown', this);
		this.element.removeEventListener('click', this);
	};

	Drawer.prototype.handleEvent = function (event) {
		switch(event.type) {
			case 'click': {
				this.initClick(event);
			}
			case 'keydown': {
				this.initKeyDown(event);
			}
		}
	};

	Drawer.prototype.initKeyDown = function(event) {
		if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
			//close drawer window on esc
			this.closeDrawer(false);
		} else if( this.isModal && (event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' )) {
			//trap focus inside drawer
			this.trapFocus(event);
		}
	};

	Drawer.prototype.initClick = function(event) {
		//close drawer when clicking on close button or drawer bg layer 
		if( !event.target.closest('.js-drawer__close') && !event.target.classList.contains('js-drawer') ) return;
		event.preventDefault();
		this.closeDrawer(event.target);
	};

	Drawer.prototype.trapFocus = function(event) {
		if( this.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of drawer
			event.preventDefault();
			this.lastFocusable.focus();
		}
		if( this.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of drawer
			event.preventDefault();
			this.firstFocusable.focus();
		}
	}

	Drawer.prototype.getFocusableElements = function() {
		//get all focusable elements inside the drawer
		var allFocusable = this.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
		this.getFirstVisible(allFocusable);
		this.getLastVisible(allFocusable);
	};

	Drawer.prototype.getFirstVisible = function(elements) {
		//get first visible focusable element inside the drawer
		for(var i = 0; i < elements.length; i++) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				this.firstFocusable = elements[i];
				return true;
			}
		}
	};

	Drawer.prototype.getLastVisible = function(elements) {
		//get last visible focusable element inside the drawer
		for(var i = elements.length - 1; i >= 0; i--) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				this.lastFocusable = elements[i];
				return true;
			}
		}
	};

	Drawer.prototype.emitDrawerEvents = function(eventName, target) {
		var event = new CustomEvent(eventName, {detail: target});
		this.element.dispatchEvent(event);
	};

	function moveFocus(element) {
    element.focus();
    if (document.activeElement !== element) {
      element.setAttribute('tabindex','-1');
      element.focus();
    }
  };

	window.Drawer = Drawer;

	//initialize the Drawer objects
	var drawer = document.getElementsByClassName('js-drawer');
	if( drawer.length > 0 ) {
		for( var i = 0; i < drawer.length; i++) {
			(function(i){new Drawer(drawer[i]);})(i);
		}
	}
}());
// File#: _1_expandable-search
// Usage: codyhouse.co/license
(function() {
  var expandableSearch = document.getElementsByClassName('js-expandable-search');
  if(expandableSearch.length > 0) {
    for( var i = 0; i < expandableSearch.length; i++) {
      (function(i){ // if user types in search input, keep the input expanded when focus is lost
        expandableSearch[i].getElementsByClassName('js-expandable-search__input')[0].addEventListener('input', function(event){
          Util.toggleClass(event.target, 'expandable-search__input--has-content', event.target.value.length > 0);
        });
      })(i);
    }
  }
}());
// File#: _1_filter-navigation
// Usage: codyhouse.co/license
(function() {
  var FilterNav = function(element) {
    this.element = element;
    this.wrapper = this.element.getElementsByClassName('js-filter-nav__wrapper')[0];
    this.nav = this.element.getElementsByClassName('js-filter-nav__nav')[0];
    this.list = this.nav.getElementsByClassName('js-filter-nav__list')[0];
    this.control = this.element.getElementsByClassName('js-filter-nav__control')[0];
    this.modalClose = this.element.getElementsByClassName('js-filter-nav__close-btn')[0];
    this.placeholder = this.element.getElementsByClassName('js-filter-nav__placeholder')[0];
    this.marker = this.element.getElementsByClassName('js-filter-nav__marker');
    this.layout = 'expanded';
    initFilterNav(this);
  };

  function initFilterNav(element) {
    checkLayout(element); // init layout
    if(element.layout == 'expanded') placeMarker(element);
    element.element.addEventListener('update-layout', function(event){ // on resize - modify layout
      checkLayout(element);
    });

    // update selected item
    element.wrapper.addEventListener('click', function(event){
      var newItem = event.target.closest('.js-filter-nav__btn');
      if(newItem) {
        updateCurrentItem(element, newItem);
        return;
      }
      // close modal list - mobile version only
      if(event.target.classList.contains('js-filter-nav__wrapper') || event.target.closest('.js-filter-nav__close-btn')) toggleModalList(element, false);
    });

    // open modal list - mobile version only
    element.control.addEventListener('click', function(event){
      toggleModalList(element, true);
    });
    
    // listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(element.control.getAttribute('aria-expanded') == 'true' && isVisible(element.control)) {
					toggleModalList(element, false);
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(element.control.getAttribute('aria-expanded') == 'true' && isVisible(element.control) && !document.activeElement.closest('.js-filter-nav__wrapper')) toggleModalList(element, false);
			}
		});
  };

  function updateCurrentItem(element, btn) {
    if(btn.getAttribute('aria-current') == 'true') {
      toggleModalList(element, false);
      return;
    }
    var activeBtn = element.wrapper.querySelector('[aria-current]');
    if(activeBtn) activeBtn.removeAttribute('aria-current');
    btn.setAttribute('aria-current', 'true');
    // update trigger label on selection (visible on mobile only)
    element.placeholder.textContent = btn.textContent;
    toggleModalList(element, false);
    if(element.layout == 'expanded') placeMarker(element);
  };

  function toggleModalList(element, bool) {
    element.control.setAttribute('aria-expanded', bool);
    element.wrapper.classList.toggle('filter-nav__wrapper--is-visible', bool);
    if(bool) {
      element.nav.querySelectorAll('[href], button:not([disabled])')[0].focus();
    } else if(isVisible(element.control)) {
      element.control.focus();
    }
  };

  function isVisible(element) {
		return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
	};

  function checkLayout(element) {
    if(element.layout == 'expanded' && switchToCollapsed(element)) { // check if there's enough space 
      element.layout = 'collapsed';
      element.element.classList.remove('filter-nav--expanded');
      element.element.classList.add('filter-nav--collapsed');
      element.modalClose.classList.remove('is-hidden');
      element.control.classList.remove('is-hidden');
    } else if(element.layout == 'collapsed' && switchToExpanded(element)) {
      element.layout = 'expanded';
      element.element.classList.add('filter-nav--expanded');
      element.element.classList.remove('filter-nav--collapsed');
      element.modalClose.classList.add('is-hidden');
      element.control.classList.add('is-hidden');
    }
    // place background element
    if(element.layout == 'expanded') placeMarker(element);
  };

  function switchToCollapsed(element) {
    return element.nav.scrollWidth > element.nav.offsetWidth;
  };

  function switchToExpanded(element) {
    element.element.style.visibility = 'hidden';
    element.element.classList.add('filter-nav--expanded');
    element.element.classList.remove('filter-nav--collapsed');
    var switchLayout = element.nav.scrollWidth <= element.nav.offsetWidth;
    element.element.classList.remove('filter-nav--expanded');
    element.element.classList.add('filter-nav--collapsed');
    element.element.style.visibility = 'visible';
    return switchLayout;
  };

  function placeMarker(element) {
    var activeElement = element.wrapper.querySelector('.js-filter-nav__btn[aria-current="true"]');
    if(element.marker.length == 0 || !activeElement ) return;
    element.marker[0].style.width = activeElement.offsetWidth+'px';
    element.marker[0].style.transform = 'translateX('+(activeElement.getBoundingClientRect().left - element.list.getBoundingClientRect().left)+'px)';
  };

  var filterNav = document.getElementsByClassName('js-filter-nav');
  if(filterNav.length > 0) {
    var filterNavArray = [];
    for(var i = 0; i < filterNav.length; i++) {
      filterNavArray.push(new FilterNav(filterNav[i]));
    }

    var resizingId = false,
      customEvent = new CustomEvent('update-layout');

    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 100);
    });

    // wait for font to be loaded
    if(document.fonts) {
      document.fonts.onloadingdone = function (fontFaceSetEvent) {
        doneResizing();
      };
    }

    function doneResizing() {
      for( var i = 0; i < filterNavArray.length; i++) {
        (function(i){filterNavArray[i].element.dispatchEvent(customEvent)})(i);
      };
    };
  }
}());
// File#: _1_filter
// Usage: codyhouse.co/license
(function() {
  var Filter = function(opts) {
    this.options = extendProps(Filter.defaults , opts); // used to store custom filter/sort functions
    this.element = this.options.element;
    this.elementId = this.element.getAttribute('id');
    this.items = this.element.querySelectorAll('.js-filter__item');
    this.controllers = document.querySelectorAll('[aria-controls="'+this.elementId+'"]'); // controllers wrappers
    this.fallbackMessage = document.querySelector('[data-fallback-gallery-id="'+this.elementId+'"]');
    this.filterString = []; // combination of different filter values
    this.sortingString = '';  // sort value - will include order and type of argument (e.g., number or string)
    // store info about sorted/filtered items
    this.filterList = []; // list of boolean for each this.item -> true if still visible , otherwise false
    this.sortingList = []; // list of new ordered this.item -> each element is [item, originalIndex]
    
    // store grid info for animation
    this.itemsGrid = []; // grid coordinates
    this.itemsInitPosition = []; // used to store coordinates of this.items before animation
    this.itemsIterPosition = []; // used to store coordinates of this.items before animation - intermediate state
    this.itemsFinalPosition = []; // used to store coordinates of this.items after filtering
    
    // animation off
    this.animateOff = this.element.getAttribute('data-filter-animation') == 'off';
    // used to update this.itemsGrid on resize
    this.resizingId = false;
    // default acceleration style - improve animation
    this.accelerateStyle = 'will-change: transform, opacity; transform: translateZ(0); backface-visibility: hidden;';

    // handle multiple changes
    this.animating = false;
    this.reanimate = false;

    initFilter(this);
  };

  function initFilter(filter) {
    resetFilterSortArray(filter, true, true); // init array filter.filterList/filter.sortingList
    createGridInfo(filter); // store grid coordinates in filter.itemsGrid
    initItemsOrder(filter); // add data-orders so that we can reset the sorting

    // events handling - filter update
    for(var i = 0; i < filter.controllers.length; i++) {
      filter.filterString[i] = ''; // reset filtering

      // get proper filter/sorting string based on selected controllers
      (function(i){
        filter.controllers[i].addEventListener('change', function(event) {  
          if(event.target.tagName.toLowerCase() == 'select') { // select elements
            (!event.target.getAttribute('data-filter'))
              ? setSortingString(filter, event.target.value, event.target.options[event.target.selectedIndex])
              : setFilterString(filter, i, 'select');
          } else if(event.target.tagName.toLowerCase() == 'input' && (event.target.getAttribute('type') == 'radio' || event.target.getAttribute('type') == 'checkbox') ) { // input (radio/checkboxed) elements
            (!event.target.getAttribute('data-filter'))
              ? setSortingString(filter, event.target.getAttribute('data-sort'), event.target)
              : setFilterString(filter, i, 'input');
          } else {
            // generic inout element
            (!filter.controllers[i].getAttribute('data-filter'))
              ? setSortingString(filter, filter.controllers[i].getAttribute('data-sort'), filter.controllers[i])
              : setFilterString(filter, i, 'custom');
          }

          updateFilterArray(filter);
        });

        filter.controllers[i].addEventListener('click', function(event) { // retunr if target is select/input elements
          var filterEl = event.target.closest('[data-filter]');
          var sortEl = event.target.closest('[data-sort]');
          if(!filterEl && !sortEl) return;
          if(filterEl && ( filterEl.tagName.toLowerCase() == 'input' || filterEl.tagName.toLowerCase() == 'select')) return;
          if(sortEl && (sortEl.tagName.toLowerCase() == 'input' || sortEl.tagName.toLowerCase() == 'select')) return;
          if(sortEl && sortEl.classList.contains('js-filter__custom-control')) return;
          if(filterEl && filterEl.classList.contains('js-filter__custom-control')) return;
          // this will be executed only for a list of buttons -> no inputs
          event.preventDefault();
          resetControllersList(filter, i, filterEl, sortEl);
          sortEl 
            ? setSortingString(filter, sortEl.getAttribute('data-sort'), sortEl)
            : setFilterString(filter, i, 'button');
          updateFilterArray(filter);
        });

        // target search inputs -> update them on 'input'
        filter.controllers[i].addEventListener('input', function(event) {
          if(event.target.tagName.toLowerCase() == 'input' && (event.target.getAttribute('type') == 'search' || event.target.getAttribute('type') == 'text') ) {
            setFilterString(filter, i, 'custom');
            updateFilterArray(filter);
          }
        });
      })(i);
    }

    // handle resize - update grid coordinates in filter.itemsGrid
    window.addEventListener('resize', function() {
      clearTimeout(filter.resizingId);
      filter.resizingId = setTimeout(function(){createGridInfo(filter)}, 300);
    });

    // check if there are filters/sorting values already set
    checkInitialFiltering(filter);

    // reset filtering results if filter selection was changed by an external control (e.g., form reset) 
    filter.element.addEventListener('update-filter-results', function(event){
      // reset filters first
      for(var i = 0; i < filter.controllers.length; i++) filter.filterString[i] = '';
      filter.sortingString = '';
      checkInitialFiltering(filter);
    });
  };

  function checkInitialFiltering(filter) {
    for(var i = 0; i < filter.controllers.length; i++) { // check if there's a selected option
      // buttons list
      var selectedButton = filter.controllers[i].getElementsByClassName('js-filter-selected');
      if(selectedButton.length > 0) {
        var sort = selectedButton[0].getAttribute('data-sort');
        sort
          ? setSortingString(filter, selectedButton[0].getAttribute('data-sort'), selectedButton[0])
          : setFilterString(filter, i, 'button');
        continue;
      }

      // input list
      var selectedInput = filter.controllers[i].querySelectorAll('input:checked');
      if(selectedInput.length > 0) {
        var sort = selectedInput[0].getAttribute('data-sort');
        sort
          ? setSortingString(filter, sort, selectedInput[0])
          : setFilterString(filter, i, 'input');
        continue;
      }
      // select item
      if(filter.controllers[i].tagName.toLowerCase() == 'select') {
        var sort = filter.controllers[i].getAttribute('data-sort');
        sort
          ? setSortingString(filter, filter.controllers[i].value, filter.controllers[i].options[filter.controllers[i].selectedIndex])
          : setFilterString(filter, i, 'select');
         continue;
      }
      // check if there's a generic custom input
      var radioInput = filter.controllers[i].querySelector('input[type="radio"]'),
        checkboxInput = filter.controllers[i].querySelector('input[type="checkbox"]');
      if(!radioInput && !checkboxInput) {
        var sort = filter.controllers[i].getAttribute('data-sort');
        var filterString = filter.controllers[i].getAttribute('data-filter');
        if(sort) setSortingString(filter, sort, filter.controllers[i]);
        else if(filterString) setFilterString(filter, i, 'custom');
      }
    }

    updateFilterArray(filter);
  };

  function setSortingString(filter, value, item) { 
    // get sorting string value-> sortName:order:type
    var order = item.getAttribute('data-sort-order') ? 'desc' : 'asc';
    var type = item.getAttribute('data-sort-number') ? 'number' : 'string';
    filter.sortingString = value+':'+order+':'+type;
  };

  function setFilterString(filter, index, type) { 
    // get filtering array -> [filter1:filter2, filter3, filter4:filter5]
    if(type == 'input') {
      var checkedInputs = filter.controllers[index].querySelectorAll('input:checked');
      filter.filterString[index] = '';
      for(var i = 0; i < checkedInputs.length; i++) {
        filter.filterString[index] = filter.filterString[index] + checkedInputs[i].getAttribute('data-filter') + ':';
      }
    } else if(type == 'select') {
      if(filter.controllers[index].multiple) { // select with multiple options
        filter.filterString[index] = getMultipleSelectValues(filter.controllers[index]);
      } else { // select with single option
        filter.filterString[index] = filter.controllers[index].value;
      }
    } else if(type == 'button') {
      var selectedButtons = filter.controllers[index].querySelectorAll('.js-filter-selected');
      filter.filterString[index] = '';
      for(var i = 0; i < selectedButtons.length; i++) {
        filter.filterString[index] = filter.filterString[index] + selectedButtons[i].getAttribute('data-filter') + ':';
      }
    } else if(type == 'custom') {
      filter.filterString[index] = filter.controllers[index].getAttribute('data-filter');
    }
  };

  function resetControllersList(filter, index, target1, target2) {
    // for a <button>s list -> toggle js-filter-selected + custom classes
    var multi = filter.controllers[index].getAttribute('data-filter-checkbox'),
      customClass = filter.controllers[index].getAttribute('data-selected-class');
    
    customClass = (customClass) ? 'js-filter-selected '+ customClass : 'js-filter-selected';
    if(multi == 'true') { // multiple options can be on
      (target1) 
        ? toggleClass(target1, customClass, !target1.classList.contains('js-filter-selected'))
        : toggleClass(target2, customClass, !target2.classList.contains('js-filter-selected'));
    } else { // only one element at the time
      // remove the class from all siblings
      var selectedOption = filter.controllers[index].querySelector('.js-filter-selected');
      if(selectedOption) removeClass(selectedOption, customClass);
      (target1) 
        ? addClass(target1, customClass)
        : addClass(target2, customClass);
    }
  };

  function updateFilterArray(filter) { // sort/filter strings have been updated -> so you can update the gallery
    if(filter.animating) {
      filter.reanimate = true;
      return;
    }
    filter.animating = true;
    filter.reanimate = false;
    createGridInfo(filter); // get new grid coordinates
    sortingGallery(filter); // update sorting list 
    filteringGallery(filter); // update filter list
    resetFallbackMessage(filter, true); // toggle fallback message
    if(reducedMotion || filter.animateOff) {
      resetItems(filter);
    } else {
      updateItemsAttributes(filter);
    }
  };

  function sortingGallery(filter) {
    // use sorting string to reorder gallery
    var sortOptions = filter.sortingString.split(':');
    if(sortOptions[0] == '' || sortOptions[0] == '*') {
      // no sorting needed
      restoreSortOrder(filter);
    } else { // need to sort
      if(filter.options[sortOptions[0]]) { // custom sort function -> user takes care of it
        filter.sortingList = filter.options[sortOptions[0]](filter.sortingList);
      } else {
        filter.sortingList.sort(function(left, right) {
          var leftVal = left[0].getAttribute('data-sort-'+sortOptions[0]),
          rightVal = right[0].getAttribute('data-sort-'+sortOptions[0]);
          if(sortOptions[2] == 'number') {
            leftVal = parseFloat(leftVal);
            rightVal = parseFloat(rightVal);
          }
          if(sortOptions[1] == 'desc') return leftVal <= rightVal ? 1 : -1;
          else return leftVal >= rightVal ? 1 : -1;
        });
      }
    }
  };

  function filteringGallery(filter) {
    // use filtering string to reorder gallery
    resetFilterSortArray(filter, true, false);
    // we can have multiple filters
    for(var i = 0; i < filter.filterString.length; i++) {
      //check if multiple filters inside the same controller
      if(filter.filterString[i] != '' && filter.filterString[i] != '*' && filter.filterString[i] != ' ') {
        singleFilterGallery(filter, filter.filterString[i].split(':'));
      }
    }
  };

  function singleFilterGallery(filter, subfilter) {
    if(!subfilter || subfilter == '' || subfilter == '*') return;
    // check if we have custom options
    var customFilterArray = [];
    for(var j = 0; j < subfilter.length; j++) {
      if(filter.options[subfilter[j]]) { // custom function
        customFilterArray[subfilter[j]] = filter.options[subfilter[j]](filter.items);
      }
    }

    for(var i = 0; i < filter.items.length; i++) {
      var filterValues = filter.items[i].getAttribute('data-filter').split(' ');
      var present = false;
      for(var j = 0; j < subfilter.length; j++) {
        if(filter.options[subfilter[j]] && customFilterArray[subfilter[j]][i]) { // custom function
          present = true;
          break;
        } else if(subfilter[j] == '*' || filterValues.indexOf(subfilter[j]) > -1) {
          present = true;
          break;
        }
      }
      filter.filterList[i] = !present ? false : filter.filterList[i];
    }
  };

  function updateItemsAttributes(filter) { // set items before triggering the update animation
    // get offset of all elements before animation
    storeOffset(filter, filter.itemsInitPosition);
    // set height of container
    filter.element.setAttribute('style', 'height: '+parseFloat(filter.element.offsetHeight)+'px; width: '+parseFloat(filter.element.offsetWidth)+'px;');

    for(var i = 0; i < filter.items.length; i++) { // remove is-hidden class from items now visible and scale to zero
      if( filter.items[i].classList.contains('is-hidden') && filter.filterList[i]) {
        filter.items[i].setAttribute('data-scale', 'on');
        filter.items[i].setAttribute('style', filter.accelerateStyle+'transform: scale(0.5); opacity: 0;')
        removeClass(filter.items[i], 'is-hidden');
      }
    }
    // get new elements offset
    storeOffset(filter, filter.itemsIterPosition);
    // translate items so that they are in the right initial position
    for(var i = 0; i < filter.items.length; i++) {
      if( filter.items[i].getAttribute('data-scale') != 'on') {
        filter.items[i].setAttribute('style', filter.accelerateStyle+'transform: translateX('+parseInt(filter.itemsInitPosition[i][0] - filter.itemsIterPosition[i][0])+'px) translateY('+parseInt(filter.itemsInitPosition[i][1] - filter.itemsIterPosition[i][1])+'px);');
      }
    }

    animateItems(filter)
  };

  function animateItems(filter) {
    var transitionValue = 'transform '+filter.options.duration+'ms cubic-bezier(0.455, 0.03, 0.515, 0.955), opacity '+filter.options.duration+'ms';

    // get new index of items in the list
    var j = 0;
    for(var i = 0; i < filter.sortingList.length; i++) {
      var item = filter.items[filter.sortingList[i][1]];
      if(item.classList.contains('is-hidden') || !filter.filterList[filter.sortingList[i][1]]) {
        // item is hidden or was previously hidden -> final position equal to first one
        filter.itemsFinalPosition[filter.sortingList[i][1]] = filter.itemsIterPosition[filter.sortingList[i][1]];
        if(item.getAttribute('data-scale') == 'on') j = j + 1; 
      } else {
        filter.itemsFinalPosition[filter.sortingList[i][1]] = [filter.itemsGrid[j][0], filter.itemsGrid[j][1]]; // left/top
        j = j + 1; 
      }
    } 

    setTimeout(function(){
      for(var i = 0; i < filter.items.length; i++) {
        if(filter.filterList[i] && filter.items[i].getAttribute('data-scale') == 'on') { // scale up item
          filter.items[i].setAttribute('style', filter.accelerateStyle+'transition: '+transitionValue+'; transform: translateX('+parseInt(filter.itemsFinalPosition[i][0] - filter.itemsIterPosition[i][0])+'px) translateY('+parseInt(filter.itemsFinalPosition[i][1] - filter.itemsIterPosition[i][1])+'px) scale(1); opacity: 1;');
        } else if(filter.filterList[i]) { // translate item
          filter.items[i].setAttribute('style', filter.accelerateStyle+'transition: '+transitionValue+'; transform: translateX('+parseInt(filter.itemsFinalPosition[i][0] - filter.itemsIterPosition[i][0])+'px) translateY('+parseInt(filter.itemsFinalPosition[i][1] - filter.itemsIterPosition[i][1])+'px);');
        } else { // scale down item
          filter.items[i].setAttribute('style', filter.accelerateStyle+'transition: '+transitionValue+'; transform: scale(0.5); opacity: 0;');
        }
      };
    }, 50);  
    
    // wait for the end of transition of visible elements
    setTimeout(function(){
      resetItems(filter);
    }, (filter.options.duration + 100));
  };

  function resetItems(filter) {
    // animation was off or animation is over -> reset attributes
    for(var i = 0; i < filter.items.length; i++) {
      filter.items[i].removeAttribute('style');
      toggleClass(filter.items[i], 'is-hidden', !filter.filterList[i]);
      filter.items[i].removeAttribute('data-scale');
    }
    
    for(var i = 0; i < filter.items.length; i++) {// reorder
      filter.element.appendChild(filter.items[filter.sortingList[i][1]]);
    }

    filter.items = [];
    filter.items = filter.element.querySelectorAll('.js-filter__item');
    resetFilterSortArray(filter, false, true);
    filter.element.removeAttribute('style');
    filter.animating = false;
    if(filter.reanimate) {
      updateFilterArray(filter);
    }

    resetFallbackMessage(filter, false); // toggle fallback message

    // emit custom event - end of filtering
    filter.element.dispatchEvent(new CustomEvent('filter-selection-updated'));
  };

  function resetFilterSortArray(filter, filtering, sorting) {
    for(var i = 0; i < filter.items.length; i++) {
      if(filtering) filter.filterList[i] = true;
      if(sorting) filter.sortingList[i] = [filter.items[i], i];
    }
  };

  function createGridInfo(filter) {
    var containerWidth = parseFloat(window.getComputedStyle(filter.element).getPropertyValue('width')),
      itemStyle, itemWidth, itemHeight, marginX, marginY, colNumber;

    // get offset first visible element
    for(var i = 0; i < filter.items.length; i++) {
      if( !filter.items[i].classList.contains('is-hidden') ) {
        itemStyle = window.getComputedStyle(filter.items[i]),
        itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
        itemHeight = parseFloat(itemStyle.getPropertyValue('height')),
        marginX = parseFloat(itemStyle.getPropertyValue('margin-left')) + parseFloat(itemStyle.getPropertyValue('margin-right')),
        marginY = parseFloat(itemStyle.getPropertyValue('margin-bottom')) + parseFloat(itemStyle.getPropertyValue('margin-top'));
        if(marginX == 0 && marginY == 0) {
          // grid is set using the gap property and not margins
          var margins = resetMarginValues(filter);
          marginX = margins[0];
          marginY = margins[1];
        }
        var colNumber = parseInt((containerWidth + marginX)/(itemWidth+marginX));
        filter.itemsGrid[0] = [filter.items[i].offsetLeft, filter.items[i].offsetTop]; // left, top
        break;
      }
    }

    for(var i = 1; i < filter.items.length; i++) {
      var x = i < colNumber ? i : i % colNumber,
        y = i < colNumber ? 0 : Math.floor(i/colNumber);
      filter.itemsGrid[i] = [filter.itemsGrid[0][0] + x*(itemWidth+marginX), filter.itemsGrid[0][1] + y*(itemHeight+marginY)];
    }
  };

  function storeOffset(filter, array) {
    for(var i = 0; i < filter.items.length; i++) {
      array[i] = [filter.items[i].offsetLeft, filter.items[i].offsetTop];
    }
  };

  function initItemsOrder(filter) {
    for(var i = 0; i < filter.items.length; i++) {
      filter.items[i].setAttribute('data-init-sort-order', i);
    }
  };

  function restoreSortOrder(filter) {
    for(var i = 0; i < filter.items.length; i++) {
      filter.sortingList[parseInt(filter.items[i].getAttribute('data-init-sort-order'))] = [filter.items[i], i];
    }
  };

  function resetFallbackMessage(filter, bool) {
    if(!filter.fallbackMessage) return;
    var show = true;
    for(var i = 0; i < filter.filterList.length; i++) {
      if(filter.filterList[i]) {
        show = false;
        break;
      }
    };
    if(bool) { // reset visibility before animation is triggered
      if(!show) addClass(filter.fallbackMessage, 'is-hidden');
      return;
    }
    toggleClass(filter.fallbackMessage, 'is-hidden', !show);
  };

  function getMultipleSelectValues(multipleSelect) {
    // get selected options of a <select multiple> element
    var options = multipleSelect.options,
      value = '';
    for(var i = 0; i < options.length; i++) {
      if(options[i].selected) {
        if(value != '') value = value + ':';
        value = value + options[i].value;
      }
    }
    return value;
  };

  function resetMarginValues(filter) {
    var gapX = getComputedStyle(filter.element).getPropertyValue('--gap-x'),
      gapY = getComputedStyle(filter.element).getPropertyValue('--gap-y'),
      gap = getComputedStyle(filter.element).getPropertyValue('--gap'),
      gridGap = [0, 0];

    // if the gap property is used to create the grid (not margin left/right) -> get gap values rather than margins
    // check if the --gap/--gap-x/--gap-y
    var newDiv = document.createElement('div'),
      cssText = 'position: absolute; opacity: 0; width: 0px; height: 0px';
    if(gapX && gapY) {
      cssText = 'position: absolute; opacity: 0; width: '+gapX+'; height: '+gapY;
    } else if(gap) {
      cssText = 'position: absolute; opacity: 0; width: '+gap+'; height: '+gap;
    } else if(gapX) {
      cssText = 'position: absolute; opacity: 0; width: '+gapX+'; height: 0px';
    } else if(gapY) {
      cssText = 'position: absolute; opacity: 0; width: 0px; height: '+gapY;
    } else { // --gap/--gap-x/--gap-y properties are not defined -> get grid gap property values
      gapX = getGridGap(filter, 'columns', filter.element.offsetWidth);
      gapY = getGridGap(filter, 'rows', filter.element.offsetHeight);
      if(isNaN(gapY)) gapY = gapX;
      cssText = 'position: absolute; opacity: 0; width: '+gapX+'; height: '+gapY;
    }
    newDiv.style.cssText = cssText;
    filter.element.appendChild(newDiv);
    var boundingRect = newDiv.getBoundingClientRect();
    gridGap = [boundingRect.width, boundingRect.height];
    filter.element.removeChild(newDiv);
    return gridGap;
  };

  function getGridGap(filter, direction, containerSize) {
    var computedStyle = getComputedStyle(filter.element),
      template = computedStyle.getPropertyValue('grid-template-'+direction);
    
    var arrayEl = template.split(' '),
      gap = (containerSize - parseFloat(arrayEl[0])*arrayEl.length)/(arrayEl.length - 1);
    return gap+'px';
  };

  function toggleClass(el, className, bool) {
    if(bool) addClass(el, className);
    else removeClass(el, className);
  };

  function addClass(el, className) {
    var classList = className.split(' ');
    el.classList.add(classList[0]);
    if (classList.length > 1) addClass(el, classList.slice(1).join(' '));
  };

  function removeClass(el, className) {
    var classList = className.split(' ');
    el.classList.remove(classList[0]);
    if (classList.length > 1) removeClass(el, classList.slice(1).join(' '));
  };

  var extendProps = function () {
    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;
    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
    }
    // Merge the object into the extended object
    var merge = function (obj) {
      for ( var prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = extend( true, extended[prop], obj[prop] );
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };
    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
      var obj = arguments[i];
      merge(obj);
    }
    return extended;
  };

  Filter.defaults = {
    element : false,
    duration: 400
  };

  window.Filter = Filter;

  // init Filter object
  var filterGallery = document.getElementsByClassName('js-filter'),
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if( filterGallery.length > 0 ) {
    for( var i = 0; i < filterGallery.length; i++) {
      var duration = filterGallery[i].getAttribute('data-filter-duration');
      if(!duration) duration = Filter.defaults.duration;
      new Filter({element: filterGallery[i], duration: duration});
    }
  }
}());
// File#: _1_main-header
// Usage: codyhouse.co/license
(function() {
	var mainHeader = document.getElementsByClassName('js-header');
	if( mainHeader.length > 0 ) {
		var trigger = mainHeader[0].getElementsByClassName('js-header__trigger')[0],
			nav = mainHeader[0].getElementsByClassName('js-header__nav')[0];

		// we'll use these to store the node that needs to receive focus when the mobile menu is closed 
		var focusMenu = false;

		//detect click on nav trigger
		trigger.addEventListener("click", function(event) {
			event.preventDefault();
			toggleNavigation(!nav.classList.contains('header__nav--is-visible'));
		});

		// listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger)) {
					focusMenu = trigger; // move focus to menu trigger when menu is close
					trigger.click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger) && !document.activeElement.closest('.js-header')) trigger.click();
			}
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 500);
		});

		function doneResizing() {
			if( !isVisible(trigger) && mainHeader[0].classList.contains('header--expanded')) toggleNavigation(false); 
		};
	}

	function isVisible(element) {
		return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
	};

	function toggleNavigation(bool) { // toggle navigation visibility on small device
		nav.classList.toggle('header__nav--is-visible', bool);
		mainHeader[0].classList.toggle('header--expanded', bool);
		trigger.setAttribute('aria-expanded', bool);
		if(bool) { //opening menu -> move focus to first element inside nav
			nav.querySelectorAll('[href], input:not([disabled]), button:not([disabled])')[0].focus();
		} else if(focusMenu) {
			focusMenu.focus();
			focusMenu = false;
		}
	};
}());
// File#: _1_menu
// Usage: codyhouse.co/license
(function() {
	var Menu = function(element) {
		this.element = element;
		this.elementId = this.element.getAttribute('id');
		this.menuItems = this.element.getElementsByClassName('js-menu__content');
		this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
		this.selectedTrigger = false;
		this.menuIsOpen = false;
		this.initMenu();
		this.initMenuEvents();
	};	

	Menu.prototype.initMenu = function() {
		// init aria-labels
		for(var i = 0; i < this.trigger.length; i++) {
			this.trigger[i].setAttribute('aria-expanded', 'false');
			this.trigger[i].setAttribute('aria-haspopup', 'true');
		}
		// init tabindex
		for(var i = 0; i < this.menuItems.length; i++) {
			this.menuItems[i].setAttribute('tabindex', '0');
		}
	};

	Menu.prototype.initMenuEvents = function() {
		var self = this;
		for(var i = 0; i < this.trigger.length; i++) {(function(i){
			self.trigger[i].addEventListener('click', function(event){
				event.preventDefault();
				// if the menu had been previously opened by another trigger element -> close it first and reopen in the right position
				if(self.element.classList.contains('menu--is-visible') && self.selectedTrigger !=  self.trigger[i]) {
					self.toggleMenu(false, false); // close menu
				}
				// toggle menu
				self.selectedTrigger = self.trigger[i];
				self.toggleMenu(!self.element.classList.contains('menu--is-visible'), true);
			});
		})(i);}
		
		// keyboard events
		this.element.addEventListener('keydown', function(event) {
			// use up/down arrow to navigate list of menu items
			if( !event.target.classList.contains('js-menu__content') ) return;
			if( (event.keyCode && event.keyCode == 40) || (event.key && event.key.toLowerCase() == 'arrowdown') ) {
				self.navigateItems(event, 'next');
			} else if( (event.keyCode && event.keyCode == 38) || (event.key && event.key.toLowerCase() == 'arrowup') ) {
				self.navigateItems(event, 'prev');
			}
		});
	};

	Menu.prototype.toggleMenu = function(bool, moveFocus) {
		var self = this;
		// toggle menu visibility
		this.element.classList.toggle('menu--is-visible', bool);
		this.menuIsOpen = bool;
		if(bool) {
			this.selectedTrigger.setAttribute('aria-expanded', 'true');
			moveFocusFn(this.menuItems[0]);
			this.element.addEventListener("transitionend", function(event) {moveFocusFn(self.menuItems[0]);}, {once: true});
			// position the menu element
			this.positionMenu();
			// add class to menu trigger
			this.selectedTrigger.classList.add('menu-control--active');
		} else if(this.selectedTrigger) {
			this.selectedTrigger.setAttribute('aria-expanded', 'false');
			if(moveFocus) moveFocusFn(this.selectedTrigger);
			// remove class from menu trigger
			this.selectedTrigger.classList.remove('menu-control--active');
			this.selectedTrigger = false;
		}
	};

	Menu.prototype.positionMenu = function(event, direction) {
		var selectedTriggerPosition = this.selectedTrigger.getBoundingClientRect(),
			menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
			// menuOnTop = window.innerHeight < selectedTriggerPosition.bottom + this.element.offsetHeight;
			
		var left = selectedTriggerPosition.left,
			right = (window.innerWidth - selectedTriggerPosition.right),
			isRight = (window.innerWidth < selectedTriggerPosition.left + this.element.offsetWidth);

		var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
			vertical = menuOnTop
				? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
				: 'top: '+selectedTriggerPosition.bottom+'px;';
		// check right position is correct -> otherwise set left to 0
		if( isRight && (right + this.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - this.element.offsetWidth)/2)+'px;';
		var maxHeight = menuOnTop ? selectedTriggerPosition.top - 20 : window.innerHeight - selectedTriggerPosition.bottom - 20;
		this.element.setAttribute('style', horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
	};

	Menu.prototype.navigateItems = function(event, direction) {
		event.preventDefault();
		var index = Array.prototype.indexOf.call(this.menuItems, event.target),
			nextIndex = direction == 'next' ? index + 1 : index - 1;
		if(nextIndex < 0) nextIndex = this.menuItems.length - 1;
		if(nextIndex > this.menuItems.length - 1) nextIndex = 0;
		moveFocusFn(this.menuItems[nextIndex]);
	};

	Menu.prototype.checkMenuFocus = function() {
		var menuParent = document.activeElement.closest('.js-menu');
		if (!menuParent || !this.element.contains(menuParent)) this.toggleMenu(false, false);
	};

	Menu.prototype.checkMenuClick = function(target) {
		if( !this.element.contains(target) && !target.closest('[aria-controls="'+this.elementId+'"]')) this.toggleMenu(false);
	};

	function moveFocusFn(element) {
    element.focus();
    if (document.activeElement !== element) {
      element.setAttribute('tabindex','-1');
      element.focus();
    }
  };

	window.Menu = Menu;

	//initialize the Menu objects
	var menus = document.getElementsByClassName('js-menu');
	if( menus.length > 0 ) {
		var menusArray = [];
		var scrollingContainers = [];
		for( var i = 0; i < menus.length; i++) {
			(function(i){
				menusArray.push(new Menu(menus[i]));
				var scrollableElement = menus[i].getAttribute('data-scrollable-element');
				if(scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
			})(i);
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 9 || event.key && event.key.toLowerCase() == 'tab' ) {
				//close menu if focus is outside menu element
				menusArray.forEach(function(element){
					element.checkMenuFocus();
				});
			} else if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
				// close menu on 'Esc'
				menusArray.forEach(function(element){
					element.toggleMenu(false, false);
				});
			} 
		});
		// close menu when clicking outside it
		window.addEventListener('click', function(event){
			menusArray.forEach(function(element){
				element.checkMenuClick(event.target);
			});
		});
		// on resize -> close all menu elements
		window.addEventListener('resize', function(event){
			menusArray.forEach(function(element){
				element.toggleMenu(false, false);
			});
		});
		// on scroll -> close all menu elements
		window.addEventListener('scroll', function(event){
			menusArray.forEach(function(element){
				if(element.menuIsOpen) element.toggleMenu(false, false);
			});
		});
		// take into account additinal scrollable containers
		for(var j = 0; j < scrollingContainers.length; j++) {
			var scrollingContainer = document.querySelector(scrollingContainers[j]);
			if(scrollingContainer) {
				scrollingContainer.addEventListener('scroll', function(event){
					menusArray.forEach(function(element){
						if(element.menuIsOpen) element.toggleMenu(false, false);
					});
				});
			}
		}
	}
}());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
	var Modal = function(element) {
		this.element = element;
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null; // focus will be moved to this element when modal is open
		this.modalFocus = this.element.getAttribute('data-modal-first-focus') ? this.element.querySelector(this.element.getAttribute('data-modal-first-focus')) : null;
		this.selectedTrigger = null;
		this.preventScrollEl = this.getPreventScrollEl();
		this.showClass = "modal--is-visible";
		this.initModal();
	};

	Modal.prototype.getPreventScrollEl = function() {
		var scrollEl = false;
		var querySelector = this.element.getAttribute('data-modal-prevent-scroll');
		if(querySelector) scrollEl = document.querySelector(querySelector);
		return scrollEl;
	};

	Modal.prototype.initModal = function() {
		var self = this;
		//open modal when clicking on trigger buttons
		if ( this.triggers ) {
			for(var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					if(self.element.classList.contains(self.showClass)) {
						self.closeModal();
						return;
					}
					self.selectedTrigger = event.currentTarget;
					self.showModal();
					self.initModalEvents();
				});
			}
		}

		// listen to the openModal event -> open modal without a trigger button
		this.element.addEventListener('openModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.showModal();
			self.initModalEvents();
		});

		// listen to the closeModal event -> close modal without a trigger button
		this.element.addEventListener('closeModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.closeModal();
		});

		// if modal is open by default -> initialise modal events
		if(this.element.classList.contains(this.showClass)) this.initModalEvents();
	};

	Modal.prototype.showModal = function() {
		var self = this;
		this.element.classList.add(this.showClass);
		this.getFocusableElements();
		if(this.moveFocusEl) {
			this.moveFocusEl.focus();
			// wait for the end of transitions before moving focus
			this.element.addEventListener("transitionend", function cb(event) {
				self.moveFocusEl.focus();
				self.element.removeEventListener("transitionend", cb);
			});
		}
		this.emitModalEvents('modalIsOpen');
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
	};

	Modal.prototype.closeModal = function() {
		if(!this.element.classList.contains(this.showClass)) return;
		this.element.classList.remove(this.showClass);
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null;
		if(this.selectedTrigger) this.selectedTrigger.focus();
		//remove listeners
		this.cancelModalEvents();
		this.emitModalEvents('modalIsClose');
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = '';
	};

	Modal.prototype.initModalEvents = function() {
		//add event listeners
		this.element.addEventListener('keydown', this);
		this.element.addEventListener('click', this);
	};

	Modal.prototype.cancelModalEvents = function() {
		//remove event listeners
		this.element.removeEventListener('keydown', this);
		this.element.removeEventListener('click', this);
	};

	Modal.prototype.handleEvent = function (event) {
		switch(event.type) {
			case 'click': {
				this.initClick(event);
			}
			case 'keydown': {
				this.initKeyDown(event);
			}
		}
	};

	Modal.prototype.initKeyDown = function(event) {
		if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
			//trap focus inside modal
			this.trapFocus(event);
		} else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
			event.preventDefault();
			this.closeModal(); // close modal when pressing Enter on close button
		}	
	};

	Modal.prototype.initClick = function(event) {
		//close modal when clicking on close button or modal bg layer 
		if( !event.target.closest('.js-modal__close') && !event.target.classList.contains('js-modal') ) return;
		event.preventDefault();
		this.closeModal();
	};

	Modal.prototype.trapFocus = function(event) {
		if( this.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of modal
			event.preventDefault();
			this.lastFocusable.focus();
		}
		if( this.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of modal
			event.preventDefault();
			this.firstFocusable.focus();
		}
	}

	Modal.prototype.getFocusableElements = function() {
		//get all focusable elements inside the modal
		var allFocusable = this.element.querySelectorAll(focusableElString);
		this.getFirstVisible(allFocusable);
		this.getLastVisible(allFocusable);
		this.getFirstFocusable();
	};

	Modal.prototype.getFirstVisible = function(elements) {
		//get first visible focusable element inside the modal
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				this.firstFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getLastVisible = function(elements) {
		//get last visible focusable element inside the modal
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				this.lastFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getFirstFocusable = function() {
		if(!this.modalFocus || !Element.prototype.matches) {
			this.moveFocusEl = this.firstFocusable;
			return;
		}
		var containerIsFocusable = this.modalFocus.matches(focusableElString);
		if(containerIsFocusable) {
			this.moveFocusEl = this.modalFocus;
		} else {
			this.moveFocusEl = false;
			var elements = this.modalFocus.querySelectorAll(focusableElString);
			for(var i = 0; i < elements.length; i++) {
				if( isVisible(elements[i]) ) {
					this.moveFocusEl = elements[i];
					break;
				}
			}
			if(!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
		}
	};

	Modal.prototype.emitModalEvents = function(eventName) {
		var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
		this.element.dispatchEvent(event);
	};

	function isVisible(element) {
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

	window.Modal = Modal;

	//initialize the Modal objects
	var modals = document.getElementsByClassName('js-modal');
	// generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	if( modals.length > 0 ) {
		var modalArrays = [];
		for( var i = 0; i < modals.length; i++) {
			(function(i){modalArrays.push(new Modal(modals[i]));})(i);
		}

		window.addEventListener('keydown', function(event){ //close modal window on esc
			if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
				for( var i = 0; i < modalArrays.length; i++) {
					(function(i){modalArrays[i].closeModal();})(i);
				};
			}
		});
	}
}());
// File#: _1_number-input
// Usage: codyhouse.co/license
(function() {
	var InputNumber = function(element) {
		this.element = element;
		this.input = this.element.getElementsByClassName('js-number-input__value')[0];
		this.min = parseFloat(this.input.getAttribute('min'));
		this.max = parseFloat(this.input.getAttribute('max'));
		this.step = parseFloat(this.input.getAttribute('step'));
		if(isNaN(this.step)) this.step = 1;
		this.precision = getStepPrecision(this.step);
		initInputNumberEvents(this);
	};

	function initInputNumberEvents(input) {
		// listen to the click event on the custom increment buttons
		input.element.addEventListener('click', function(event){ 
			var increment = event.target.closest('.js-number-input__btn');
			if(increment) {
				event.preventDefault();
				updateInputNumber(input, increment);
			}
		});

		// when input changes, make sure the new value is acceptable
		input.input.addEventListener('focusout', function(event){
			var value = parseFloat(input.input.value);
			if( value < input.min ) value = input.min;
			if( value > input.max ) value = input.max;
			// check value is multiple of step
			value = checkIsMultipleStep(input, value);
			if( value != parseFloat(input.input.value)) input.input.value = value;

		});
	};

	function getStepPrecision(step) {
		// if step is a floating number, return its precision
		return (step.toString().length - Math.floor(step).toString().length - 1);
	};

	function updateInputNumber(input, btn) {
		var value = ( btn.classList.contains('number-input__btn--plus') ) ? parseFloat(input.input.value) + input.step : parseFloat(input.input.value) - input.step;
		if( input.precision > 0 ) value = value.toFixed(input.precision);
		if( value < input.min ) value = input.min;
		if( value > input.max ) value = input.max;
		input.input.value = value;
		input.input.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
	};

	function checkIsMultipleStep(input, value) {
		// check if the number inserted is a multiple of the step value
		var remain = (value*10*input.precision)%(input.step*10*input.precision);
		if( remain != 0) value = value - remain;
		if( input.precision > 0 ) value = value.toFixed(input.precision);
		return value;
	};

	window.InputNumber = InputNumber;

	//initialize the InputNumber objects
	var inputNumbers = document.getElementsByClassName('js-number-input');
	if( inputNumbers.length > 0 ) {
		for( var i = 0; i < inputNumbers.length; i++) {
			(function(i){new InputNumber(inputNumbers[i]);})(i);
		}
	}
}());
// File#: _1_password
// Usage: codyhouse.co/license
(function() {
  var Password = function(element) {
    this.element = element;
    this.password = this.element.getElementsByClassName('js-password__input')[0];
    this.visibilityBtn = this.element.getElementsByClassName('js-password__btn')[0];
    this.visibilityClass = 'password--text-is-visible';
    this.initPassword();
  };

  Password.prototype.initPassword = function() {
    var self = this;
    //listen to the click on the password btn
    this.visibilityBtn.addEventListener('click', function(event) {
      //if password is in focus -> do nothing if user presses Enter
      if(document.activeElement === self.password) return;
      event.preventDefault();
      self.togglePasswordVisibility();
    });
  };

  Password.prototype.togglePasswordVisibility = function() {
    var makeVisible = !Util.hasClass(this.element, this.visibilityClass);
    //change element class
    Util.toggleClass(this.element, this.visibilityClass, makeVisible);
    //change input type
    (makeVisible) ? this.password.setAttribute('type', 'text') : this.password.setAttribute('type', 'password');
  };
  
  //initialize the Password objects
  var passwords = document.getElementsByClassName('js-password');
  if( passwords.length > 0 ) {
    for( var i = 0; i < passwords.length; i++) {
      (function(i){new Password(passwords[i]);})(i);
    }
  };
}());
// File#: _1_percentage-bar
// Usage: codyhouse.co/license
(function() {
  var PercentageBar = function(element) {
    this.element = element;
    this.bar = this.element.getElementsByClassName('js-pct-bar__bg');
    this.percentages = this.element.getElementsByClassName('js-pct-bar__value');
    initPercentageBar(this);
  };

  function initPercentageBar(bar) {
    if(bar.bar.length < 1) return;
    var content = '';
    for(var i = 0; i < bar.percentages.length; i++) {
      var customClass = bar.percentages[i].getAttribute('data-pct-bar-bg'),
        customStyle = bar.percentages[i].getAttribute('data-pct-bar-style'),
        percentage = bar.percentages[i].textContent;
      
      if(!customStyle) customStyle = '';
      if(!customClass) customClass = '';
      content = content + '<div class="pct-bar__fill js-pct-bar__fill '+customClass+'" style="flex-basis: '+percentage+';'+customStyle+'"></div>';
    }
    bar.bar[0].innerHTML = content;
  }

  window.PercentageBar = PercentageBar;

  //initialize the PercentageBar objects
  var percentageBar = document.getElementsByClassName('js-pct-bar');
  if( percentageBar.length > 0 ) {
    for( var i = 0; i < percentageBar.length; i++) {
      (function(i){new PercentageBar(percentageBar[i]);})(i);
    }
  }
}());
// File#: _1_pie-chart
// Usage: codyhouse.co/license
(function() {
  var PieChart = function(opts) {
    this.options = Util.extend(PieChart.defaults , opts);
    this.element = this.options.element;
    this.chartArea = this.element.getElementsByClassName('js-pie-chart__area')[0];
    this.dataValues = this.element.getElementsByClassName('js-pie-chart__value');
    this.chartPaths;
    // used to convert data values to percentages
    this.percentageTot = 0; 
    this.percentageReset = getPercentageMultiplier(this);
    this.percentageStart = []; // store the start angle for each item in the chart
    this.percentageDelta = []; // store the end angle for each item in the chart
    // tooltip element
    this.tooltip = this.element.getElementsByClassName('js-pie-chart__tooltip');
    this.eventIds = [];
    this.hoverId = false;
    this.hovering = false;
    this.selectedIndex = false; // will be used for tooltip 
    this.chartLoaded = false; // used when chart is initially animated
    initPieChart(this);
    initTooltip(this);
  };

  function getPercentageMultiplier(chart) {
    var tot = 0;
    for(var i = 0; i < chart.dataValues.length; i++) {
      tot = tot + parseFloat(chart.dataValues[i].textContent);
    }
    return 100/tot;
  };

  function initPieChart(chart) {
    createChart(chart);
    animateChart(chart);
    // reset chart on resize (if required)
    resizeChart(chart);
  };

  function createChart(chart) {
    setChartSize(chart);
    // create svg element
    createChartSvg(chart);
    // visually hide svg element
    chart.chartArea.setAttribute('aria-hidden', true);
  };

  function setChartSize(chart) {
    chart.height = chart.chartArea.clientHeight;
    chart.width = chart.chartArea.clientWidth;
    // donut charts only
    if(chart.options.type == 'donut') {
      chart.donutSize = parseInt(getComputedStyle(chart.element).getPropertyValue('--pie-chart-donut-width'));
      if(chart.donutSize <= 0 || isNaN(chart.donutSize)) chart.donutSize = chart.width/4; 
    }
  };

  function createChartSvg(chart) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="'+chart.width+'" height="'+chart.height+'" class="pie-chart__svg js-pie-chart__svg"></svg>';
    chart.chartArea.innerHTML = chart.chartArea.innerHTML + svg;
    chart.svg = chart.chartArea.getElementsByClassName('js-pie-chart__svg')[0];
    // create chart content
    getPieSvgCode(chart);
  };

  function getPieSvgCode(chart) {
    var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gEl.setAttribute('class', 'pie-chart__dataset js-pie-chart__dataset');
    for(var i = 0; i < chart.dataValues.length; i++) {
      var pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      Util.setAttributes(pathEl, {d: getPiePath(chart, i), class: 'pie-chart__data-path pie-chart__data-path--'+(i+1)+' js-pie-chart__data-path js-pie-chart__data-path--'+(i+1), 'data-index': i, 'stroke-linejoin': 'round'});
      var customStyle = chart.dataValues[i].getAttribute('data-pie-chart-style');
      if(customStyle) pathEl.setAttribute('style', customStyle);
      gEl.appendChild(pathEl);
    }

    chart.svg.appendChild(gEl);
    chart.chartPaths = chart.svg.querySelectorAll('.js-pie-chart__data-path');
  };

  function getPiePath(chart, index) {
    var startAngle = chart.percentageTot*chart.percentageReset*3.6; //convert from percentage to angles
    var dataValue = parseFloat(chart.dataValues[index].textContent);
    // update percentage start
    chart.percentageStart.push(startAngle);
    chart.percentageDelta.push(dataValue*chart.percentageReset*3.6);
    chart.percentageTot = chart.percentageTot + dataValue;
    var endAngle = chart.percentageTot*chart.percentageReset*3.6;
    return getPathCode(chart, startAngle, endAngle);
  };

  function getPathCode(chart, startAngle, endAngle) {
    // if we still need to animate the chart -> reset endAngle
    if(!chart.chartLoaded && chart.options.animate && intersectionObserver && ! reducedMotion) {
      endAngle = startAngle;
    }
    if(chart.options.type == 'pie') {
      return getPieArc(chart.width/2, chart.width/2, chart.width/2, startAngle, endAngle);
    } else { //donut
      return getDonutArc(chart.width/2, chart.width/2, chart.width/2, chart.donutSize, startAngle, endAngle);
    }
  };

  function initTooltip(chart) {
    if(chart.tooltip.length < 1) return;
    // init mouse events
    chart.eventIds['hover'] = handleEvent.bind(chart);
    chart.chartArea.addEventListener('mouseenter', chart.eventIds['hover']);
    chart.chartArea.addEventListener('mousedown', chart.eventIds['hover']);
    chart.chartArea.addEventListener('mousemove', chart.eventIds['hover']);
    chart.chartArea.addEventListener('mouseleave', chart.eventIds['hover']);
  };

  function handleEvent(event) {
    switch(event.type) {
      case 'mouseenter':
      case 'mousedown':
        hoverChart(this, event);
        break;
      case 'mousemove': 
        var self = this;
        self.hoverId  = window.requestAnimationFrame 
          ? window.requestAnimationFrame(function(){hoverChart(self, event)})
          : setTimeout(function(){hoverChart(self, event);});
        break;
      case 'mouseleave':
        resetTooltip(this);
        break;
    }
  };

  function hoverChart(chart, event) {
    if(chart.hovering) return;
    chart.hovering = true;
    var selectedIndex = getSelectedIndex(event);
    if(selectedIndex !== false && selectedIndex !== chart.selectedIndex) {
      chart.selectedIndex = selectedIndex;
      setTooltipContent(chart);
      placeTooltip(chart);
      Util.removeClass(chart.tooltip[0], 'is-hidden');
    }
    chart.hovering = false;
  };

  function resetTooltip(chart) {
    if(chart.hoverId) {
      (window.requestAnimationFrame) ? window.cancelAnimationFrame(chart.hoverId) : clearTimeout(chart.hoverId);
      chart.hoverId = false;
    }
    Util.addClass(chart.tooltip[0], 'is-hidden');
    chart.hovering = false;
    chart.selectedIndex = false;
  };

  function placeTooltip(chart) {
    var tooltipRadialPosition = (chart.options.type == 'donut') ? (chart.width - chart.donutSize)/2 : chart.width/4;
    var pathCenter = polarToCartesian(chart.width/2, chart.width/2, tooltipRadialPosition, chart.percentageStart[chart.selectedIndex] + chart.percentageDelta[chart.selectedIndex]/2);

    chart.tooltip[0].setAttribute('style', 'left: '+pathCenter.x+'px; top: '+pathCenter.y+'px');
  };

  function setTooltipContent(chart) {
    chart.tooltip[0].textContent = chart.dataValues[chart.selectedIndex].textContent;
  };

  function getSelectedIndex(event) {
    if(event.target.tagName.toLowerCase() == 'path') {
      return parseInt(event.target.getAttribute('data-index'));
    }
    return false;
  };

  function resizeChart(chart) {
    window.addEventListener('resize', function() {
      clearTimeout(chart.eventIds['resize']);
      chart.eventIds['resize'] = setTimeout(doneResizing, 300);
    });

    function doneResizing() {
      resetChartResize(chart);
      removeChart(chart);
      createChart(chart);
      initTooltip(chart);
    };
  };

  function resetChartResize(chart) {
    chart.hovering = false;
    // reset event listeners
    if( chart.eventIds && chart.eventIds['hover']) {
      chart.chartArea.removeEventListener('mouseenter', chart.eventIds['hover']);
      chart.chartArea.removeEventListener('mousedown', chart.eventIds['hover']);
      chart.chartArea.removeEventListener('mousemove', chart.eventIds['hover']);
      chart.chartArea.removeEventListener('mouseleave', chart.eventIds['hover']);
    }
  };

  function removeChart(chart) {
    // on resize -> remove svg and create a new one
    chart.svg.remove();
  };

  function animateChart(chart) {
    if(!chart.options.animate || chart.chartLoaded || reducedMotion || !intersectionObserver) return;
    var observer = new IntersectionObserver(chartObserve.bind(chart), {rootMargin: "0px 0px -200px 0px"});
    observer.observe(chart.element);
  };

  function chartObserve(entries, observer) { // observe chart position -> start animation when inside viewport
    if(entries[0].isIntersecting) {
      this.chartLoaded = true;
      animatePath(this);
      observer.unobserve(this.element);
    }
  };

  function animatePath(chart, type) {
    var currentTime = null,
      duration = 400/chart.dataValues.length;
        
    var animateSinglePath = function(index, timestamp) {
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;

      var startAngle = chart.percentageStart[index];
      var endAngle =  startAngle + chart.percentageDelta[index]*(progress/duration);

      var path = chart.element.getElementsByClassName('js-pie-chart__data-path--'+(index+1))[0];
      var pathCode = getPathCode(chart, startAngle, endAngle);;
      path.setAttribute('d', pathCode);
      
      if(progress < duration) {
        window.requestAnimationFrame(function(timestamp) {animateSinglePath(index, timestamp);});
      } else if(index < chart.dataValues.length - 1) {
        currentTime = null;
        window.requestAnimationFrame(function(timestamp) {animateSinglePath(index + 1, timestamp);});
      }
    };

    window.requestAnimationFrame(function(timestamp) {animateSinglePath(0, timestamp);});
  };

  // util functions - get paths d values
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  function getPieArc(x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
        "L", x,y,
        "L", start.x, start.y
    ].join(" ");

    return d;       
  };

  function getDonutArc(x, y, radius, radiusDelta, startAngle, endAngle){
    var s1 = polarToCartesian(x, y, (radius - radiusDelta), endAngle),
      s2 = polarToCartesian(x, y, radius, endAngle),
      s3 = polarToCartesian(x, y, radius, startAngle),
      s4 = polarToCartesian(x, y, (radius - radiusDelta), startAngle);


    var arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

    var d = [
        "M", s1.x, s1.y,
        "L", s2.x, s2.y, 
        "A", radius, radius, 0, arcSweep, 0, s3.x, s3.y, 
        "L", s4.x, s4.y, 
        "A", (radius - radiusDelta), (radius - radiusDelta), 0, arcSweep, 1, s1.x, s1.y
    ].join(" ");

    return d;       
  };

  PieChart.defaults = {
    element : '',
    type: 'pie', // can be pie or donut
    animate: false
  };

  window.PieChart = PieChart;

  //initialize the PieChart objects
  var pieCharts = document.getElementsByClassName('js-pie-chart');
  var intersectionObserver = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
    reducedMotion = Util.osHasReducedMotion();
  
  if( pieCharts.length > 0 ) {
    for( var i = 0; i < pieCharts.length; i++) {
      (function(i){
        var chartType = pieCharts[i].getAttribute('data-pie-chart-type') ? pieCharts[i].getAttribute('data-pie-chart-type') : 'pie';
        var animate = pieCharts[i].getAttribute('data-pie-chart-animation') && pieCharts[i].getAttribute('data-pie-chart-animation') == 'on' ? true : false;
        new PieChart({
          element: pieCharts[i],
          type: chartType,
          animate: animate
        });
      })(i);
    }
  }
}());
// File#: _1_popover
// Usage: codyhouse.co/license
(function() {
  var Popover = function(element) {
    this.element = element;
		this.elementId = this.element.getAttribute('id');
		this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
		this.selectedTrigger = false;
    this.popoverVisibleClass = 'popover--is-visible';
    this.selectedTriggerClass = 'popover-control--active';
    this.popoverIsOpen = false;
    // focusable elements
    this.firstFocusable = false;
		this.lastFocusable = false;
		// position target - position tooltip relative to a specified element
		this.positionTarget = getPositionTarget(this);
		// gap between element and viewport - if there's max-height 
		this.viewportGap = parseInt(getComputedStyle(this.element).getPropertyValue('--popover-viewport-gap')) || 20;
		initPopover(this);
		initPopoverEvents(this);
  };

  // public methods
  Popover.prototype.togglePopover = function(bool, moveFocus) {
    togglePopover(this, bool, moveFocus);
  };

  Popover.prototype.checkPopoverClick = function(target) {
    checkPopoverClick(this, target);
  };

  Popover.prototype.checkPopoverFocus = function() {
    checkPopoverFocus(this);
  };

	// private methods
	function getPositionTarget(popover) {
		// position tooltip relative to a specified element - if provided
		var positionTargetSelector = popover.element.getAttribute('data-position-target');
		if(!positionTargetSelector) return false;
		var positionTarget = document.querySelector(positionTargetSelector);
		return positionTarget;
	};

  function initPopover(popover) {
		// init aria-labels
		for(var i = 0; i < popover.trigger.length; i++) {
			Util.setAttributes(popover.trigger[i], {'aria-expanded': 'false', 'aria-haspopup': 'true'});
		}
  };
  
  function initPopoverEvents(popover) {
		for(var i = 0; i < popover.trigger.length; i++) {(function(i){
			popover.trigger[i].addEventListener('click', function(event){
				event.preventDefault();
				// if the popover had been previously opened by another trigger element -> close it first and reopen in the right position
				if(Util.hasClass(popover.element, popover.popoverVisibleClass) && popover.selectedTrigger !=  popover.trigger[i]) {
					togglePopover(popover, false, false); // close menu
				}
				// toggle popover
				popover.selectedTrigger = popover.trigger[i];
				togglePopover(popover, !Util.hasClass(popover.element, popover.popoverVisibleClass), true);
			});
    })(i);}
    
    // trap focus
    popover.element.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside popover
        trapFocus(popover, event);
      }
    });
  };
  
  function togglePopover(popover, bool, moveFocus) {
		// toggle popover visibility
		Util.toggleClass(popover.element, popover.popoverVisibleClass, bool);
		popover.popoverIsOpen = bool;
		if(bool) {
      popover.selectedTrigger.setAttribute('aria-expanded', 'true');
      getFocusableElements(popover);
      // move focus
      focusPopover(popover);
			popover.element.addEventListener("transitionend", function(event) {focusPopover(popover);}, {once: true});
			// position the popover element
			positionPopover(popover);
			// add class to popover trigger
			Util.addClass(popover.selectedTrigger, popover.selectedTriggerClass);
		} else if(popover.selectedTrigger) {
			popover.selectedTrigger.setAttribute('aria-expanded', 'false');
			if(moveFocus) Util.moveFocus(popover.selectedTrigger);
			// remove class from menu trigger
			Util.removeClass(popover.selectedTrigger, popover.selectedTriggerClass);
			popover.selectedTrigger = false;
		}
	};
	
	function focusPopover(popover) {
		if(popover.firstFocusable) {
			popover.firstFocusable.focus();
		} else {
			Util.moveFocus(popover.element);
		}
	};

  function positionPopover(popover) {
		// reset popover position
		resetPopoverStyle(popover);
		var selectedTriggerPosition = (popover.positionTarget) ? popover.positionTarget.getBoundingClientRect() : popover.selectedTrigger.getBoundingClientRect();
		
		var menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
			
		var left = selectedTriggerPosition.left,
			right = (window.innerWidth - selectedTriggerPosition.right),
			isRight = (window.innerWidth < selectedTriggerPosition.left + popover.element.offsetWidth);

		var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
			vertical = menuOnTop
				? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
				: 'top: '+selectedTriggerPosition.bottom+'px;';
		// check right position is correct -> otherwise set left to 0
		if( isRight && (right + popover.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - popover.element.offsetWidth)/2)+'px;';
		// check if popover needs a max-height (user will scroll inside the popover)
		var maxHeight = menuOnTop ? selectedTriggerPosition.top - popover.viewportGap : window.innerHeight - selectedTriggerPosition.bottom - popover.viewportGap;

		var initialStyle = popover.element.getAttribute('style');
		if(!initialStyle) initialStyle = '';
		popover.element.setAttribute('style', initialStyle + horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
	};
	
	function resetPopoverStyle(popover) {
		// remove popover inline style before appling new style
		popover.element.style.maxHeight = '';
		popover.element.style.top = '';
		popover.element.style.bottom = '';
		popover.element.style.left = '';
		popover.element.style.right = '';
	};

  function checkPopoverClick(popover, target) {
    // close popover when clicking outside it
    if(!popover.popoverIsOpen) return;
    if(!popover.element.contains(target) && !target.closest('[aria-controls="'+popover.elementId+'"]')) togglePopover(popover, false);
  };

  function checkPopoverFocus(popover) {
    // on Esc key -> close popover if open and move focus (if focus was inside popover)
    if(!popover.popoverIsOpen) return;
    var popoverParent = document.activeElement.closest('.js-popover');
    togglePopover(popover, false, popoverParent);
  };
  
  function getFocusableElements(popover) {
    //get all focusable elements inside the popover
		var allFocusable = popover.element.querySelectorAll(focusableElString);
		getFirstVisible(popover, allFocusable);
		getLastVisible(popover, allFocusable);
  };

  function getFirstVisible(popover, elements) {
		//get first visible focusable element inside the popover
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				popover.firstFocusable = elements[i];
				break;
			}
		}
	};

  function getLastVisible(popover, elements) {
		//get last visible focusable element inside the popover
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				popover.lastFocusable = elements[i];
				break;
			}
		}
  };

  function trapFocus(popover, event) {
    if( popover.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of popover
			event.preventDefault();
			popover.lastFocusable.focus();
		}
		if( popover.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of popover
			event.preventDefault();
			popover.firstFocusable.focus();
		}
  };
  
  function isVisible(element) {
		// check if element is visible
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

  window.Popover = Popover;

  //initialize the Popover objects
  var popovers = document.getElementsByClassName('js-popover');
  // generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	
	if( popovers.length > 0 ) {
		var popoversArray = [];
		var scrollingContainers = [];
		for( var i = 0; i < popovers.length; i++) {
			(function(i){
				popoversArray.push(new Popover(popovers[i]));
				var scrollableElement = popovers[i].getAttribute('data-scrollable-element');
				if(scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
			})(i);
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        // close popover on 'Esc'
				popoversArray.forEach(function(element){
					element.checkPopoverFocus();
				});
			} 
		});
		// close popover when clicking outside it
		window.addEventListener('click', function(event){
			popoversArray.forEach(function(element){
				element.checkPopoverClick(event.target);
			});
		});
		// on resize -> close all popover elements
		window.addEventListener('resize', function(event){
			popoversArray.forEach(function(element){
				element.togglePopover(false, false);
			});
		});
		// on scroll -> close all popover elements
		window.addEventListener('scroll', function(event){
			popoversArray.forEach(function(element){
				if(element.popoverIsOpen) element.togglePopover(false, false);
			});
		});
		// take into account additinal scrollable containers
		for(var j = 0; j < scrollingContainers.length; j++) {
			var scrollingContainer = document.querySelector(scrollingContainers[j]);
			if(scrollingContainer) {
				scrollingContainer.addEventListener('scroll', function(event){
					popoversArray.forEach(function(element){
						if(element.popoverIsOpen) element.togglePopover(false, false);
					});
				});
			}
		}
	}
}());
// File#: _1_progress-bar
// Usage: codyhouse.co/license
(function() {	
  var ProgressBar = function(element) {
    this.element = element;
    this.fill = this.element.getElementsByClassName('progress-bar__fill')[0];
    this.label = this.element.getElementsByClassName('progress-bar__value');
    this.value = getProgressBarValue(this);
    // before checking if data-animation is set -> check for reduced motion
    updatedProgressBarForReducedMotion(this);
    this.animate = this.element.hasAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on';
    this.animationDuration = this.element.hasAttribute('data-duration') ? this.element.getAttribute('data-duration') : 1000;
    // animation will run only on browsers supporting IntersectionObserver
    this.canAnimate = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    // this element is used to announce the percentage value to SR
    this.ariaLabel = this.element.getElementsByClassName('js-progress-bar__aria-value');
    // check if we need to update the bar color
    this.changeColor =  Util.hasClass(this.element, 'progress-bar--color-update') && Util.cssSupports('color', 'var(--color-value)');
    if(this.changeColor) {
      this.colorThresholds = getProgressBarColorThresholds(this);
    }
    initProgressBar(this);
    // store id to reset animation
    this.animationId = false;
  }; 

  // public function
  ProgressBar.prototype.setProgressBarValue = function(value) {
    setProgressBarValue(this, value);
  };

  function getProgressBarValue(progressBar) { // get progress value
    // return (fill width/total width) * 100
    return parseFloat(progressBar.fill.offsetWidth*100/progressBar.element.getElementsByClassName('progress-bar__bg')[0].offsetWidth);
  };

  function getProgressBarColorThresholds(progressBar) {
    var thresholds = [];
    var i = 1;
    while (!isNaN(parseInt(getComputedStyle(progressBar.element).getPropertyValue('--progress-bar-color-'+i)))) {
      thresholds.push(parseInt(getComputedStyle(progressBar.element).getPropertyValue('--progress-bar-color-'+i)));
      i = i + 1;
    }
    return thresholds;
  };

  function updatedProgressBarForReducedMotion(progressBar) {
    // if reduced motion is supported and set to reduced -> remove animations
    if(osHasReducedMotion) progressBar.element.removeAttribute('data-animation');
  };

  function initProgressBar(progressBar) {
    // set initial bar color
    if(progressBar.changeColor) updateProgressBarColor(progressBar, progressBar.value);
    // if data-animation is on -> reset the progress bar and animate when entering the viewport
    if(progressBar.animate && progressBar.canAnimate) animateProgressBar(progressBar);
    // reveal fill and label -> --animate and --color-update variations only
    setTimeout(function(){Util.addClass(progressBar.element, 'progress-bar--init');}, 30);

    // dynamically update value of progress bar
    progressBar.element.addEventListener('updateProgress', function(event){
      // cancel request animation frame if it was animating
      if(progressBar.animationId) window.cancelAnimationFrame(progressBar.animationId);
      
      var final = event.detail.value,
        duration = (event.detail.duration) ? event.detail.duration : progressBar.animationDuration;
      var start = getProgressBarValue(progressBar);
      // trigger update animation
      updateProgressBar(progressBar, start, final, duration, function(){
        emitProgressBarEvents(progressBar, 'progressCompleted', progressBar.value+'%');
        // update value of label for SR
        if(progressBar.ariaLabel.length > 0) progressBar.ariaLabel[0].textContent = final+'%';
      });
    });
  };

  function animateProgressBar(progressBar) {
    // reset inital values
    setProgressBarValue(progressBar, 0);
    
    // listen for the element to enter the viewport -> start animation
    var observer = new IntersectionObserver(progressBarObserve.bind(progressBar), { threshold: [0, 0.1] });
    observer.observe(progressBar.element);
  };

  function progressBarObserve(entries, observer) { // observe progressBar position -> start animation when inside viewport
    var self = this;
    if(entries[0].intersectionRatio.toFixed(1) > 0 && !this.animationTriggered) {
      updateProgressBar(this, 0, this.value, this.animationDuration, function(){
        emitProgressBarEvents(self, 'progressCompleted', self.value+'%');
      });
    }
  };

  function updateProgressBar(progressBar, start, to, duration, cb) {
    var change = to - start,
      currentTime = null;

    var animateFill = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      var val = parseInt((progress/duration)*change + start);
      // make sure value is in correct range
      if(change > 0 && val > to) val = to;
      if(change < 0 && val < to) val = to;
      if(progress >= duration) val = to;

      setProgressBarValue(progressBar, val);
      if(progress < duration) {
        progressBar.animationId = window.requestAnimationFrame(animateFill);
      } else {
        progressBar.animationId = false;
        cb();
      }
    };
    if ( window.requestAnimationFrame && !osHasReducedMotion ) {
      progressBar.animationId = window.requestAnimationFrame(animateFill);
    } else {
      setProgressBarValue(progressBar, to);
      cb();
    }
  };

  function setProgressBarValue(progressBar, value) {
    progressBar.fill.style.width = value+'%';
    if(progressBar.label.length > 0 ) progressBar.label[0].textContent = value+'%';
    if(progressBar.changeColor) updateProgressBarColor(progressBar, value);
  };

  function updateProgressBarColor(progressBar, value) {
    var className = 'progress-bar--fill-color-'+ progressBar.colorThresholds.length;
    for(var i = progressBar.colorThresholds.length; i > 0; i--) {
      if( !isNaN(progressBar.colorThresholds[i - 1]) && value <= progressBar.colorThresholds[i - 1]) {
        className = 'progress-bar--fill-color-' + i;
      } 
    }
    
    removeProgressBarColorClasses(progressBar);
    Util.addClass(progressBar.element, className);
  };

  function removeProgressBarColorClasses(progressBar) {
    var classes = progressBar.element.className.split(" ").filter(function(c) {
      return c.lastIndexOf('progress-bar--fill-color-', 0) !== 0;
    });
    progressBar.element.className = classes.join(" ").trim();
  };

  function emitProgressBarEvents(progressBar, eventName, detail) {
    progressBar.element.dispatchEvent(new CustomEvent(eventName, {detail: detail}));
  };

  window.ProgressBar = ProgressBar;

  //initialize the ProgressBar objects
  var progressBars = document.getElementsByClassName('js-progress-bar');
  var osHasReducedMotion = Util.osHasReducedMotion();
  if( progressBars.length > 0 ) {
		for( var i = 0; i < progressBars.length; i++) {
			(function(i){new ProgressBar(progressBars[i]);})(i);
    }
	}
}());
// File#: _1_radial-bar-chart
// Usage: codyhouse.co/license
(function() {
  var RadialBar = function(opts) {
    this.options = Util.extend(RadialBar.defaults , opts);
    this.element = this.options.element;
    this.chartArea = this.element.getElementsByClassName('js-radial-bar__area')[0];
    this.percentages = this.element.getElementsByClassName('js-radial-bar__value');
    this.chartDashStroke = [];
    this.tooltip = this.chartArea.getElementsByClassName('js-radial-bar__tooltip');
    this.eventIds = [];
    this.hoverId = false;
    this.hovering = false;
    this.selectedIndex = false; // will be used for tooltip 
    this.chartLoaded = false; // used when chart is initially animated
    initRadialBar(this);
  };

  function initRadialBar(chart) {
    createChart(chart);
    animateChart(chart);
    resizeChart(chart);
  };

  function createChart(chart) {
    setChartSize(chart);
    getChartVariables(chart); // get radius + gap values
    // create svg element
    createChartSvg(chart);
    // tooltip
    initTooltip(chart);
  };

  function setChartSize(chart) {
    chart.height = chart.chartArea.clientHeight;
    chart.width = chart.chartArea.clientWidth;
  };

  function getChartVariables(chart) {
    chart.circleGap = parseInt(getComputedStyle(chart.element).getPropertyValue('--radial-bar-gap'));
    if(isNaN(chart.circleGap)) chart.circleGap = 4;

    chart.circleStroke = parseInt(getComputedStyle(chart.element).getPropertyValue('--radial-bar-bar-stroke'));
    if(isNaN(chart.circleStroke)) chart.circleStroke = 10;
  };

  function createChartSvg(chart) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="'+chart.width+'" height="'+chart.height+'" class="radial-bar__svg js-radial-bar__svg"></svg>';
    chart.chartArea.innerHTML = chart.chartArea.innerHTML + svg;
    chart.svg = chart.chartArea.getElementsByClassName('js-radial-bar__svg')[0];
    // create chart content
    getRadialBarCode(chart);
  };

  function getRadialBarCode(chart) {
    for(var i = 0; i < chart.percentages.length; i++) {
      // for each percentage value, we'll create: a <g> wrapper + 2 <circle> elements (bg + fill)
      var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
        circleFill = document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
        circleBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

      var customClass = chart.percentages[i].getAttribute('data-radial-bar-color');
      if(!customClass) customClass = '';
        
      var radius = chart.height/2 - (chart.circleStroke + chart.circleGap)* i - chart.circleStroke;

      var circunference = 2*Math.PI*radius,
        percentage = parseInt(chart.percentages[i].textContent);

      chart.chartDashStroke.push([circunference*percentage/100, circunference*(100-percentage)/100, circunference]);

      Util.setAttributes(circleBg, {cx: chart.height/2, cy: chart.width/2, r: radius, class: 'radial-bar__circle radial-bar__circle__bg', 'data-index': i});

      var dashArray = chart.chartDashStroke[i][0]+' '+chart.chartDashStroke[i][1];
      
      if(!chart.chartLoaded && chart.options.animate && intersectionObserver && ! reducedMotion) {
        // if chart has to be animated - start with empty circles
        dashArray = '0 '+2*circunference;
      }
      
      Util.setAttributes(circleFill, {cx: chart.height/2, cy: chart.width/2, r: radius, class: 'radial-bar__circle radial-bar__circle__fill js-radial-bar__circle__fill '+customClass, 'stroke-dasharray': dashArray, 'stroke-dashoffset': circunference/4, 'data-index': i});

      gEl.setAttribute('class', 'radial-bar__group');

      gEl.appendChild(circleBg);
      gEl.appendChild(circleFill);
      chart.svg.appendChild(gEl);
    }
  };

  function initTooltip(chart) {
    if(chart.tooltip.length < 1) return;
    // init mouse events
    chart.eventIds['hover'] = handleEvent.bind(chart);
    chart.chartArea.addEventListener('mouseenter', chart.eventIds['hover']);
    chart.chartArea.addEventListener('mousedown', chart.eventIds['hover']);
    chart.chartArea.addEventListener('mousemove', chart.eventIds['hover']);
    chart.chartArea.addEventListener('mouseleave', chart.eventIds['hover']);
  };

  function handleEvent(event) {
    // show tooltip on hover
    switch(event.type) {
      case 'mouseenter':
      case 'mousedown':
        hoverChart(this, event);
        break;
      case 'mousemove': 
        var self = this;
        self.hoverId  = window.requestAnimationFrame 
          ? window.requestAnimationFrame(function(){hoverChart(self, event)})
          : setTimeout(function(){hoverChart(self, event);});
        break;
      case 'mouseleave':
        resetTooltip(this);
        break;
    }
  };

  function hoverChart(chart, event) {
    if(chart.hovering) return;
    chart.hovering = true;
    var selectedIndex = getSelectedIndex(event);
    if(selectedIndex !== false && selectedIndex !== chart.selectedIndex) {
      chart.selectedIndex = selectedIndex;
      setTooltipContent(chart);
      Util.removeClass(chart.tooltip[0], 'is-hidden');
    } else if(selectedIndex === false) {
      resetTooltip(chart);
    }
    chart.hovering = false;
  };

  function resetTooltip(chart) {
    // hide tooltip
    if(chart.hoverId) {
      (window.requestAnimationFrame) ? window.cancelAnimationFrame(chart.hoverId) : clearTimeout(chart.hoverId);
      chart.hoverId = false;
    }
    Util.addClass(chart.tooltip[0], 'is-hidden');
    chart.hovering = false;
    chart.selectedIndex = false;
  };

  function setTooltipContent(chart) {
    chart.tooltip[0].textContent = chart.percentages[chart.selectedIndex].textContent;
  };

  function getSelectedIndex(event) {
    if(event.target.tagName.toLowerCase() == 'circle') {
      return parseInt(event.target.getAttribute('data-index'));
    }
    return false;
  };

  function resizeChart(chart) {
    // reset chart on resize
    window.addEventListener('resize', function() {
      clearTimeout(chart.eventIds['resize']);
      chart.eventIds['resize'] = setTimeout(doneResizing, 300);
    });

    function doneResizing() {
      resetChartResize(chart);
      removeChart(chart);
      createChart(chart);
      initTooltip(chart);
    };
  };

  function resetChartResize(chart) {
    chart.hovering = false;
    // reset event listeners
    if( chart.eventIds && chart.eventIds['hover']) {
      chart.chartArea.removeEventListener('mouseenter', chart.eventIds['hover']);
      chart.chartArea.removeEventListener('mousedown', chart.eventIds['hover']);
      chart.chartArea.removeEventListener('mousemove', chart.eventIds['hover']);
      chart.chartArea.removeEventListener('mouseleave', chart.eventIds['hover']);
    }
  };

  function removeChart(chart) {
    // on resize -> remove svg and create a new one
    chart.svg.remove();
  };

  function animateChart(chart) {
    // reveal chart when it enters the viewport
    if(!chart.options.animate || chart.chartLoaded || reducedMotion || !intersectionObserver) return;
    var observer = new IntersectionObserver(chartObserve.bind(chart), {rootMargin: "0px 0px -200px 0px"});
    observer.observe(chart.element);
  };

  function chartObserve(entries, observer) { // observe chart position -> start animation when inside viewport
    if(entries[0].isIntersecting) {
      this.chartLoaded = true;
      animatePath(this);
      observer.unobserve(this.element);
    }
  };

  function animatePath(chart) {
    var currentTime = null,
      duration = 600;
    var circles = chart.element.getElementsByClassName('js-radial-bar__circle__fill');
        
    var animateSinglePath = function(timestamp) {
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;

      for(var i = 0; i < chart.percentages.length; i++) {
        var fill = Math.easeOutQuart(progress, 0, chart.chartDashStroke[i][0], duration),
          empty = chart.chartDashStroke[i][2] - fill;

        circles[i].setAttribute('stroke-dasharray', fill+' '+empty);
      }
      
      if(progress < duration) {
        window.requestAnimationFrame(animateSinglePath);
      }
    };

    window.requestAnimationFrame(animateSinglePath);
  };

  RadialBar.defaults = {
    element : '',
    animate: false
  };

  window.RadialBar = RadialBar;

  // initialize the RadialBar objects
  var radialBar = document.getElementsByClassName('js-radial-bar');
  var intersectionObserver = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
    reducedMotion = Util.osHasReducedMotion();

  if( radialBar.length > 0 ) {
    for( var i = 0; i < radialBar.length; i++) {
      (function(i){
        var animate = radialBar[i].getAttribute('data-radial-chart-animation') && radialBar[i].getAttribute('data-radial-chart-animation') == 'on' ? true : false;
        new RadialBar({element: radialBar[i], animate: animate});
      })(i);
    }
  }
}());
if(!Util) function Util () {};

Util.hasClass = function(el, className) {
  return el.classList.contains(className);
};

Util.addClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.add(classList[0]);
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.remove(classList[0]);
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};


// File#: _1_rating
// Usage: codyhouse.co/license
(function() {
	var Rating = function(element) {
		this.element = element;
		this.icons = this.element.getElementsByClassName('js-rating__control')[0];
		this.iconCode = this.icons.children[0].parentNode.innerHTML;
		this.initialRating = [];
		this.initialRatingElement = this.element.getElementsByClassName('js-rating__value')[0];
		this.ratingItems;
		this.selectedRatingItem;
    this.readOnly = Util.hasClass(this.element, 'js-rating--read-only');
		this.ratingMaxValue = 5;
		this.getInitialRating();
		this.initRatingHtml();
	};

	Rating.prototype.getInitialRating = function() {
		// get the rating of the product
		if(!this.initialRatingElement || !this.readOnly) {
			this.initialRating = [0, false];
			return;
		}

		var initialValue = Number(this.initialRatingElement.textContent);
		if(isNaN(initialValue)) {
			this.initialRating = [0, false];
			return;
		}

		var floorNumber = Math.floor(initialValue);
		this.initialRating[0] = (floorNumber < initialValue) ? floorNumber + 1 : floorNumber;
		this.initialRating[1] = (floorNumber < initialValue) ? Math.round((initialValue - floorNumber)*100) : false;
	};

	Rating.prototype.initRatingHtml = function() {
		//create the star elements
		var iconsList = this.readOnly ? '<ul>' : '<ul role="radiogroup">';
		
		//if initial rating value is zero -> add a 'zero' item 
		if(this.initialRating[0] == 0 && !this.initialRating[1]) {
			iconsList = iconsList+ '<li class="rating__item--zero rating__item--checked"></li>';
		}

		// create the stars list 
		for(var i = 0; i < this.ratingMaxValue; i++) { 
			iconsList = iconsList + this.getStarHtml(i);
		}
		iconsList = iconsList + '</ul>';

		// --default variation only - improve SR accessibility including a legend element 
		if(!this.readOnly) {
			var labelElement = this.element.getElementsByTagName('label');
			if(labelElement.length > 0) {
				var legendElement = '<legend class="'+labelElement[0].getAttribute('class')+'">'+labelElement[0].textContent+'</legend>';
				iconsList = '<fieldset>'+legendElement+iconsList+'</fieldset>';
				Util.addClass(labelElement[0], 'is-hidden');
			}
		}

		this.icons.innerHTML = iconsList;
		
		//init object properties
		this.ratingItems = this.icons.getElementsByClassName('js-rating__item');
		this.selectedRatingItem = this.icons.getElementsByClassName('rating__item--checked')[0];

		//show the stars
		Util.removeClass(this.icons, 'rating__control--is-hidden');

		//event listener
		!this.readOnly && this.initRatingEvents();// rating vote enabled
	};

	Rating.prototype.getStarHtml = function(index) {
		var listItem = '';
		var checked = (index+1 == this.initialRating[0]) ? true : false,
			itemClass = checked ? ' rating__item--checked' : '',
			tabIndex = (checked || (this.initialRating[0] == 0 && !this.initialRating[1] && index == 0) ) ? 0 : -1,
			showHalf = checked && this.initialRating[1] ? true : false,
			iconWidth = showHalf ? ' rating__item--half': '';
		if(!this.readOnly) {
			listItem = '<li class="js-rating__item'+itemClass+iconWidth+'" role="radio" aria-label="'+(index+1)+'" aria-checked="'+checked+'" tabindex="'+tabIndex+'"><div class="rating__icon">'+this.iconCode+'</div></li>';
		} else {
			var starInner = showHalf ? '<div class="rating__icon">'+this.iconCode+'</div><div class="rating__icon rating__icon--inactive">'+this.iconCode+'</div>': '<div class="rating__icon">'+this.iconCode+'</div>';
			listItem = '<li class="js-rating__item'+itemClass+iconWidth+'">'+starInner+'</li>';
		}
		return listItem;
	};

	Rating.prototype.initRatingEvents = function() {
		var self = this;

		//click on a star
		this.icons.addEventListener('click', function(event){
			var trigger = event.target.closest('.js-rating__item');
			self.resetSelectedIcon(trigger);
		});

		//keyboard navigation -> select new star
		this.icons.addEventListener('keydown', function(event){
			if( event.keyCode && (event.keyCode == 39 || event.keyCode == 40 ) || event.key && (event.key.toLowerCase() == 'arrowright' || event.key.toLowerCase() == 'arrowdown') ) {
				self.selectNewIcon('next'); //select next star on arrow right/down
			} else if(event.keyCode && (event.keyCode == 37 || event.keyCode == 38 ) || event.key && (event.key.toLowerCase() == 'arrowleft' || event.key.toLowerCase() == 'arrowup')) {
				self.selectNewIcon('prev'); //select prev star on arrow left/up
			} else if(event.keyCode && event.keyCode == 32 || event.key && event.key == ' ') {
				self.selectFocusIcon(); // select focused star on Space
			}
		});
	};

	Rating.prototype.selectNewIcon = function(direction) {
		var index = Util.getIndexInArray(this.ratingItems, this.selectedRatingItem);
		index = (direction == 'next') ? index + 1 : index - 1;
		if(index < 0) index = this.ratingItems.length - 1;
		if(index >= this.ratingItems.length) index = 0;	
		this.resetSelectedIcon(this.ratingItems[index]);
		this.ratingItems[index].focus();
	};

	Rating.prototype.selectFocusIcon = function(direction) {
		this.resetSelectedIcon(document.activeElement);
	};

	Rating.prototype.resetSelectedIcon = function(trigger) {
		if(!trigger) return;
		Util.removeClass(this.selectedRatingItem, 'rating__item--checked');
		Util.setAttributes(this.selectedRatingItem, {'aria-checked': false, 'tabindex': -1});
		Util.addClass(trigger, 'rating__item--checked');
		Util.setAttributes(trigger, {'aria-checked': true, 'tabindex': 0});
		this.selectedRatingItem = trigger; 
		// update select input value
		var select = this.element.getElementsByTagName('select');
		if(select.length > 0) {
			select[0].value = trigger.getAttribute('aria-label');
		}
	};
	
	//initialize the Rating objects
	var ratings = document.getElementsByClassName('js-rating');
	if( ratings.length > 0 ) {
		for( var i = 0; i < ratings.length; i++) {
			(function(i){new Rating(ratings[i]);})(i);
		}
	};
}());
// File#: _1_read-more
// Usage: codyhouse.co/license
(function() {
  var ReadMore = function(element) {
    this.element = element;
    this.moreContent = this.element.getElementsByClassName('js-read-more__content');
    this.count = this.element.getAttribute('data-characters') || 200;
    this.counting = 0;
    this.btnClasses = this.element.getAttribute('data-btn-class');
    this.ellipsis = this.element.getAttribute('data-ellipsis') && this.element.getAttribute('data-ellipsis') == 'off' ? false : true;
    this.btnShowLabel = 'Read more';
    this.btnHideLabel = 'Read less';
    this.toggleOff = this.element.getAttribute('data-toggle') && this.element.getAttribute('data-toggle') == 'off' ? false : true;
    if( this.moreContent.length == 0 ) splitReadMore(this);
    setBtnLabels(this);
    initReadMore(this);
  };

  function splitReadMore(readMore) { 
    splitChildren(readMore.element, readMore); // iterate through children and hide content
  };

  function splitChildren(parent, readMore) {
    if(readMore.counting >= readMore.count) {
      parent.classList.add('js-read-more__content');
      return parent.outerHTML;
    }
    var children = parent.childNodes;
    var content = '';
    for(var i = 0; i < children.length; i++) {
      if (children[i].nodeType == Node.TEXT_NODE) {
        content = content + wrapText(children[i], readMore);
      } else {
        content = content + splitChildren(children[i], readMore);
      }
    }
    parent.innerHTML = content;
    return parent.outerHTML;
  };

  function wrapText(element, readMore) {
    var content = element.textContent;
    if(content.replace(/\s/g,'').length == 0) return '';// check if content is empty
    if(readMore.counting >= readMore.count) {
      return '<span class="js-read-more__content">' + content + '</span>';
    }
    if(readMore.counting + content.length < readMore.count) {
      readMore.counting = readMore.counting + content.length;
      return content;
    }
    var firstContent = content.substr(0, readMore.count - readMore.counting);
    firstContent = firstContent.substr(0, Math.min(firstContent.length, firstContent.lastIndexOf(" ")));
    var secondContent = content.substr(firstContent.length, content.length);
    readMore.counting = readMore.count;
    return firstContent + '<span class="js-read-more__content">' + secondContent + '</span>';
  };

  function setBtnLabels(readMore) { // set custom labels for read More/Less btns
    var btnLabels = readMore.element.getAttribute('data-btn-labels');
    if(btnLabels) {
      var labelsArray = btnLabels.split(',');
      readMore.btnShowLabel = labelsArray[0].trim();
      readMore.btnHideLabel = labelsArray[1].trim();
    }
  };

  function initReadMore(readMore) { // add read more/read less buttons to the markup
    readMore.moreContent = readMore.element.getElementsByClassName('js-read-more__content');
    if( readMore.moreContent.length == 0 ) {
      readMore.element.classList.add('read-more--loaded');
      return;
    }
    var btnShow = ' <button class="js-read-more__btn '+readMore.btnClasses+'">'+readMore.btnShowLabel+'</button>';
    var btnHide = ' <button class="js-read-more__btn is-hidden '+readMore.btnClasses+'">'+readMore.btnHideLabel+'</button>';
    if(readMore.ellipsis) {
      btnShow = '<span class="js-read-more__ellipsis" aria-hidden="true">...</span>'+ btnShow;
    }

    readMore.moreContent[readMore.moreContent.length - 1].insertAdjacentHTML('afterend', btnHide);
    readMore.moreContent[0].insertAdjacentHTML('afterend', btnShow);
    resetAppearance(readMore);
    initEvents(readMore);
  };

  function resetAppearance(readMore) { // hide part of the content
    for(var i = 0; i < readMore.moreContent.length; i++) readMore.moreContent[i].classList.add('is-hidden');
    readMore.element.classList.add('read-more--loaded'); // show entire component
  };

  function initEvents(readMore) { // listen to the click on the read more/less btn
    readMore.btnToggle = readMore.element.getElementsByClassName('js-read-more__btn');
    readMore.ellipsis = readMore.element.getElementsByClassName('js-read-more__ellipsis');

    readMore.btnToggle[0].addEventListener('click', function(event){
      event.preventDefault();
      updateVisibility(readMore, true);
    });
    readMore.btnToggle[1].addEventListener('click', function(event){
      event.preventDefault();
      updateVisibility(readMore, false);
    });
  };

  function updateVisibility(readMore, visibile) {
    for(var i = 0; i < readMore.moreContent.length; i++) readMore.moreContent[i].classList.toggle('is-hidden', !visibile);
    // reset btns appearance
    readMore.btnToggle[0].classList.toggle('is-hidden', visibile);
    readMore.btnToggle[1].classList.toggle('is-hidden', !visibile);
    if(readMore.ellipsis.length > 0 ) readMore.ellipsis[0].classList.toggle('is-hidden', visibile);
    
    if(!readMore.toggleOff) readMore.btn.classList.add('is-hidden');
    // move focus
    if(visibile) {
      var targetTabIndex = readMore.moreContent[0].getAttribute('tabindex');
      elMoveFocus(readMore.moreContent[0]);
      resetFocusTarget(readMore.moreContent[0], targetTabIndex);
    } else {
      elMoveFocus(readMore.btnToggle[0]);
    }
  };

  function resetFocusTarget(target, tabindex) {
    if( parseInt(target.getAttribute('tabindex')) < 0) {
			target.style.outline = 'none';
			!tabindex && target.removeAttribute('tabindex');
		}
  };

  function elMoveFocus(element) {
    element.focus();
    if (document.activeElement !== element) {
      element.setAttribute('tabindex','-1');
      element.focus();
    }
  };

  //initialize the ReadMore objects
	var readMore = document.getElementsByClassName('js-read-more');
	if( readMore.length > 0 ) {
		for( var i = 0; i < readMore.length; i++) {
			(function(i){new ReadMore(readMore[i]);})(i);
		}
	};
}());
if(!Util) function Util () {};

Util.hasClass = function(el, className) {
  return el.classList.contains(className);
};

Util.addClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.add(classList[0]);
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.remove(classList[0]);
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
  if(bool) Util.addClass(el, className);
  else Util.removeClass(el, className);
};

Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName('body')[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};


// File#: _1_responsive-sidebar
// Usage: codyhouse.co/license
(function() {
  var Sidebar = function(element) {
		this.element = element;
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.selectedTrigger = null;
    this.showClass = "sidebar--is-visible";
    this.staticClass = "sidebar--static";
    this.customStaticClass = "";
    this.readyClass = "sidebar--loaded";
    this.contentReadyClass = "sidebar-loaded:show";
    this.layout = false; // this will be static or mobile
    this.preventScrollEl = getPreventScrollEl(this);
    getCustomStaticClass(this); // custom classes for static version
    initSidebar(this);
  };

  function getPreventScrollEl(element) {
		var scrollEl = false;
		var querySelector = element.element.getAttribute('data-sidebar-prevent-scroll');
		if(querySelector) scrollEl = document.querySelector(querySelector);
		return scrollEl;
	};

  function getCustomStaticClass(element) {
    var customClasses = element.element.getAttribute('data-static-class');
    if(customClasses) element.customStaticClass = ' '+customClasses;
  };
  
  function initSidebar(sidebar) {
    initSidebarResize(sidebar); // handle changes in layout -> mobile to static and viceversa
    
		if ( sidebar.triggers ) { // open sidebar when clicking on trigger buttons - mobile layout only
			for(var i = 0; i < sidebar.triggers.length; i++) {
				sidebar.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
          toggleSidebar(sidebar, event.target);
				});
			}
		}

    // use the 'openSidebar' event to trigger the sidebar
    sidebar.element.addEventListener('openSidebar', function(event) {
      toggleSidebar(sidebar, event.detail);
    });
  };

  function toggleSidebar(sidebar, target) {
    if(Util.hasClass(sidebar.element, sidebar.showClass)) {
      sidebar.selectedTrigger = target;
      closeSidebar(sidebar);
      return;
    }
    sidebar.selectedTrigger = target;
    showSidebar(sidebar);
    initSidebarEvents(sidebar);
  };

  function showSidebar(sidebar) { // mobile layout only
		Util.addClass(sidebar.element, sidebar.showClass);
		getFocusableElements(sidebar);
		Util.moveFocus(sidebar.element);
    // change the overflow of the preventScrollEl
		if(sidebar.preventScrollEl) sidebar.preventScrollEl.style.overflow = 'hidden';
  };

  function closeSidebar(sidebar) { // mobile layout only
		Util.removeClass(sidebar.element, sidebar.showClass);
		sidebar.firstFocusable = null;
		sidebar.lastFocusable = null;
    if(sidebar.selectedTrigger) sidebar.selectedTrigger.focus();
    sidebar.element.removeAttribute('tabindex');
		//remove listeners
		cancelSidebarEvents(sidebar);
    // change the overflow of the preventScrollEl
		if(sidebar.preventScrollEl) sidebar.preventScrollEl.style.overflow = '';
	};

  function initSidebarEvents(sidebar) { // mobile layout only
    //add event listeners
		sidebar.element.addEventListener('keydown', handleEvent.bind(sidebar));
		sidebar.element.addEventListener('click', handleEvent.bind(sidebar));
  };

  function cancelSidebarEvents(sidebar) { // mobile layout only
    //remove event listeners
		sidebar.element.removeEventListener('keydown', handleEvent.bind(sidebar));
		sidebar.element.removeEventListener('click', handleEvent.bind(sidebar));
  };

  function handleEvent(event) { // mobile layout only
    switch(event.type) {
      case 'click': {
        initClick(this, event);
      }
      case 'keydown': {
        initKeyDown(this, event);
      }
    }
  };

  function initKeyDown(sidebar, event) { // mobile layout only
    if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
      //close sidebar window on esc
      closeSidebar(sidebar);
    } else if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
      //trap focus inside sidebar
      trapFocus(sidebar, event);
    }
  };

  function initClick(sidebar, event) { // mobile layout only
    //close sidebar when clicking on close button or sidebar bg layer 
		if( !event.target.closest('.js-sidebar__close-btn') && !Util.hasClass(event.target, 'js-sidebar') ) return;
		event.preventDefault();
		closeSidebar(sidebar);
  };

  function trapFocus(sidebar, event) { // mobile layout only
    if( sidebar.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of sidebar
			event.preventDefault();
			sidebar.lastFocusable.focus();
		}
		if( sidebar.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of sidebar
			event.preventDefault();
			sidebar.firstFocusable.focus();
		}
  };

  function initSidebarResize(sidebar) {
    // custom event emitted when window is resized - detect only if the sidebar--static@{breakpoint} class was added
    var beforeContent = getComputedStyle(sidebar.element, ':before').getPropertyValue('content');
    if(beforeContent && beforeContent !='' && beforeContent !='none') {
      checkSidebarLayout(sidebar);

      sidebar.element.addEventListener('update-sidebar', function(event){
        checkSidebarLayout(sidebar);
      });
    } 
    // check if there a main element to show
    var mainContent = document.getElementsByClassName(sidebar.contentReadyClass);
    if(mainContent.length > 0) Util.removeClass(mainContent[0], sidebar.contentReadyClass);
    Util.addClass(sidebar.element, sidebar.readyClass);
  };

  function checkSidebarLayout(sidebar) {
    var layout = getComputedStyle(sidebar.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    if(layout == sidebar.layout) return;
    sidebar.layout = layout;
    if(layout != 'static') Util.addClass(sidebar.element, 'is-hidden');
    Util.toggleClass(sidebar.element, sidebar.staticClass + sidebar.customStaticClass, layout == 'static');
    if(layout != 'static') setTimeout(function(){Util.removeClass(sidebar.element, 'is-hidden')});
    // reset element role 
    (layout == 'static') ? sidebar.element.removeAttribute('role', 'alertdialog') :  sidebar.element.setAttribute('role', 'alertdialog');
    // reset mobile behaviour
    if(layout == 'static' && Util.hasClass(sidebar.element, sidebar.showClass)) closeSidebar(sidebar);
  };

  function getFocusableElements(sidebar) {
    //get all focusable elements inside the drawer
		var allFocusable = sidebar.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
		getFirstVisible(sidebar, allFocusable);
		getLastVisible(sidebar, allFocusable);
  };

  function getFirstVisible(sidebar, elements) {
		//get first visible focusable element inside the sidebar
		for(var i = 0; i < elements.length; i++) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				sidebar.firstFocusable = elements[i];
				return true;
			}
		}
	};

	function getLastVisible(sidebar, elements) {
		//get last visible focusable element inside the sidebar
		for(var i = elements.length - 1; i >= 0; i--) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				sidebar.lastFocusable = elements[i];
				return true;
			}
		}
  };

  window.Sidebar = Sidebar;

  //initialize the Sidebar objects
	var sidebar = document.getElementsByClassName('js-sidebar');
	if( sidebar.length > 0 ) {
		for( var i = 0; i < sidebar.length; i++) {
			(function(i){new Sidebar(sidebar[i]);})(i);
    }
    // switch from mobile to static layout
    var customEvent = new CustomEvent('update-sidebar');
    window.addEventListener('resize', function(event){
      (!window.requestAnimationFrame) ? setTimeout(function(){resetLayout();}, 250) : window.requestAnimationFrame(resetLayout);
    });

    (window.requestAnimationFrame) // init sidebar layout
      ? window.requestAnimationFrame(resetLayout)
      : resetLayout();

    function resetLayout() {
      for( var i = 0; i < sidebar.length; i++) {
        (function(i){sidebar[i].dispatchEvent(customEvent)})(i);
      };
    };
	}
}());
// File#: _1_side-navigation
// Usage: codyhouse.co/license
(function() {
  function initSideNav(nav) {
    nav.addEventListener('click', function(event){
      var btn = event.target.closest('.js-sidenav__sublist-control');
      if(!btn) return;
      var listItem = btn.parentElement,
        bool = Util.hasClass(listItem, 'sidenav__item--expanded');
      btn.setAttribute('aria-expanded', !bool);
      Util.toggleClass(listItem, 'sidenav__item--expanded', !bool);
    });
  };

  var sideNavs = document.getElementsByClassName('js-sidenav');
  if( sideNavs.length > 0 ) {
    for( var i = 0; i < sideNavs.length; i++) {
      (function(i){initSideNav(sideNavs[i]);})(i);
    }
  }
}());
// File#: _1_slider
// Usage: codyhouse.co/license
(function() {
	var Slider = function(element) {
		this.element = element;
		this.rangeWrapper = this.element.getElementsByClassName('slider__range');
		this.rangeInput = this.element.getElementsByClassName('slider__input');
		this.value = this.element.getElementsByClassName('js-slider__value'); 
		this.floatingValue = this.element.getElementsByClassName('js-slider__value--floating'); 
		this.rangeMin = this.rangeInput[0].getAttribute('min');
		this.rangeMax = this.rangeInput[0].getAttribute('max');
		this.sliderWidth = window.getComputedStyle(this.element.getElementsByClassName('slider__range')[0]).getPropertyValue('width');
		this.thumbWidth = getComputedStyle(this.element).getPropertyValue('--slide-thumb-size');
		this.isInputVar = (this.value[0].tagName.toLowerCase() == 'input');
		this.isFloatingVar = this.floatingValue.length > 0;
		if(this.isFloatingVar) {
			this.floatingValueLeft = window.getComputedStyle(this.floatingValue[0]).getPropertyValue('left');
		}
		initSlider(this);
	};

	function initSlider(slider) {
		updateLabelValues(slider);// update label/input value so that it is the same as the input range
		updateLabelPosition(slider, false); // update label position if floating variation
		updateRangeColor(slider, false); // update range bg color
		checkRangeSupported(slider); // hide label/input value if input range is not supported
		
		// listen to change in the input range
		for(var i = 0; i < slider.rangeInput.length; i++) {
			(function(i){
				slider.rangeInput[i].addEventListener('input', function(event){
					updateSlider(slider, i);
				});
				slider.rangeInput[i].addEventListener('change', function(event){ // fix issue on IE where input event is not emitted
					updateSlider(slider, i);
				});
			})(i);
		}

		// if there's an input text, listen for changes in value, validate it and then update slider
		if(slider.isInputVar) {
			for(var i = 0; i < slider.value.length; i++) {
				(function(i){
					slider.value[i].addEventListener('change', function(event){
						updateRange(slider, i);
					});
				})(i);
			}
		}

		// native <input> element has been updated (e.g., form reset) -> update custom appearance
		slider.element.addEventListener('slider-updated', function(event){
			for(var i = 0; i < slider.value.length; i++) {updateSlider(slider, i);}
		});

		// custom events - emitted if slider has allows for multi-values
		slider.element.addEventListener('inputRangeLimit', function(event){
			updateLabelValues(slider);
			updateLabelPosition(slider, event.detail);
		});
	};

	function updateSlider(slider, index) {
		updateLabelValues(slider);
		updateLabelPosition(slider, index);
		updateRangeColor(slider, index);
	};

	function updateLabelValues(slider) {
		for(var i = 0; i < slider.rangeInput.length; i++) {
			slider.isInputVar ? slider.value[i].value = slider.rangeInput[i].value : slider.value[i].textContent = slider.rangeInput[i].value;
		}
	};

	function updateLabelPosition(slider, index) {
		if(!slider.isFloatingVar) return;
		var i = index ? index : 0,
			j = index ? index + 1: slider.rangeInput.length;
		for(var k = i; k < j; k++) {
			var percentage = (slider.rangeInput[k].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin);
			slider.floatingValue[k].style.left = 'calc(0.5 * '+slider.floatingValueLeft+' + '+percentage+' * ( '+slider.sliderWidth+' - '+slider.floatingValueLeft+' ))';
		}
	};

	function updateRangeColor(slider, index) {
		if(slider.rangeInput.length > 1) {slider.element.dispatchEvent(new CustomEvent('updateRange', {detail: index}));return;}
		var percentage = (slider.rangeInput[0].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin)*100,
			fill = 'calc('+percentage+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)',
			empty = 'calc('+slider.sliderWidth+' - '+percentage+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)';

		slider.rangeWrapper[0].style.setProperty('--slider-fill-value', fill);
		slider.rangeWrapper[0].style.setProperty('--slider-empty-value', empty);
	};

	function updateRange(slider, index) {
		var newValue = parseFloat(slider.value[index].value);
		if(isNaN(newValue)) {
			slider.value[index].value = slider.rangeInput[index].value;
			return;
		} else {
			if(newValue < slider.rangeMin) newValue = slider.rangeMin;
			if(newValue > slider.rangeMax) newValue = slider.rangeMax;
			slider.rangeInput[index].value = newValue;
			var inputEvent = new Event('change');
			slider.rangeInput[index].dispatchEvent(inputEvent);
		}
	};

	function checkRangeSupported(slider) {
		var input = document.createElement("input");
		input.setAttribute("type", "range");
		slider.element.classList.toggle('slider--range-not-supported', input.type !== "range")
	};

	//initialize the Slider objects
	var sliders = document.getElementsByClassName('js-slider');
	if( sliders.length > 0 ) {
		for( var i = 0; i < sliders.length; i++) {
			(function(i){new Slider(sliders[i]);})(i);
		}
	}
}());
// File#: _1_swipe-content
(function() {
	var SwipeContent = function(element) {
		this.element = element;
		this.delta = [false, false];
		this.dragging = false;
		this.intervalId = false;
		initSwipeContent(this);
	};

	function initSwipeContent(content) {
		content.element.addEventListener('mousedown', handleEvent.bind(content));
		content.element.addEventListener('touchstart', handleEvent.bind(content), {passive: true});
	};

	function initDragging(content) {
		//add event listeners
		content.element.addEventListener('mousemove', handleEvent.bind(content));
		content.element.addEventListener('touchmove', handleEvent.bind(content), {passive: true});
		content.element.addEventListener('mouseup', handleEvent.bind(content));
		content.element.addEventListener('mouseleave', handleEvent.bind(content));
		content.element.addEventListener('touchend', handleEvent.bind(content));
	};

	function cancelDragging(content) {
		//remove event listeners
		if(content.intervalId) {
			(!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
			content.intervalId = false;
		}
		content.element.removeEventListener('mousemove', handleEvent.bind(content));
		content.element.removeEventListener('touchmove', handleEvent.bind(content));
		content.element.removeEventListener('mouseup', handleEvent.bind(content));
		content.element.removeEventListener('mouseleave', handleEvent.bind(content));
		content.element.removeEventListener('touchend', handleEvent.bind(content));
	};

	function handleEvent(event) {
		switch(event.type) {
			case 'mousedown':
			case 'touchstart':
				startDrag(this, event);
				break;
			case 'mousemove':
			case 'touchmove':
				drag(this, event);
				break;
			case 'mouseup':
			case 'mouseleave':
			case 'touchend':
				endDrag(this, event);
				break;
		}
	};

	function startDrag(content, event) {
		content.dragging = true;
		// listen to drag movements
		initDragging(content);
		content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
		// emit drag start event
		emitSwipeEvents(content, 'dragStart', content.delta, event.target);
	};

	function endDrag(content, event) {
		cancelDragging(content);
		// credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
		var dx = parseInt(unify(event).clientX), 
	    dy = parseInt(unify(event).clientY);
	  
	  // check if there was a left/right swipe
		if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
	    var s = getSign(dx - content.delta[0]);
			
			if(Math.abs(dx - content.delta[0]) > 30) {
				(s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);	
			}
	    
	    content.delta[0] = false;
	  }
		// check if there was a top/bottom swipe
	  if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
	  	var y = getSign(dy - content.delta[1]);

	  	if(Math.abs(dy - content.delta[1]) > 30) {
	    	(y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
	    }

	    content.delta[1] = false;
	  }
		// emit drag end event
	  emitSwipeEvents(content, 'dragEnd', [dx, dy]);
	  content.dragging = false;
	};

	function drag(content, event) {
		if(!content.dragging) return;
		// emit dragging event with coordinates
		(!window.requestAnimationFrame) 
			? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250) 
			: content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
	};

	function emitDrag(event) {
		emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
	};

	function unify(event) { 
		// unify mouse and touch events
		return event.changedTouches ? event.changedTouches[0] : event; 
	};

	function emitSwipeEvents(content, eventName, detail, el) {
		var trigger = false;
		if(el) trigger = el;
		// emit event with coordinates
		var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1], origin: trigger}});
		content.element.dispatchEvent(event);
	};

	function getSign(x) {
		if(!Math.sign) {
			return ((x > 0) - (x < 0)) || +x;
		} else {
			return Math.sign(x);
		}
	};

	window.SwipeContent = SwipeContent;
	
	//initialize the SwipeContent objects
	var swipe = document.getElementsByClassName('js-swipe-content');
	if( swipe.length > 0 ) {
		for( var i = 0; i < swipe.length; i++) {
			(function(i){new SwipeContent(swipe[i]);})(i);
		}
	}
}());
(function() {
  var themeSwitch = document.getElementById('switch-light-dark');
  if(themeSwitch) {
    var htmlElement = document.getElementsByTagName("html")[0];
    initTheme();
    
    themeSwitch.addEventListener('change', function(event){
      resetTheme(event.target);
    });

    function initTheme() {
      if(htmlElement.getAttribute('data-theme') == 'dark') {
        themeSwitch.checked = true;
      }
    };

    function resetTheme(target) {
      if(target.checked) {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('themeSwitch', 'dark');
      } else {
        htmlElement.removeAttribute('data-theme');
        localStorage.setItem('themeSwitch', 'light');
      }
    };
  }
}());
// File#: _1_toast
// Usage: codyhouse.co/license
(function() {
  var Toasts = function() {
    this.toastsEl = document.getElementsByClassName('js-toast');
    this.toastsId = getRandomInt(0, 1000);
    this.index = 0;
    this.closingToast = false;
    initToasts(this);
  };

  // public method to initialize new toast elements
  Toasts.prototype.initToast = function(element) {
		initSingleToast(this, element);
	};

  function initToasts(obj) {
    // create a wrapper element for each toast variation
    createWrapper(obj, 'top-right');
    createWrapper(obj, 'top-left');
    createWrapper(obj, 'top-center');
    createWrapper(obj, 'bottom-right');
    createWrapper(obj, 'bottom-left');
    createWrapper(obj, 'bottom-center');

    // init single toast element
    for(var i = 0; i < obj.toastsEl.length; i++) {
      initSingleToast(obj, obj.toastsEl[i]);
    }

    // listen for dynamic toast creation
    window.addEventListener('newToast', function(event) {
      initSingleToast(obj, event.detail);
    });
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  };

  function createWrapper(obj, position) {
    var classes = 'top-0 left-0 flex-column';
    if(position == 'top-right') classes = 'top-0 right-0 flex-column';
    if(position == 'top-center') classes = 'top-0 left-50% -translate-x-50% flex-column items-center';
    if(position == 'bottom-right') classes = 'bottom-0 right-0 flex-column-reverse';
    if(position == 'bottom-left') classes = 'bottom-0 left-0 flex-column-reverse';
    if(position == 'bottom-center') classes = 'bottom-0 left-50% -translate-x-50% flex-column-reverse items-center';

    var div = '<div class="toast-wrapper position-fixed flex '+classes+'" id="toast-wrapper-'+position+'"></div>';
    document.body.insertAdjacentHTML('beforeend', div);
    obj[position] = document.getElementById('toast-wrapper-'+position);
  };

  function initSingleToast(obj, toast) {
    var id = 'toast-'+obj.toastsId+'-'+obj.index;
    obj.index = obj.index + 1;
    // store toast info in the Toasts obj
    obj[id] = {};
    obj[id]['interval'] = toast.getAttribute('data-toast-interval') || 5000,
    obj[id]['intervalId'] = false;
    obj[id]['closing'] = false;
    // get position type
    var classes = toast.getAttribute('class');
    obj[id]['position'] = 'top-right';
    if(classes.indexOf('toast--top-left') > -1) obj[id]['position'] = 'top-left';
    if(classes.indexOf('toast--top-center') > -1) obj[id]['position'] = 'top-center';
    if(classes.indexOf('toast--bottom-right') > -1) obj[id]['position'] = 'bottom-right';
    if(classes.indexOf('toast--bottom-left') > -1) obj[id]['position'] = 'bottom-left'; 
    if(classes.indexOf('toast--bottom-center') > -1) obj[id]['position'] = 'bottom-center';

    // listen for custom open event
    toast.addEventListener('openToast', function() {
      if(!toast.classList.contains('toast--hidden') || obj[id]['closing']) return;
      openToast(obj, toast, id);
    });

    // close toast
    toast.addEventListener('click', function(event){
      if(event.target.closest('.js-toast__close-btn')) {
        obj.closingToast = true;
        closeToast(obj, toast, id);
      }
    });
  };

  function openToast(obj, toast, id) {
    if(obj[id]['intervalId']) {
      clearInterval(obj[id]['intervalId']);
      obj[id]['intervalId'] = false;
    }
    // place toast - insert in the proper container
    var fragment = document.createDocumentFragment();
    fragment.appendChild(toast);
    obj[obj[id]['position']].appendChild(fragment);

    // change position
    toast.style.position = 'static';

    // show toast
    setTimeout(function() {
      toast.classList.remove('toast--hidden');
    });
    
    // automatically close after a time interval
    if(obj[id]['interval'] && parseInt(obj[id]['interval']) > 0) {
      setToastInterval(obj, toast, id, obj[id]['interval']);
    }
  };

  function setToastInterval(obj, toast, id, interval) {
    obj[id]['intervalId'] = setTimeout(function(){
      if(obj.closingToast) return setToastInterval(obj, toast, id, 1000);
      closeToast(obj, toast, id);
    }, interval);
  };

  function closeToast(obj, toast, id) {
    obj[id]['closing'] = true;
    toast.classList.add('toast--hidden');
    // clear timeout
    if(obj[id]['intervalId']) clearTimeout(obj[id]['intervalId']);
    // remove toast and animate siblings
    closeToastAnimation(obj, toast, id);    
  };

  function closeToastAnimation(obj, toast, id) {
    // get all next elements 
    var siblings = getToastNextSiblings(toast);
    // get translate value (could be positive or negative based on position)
    var toastStyle = window.getComputedStyle(toast),
      margin = parseInt(toastStyle.getPropertyValue('margin-top')) || parseInt(toastStyle.getPropertyValue('margin-bottom'));
    // translate next elements if any
    var translate = toast.offsetHeight + margin;
    if(obj[id]['position'].indexOf('top') > -1) {
      translate = '-'+translate
    }
    for(var i = 0; i < siblings.length; i++) {
      siblings[i].style.transform = 'translateY('+translate+'px)';
    }
    // remove toast and reset translate
    toast.addEventListener('transitionend', function cb(event){
      if(event.propertyName != 'opacity') return;
      toast.removeEventListener('transitionend', cb);
      removeToast(toast, siblings, obj, id);
      obj.closingToast = false;
    });
  };

  function getToastNextSiblings(toast) {
    var array = [];
    var nextSibling = toast.nextElementSibling;
    if(nextSibling) {
      array.push(nextSibling);
      var nextSiblingsIterate = getToastNextSiblings(nextSibling);
      Array.prototype.push.apply(array, nextSiblingsIterate);
    }
    return array;
  };

  function removeToast(toast, siblings, obj, id) {
    // reset position
    toast.style.position = '';

    // move toast back to body
    var fragment = document.createDocumentFragment();
    fragment.appendChild(toast);
    document.body.appendChild(fragment); 

    // reset siblings translate
    for(var i = 0; i < siblings.length; i++) {
      (function(i){
        // set transition to none
        siblings[i].style.transition = 'none';
        siblings[i].style.transform = '';
        setTimeout(function() {siblings[i].style.transition = '';}, 10);
      })(i);
    }

    // reset closing status
    obj[id]['closing'] = false;
  };

  window.Toasts = Toasts;

	//initialize the Toasts objects
	var toasts = document.getElementsByClassName('js-toast');
	if( toasts.length > 0 ) {
		new Toasts();
	}
}());
// File#: _1_vertical-timeline
// Usage: codyhouse.co/license
(function() {
  var VTimeline = function(element) {
    this.element = element;
    this.sections = this.element.getElementsByClassName('js-v-timeline__section');
    this.animate = this.element.getAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on' ? true : false;
    this.animationClass = 'v-timeline__section--animate';
    this.animationDelta = '-150px';
    initVTimeline(this);
  };

  function initVTimeline(element) {
    if(!element.animate) return;
    for(var i = 0; i < element.sections.length; i++) {
      var observer = new IntersectionObserver(vTimelineCallback.bind(element, i),
      {rootMargin: "0px 0px "+element.animationDelta+" 0px"});
      observer.observe(element.sections[i]);
    }
  };

  function vTimelineCallback(index, entries, observer) {
    if(entries[0].isIntersecting) {
      Util.addClass(this.sections[index], this.animationClass);
      observer.unobserve(this.sections[index]);
    } 
  };

  //initialize the VTimeline objects
  var timelines = document.querySelectorAll('.js-v-timeline'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
    reducedMotion = Util.osHasReducedMotion();
  if( timelines.length > 0) {
    for( var i = 0; i < timelines.length; i++) {
      if(intersectionObserverSupported && !reducedMotion) (function(i){new VTimeline(timelines[i]);})(i);
      else timelines[i].removeAttribute('data-animation');
    }
  }
}());
// File#: _2_chart
// Usage: codyhouse.co/license
(function() {
  var Chart = function(opts) {
    this.options = Util.extend(Chart.defaults , opts);
    this.element = this.options.element.getElementsByClassName('js-chart__area')[0];
    this.svgPadding = this.options.padding;
    this.topDelta = this.svgPadding;
    this.bottomDelta = 0;
    this.leftDelta = 0;
    this.rightDelta = 0;
    this.legendHeight = 0;
    this.yChartMaxWidth = 0;
    this.yAxisHeight = 0;
    this.xAxisWidth = 0;
    this.yAxisInterval = []; // used to store min and max value on y axis
    this.xAxisInterval = []; // used to store min and max value on x axis
    this.datasetScaled = []; // used to store set data converted to chart coordinates
    this.datasetScaledFlat = []; // used to store set data converted to chart coordinates for animation
    this.datasetAreaScaled = []; // used to store set data (area part) converted to chart coordinates
    this.datasetAreaScaledFlat = []; // used to store set data (area part)  converted to chart coordinates for animation
    // columns chart - store if x axis label where rotated
    this.xAxisLabelRotation = false;
    // tooltip
    this.interLine = false;
    this.markers = false;
    this.tooltipOn = this.options.tooltip && this.options.tooltip.enabled;
    this.tooltipClasses = (this.tooltipOn && this.options.tooltip.classes) ? this.options.tooltip.classes : '';
    this.tooltipPosition = (this.tooltipOn && this.options.tooltip.position) ? this.options.tooltip.position : false;
    this.tooltipDelta = 10;
    this.selectedMarker = false;
    this.selectedMarkerClass = 'chart__marker--selected';
    this.selectedBarClass = 'chart__data-bar--selected';
    this.hoverId = false;
    this.hovering = false;
    // events id
    this.eventIds = []; // will use to store event ids
    // accessibility
    this.categories = this.options.element.getElementsByClassName('js-chart__category');
    this.loaded = false;
    // init chart
    initChartInfo(this);
    initChart(this);
    // if externalDate == true
    initExternalData(this);
  };

  function initChartInfo(chart) {
    // we may need to store store some initial config details before setting up the chart
    if(chart.options.type == 'column') {
      setChartColumnSize(chart);
    }
  };

  function initChart(chart) {
    if(chart.options.datasets.length == 0) return; // no data where provided
    if(!intObservSupported) chart.options.animate = false; // do not animate if intersectionObserver is not supported
    // init event ids variables
    intEventIds(chart);
    setChartSize(chart);
    createChartSvg(chart);
    createSrTables(chart); // chart accessibility
    animateChart(chart); // if animate option is true
    resizeChart(chart);
    chart.loaded = true;
  };

  function intEventIds(chart) {
    chart.eventIds['resize'] = false;
  };

  function setChartSize(chart) {
    chart.height = chart.element.clientHeight;
    chart.width = chart.element.clientWidth;
  };

  function createChartSvg(chart) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="'+chart.width+'" height="'+chart.height+'" class="chart__svg js-chart__svg"></svg>';
    chart.element.innerHTML = svg;
    chart.svg = chart.element.getElementsByClassName('js-chart__svg')[0];

    // create chart content
    switch (chart.options.type) {
      case 'pie':
        getPieSvgCode(chart);
        break;
      case 'doughnut':
        getDoughnutSvgCode(chart);
        break;
      case 'column':
        getColumnSvgCode(chart);
        break;
      default:
        getLinearSvgCode(chart);
    }
  };

  function getLinearSvgCode(chart) { // svg for linear + area charts
    setYAxis(chart);
    setXAxis(chart);
    updateChartWidth(chart);
    placexAxisLabels(chart);
    placeyAxisLabels(chart);
    setChartDatasets(chart);
    initTooltips(chart);
  };

  function getColumnSvgCode(chart) { // svg for column charts
    setYAxis(chart);
    setXAxis(chart);
    updateChartWidth(chart);
    placexAxisLabels(chart);
    placeyAxisLabels(chart);
    resetColumnChart(chart);
    setColumnChartDatasets(chart);
    initTooltips(chart);
  };

  function setXAxis(chart) {
    // set legend of axis if available
    if( chart.options.xAxis && chart.options.xAxis.legend) {
      var textLegend = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textLegend.textContent = chart.options.xAxis.legend;
      Util.setAttributes(textLegend, {class: 'chart__axis-legend chart__axis-legend--x js-chart__axis-legend--x'});
      chart.svg.appendChild(textLegend);

      var xLegend = chart.element.getElementsByClassName('js-chart__axis-legend--x')[0];

      if(isVisible(xLegend)) {
        var size = xLegend.getBBox(),
          xPosition = chart.width/2 - size.width/2,
          yPosition = chart.height - chart.bottomDelta;

        Util.setAttributes(xLegend, {x: xPosition, y: yPosition});
        chart.bottomDelta = chart.bottomDelta + size.height +chart.svgPadding;
      }
    }

    // get interval and create scale
    var xLabels;
    if(chart.options.xAxis && chart.options.xAxis.labels && chart.options.xAxis.labels.length > 1) {
      xLabels = chart.options.xAxis.labels;
      chart.xAxisInterval = [0, chart.options.xAxis.labels.length - 1];
    } else {
      xLabels = getChartXLabels(chart); // this function is used to set chart.xAxisInterval as well
    }
    // modify axis labels
    if(chart.options.xAxis && chart.options.xAxis.labelModifier) {
      xLabels = modifyAxisLabel(xLabels, chart.options.xAxis.labelModifier);
    } 

    var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    Util.setAttributes(gEl, {class: 'chart__axis-labels chart__axis-labels--x js-chart__axis-labels--x'});

    for(var i = 0; i < xLabels.length; i++) {
      var textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      var labelClasses = (chart.options.xAxis && chart.options.xAxis.labels) ? 'chart__axis-label chart__axis-label--x js-chart__axis-label' : 'is-hidden js-chart__axis-label';
      Util.setAttributes(textEl, {class: labelClasses, 'alignment-baseline': 'middle'});
      textEl.textContent = xLabels[i];
      gEl.appendChild(textEl);
    }
    
    if(chart.options.xAxis && chart.options.xAxis.line) {
      var lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      Util.setAttributes(lineEl, {class: 'chart__axis chart__axis--x js-chart__axis--x', 'stroke-linecap': 'square'});
      gEl.appendChild(lineEl);
    }

    var ticksLength = xLabels.length;
    if(chart.options.type == 'column') ticksLength = ticksLength + 1;
    
    for(var i = 0; i < ticksLength; i++) {
      var tickEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      var classTicks = (chart.options.xAxis && chart.options.xAxis.ticks) ? 'chart__tick chart__tick-x js-chart__tick-x' : 'js-chart__tick-x';
      Util.setAttributes(tickEl, {class: classTicks, 'stroke-linecap': 'square'});
      gEl.appendChild(tickEl);
    }

    chart.svg.appendChild(gEl);
  };

  function setYAxis(chart) {
    // set legend of axis if available
    if( chart.options.yAxis && chart.options.yAxis.legend) {
      var textLegend = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textLegend.textContent = chart.options.yAxis.legend;
      textLegend.setAttribute('class', 'chart__axis-legend chart__axis-legend--y js-chart__axis-legend--y');
      chart.svg.appendChild(textLegend);

      var yLegend = chart.element.getElementsByClassName('js-chart__axis-legend--y')[0];
      if(isVisible(yLegend)) {
        var height = yLegend.getBBox().height,
          xPosition = chart.leftDelta + height/2,
          yPosition = chart.topDelta;
    
        Util.setAttributes(yLegend, {x: xPosition, y: yPosition});
        chart.leftDelta = chart.leftDelta + height + chart.svgPadding;
      }
    }
    // get interval and create scale
    var yLabels;
    if(chart.options.yAxis && chart.options.yAxis.labels && chart.options.yAxis.labels.length > 1) {
      yLabels = chart.options.yAxis.labels;
      chart.yAxisInterval = [0, chart.options.yAxis.labels.length - 1];
    } else {
      yLabels = getChartYLabels(chart); // this function is used to set chart.yAxisInterval as well
    }

    // modify axis labels
    if(chart.options.yAxis && chart.options.yAxis.labelModifier) {
      yLabels = modifyAxisLabel(yLabels, chart.options.yAxis.labelModifier);
    } 

    var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    Util.setAttributes(gEl, {class: 'chart__axis-labels chart__axis-labels--y js-chart__axis-labels--y'});

    for(var i = yLabels.length - 1; i >= 0; i--) {
      var textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      var labelClasses = (chart.options.yAxis && chart.options.yAxis.labels) ? 'chart__axis-label chart__axis-label--y js-chart__axis-label' : 'is-hidden js-chart__axis-label';
      Util.setAttributes(textEl, {class: labelClasses, 'alignment-baseline': 'middle'});
      textEl.textContent = yLabels[i];
      gEl.appendChild(textEl);
    }

    if(chart.options.yAxis && chart.options.yAxis.line) {
      var lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      Util.setAttributes(lineEl, {class: 'chart__axis chart__axis--y js-chart__axis--y', 'stroke-linecap': 'square'});
      gEl.appendChild(lineEl);
    }

    var hideGuides = chart.options.xAxis && chart.options.xAxis.hasOwnProperty('guides') && !chart.options.xAxis.guides;
    for(var i = 1; i < yLabels.length; i++ ) {
      var rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      Util.setAttributes(rectEl, {class: 'chart__guides js-chart__guides'});
      if(hideGuides) {
        Util.setAttributes(rectEl, {class: 'chart__guides js-chart__guides opacity-0'});
      }
      gEl.appendChild(rectEl);
    }
    chart.svg.appendChild(gEl);
  };

  function updateChartWidth(chart) {
    var labels = chart.element.getElementsByClassName('js-chart__axis-labels--y')[0].querySelectorAll('.js-chart__axis-label');

    if(isVisible(labels[0])) {
      chart.yChartMaxWidth = getLabelMaxSize(labels, 'width');
      chart.leftDelta = chart.leftDelta + chart.svgPadding + chart.yChartMaxWidth + chart.svgPadding;
    } else {
      chart.leftDelta = chart.leftDelta + chart.svgPadding;
    }

    var xLabels = chart.element.getElementsByClassName('js-chart__axis-labels--x')[0].querySelectorAll('.js-chart__axis-label');
    if(isVisible(xLabels[0]) && !isVisible(labels[0])) {
      chart.leftDelta = chart.leftDelta + xLabels[0].getBBox().width*0.5;
    }
  };

  function placeyAxisLabels(chart) {
    var labels = chart.element.getElementsByClassName('js-chart__axis-labels--y')[0].querySelectorAll('.js-chart__axis-label');

    var labelsVisible = isVisible(labels[0]);
    var height = 0;
    if(labelsVisible) height = labels[0].getBBox().height*0.5;
    
    // update topDelta and set chart height
    chart.topDelta = chart.topDelta + height + chart.svgPadding;
    chart.yAxisHeight = chart.height - chart.topDelta - chart.bottomDelta;

    var yDelta = chart.yAxisHeight/(labels.length - 1);

    var gridRect = chart.element.getElementsByClassName('js-chart__guides'),
      dasharray = ""+chart.xAxisWidth+" "+(2*(chart.xAxisWidth + yDelta))+"";

    for(var i = 0; i < labels.length; i++) {
      var labelWidth = 0;
      if(labelsVisible) labelWidth = labels[i].getBBox().width;
      // chart.leftDelta has already been updated in updateChartWidth() function
      Util.setAttributes(labels[i], {x: chart.leftDelta - labelWidth - 2*chart.svgPadding, y: chart.topDelta + yDelta*i });
      // place grid rectangles
      if(gridRect[i]) Util.setAttributes(gridRect[i], {x: chart.leftDelta, y: chart.topDelta + yDelta*i, height: yDelta, width: chart.xAxisWidth, 'stroke-dasharray': dasharray});
    }

    // place the y axis
    var yAxis = chart.element.getElementsByClassName('js-chart__axis--y');
    if(yAxis.length > 0) {
      Util.setAttributes(yAxis[0], {x1: chart.leftDelta, x2: chart.leftDelta, y1: chart.topDelta, y2: chart.topDelta + chart.yAxisHeight})
    }
    // center y axis label
    var yLegend = chart.element.getElementsByClassName('js-chart__axis-legend--y');
    if(yLegend.length > 0 && isVisible(yLegend[0]) ) {
      var position = yLegend[0].getBBox(),
        height = position.height,
        yPosition = position.y + 0.5*(chart.yAxisHeight + position.width),
        xPosition = position.x + height/4;
      
      Util.setAttributes(yLegend[0], {y: yPosition, x: xPosition, transform: 'rotate(-90 '+(position.x + height)+' '+(yPosition + height/2)+')'});
    }
  };

  function placexAxisLabels(chart) {
    var labels = chart.element.getElementsByClassName('js-chart__axis-labels--x')[0].querySelectorAll('.js-chart__axis-label');
    var ticks = chart.element.getElementsByClassName('js-chart__tick-x');

    // increase rightDelta value
    var labelWidth = 0,
      labelsVisible = isVisible(labels[labels.length - 1]);
    if(labelsVisible) labelWidth = labels[labels.length - 1].getBBox().width;
    if(chart.options.type != 'column') {
      chart.rightDelta = chart.rightDelta + labelWidth*0.5 + chart.svgPadding;
    } else {
      chart.rightDelta = chart.rightDelta + 4;
    }
    chart.xAxisWidth = chart.width - chart.leftDelta - chart.rightDelta;
    

    var maxHeight = getLabelMaxSize(labels, 'height'),
      maxWidth = getLabelMaxSize(labels, 'width'),
      xDelta = chart.xAxisWidth/(labels.length - 1);

    if(chart.options.type == 'column') xDelta = chart.xAxisWidth/labels.length;

    var totWidth = 0,
      height = 0;
    if(labelsVisible)  height = labels[0].getBBox().height;

    for(var i = 0; i < labels.length; i++) {
      var width = 0;
      if(labelsVisible) width = labels[i].getBBox().width;
      // label
      Util.setAttributes(labels[i], {y: chart.height - chart.bottomDelta - height/2, x: chart.leftDelta + xDelta*i - width/2});
      // tick
      Util.setAttributes(ticks[i], {y1: chart.height - chart.bottomDelta - maxHeight - chart.svgPadding, y2: chart.height - chart.bottomDelta - maxHeight - chart.svgPadding + 5, x1: chart.leftDelta + xDelta*i, x2: chart.leftDelta + xDelta*i});
      totWidth = totWidth + width + 4;
    }
    // for columns chart -> there's an additional tick element
    if(chart.options.type == 'column' && ticks[labels.length]) {
      Util.setAttributes(ticks[labels.length], {y1: chart.height - chart.bottomDelta - maxHeight - chart.svgPadding, y2: chart.height - chart.bottomDelta - maxHeight - chart.svgPadding + 5, x1: chart.leftDelta + xDelta*labels.length, x2: chart.leftDelta + xDelta*labels.length});
    }
    //check if we need to rotate chart label -> not enough space
    if(totWidth >= chart.xAxisWidth) {
      chart.xAxisLabelRotation = true;
      rotatexAxisLabels(chart, labels, ticks, maxWidth - maxHeight);
      maxHeight = maxWidth;
    } else {
      chart.xAxisLabelRotation = false;
    }

    chart.bottomDelta = chart.bottomDelta + chart.svgPadding + maxHeight;

    // place the x axis
    var xAxis = chart.element.getElementsByClassName('js-chart__axis--x');
    if(xAxis.length > 0) {
      Util.setAttributes(xAxis[0], {x1: chart.leftDelta, x2: chart.width - chart.rightDelta, y1: chart.height - chart.bottomDelta, y2: chart.height - chart.bottomDelta})
    }

    // center x-axis label
    var xLegend = chart.element.getElementsByClassName('js-chart__axis-legend--x');
    if(xLegend.length > 0 && isVisible(xLegend[0])) {
      xLegend[0].setAttribute('x', chart.leftDelta + 0.5*(chart.xAxisWidth - xLegend[0].getBBox().width));
    }
  };

  function rotatexAxisLabels(chart, labels, ticks, delta) {
    // there's not enough horiziontal space -> we need to rotate the x axis labels
    for(var i = 0; i < labels.length; i++) {
      var dimensions = labels[i].getBBox(),
        xCenter = parseFloat(labels[i].getAttribute('x')) + dimensions.width/2,
        yCenter = parseFloat(labels[i].getAttribute('y'))  - delta;

      Util.setAttributes(labels[i], {y: parseFloat(labels[i].getAttribute('y')) - delta, transform: 'rotate(-45 '+xCenter+' '+yCenter+')'});

      ticks[i].setAttribute('transform', 'translate(0 -'+delta+')');
    }
    if(ticks[labels.length]) ticks[labels.length].setAttribute('transform', 'translate(0 -'+delta+')');
  };

  function setChartDatasets(chart) {
    var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gEl.setAttribute('class', 'chart__dataset js-chart__dataset');
    chart.datasetScaled = [];
    for(var i = 0; i < chart.options.datasets.length; i++) {
      var gSet = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gSet.setAttribute('class', 'chart__set chart__set--'+(i+1)+' js-chart__set');
      chart.datasetScaled[i] = JSON.parse(JSON.stringify(chart.options.datasets[i].data));
      chart.datasetScaled[i] = getChartData(chart, chart.datasetScaled[i]);
      chart.datasetScaledFlat[i] = JSON.parse(JSON.stringify(chart.datasetScaled[i]));
      if(chart.options.type == 'area') {
        chart.datasetAreaScaled[i] = getAreaPointsFromLine(chart, chart.datasetScaled[i]);
        chart.datasetAreaScaledFlat[i] = JSON.parse(JSON.stringify(chart.datasetAreaScaled[i]));
      }
      if(!chart.loaded && chart.options.animate) {
        flatDatasets(chart, i);
      }
      gSet.appendChild(getPath(chart, chart.datasetScaledFlat[i], chart.datasetAreaScaledFlat[i], i));
      gSet.appendChild(getMarkers(chart, chart.datasetScaled[i], i));
      gEl.appendChild(gSet);
    }
    
    chart.svg.appendChild(gEl);
  };

  function getChartData(chart, data) {
    var multiSet = data[0].length > 1;
    var points = multiSet ? data : addXData(data); // addXData is used for one-dimension dataset; e.g. [2, 4, 6] rather than [[2, 4], [4, 7]]
    
    // xOffsetChart used for column chart type onlymodified
    var xOffsetChart = chart.xAxisWidth/(points.length-1) - chart.xAxisWidth/points.length;
    // now modify the points to coordinate relative to the svg 
    for(var i = 0; i < points.length; i++) {
      var xNewCoordinate = chart.leftDelta + chart.xAxisWidth*(points[i][0] - chart.xAxisInterval[0])/(chart.xAxisInterval[1] - chart.xAxisInterval[0]),
        yNewCoordinate = chart.height - chart.bottomDelta - chart.yAxisHeight*(points[i][1] - chart.yAxisInterval[0])/(chart.yAxisInterval[1] - chart.yAxisInterval[0]);
      if(chart.options.type == 'column') {
        xNewCoordinate = xNewCoordinate - i*xOffsetChart;
      }
      points[i] = [xNewCoordinate, yNewCoordinate];
    }
    return points;
  };

  function getPath(chart, points, areaPoints, index) {
    var pathCode = chart.options.smooth ? getSmoothLine(points, false) : getStraightLine(points);
    
    var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
      pathL = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
    Util.setAttributes(pathL, {d: pathCode, class: 'chart__data-line chart__data-line--'+(index+1)+' js-chart__data-line--'+(index+1)});

    if(chart.options.type == 'area') {
      var areaCode = chart.options.smooth ? getSmoothLine(areaPoints, true) : getStraightLine(areaPoints);
      var pathA = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      Util.setAttributes(pathA, {d: areaCode, class: 'chart__data-fill chart__data-fill--'+(index+1)+' js-chart__data-fill--'+(index+1)});
      gEl.appendChild(pathA);
    }
   
    gEl.appendChild(pathL);
    return gEl;
  };

  function getStraightLine(points) {
    var dCode = '';
    for(var i = 0; i < points.length; i++) {
      dCode = (i == 0) ? 'M '+points[0][0]+','+points[0][1] : dCode+ ' L '+points[i][0]+','+points[i][1];
    }
    return dCode;
  };

  function flatDatasets(chart, index) {
    var bottomY = getBottomFlatDatasets(chart);
    for(var i = 0; i < chart.datasetScaledFlat[index].length; i++) {
      chart.datasetScaledFlat[index][i] = [chart.datasetScaled[index][i][0], bottomY];
    }
    if(chart.options.type == 'area') {
      chart.datasetAreaScaledFlat[index] = getAreaPointsFromLine(chart, chart.datasetScaledFlat[index]);
    }
  };

  // https://medium.com/@francoisromain/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
  function getSmoothLine(points, bool) {
    var dCode = '';
    var maxVal = points.length;
    var pointsLoop = JSON.parse(JSON.stringify(points));
    if(bool) {
      maxVal = maxVal - 3;
      pointsLoop.splice(-3, 3);
    }
    for(var i = 0; i < maxVal; i++) {
      if(i == 0) dCode = 'M '+points[0][0]+','+points[0][1];
      else dCode = dCode + ' '+bezierCommand(points[i], i, pointsLoop);
    }
    if(bool) {
      for(var j = maxVal; j < points.length; j++) {
        dCode = dCode + ' L '+points[j][0]+','+points[j][1];
      }
    }
    return dCode;
  };  
  
  function pathLine(pointA, pointB) {
    var lengthX = pointB[0] - pointA[0];
    var lengthY = pointB[1] - pointA[1];

    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    };
  };

  function pathControlPoint(current, previous, next, reverse) {
    var p = previous || current;
    var n = next || current;
    var smoothing = 0.2;
    var o = pathLine(p, n);

    var angle = o.angle + (reverse ? Math.PI : 0);
    var length = o.length * smoothing;

    var x = current[0] + Math.cos(angle) * length;
    var y = current[1] + Math.sin(angle) * length;
    return [x, y];
  };

  function bezierCommand(point, i, a) {
    var cps =  pathControlPoint(a[i - 1], a[i - 2], point);
    var cpe = pathControlPoint(point, a[i - 1], a[i + 1], true);
    return "C "+cps[0]+','+cps[1]+' '+cpe[0]+','+cpe[1]+' '+point[0]+','+point[1];
  };

  function getAreaPointsFromLine(chart, array) {
    var points = JSON.parse(JSON.stringify(array)),
      firstPoint = points[0],
      lastPoint = points[points.length -1];

    var boottomY = getBottomFlatDatasets(chart); 
    points.push([lastPoint[0], boottomY]);
    points.push([chart.leftDelta, boottomY]);
    points.push([chart.leftDelta, firstPoint[1]]);
    return points;
  };

  function getBottomFlatDatasets(chart) {
    var bottom = chart.height - chart.bottomDelta;
    if(chart.options.fillOrigin ) {
      bottom = chart.height - chart.bottomDelta - chart.yAxisHeight*(0 - chart.yAxisInterval[0])/(chart.yAxisInterval[1] - chart.yAxisInterval[0]);
    }
    if(chart.options.type && chart.options.type == 'column') {
      bottom = chart.yZero; 
    }
    return bottom;
  };

  function getMarkers(chart, points, index) {
    // see if we need to show tooltips 
    var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var xOffset = 0;
    if(chart.options.type == 'column') {
      xOffset = 0.5*chart.xAxisWidth/points.length;
    }
    for(var i = 0; i < points.length; i++) {
      var marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      Util.setAttributes(marker, {class: 'chart__marker js-chart__marker chart__marker--'+(index+1), cx: points[i][0] + xOffset, cy: points[i][1], r: 2, 'data-set': index, 'data-index': i});
      gEl.appendChild(marker);
    }
    return gEl;
  };

  function addXData(data) {
    var multiData = [];
    for(var i = 0; i < data.length; i++) {
      multiData.push([i, data[i]]);
    }
    return multiData;
  };

  function createSrTables(chart) {
    // create a table element for accessibility reasons
    var table = '<div class="chart__sr-table sr-only">';
    for(var i = 0; i < chart.options.datasets.length; i++) {
      table = table + createDataTable(chart, i);
    }
    table = table + '</div>';
    chart.element.insertAdjacentHTML('afterend', table);
  };

  function createDataTable(chart, index) {
    var tableTitle = (chart.categories.length > index ) ? 'aria-label="'+chart.categories.length[index].textContent+'"': '';
    var table = '<table '+tableTitle+'><thead><tr>';
    table = (chart.options.xAxis && chart.options.xAxis.legend) 
      ? table + '<th scope="col">'+chart.options.xAxis.legend+'</th>'
      : table + '<th scope="col"></th>';
      
    table = (chart.options.yAxis && chart.options.yAxis.legend) 
      ? table + '<th scope="col">'+chart.options.yAxis.legend+'</th>'
      : table + '<th scope="col"></th>';

    table = table + '</thead><tbody>';
    var multiset = chart.options.datasets[index].data[0].length > 1,
      xAxisLabels = chart.options.xAxis && chart.options.xAxis.labels && chart.options.xAxis.labels.length > 1;
    for(var i = 0; i < chart.options.datasets[index].data.length; i++) {
      table = table + '<tr>';
      if(multiset) {
        table = table + '<td role="cell">'+chart.options.datasets[index].data[i][0]+'</td><td role="cell">'+chart.options.datasets[index].data[i][1]+'</td>';
      } else {
        var xValue = xAxisLabels ? chart.options.xAxis.labels[i]: (i + 1);
        table = table + '<td role="cell">'+xValue+'</td><td role="cell">'+chart.options.datasets[index].data[i]+'</td>';
      }
      table = table + '</tr>';
    }
    table = table + '</tbody></table>';
    return table;
  }

  function getChartYLabels(chart) {
    var labels = [],
      intervals = 0;
    if(chart.options.yAxis && chart.options.yAxis.range && chart.options.yAxis.step) {
      intervals = Math.ceil((chart.options.yAxis.range[1] - chart.options.yAxis.range[0])/chart.options.yAxis.step);
      for(var i = 0; i <= intervals; i++) {
        labels.push(chart.options.yAxis.range[0] + chart.options.yAxis.step*i);
      }
      chart.yAxisInterval = [chart.options.yAxis.range[0], chart.options.yAxis.range[1]];
    } else {
      var columnChartStacked = (chart.options.type && chart.options.type == 'column' && chart.options.stacked);
      if(columnChartStacked) setDatasetsSum(chart);
      var min = columnChartStacked ? getColStackedMinDataValue(chart) : getMinDataValue(chart, true);
      var max = columnChartStacked ? getColStackedMaxDataValue(chart) : getMaxDataValue(chart, true);
      var niceScale = new NiceScale(min, max, 5);
      var intervals = Math.ceil((niceScale.getNiceUpperBound() - niceScale.getNiceLowerBound()) /niceScale.getTickSpacing());

      for(var i = 0; i <= intervals; i++) {
        labels.push(niceScale.getNiceLowerBound() + niceScale.getTickSpacing()*i);
      }
      chart.yAxisInterval = [niceScale.getNiceLowerBound(), niceScale.getNiceUpperBound()];
    }
    return labels;
  };

  function getChartXLabels(chart) {
    var labels = [],
      intervals = 0;
    if(chart.options.xAxis && chart.options.xAxis.range && chart.options.xAxis.step) {
      intervals = Math.ceil((chart.options.xAxis.range[1] - chart.options.xAxis.range[0])/chart.options.xAxis.step);
      for(var i = 0; i <= intervals; i++) {
        labels.push(chart.options.xAxis.range[0] + chart.options.xAxis.step*i);
      }
      chart.xAxisInterval = [chart.options.xAxis.range[0], chart.options.xAxis.range[1]];
    } else if(!chart.options.datasets[0].data[0].length || chart.options.datasets[0].data[0].length < 2) {
      // data sets are passed with a single value (y axis only)
      chart.xAxisInterval = [0, chart.options.datasets[0].data.length - 1];
      for(var i = 0; i < chart.options.datasets[0].data.length; i++) {
        labels.push(i);
      }
    } else {
      var min = getMinDataValue(chart, false);
      var max = getMaxDataValue(chart, false);
      var niceScale = new NiceScale(min, max, 5);
      var intervals = Math.ceil((niceScale.getNiceUpperBound() - niceScale.getNiceLowerBound()) /niceScale.getTickSpacing());

      for(var i = 0; i <= intervals; i++) {
        labels.push(niceScale.getNiceLowerBound() + niceScale.getTickSpacing()*i);
      }
      chart.xAxisInterval = [niceScale.getNiceLowerBound(), niceScale.getNiceUpperBound()];
    }
    return labels;
  };

  function modifyAxisLabel(labels, fnModifier) {
    for(var i = 0; i < labels.length; i++) {
      labels[i] = fnModifier(labels[i]);
    }

    return labels;
  };

  function getLabelMaxSize(labels, dimesion) {
    if(!isVisible(labels[0])) return 0;
    var size = 0;
    for(var i = 0; i < labels.length; i++) {
      var labelSize = labels[i].getBBox()[dimesion];
      if(labelSize > size) size = labelSize;
    };  
    return size;
  };

  function getMinDataValue(chart, bool) { // bool = true for y axis
    var minArray = [];
    for(var i = 0; i < chart.options.datasets.length; i++) {
      minArray.push(getMin(chart.options.datasets[i].data, bool));
    }
    return Math.min.apply(null, minArray);
  };

  function getMaxDataValue(chart, bool) { // bool = true for y axis
    var maxArray = [];
    for(var i = 0; i < chart.options.datasets.length; i++) {
      maxArray.push(getMax(chart.options.datasets[i].data, bool));
    }
    return Math.max.apply(null, maxArray);
  };

  function setDatasetsSum(chart) {
    // sum all datasets -> this is used for column and bar charts
    chart.datasetsSum = [];
    for(var i = 0; i < chart.options.datasets.length; i++) {
      for(var j = 0; j < chart.options.datasets[i].data.length; j++) {
        chart.datasetsSum[j] = (i == 0) ? chart.options.datasets[i].data[j] : chart.datasetsSum[j] + chart.options.datasets[i].data[j];
      }
    } 
  };

  function getColStackedMinDataValue(chart) {
    var min = Math.min.apply(null, chart.datasetsSum);
    if(min > 0) min = 0;
    return min;
  };

  function getColStackedMaxDataValue(chart) {
    var max = Math.max.apply(null, chart.datasetsSum);
    if(max < 0) max = 0;
    return max;
  };

  function getMin(array, bool) {
    var min;
    var multiSet = array[0].length > 1;
    for(var i = 0; i < array.length; i++) {
      var value;
      if(multiSet) {
        value = bool ? array[i][1] : array[i][0];
      } else {
        value = array[i];
      }
      if(i == 0) {min = value;}
      else if(value < min) {min = value;}
    }
    return min;
  };

  function getMax(array, bool) {
    var max;
    var multiSet = array[0].length > 1;
    for(var i = 0; i < array.length; i++) {
      var value;
      if(multiSet) {
        value = bool ? array[i][1] : array[i][0];
      } else {
        value = array[i];
      }
      if(i == 0) {max = value;}
      else if(value > max) {max = value;}
    }
    return max;
  };

  // https://gist.github.com/igodorogea/4f42a95ea31414c3a755a8b202676dfd
  function NiceScale (lowerBound, upperBound, _maxTicks) {
    var maxTicks = _maxTicks || 10;
    var tickSpacing;
    var range;
    var niceLowerBound;
    var niceUpperBound;
  
    calculate();
  
    this.setMaxTicks = function (_maxTicks) {
      maxTicks = _maxTicks;
      calculate();
    };
  
    this.getNiceUpperBound = function() {
      return niceUpperBound;
    };
  
    this.getNiceLowerBound = function() {
      return niceLowerBound;
    };
  
    this.getTickSpacing = function() {
      return tickSpacing;
    };
  
    function setMinMaxPoints (min, max) {
      lowerBound = min;
      upperBound = max;
      calculate();
    }
  
    function calculate () {
      range = niceNum(upperBound - lowerBound, false);
      tickSpacing = niceNum(range / (maxTicks - 1), true);
      niceLowerBound = Math.floor(lowerBound / tickSpacing) * tickSpacing;
      niceUpperBound = Math.ceil(upperBound / tickSpacing) * tickSpacing;
    }
  
    function niceNum (range, round) {
      // var exponent = Math.floor(Math.log10(range));
      var exponent = Math.floor(Math.log(range) * Math.LOG10E);
      var fraction = range / Math.pow(10, exponent);
      var niceFraction;
  
      if (round) {
        if (fraction < 1.5) niceFraction = 1;
        else if (fraction < 3) niceFraction = 2;
        else if (fraction < 7) niceFraction = 5;
        else niceFraction = 10;
      } else {
        if (fraction <= 1) niceFraction = 1;
        else if (fraction <= 2) niceFraction = 2;
        else if (fraction <= 5) niceFraction = 5;
        else niceFraction = 10;
      }
  
      return niceFraction * Math.pow(10, exponent);
    }
  };

  function initTooltips(chart) {
    if(!intObservSupported) return;

    chart.markers = [];
    chart.bars = []; // this is for column/bar charts only
    var chartSets = chart.element.getElementsByClassName('js-chart__set');
    for(var i = 0; i < chartSets.length; i++) {
      chart.markers[i] = chartSets[i].querySelectorAll('.js-chart__marker');
      if(chart.options.type && chart.options.type == 'column') {
        chart.bars[i] = chartSets[i].querySelectorAll('.js-chart__data-bar');
      }
    }
    
    // create tooltip line
    if(chart.options.yIndicator) {
      var tooltipLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      Util.setAttributes(tooltipLine, {x1: 0, y1: chart.topDelta, x2: 0, y2: chart.topDelta + chart.yAxisHeight, transform: 'translate('+chart.leftDelta+' '+chart.topDelta+')', class: 'chart__y-indicator js-chart__y-indicator is-hidden'});
      chart.svg.insertBefore(tooltipLine, chart.element.getElementsByClassName('js-chart__dataset')[0]);
      chart.interLine = chart.element.getElementsByClassName('js-chart__y-indicator')[0];
    }
    
    // create tooltip
    if(chart.tooltipOn) {
      var tooltip = document.createElement('div');
      tooltip.setAttribute('class', 'chart__tooltip js-chart__tooltip is-hidden '+chart.tooltipClasses);
      chart.element.appendChild(tooltip);
      chart.tooltip = chart.element.getElementsByClassName('js-chart__tooltip')[0];
    }
    initChartHover(chart);
  };

  function initChartHover(chart) {
    if(!chart.options.yIndicator && !chart.tooltipOn) return;
    // init hover effect
    chart.chartArea = chart.element.getElementsByClassName('js-chart__axis-labels--y')[0];
    chart.eventIds['hover'] = handleEvent.bind(chart);
    chart.chartArea.addEventListener('mouseenter', chart.eventIds['hover']);
    chart.chartArea.addEventListener('mousemove', chart.eventIds['hover']);
    chart.chartArea.addEventListener('mouseleave', chart.eventIds['hover']);
    if(!SwipeContent) return;
    new SwipeContent(chart.element);
    chart.element.addEventListener('dragStart', chart.eventIds['hover']);
    chart.element.addEventListener('dragging', chart.eventIds['hover']);
    chart.element.addEventListener('dragEnd', chart.eventIds['hover']);
  };

  function hoverChart(chart, event) {
    if(chart.hovering) return;
    if(!chart.options.yIndicator && !chart.tooltipOn) return;
    chart.hovering = true;
    var selectedMarker = getSelectedMarker(chart, event);
    if(selectedMarker === false) return;
    if(selectedMarker !== chart.selectedMarker) {
      resetMarkers(chart, false);
      resetBars(chart, false);

      chart.selectedMarker = selectedMarker;
      resetMarkers(chart, true);
      resetBars(chart, true);
      var markerSize = chart.markers[0][chart.selectedMarker].getBBox();
      
      if(chart.options.yIndicator) {
        Util.removeClass(chart.interLine, 'is-hidden');
        chart.interLine.setAttribute('transform', 'translate('+(markerSize.x + markerSize.width/2)+' 0)');
      }
      
      if(chart.tooltipOn) {
        Util.removeClass(chart.tooltip, 'is-hidden');
        setTooltipHTML(chart);
        placeTooltip(chart);
      }
    }
    updateExternalData(chart);
    chart.hovering = false;
  };

  function getSelectedMarker(chart, event) {
    if(chart.markers[0].length < 1) return false;
    var clientX = event.detail.x ? event.detail.x : event.clientX;
    var xposition =  clientX - chart.svg.getBoundingClientRect().left;
    var marker = 0,
      deltaX = Math.abs(chart.markers[0][0].getBBox().x - xposition);
    for(var i = 1; i < chart.markers[0].length; i++) {
      var newDeltaX = Math.abs(chart.markers[0][i].getBBox().x - xposition);
      if(newDeltaX < deltaX) {
        deltaX = newDeltaX;
        marker = i;
      }
    }
    return marker;
  };

  function resetTooltip(chart) {
    if(chart.hoverId) {
      (window.requestAnimationFrame) ? window.cancelAnimationFrame(chart.hoverId) : clearTimeout(chart.hoverId);
      chart.hoverId = false;
    }
    if(chart.tooltipOn) Util.addClass(chart.tooltip, 'is-hidden');
    if(chart.options.yIndicator)Util.addClass(chart.interLine, 'is-hidden');
    resetMarkers(chart, false);
    resetBars(chart, false);
    chart.selectedMarker = false;
    resetExternalData(chart);
    chart.hovering = false;
  };

  function resetMarkers(chart, bool) {
    for(var i = 0; i < chart.markers.length; i++) {
      if(chart.markers[i] && chart.markers[i][chart.selectedMarker]) Util.toggleClass(chart.markers[i][chart.selectedMarker], chart.selectedMarkerClass, bool);
    }
  };

  function resetBars(chart, bool) {
    // for column/bar chart -> change opacity on hover
    if(!chart.options.type || chart.options.type != 'column') return;
    for(var i = 0; i < chart.bars.length; i++) {
      if(chart.bars[i] && chart.bars[i][chart.selectedMarker]) Util.toggleClass(chart.bars[i][chart.selectedMarker], chart.selectedBarClass, bool);
    }
  };

  function setTooltipHTML(chart) {
    var selectedMarker = chart.markers[0][chart.selectedMarker];
    chart.tooltip.innerHTML = getTooltipHTML(chart, selectedMarker.getAttribute('data-index'), selectedMarker.getAttribute('data-set'));
  };

  function getTooltipHTML(chart, index, setIndex) {
    var htmlContent = '';
    if(chart.options.tooltip.customHTML) {
      htmlContent = chart.options.tooltip.customHTML(index, chart.options, setIndex);
    } else {
      var multiVal = chart.options.datasets[setIndex].data[index].length > 1;
      if(chart.options.xAxis && chart.options.xAxis.labels && chart.options.xAxis.labels.length > 1) {
        htmlContent = chart.options.xAxis.labels[index] +' - ';
      } else if(multiVal) {
        htmlContent = chart.options.datasets[setIndex].data[index][0] +' - ';
      }
      htmlContent = (multiVal) 
        ? htmlContent + chart.options.datasets[setIndex].data[index][1] 
        : htmlContent + chart.options.datasets[setIndex].data[index];
    }   
    return htmlContent;
  };

  function placeTooltip(chart) {
    var selectedMarker = chart.markers[0][chart.selectedMarker];
    var markerPosition = selectedMarker.getBoundingClientRect();
    var markerPositionSVG = selectedMarker.getBBox();
    var svgPosition = chart.svg.getBoundingClientRect();

    if(chart.options.type == 'column') {
      tooltipPositionColumnChart(chart, selectedMarker, markerPosition, markerPositionSVG);
    } else {
      tooltipPositionChart(chart, markerPosition, markerPositionSVG, svgPosition.left, svgPosition.width);
    }
  };

  function tooltipPositionChart(chart, markerPosition, markerPositionSVG, svgPositionLeft, svgPositionWidth) {
    // set top/left/transform of the tooltip for line/area charts
    // horizontal position
    if(markerPosition.left - svgPositionLeft <= svgPositionWidth/2) {
      chart.tooltip.style.left = (markerPositionSVG.x + markerPositionSVG.width + 2)+'px';
      chart.tooltip.style.right = 'auto';
      chart.tooltip.style.transform = 'translateY(-100%)';
    } else {
      chart.tooltip.style.left = 'auto';
      chart.tooltip.style.right = (svgPositionWidth - markerPositionSVG.x + 2)+'px';
      chart.tooltip.style.transform = 'translateY(-100%)'; 
    }
    // vertical position
    if(!chart.tooltipPosition) {
      chart.tooltip.style.top = markerPositionSVG.y +'px';
    } else if(chart.tooltipPosition == 'top') {
      chart.tooltip.style.top = (chart.topDelta + chart.tooltip.getBoundingClientRect().height + 5) +'px';
      chart.tooltip.style.bottom = 'auto';
    } else {
      chart.tooltip.style.top = 'auto';
      chart.tooltip.style.bottom = (chart.bottomDelta + 5)+'px';
      chart.tooltip.style.transform = ''; 
    }
  };

  function tooltipPositionColumnChart(chart, marker, markerPosition, markerPositionSVG) {
    // set top/left/transform of the tooltip for column charts
    chart.tooltip.style.left = (markerPositionSVG.x + markerPosition.width/2)+'px';
    chart.tooltip.style.right = 'auto';
    chart.tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
    if(!chart.tooltipPosition) {
      if(parseInt(marker.getAttribute('cy')) > chart.yZero) {
        // negative value -> move tooltip below the bar
        chart.tooltip.style.top = (markerPositionSVG.y + markerPositionSVG.height + 6) +'px';
        chart.tooltip.style.transform = 'translateX(-50%)';
      } else {
        chart.tooltip.style.top = (markerPositionSVG.y - 6) +'px';
      }
    } else if(chart.tooltipPosition == 'top') {
      chart.tooltip.style.top = (chart.topDelta + chart.tooltip.getBoundingClientRect().height + 5) +'px';
      chart.tooltip.style.bottom = 'auto';
    } else {
      chart.tooltip.style.bottom = (chart.bottomDelta + 5)+'px';
      chart.tooltip.style.top = 'auto';
      chart.tooltip.style.transform = 'translateX(-50%)';
    }
  };

  function animateChart(chart) {
    if(!chart.options.animate) return;
    var observer = new IntersectionObserver(chartObserve.bind(chart), {rootMargin: "0px 0px -200px 0px"});
    observer.observe(chart.element);
  };

  function chartObserve(entries, observer) { // observe chart position -> start animation when inside viewport
    if(entries[0].isIntersecting) {
      triggerChartAnimation(this);
      observer.unobserve(this.element);
    }
  };

  function triggerChartAnimation(chart) {
    if(chart.options.type == 'line' || chart.options.type == 'area') {
      animatePath(chart, 'line');
      if(chart.options.type == 'area') animatePath(chart, 'fill');
    } else if(chart.options.type == 'column') {
      animateRectPath(chart, 'column');
    }
  };

  function animatePath(chart, type) {
    var currentTime = null,
      duration = 600;

    var startArray = chart.datasetScaledFlat,
      finalArray = chart.datasetScaled;

    if(type == 'fill') {
      startArray = chart.datasetAreaScaledFlat;
      finalArray = chart.datasetAreaScaled;
    }
        
    var animateSinglePath = function(timestamp){
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;
      for(var i = 0; i < finalArray.length; i++) {
        var points = [];
        var path = chart.element.getElementsByClassName('js-chart__data-'+type+'--'+(i+1))[0];
        for(var j = 0; j < finalArray[i].length; j++) {
          var val = Math.easeOutQuart(progress, startArray[i][j][1], finalArray[i][j][1]-startArray[i][j][1], duration);
          points[j] = [finalArray[i][j][0], val];
        }
        // get path and animate
        var pathCode = chart.options.smooth ? getSmoothLine(points, type == 'fill') : getStraightLine(points);
        path.setAttribute('d', pathCode);
      }
      if(progress < duration) {
        window.requestAnimationFrame(animateSinglePath);
      }
    };

    window.requestAnimationFrame(animateSinglePath);
  };

  function resizeChart(chart) {
    window.addEventListener('resize', function() {
      clearTimeout(chart.eventIds['resize']);
      chart.eventIds['resize'] = setTimeout(doneResizing, 300);
    });

    function doneResizing() {
      resetChartResize(chart);
      initChart(chart);
    };
  };

  function resetChartResize(chart) {
    chart.topDelta = 0;
    chart.bottomDelta = 0;
    chart.leftDelta = 0;
    chart.rightDelta = 0;
    chart.dragging = false;
    // reset event listeners
    if( chart.eventIds && chart.eventIds['hover']) {
      chart.chartArea.removeEventListener('mouseenter', chart.eventIds['hover']);
      chart.chartArea.removeEventListener('mousemove', chart.eventIds['hover']);
      chart.chartArea.removeEventListener('mouseleave', chart.eventIds['hover']);
      chart.element.removeEventListener('dragStart', chart.eventIds['hover']);
      chart.element.removeEventListener('dragging', chart.eventIds['hover']);
      chart.element.removeEventListener('dragEnd', chart.eventIds['hover']);
    }
  };

  function handleEvent(event) {
		switch(event.type) {
			case 'mouseenter':
				hoverChart(this, event);
        break;
			case 'mousemove':
      case 'dragging':   
        var self = this;
				self.hoverId  = window.requestAnimationFrame 
          ? window.requestAnimationFrame(function(){hoverChart(self, event)})
          : setTimeout(function(){hoverChart(self, event);});
        break;
			case 'mouseleave':
      case 'dragEnd':
				resetTooltip(this);
        break;
		}
  };

  function isVisible(item) {
    return (item && item.getClientRects().length > 0);
  };

  function initExternalData(chart) {
    if(!chart.options.externalData) return;
    var chartId = chart.options.element.getAttribute('id');
    if(!chartId) return;
    chart.extDataX = [];
    chart.extDataXInit = [];
    chart.extDataY = [];
    chart.extDataYInit = [];
    if(chart.options.datasets.length > 1) {
      for(var i = 0; i < chart.options.datasets.length; i++) {
        chart.extDataX[i] = document.querySelectorAll('.js-ext-chart-data-x--'+(i+1)+'[data-chart="'+chartId+'"]');
        chart.extDataY[i] = document.querySelectorAll('.js-ext-chart-data-y--'+(i+1)+'[data-chart="'+chartId+'"]');
      }
    } else {
      chart.extDataX[0] = document.querySelectorAll('.js-ext-chart-data-x[data-chart="'+chartId+'"]');
      chart.extDataY[0] = document.querySelectorAll('.js-ext-chart-data-y[data-chart="'+chartId+'"]');
    }
    // store initial HTML contentent
    storeExternalDataContent(chart, chart.extDataX, chart.extDataXInit);
    storeExternalDataContent(chart, chart.extDataY, chart.extDataYInit);
  };

  function storeExternalDataContent(chart, elements, array) {
    for(var i = 0; i < elements.length; i++) {
      array[i] = [];
      if(elements[i][0]) array[i][0] = elements[i][0].innerHTML;
    }
  };

  function updateExternalData(chart) {
    if(!chart.extDataX || !chart.extDataY) return;
    var marker = chart.markers[0][chart.selectedMarker];
    if(!marker) return;
    var dataIndex = marker.getAttribute('data-index');
    var multiVal = chart.options.datasets[0].data[0].length > 1;
    for(var i = 0; i < chart.options.datasets.length; i++) {
      updateExternalDataX(chart, dataIndex, i, multiVal);
      updateExternalDataY(chart, dataIndex, i, multiVal);
    }
  };

  function updateExternalDataX(chart, dataIndex, setIndex, multiVal) {
    if( !chart.extDataX[setIndex] || !chart.extDataX[setIndex][0]) return;
    var value = '';
    if(chart.options.externalData.customXHTML) {
      value = chart.options.externalData.customXHTML(dataIndex, chart.options, setIndex);
    } else {
      if(chart.options.xAxis && chart.options.xAxis.labels && chart.options.xAxis.labels.length > 1) {
        value = chart.options.xAxis.labels[dataIndex];
      } else if(multiVal) {
        htmlContent = chart.options.datasets[setIndex].data[dataIndex][0];
      }
    }
    chart.extDataX[setIndex][0].innerHTML = value;
  };

  function updateExternalDataY(chart, dataIndex, setIndex, multiVal) {
    if( !chart.extDataY[setIndex] || !chart.extDataY[setIndex][0]) return;
    var value = '';
    if(chart.options.externalData.customYHTML) {
      value = chart.options.externalData.customYHTML(dataIndex, chart.options, setIndex);
    } else {
      if(multiVal) {
        value = chart.options.datasets[setIndex].data[dataIndex][1];
      } else {
        value = chart.options.datasets[setIndex].data[dataIndex];
      }
    }
    chart.extDataY[setIndex][0].innerHTML = value;
  };

  function resetExternalData(chart) {
    if(!chart.options.externalData) return;
    for(var i = 0; i < chart.options.datasets.length; i++) {
      if(chart.extDataX[i][0]) chart.extDataX[i][0].innerHTML = chart.extDataXInit[i][0];
      if(chart.extDataY[i][0]) chart.extDataY[i][0].innerHTML = chart.extDataYInit[i][0];
    }
  };

  function setChartColumnSize(chart) {
    chart.columnWidthPerc = 100;
    chart.columnGap = 0;
    if(chart.options.column && chart.options.column.width) {
      chart.columnWidthPerc = parseInt(chart.options.column.width);
    }
    if(chart.options.column && chart.options.column.gap) {
      chart.columnGap = parseInt(chart.options.column.gap);
    } 
  };

  function resetColumnChart(chart) {
    var labels = chart.element.getElementsByClassName('js-chart__axis-labels--x')[0].querySelectorAll('.js-chart__axis-label'),
      labelsVisible = isVisible(labels[labels.length - 1]),
      xDelta = chart.xAxisWidth/labels.length;
    
    // translate x axis labels
    if(labelsVisible) {
      moveXAxisLabels(chart, labels, 0.5*xDelta);
    }
    // set column width + separation gap between columns
    var columnsSpace = xDelta*chart.columnWidthPerc/100;
    if(chart.options.stacked) {
      chart.columnWidth = columnsSpace;
    } else {
      chart.columnWidth = (columnsSpace - chart.columnGap*(chart.options.datasets.length - 1) )/chart.options.datasets.length;
    }

    chart.columnDelta = (xDelta - columnsSpace)/2;
  };

  function moveXAxisLabels(chart, labels, delta) { 
    // this applies to column charts only
    // translate the xlabels to center them 
    if(chart.xAxisLabelRotation) return; // labels were rotated - no need to translate
    for(var i = 0; i < labels.length; i++) {
      Util.setAttributes(labels[i], {x: labels[i].getBBox().x + delta});
    }
  };

  function setColumnChartDatasets(chart) {
    var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gEl.setAttribute('class', 'chart__dataset js-chart__dataset');
    chart.datasetScaled = [];

    setColumnChartYZero(chart);
    
    for(var i = 0; i < chart.options.datasets.length; i++) {
      var gSet = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gSet.setAttribute('class', 'chart__set chart__set--'+(i+1)+' js-chart__set');
      chart.datasetScaled[i] = JSON.parse(JSON.stringify(chart.options.datasets[i].data));
      chart.datasetScaled[i] = getChartData(chart, chart.datasetScaled[i]);
      chart.datasetScaledFlat[i] = JSON.parse(JSON.stringify(chart.datasetScaled[i]));
      if(!chart.loaded && chart.options.animate) {
        flatDatasets(chart, i);
      }
      gSet.appendChild(getSvgColumns(chart, chart.datasetScaledFlat[i], i));
      gEl.appendChild(gSet);
      gSet.appendChild(getMarkers(chart, chart.datasetScaled[i], i));
    }
    
    chart.svg.appendChild(gEl);
  };

  function setColumnChartYZero(chart) {
    // if there are negative values -> make sre columns start from zero
    chart.yZero = chart.height - chart.bottomDelta;
    if(chart.yAxisInterval[0] < 0) {
      chart.yZero = chart.height - chart.bottomDelta + chart.yAxisHeight*(chart.yAxisInterval[0])/(chart.yAxisInterval[1] - chart.yAxisInterval[0]);
    }
  };

  function getSvgColumns(chart, dataset, index) {
    var gEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    for(var i = 0; i < dataset.length; i++) {
      var pathL = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var points = getColumnPoints(chart, dataset[i], index, i, chart.datasetScaledFlat);
      var lineType =  chart.options.column && chart.options.column.radius ? 'round' : 'square';
      if(lineType == 'round' && chart.options.stacked && index < chart.options.datasets.length - 1) lineType = 'square';
      var dPath = (lineType == 'round') ? getRoundedColumnRect(chart, points) : getStraightLine(points);
      Util.setAttributes(pathL, {d: dPath, class: 'chart__data-bar chart__data-bar--'+(index+1)+' js-chart__data-bar js-chart__data-bar--'+(index+1)});
      gEl.appendChild(pathL);
    }
    return gEl;
  };

  function getColumnPoints(chart, point, index, pointIndex, dataSetsAll) {
    var xOffset = chart.columnDelta + index*(chart.columnWidth + chart.columnGap),
      yOffset = 0;

    if(chart.options.stacked) {
      xOffset = chart.columnDelta;
      yOffset = getyOffsetColChart(chart, dataSetsAll, index, pointIndex);
    }

    return [ 
      [point[0] + xOffset, chart.yZero - yOffset],
      [point[0] + xOffset, point[1] - yOffset], 
      [point[0] + xOffset + chart.columnWidth, point[1] - yOffset],
      [point[0] + xOffset + chart.columnWidth, chart.yZero - yOffset]
    ];
  };

  function getyOffsetColChart(chart, dataSetsAll, index, pointIndex) {
    var offset = 0;
    for(var i = 0; i < index; i++) {
      if(dataSetsAll[i] && dataSetsAll[i][pointIndex]) offset = offset + (chart.height - chart.bottomDelta - dataSetsAll[i][pointIndex][1]);
    }
    return offset;
  };

  function getRoundedColumnRect(chart, points) {
    var radius = parseInt(chart.options.column.radius);
    var arcType = '0,0,1',
      deltaArc1 = '-',
      deltaArc2 = ',',
      rectHeight = points[1][1] + radius;
    if(chart.yAxisInterval[0] < 0 && points[1][1] > chart.yZero) {
      arcType = '0,0,0';
      deltaArc1 = ',';
      deltaArc2 = '-';
      rectHeight = points[1][1] - radius;
    }
    var dpath = 'M '+points[0][0]+' '+points[0][1];
    dpath = dpath + ' V '+rectHeight;
    dpath = dpath + ' a '+radius+','+radius+','+arcType+','+radius+deltaArc1+radius;
    dpath = dpath + ' H '+(points[2][0] - radius);
    dpath = dpath + ' a '+radius+','+radius+','+arcType+','+radius+deltaArc2+radius;
    dpath = dpath + ' V '+points[3][1];
    return dpath;
  };

  function animateRectPath(chart, type) {
    var currentTime = null,
      duration = 600;

    var startArray = chart.datasetScaledFlat,
      finalArray = chart.datasetScaled;
        
    var animateSingleRectPath = function(timestamp){
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;
      var multiSetPoint = [];
      for(var i = 0; i < finalArray.length; i++) {
        // multi sets
        var points = [];
        var paths = chart.element.getElementsByClassName('js-chart__data-bar--'+(i+1));
        var rectLine = chart.options.column && chart.options.column.radius ? 'round' : 'square';
        if(chart.options.stacked && rectLine == 'round' && i < finalArray.length - 1) rectLine = 'square'; 
        for(var j = 0; j < finalArray[i].length; j++) {
          var val = Math.easeOutQuart(progress, startArray[i][j][1], finalArray[i][j][1]-startArray[i][j][1], duration);
          points[j] = [finalArray[i][j][0], val];
          // get path and animate
          var rectPoints = getColumnPoints(chart, points[j], i, j, multiSetPoint);
          var dPath = (rectLine == 'round') ? getRoundedColumnRect(chart, rectPoints) : getStraightLine(rectPoints);
          paths[j].setAttribute('d', dPath);
        }

        multiSetPoint[i] = points;
      }
      if(progress < duration) {
        window.requestAnimationFrame(animateSingleRectPath);
      }
    };

    window.requestAnimationFrame(animateSingleRectPath);
  };

  function getPieSvgCode(chart) {

  };

  function getDoughnutSvgCode(chart) {

  };

  Chart.defaults = {
    element : '',
    type: 'line', // can be line, area, bar
    xAxis: {},
    yAxis: {},
    datasets: [],
    tooltip: {
      enabled: false,
      classes: false,
      customHTM: false
    },
    yIndicator: true,
    padding: 10
  };

  window.Chart = Chart;

  var intObservSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
}());
// File#: _2_date-range
// Usage: codyhouse.co/license
(function() {
  var DateRange = function(opts) {
    this.options = Util.extend(DatePicker.defaults , opts);
    this.element = this.options.element;
    this.inputStart = this.element.getElementsByClassName('js-date-range__text--start')[0]; // visible to SR only
    this.inputEnd = this.element.getElementsByClassName('js-date-range__text--end')[0]; // visible to SR only
    this.trigger = this.element.getElementsByClassName('js-date-range__trigger')[0];
    this.triggerLabel = this.trigger.getAttribute('aria-label');
    this.datePicker = this.element.getElementsByClassName('js-date-picker')[0];
    this.body = this.datePicker.getElementsByClassName('js-date-picker__dates')[0];
    this.navigation = this.datePicker.getElementsByClassName('js-date-picker__month-nav')[0];
    this.heading = this.datePicker.getElementsByClassName('js-date-picker__month-label')[0];
    this.pickerVisible = false;
    // date format
    this.dateIndexes = getDateIndexes(this); // store indexes of date parts (d, m, y)
    // selected date (star/end)
    this.dateSelected = [];
    this.selectedDay = [];
    this.selectedMonth = [];
    this.selectedYear = [];
    // which date needs to be selected
    this.dateToSelect = 0; // o or start date, 1 for end date
    // focus trap
    this.firstFocusable = false;
    this.lastFocusable = false;
    // trigger btn - start/end values
    this.dateValueStartEl = this.element.getElementsByClassName('js-date-range__value--start');
    this.dateValueEndEl = this.element.getElementsByClassName('js-date-range__value--end');
    if(this.dateValueStartEl.length > 0) {
      this.dateValueStartElLabel = this.dateValueStartEl[0].textContent; // initial input value
    }
    if(this.dateValueEndEl.length > 0) {
      this.dateValueEndElLabel = this.dateValueEndEl[0].textContent; // initial input value
    }
    // trigger btn - label
    this.triggerLabelWrapper = this.trigger.getElementsByClassName('js-date-range__trigger-label');
    // custom classes
    this.selectedStartClass= 'date-picker__date--selected js-date-picker__date--range-start'; // does not include the class to remove borders
    this.selectedEndClass= 'date-picker__date--selected date-picker__date--range-end js-date-picker__date--range-end';
    this.inBetweenClass = 'date-picker__date--range';
    this.mouseMoving = false;
    // predefined options - if there's a select element with a list of predefined options
    this.predefOptions = this.element.previousElementSibling;
    initCalendarAria(this);
    resetCalendar(this);
    initCalendarEvents(this);

    // place picker according to available space
    placeCalendar(this);

    // predefined options
    initPredefinedOptions(this);
  };

  function initCalendarAria(datePicker) {
    // make input elements accessible
    resetInputVisibility(datePicker.inputStart);
    resetInputVisibility(datePicker.inputEnd);
    // create a live region used to announce new month selection to SR + new date selection
    var srLiveReagion = document.createElement('div');
    srLiveReagion.setAttribute('aria-live', 'polite');
    Util.addClass(srLiveReagion, 'sr-only js-date-range__sr-live');
    datePicker.element.appendChild(srLiveReagion);
    datePicker.srLiveReagionM = datePicker.element.getElementsByClassName('js-date-range__sr-live')[0];
  };

  function resetInputVisibility(input) {
    // make sure input elements are accessible to SR but not tabbable
    input.setAttribute('tabindex', '-1');
    var wrapper = input.closest('.js-date-range__input');
    if(wrapper) {
      Util.addClass(wrapper, 'sr-only');
      wrapper.style.display = 'block';
    }
  };

  function initCalendarEvents(datePicker) {
    if(datePicker.trigger) {
      datePicker.trigger.addEventListener('click', function(event){ // open calendar when clicking on calendar button
        event.preventDefault();
        datePicker.pickerVisible = false;
        toggleCalendar(datePicker);
        datePicker.trigger.setAttribute('aria-expanded', 'true');
      });
    }
    // navigate using month nav
    datePicker.navigation.addEventListener('click', function(event){
      event.preventDefault();
      var btn = event.target.closest('.js-date-picker__month-nav-btn');
      if(btn) {
        Util.hasClass(btn, 'js-date-picker__month-nav-btn--prev') ? showPrev(datePicker, true) : showNext(datePicker, true);
      }
    });

    // hide calendar
    window.addEventListener('keydown', function(event){ // close calendar on esc
      if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
        if(!datePicker.pickerVisible) return;
        if(document.activeElement. closest('.js-date-picker')) {
          datePicker.trigger.focus(); //if focus is inside the calendar -> move the focus to the input element 
        } 
        hideCalendar(datePicker);
      }
    });
    window.addEventListener('click', function(event){
      if(!event.target.closest('.js-date-picker') && !event.target.closest('.js-date-range__trigger') && datePicker.pickerVisible) {
        hideCalendar(datePicker);
      }
    });

    // navigate through days of calendar
    datePicker.body.addEventListener('keydown', function(event){
      var day = datePicker.currentDay;
      if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
        day = day + 7;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
        day = day + 1;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
        day = day - 1;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
        day = day - 7;
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 35 || event.key && event.key.toLowerCase() == 'end') { // move focus to last day of week
        event.preventDefault();
        day = day + 6 - getDayOfWeek(datePicker.currentYear, datePicker.currentMonth, day);
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 36 || event.key && event.key.toLowerCase() == 'home') { // move focus to first day of week
        event.preventDefault();
        day = day - getDayOfWeek(datePicker.currentYear, datePicker.currentMonth, day);
        resetDayValue(day, datePicker);
      } else if(event.keyCode && event.keyCode == 34 || event.key && event.key.toLowerCase() == 'pagedown') {
        event.preventDefault();
        showNext(datePicker); // show next month
        keyNavigationInBetween(datePicker);
      } else if(event.keyCode && event.keyCode == 33 || event.key && event.key.toLowerCase() == 'pageup') {
        event.preventDefault();
        showPrev(datePicker); // show prev month
        keyNavigationInBetween(datePicker);
      }
    });

    // trap focus inside calendar
    datePicker.datePicker.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside modal
        trapFocus(event, datePicker);
      }
    });

    // select a date inside the date picker
    datePicker.body.addEventListener('click', function(event){
      event.preventDefault();
      var day = event.target.closest('button');
      if(day) {
        if(datePicker.dateToSelect == 1 && dateIsBeforeStart(datePicker, day)) {
          // if this is end date -> make sure it is after start date, otherwise use as start date
          datePicker.dateToSelect = 0;
        }
        datePicker.dateSelected[datePicker.dateToSelect] = true;
        datePicker.selectedDay[datePicker.dateToSelect] = parseInt(day.innerText);
        datePicker.selectedMonth[datePicker.dateToSelect] = datePicker.currentMonth;
        datePicker.selectedYear[datePicker.dateToSelect] = datePicker.currentYear;

        if(datePicker.dateToSelect == 0) {
          setInputStartValue(datePicker);
          datePicker.dateToSelect = 1;
          startDateSelected(datePicker, day);
        } else {
          setInputEndValue(datePicker);
          datePicker.dateToSelect = 0;
          // close date picker
          hideCalendar(datePicker);
        }
        resetLabelCalendarTrigger(datePicker);
        resetLabelCalendarValue(datePicker);
        resetAriaLive(datePicker);
      }
    });

    // on mouse move, highlight the elements between start and end date
    datePicker.body.addEventListener('mousemove', function(event){
      var button = event.target.closest('.js-date-picker__date');
      if(!button || !datePicker.dateSelected[0] || datePicker.dateSelected[1]) return;
      showInBetweenElements(datePicker, button);
    });

    datePicker.body.addEventListener('mouseleave', function(event){
      if(!datePicker.dateSelected[1]) {
        // end date has not been selected -> remove the inBetween classes
        removeInBetweenClass(datePicker);
        resetStarDateAppearance(datePicker);
      }
    });

    // input events - for SR only
    datePicker.inputStart.addEventListener('focusout', function(event){
      resetCalendarFromInput(datePicker, datePicker.inputStart);
    });
    datePicker.inputEnd.addEventListener('focusout', function(event){
      resetCalendarFromInput(datePicker, datePicker.inputEnd);
    });
  };

  function dateIsBeforeStart(datePicker, day) { // do not allow end date < start date
    var selectedDate = [datePicker.currentYear, datePicker.currentMonth, parseInt(day.textContent)],
      startDate = [datePicker.selectedYear[0], datePicker.selectedMonth[0], datePicker.selectedDay[0]];
    return isPast(selectedDate, startDate);
  };

  function startDateSelected(datePicker, day) { // new start date has been selected
    datePicker.dateSelected[1] = false;
    datePicker.selectedDay[1] = false;
    datePicker.selectedMonth[1] = false;
    datePicker.selectedYear[1] = false;
    // reset input
    datePicker.inputEnd.value = '';
    // remove class from selected element -> if there was one
    var startDate = datePicker.element.getElementsByClassName('js-date-picker__date--range-start');
    if(startDate.length > 0) {
      Util.removeClass(startDate[0], datePicker.selectedStartClass + ' date-picker__date--range-start');
    }
    var endDate = datePicker.element.getElementsByClassName('js-date-picker__date--range-end');
    if(endDate.length > 0) {
      Util.removeClass(endDate[0], datePicker.selectedEndClass);
    }
    removeInBetweenClass(datePicker);
    // add classes to selected date
    Util.addClass(day, datePicker.selectedStartClass);
  };

  function resetCalendarFromInput(datePicker, input) {
    // reset calendar when input field is updated (SR only)
    var inputDate = getDateFromInput(datePicker, input.value);
    if(!inputDate) {
      input.value = '';
      return;
    }
    if (isNaN(new Date(inputDate).getTime())) {
      input.value = '';
      return;
    }
    resetCalendar(datePicker);
  };

  function resetCalendar(datePicker) {
    // new date has been selected -> reset calendar appearance
    resetSingleDate(datePicker, 0);
    resetSingleDate(datePicker, 1);
    // reset aria
    resetLabelCalendarTrigger(datePicker);
    resetLabelCalendarValue(datePicker);
    resetAriaLive(datePicker);
  };

  function resetSingleDate(datePicker, index) {
    // set current date + selected date (index == 0 ? startDate : endDate)
    var currentDate = false,
      selectedDate = (index == 0 ) ? datePicker.inputStart.value : datePicker.inputEnd.value;

    datePicker.dateSelected[index] = false;
    if( selectedDate != '') {
      var date = getDateFromInput(datePicker, selectedDate);
      datePicker.dateSelected[index] = true;
      currentDate = date;
    } 
    if( index == 0 ) {
      datePicker.currentDay = getCurrentDay(currentDate);
      datePicker.currentMonth = getCurrentMonth(currentDate); 
      datePicker.currentYear = getCurrentYear(currentDate); 
    }
    
    datePicker.selectedDay[index] = datePicker.dateSelected[index] ? getCurrentDay(currentDate) : false;
    datePicker.selectedMonth[index] = datePicker.dateSelected[index] ? getCurrentMonth(currentDate) : false;
    datePicker.selectedYear[index] = datePicker.dateSelected[index] ? getCurrentYear(currentDate) : false;
  };

  function getCurrentDay(date) {
    return (date) 
      ? getDayFromDate(date)
      : new Date().getDate();
  };

  function getCurrentMonth(date) {
    return (date) 
      ? getMonthFromDate(date)
      : new Date().getMonth();
  };

  function getCurrentYear(date) {
    return (date) 
      ? getYearFromDate(date)
      : new Date().getFullYear();
  };

  function getDayFromDate(date) {
    var day = parseInt(date.split('-')[2]);
    return isNaN(day) ? getCurrentDay(false) : day;
  };

  function getMonthFromDate(date) {
    var month = parseInt(date.split('-')[1]) - 1;
    return isNaN(month) ? getCurrentMonth(false) : month;
  };

  function getYearFromDate(date) {
    var year = parseInt(date.split('-')[0]);
    return isNaN(year) ? getCurrentYear(false) : year;
  };

  function showNext(datePicker, bool) {
    // show next month
    datePicker.currentYear = (datePicker.currentMonth === 11) ? datePicker.currentYear + 1 : datePicker.currentYear;
    datePicker.currentMonth = (datePicker.currentMonth + 1) % 12;
    datePicker.currentDay = checkDayInMonth(datePicker);
    showCalendar(datePicker, bool);
    datePicker.srLiveReagionM.textContent = datePicker.options.months[datePicker.currentMonth] + ' ' + datePicker.currentYear;
  };

  function showPrev(datePicker, bool) {
    // show prev month
    datePicker.currentYear = (datePicker.currentMonth === 0) ? datePicker.currentYear - 1 : datePicker.currentYear;
    datePicker.currentMonth = (datePicker.currentMonth === 0) ? 11 : datePicker.currentMonth - 1;
    datePicker.currentDay = checkDayInMonth(datePicker);
    showCalendar(datePicker, bool);
    datePicker.srLiveReagionM.textContent = datePicker.options.months[datePicker.currentMonth] + ' ' + datePicker.currentYear;
  };

  function checkDayInMonth(datePicker) {
    return (datePicker.currentDay > daysInMonth(datePicker.currentYear, datePicker.currentMonth)) ? 1 : datePicker.currentDay;
  };

  function daysInMonth(year, month) {
    return 32 - new Date(year, month, 32).getDate();
  };

  function showCalendar(datePicker, bool) {
    // show calendar element
    var firstDay = getDayOfWeek(datePicker.currentYear, datePicker.currentMonth, '01');
    datePicker.body.innerHTML = '';
    datePicker.heading.innerHTML = datePicker.options.months[datePicker.currentMonth] + ' ' + datePicker.currentYear;

    // creating all cells
    var date = 1,
      calendar = '';
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          calendar = calendar + '<li></li>';
        } else if (date > daysInMonth(datePicker.currentYear, datePicker.currentMonth)) {
          break;
        } else {
          var classListDate = '',
            tabindexValue = '-1';
          if (date === datePicker.currentDay) {
            tabindexValue = '0';
          } 
          if(!datePicker.dateSelected[0] && !datePicker.dateSelected[1] && getCurrentMonth() == datePicker.currentMonth && getCurrentYear() == datePicker.currentYear && date == getCurrentDay()){
            classListDate = classListDate+' date-picker__date--today'
          }
          if (datePicker.dateSelected[0] && date === datePicker.selectedDay[0] && datePicker.currentYear === datePicker.selectedYear[0] && datePicker.currentMonth === datePicker.selectedMonth[0]) {
            classListDate = classListDate+'  '+datePicker.selectedStartClass;
          }
          if (datePicker.dateSelected[1] && date === datePicker.selectedDay[1] && datePicker.currentYear === datePicker.selectedYear[1] && datePicker.currentMonth === datePicker.selectedMonth[1]) {
            classListDate = classListDate+'  '+datePicker.selectedEndClass;
          }
          calendar = calendar + '<li><button class="date-picker__date'+classListDate+' js-date-picker__date" tabindex="'+tabindexValue+'">'+date+'</button></li>';
          date++;
        }
      }
    }
    datePicker.body.innerHTML = calendar; // appending days into calendar body
    
    // show calendar
    if(!datePicker.pickerVisible) Util.addClass(datePicker.datePicker, 'date-picker--is-visible');
    datePicker.pickerVisible = true;

    //  if bool is false, move focus to calendar day
    if(!bool) datePicker.body.querySelector('button[tabindex="0"]').focus();
    
    // store first/last focusable elements
    getFocusableElements(datePicker);
    // set inBetween elements
    if(datePicker.dateSelected[1]) {
      var endDate = datePicker.element.getElementsByClassName('js-date-picker__date--range-end');
      if(endDate.length > 0) {
        resetInBetweenElements(datePicker, endDate[0]);
      } else if(monthIsBetween(datePicker)) {
        // end date has been set but it is in another month
        // if we are in a previous month -- reset in between days
        var dates = datePicker.element.getElementsByClassName('js-date-picker__date');
        resetInBetweenElements(datePicker, dates[dates.length - 1]);
      }
    }
    // reset trigger label
    resetTriggerLabel(datePicker, true);
  };

  function resetTriggerLabel(datePicker, bool) {
    if(datePicker.triggerLabelWrapper.length < 1) return;
    if(datePicker.triggerLabelWrapper[0].children.length < 2) return;

    if(bool) {
      Util.addClass(datePicker.triggerLabelWrapper[0].children[0], 'is-hidden');
      Util.removeClass(datePicker.triggerLabelWrapper[0].children[1], 'is-hidden');
      // place calendar
      placeCalendar(datePicker);
    } else if( !datePicker.dateSelected[0] && !datePicker.dateSelected[1]) {
      Util.addClass(datePicker.triggerLabelWrapper[0].children[1], 'is-hidden');
      Util.removeClass(datePicker.triggerLabelWrapper[0].children[0], 'is-hidden');
    }
  };

  function hideCalendar(datePicker) {
    Util.removeClass(datePicker.datePicker, 'date-picker--is-visible');
    datePicker.pickerVisible = false;

    // reset first/last focusable
    datePicker.firstFocusable = false;
    datePicker.lastFocusable = false;

    // reset trigger aria-expanded attribute
    if(datePicker.trigger) datePicker.trigger.setAttribute('aria-expanded', 'false');

    // update focus if required
    if(document.activeElement.closest('.js-date-picker')) datePicker.trigger.focus();

    // reset trigger label
    resetTriggerLabel(datePicker, false);
  };

  function toggleCalendar(datePicker, bool) {
    if(!datePicker.pickerVisible) {
      resetCalendar(datePicker);
      showCalendar(datePicker, bool);
    } else {
      hideCalendar(datePicker);
    }
  };

  function getDayOfWeek(year, month, day) {
    var weekDay = (new Date(year, month, day)).getDay() - 1;
    if(weekDay < 0) weekDay = 6;
    return weekDay;
  };

  function getDateIndexes(datePicker) {
    var dateFormat = datePicker.options.dateFormat.toLowerCase().replace(/-/g, '');
    return [dateFormat.indexOf('d'), dateFormat.indexOf('m'), dateFormat.indexOf('y')];
  };

  function setInputStartValue(datePicker) {
    datePicker.inputStart.value = getDateForInput(datePicker, 0);
  };

  function setInputEndValue(datePicker) {
    datePicker.inputEnd.value = getDateForInput(datePicker, 1);
  };

  function getDateForInput(datePicker, index) {
    // index is 0 for start date, 1 for end date
    var dateArray = [];
    dateArray[datePicker.dateIndexes[0]] = getReadableDate(datePicker.selectedDay[index]);
    dateArray[datePicker.dateIndexes[1]] = getReadableDate(datePicker.selectedMonth[index]+1);
    dateArray[datePicker.dateIndexes[2]] = datePicker.selectedYear[index];
    return dateArray[0]+datePicker.options.dateSeparator+dateArray[1]+datePicker.options.dateSeparator+dateArray[2];
  };

  function getDateFromInput(datePicker, input) {
    var dateArray = input.split(datePicker.options.dateSeparator);
    if(dateArray.length < 3) return false;
    return dateArray[datePicker.dateIndexes[2]]+'-'+dateArray[datePicker.dateIndexes[1]]+'-'+dateArray[datePicker.dateIndexes[0]];
  };

  function getReadableDate(date) {
    return (date < 10) ? '0'+date : date;
  };

  function resetDayValue(day, datePicker) {
    var totDays = daysInMonth(datePicker.currentYear, datePicker.currentMonth);
    if( day > totDays) {
      datePicker.currentDay = day - totDays;
      showNext(datePicker, false);
      keyNavigationInBetween(datePicker);
    } else if(day < 1) {
      var newMonth = datePicker.currentMonth == 0 ? 11 : datePicker.currentMonth - 1;
      datePicker.currentDay = daysInMonth(datePicker.currentYear, newMonth) + day;
      showPrev(datePicker, false);
      keyNavigationInBetween(datePicker);
    } else {
      datePicker.currentDay = day;
      datePicker.body.querySelector('button[tabindex="0"]').setAttribute('tabindex', '-1');
      // set new tabindex to selected item
      var buttons = datePicker.body.getElementsByTagName("button");
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent == datePicker.currentDay) {
          buttons[i].setAttribute('tabindex', '0');
          buttons[i].focus();
          break;
        }
      }
      getFocusableElements(datePicker); // update first focusable/last focusable element
      // reset inBetween dates
      keyNavigationInBetween(datePicker);
    }
  };

  function getFocusableElements(datePicker) {
    var allFocusable = datePicker.datePicker.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    getFirstFocusable(allFocusable, datePicker);
    getLastFocusable(allFocusable, datePicker);
  };

  function getFirstFocusable(elements, datePicker) {
    for(var i = 0; i < elements.length; i++) {
			if( (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) &&  elements[i].getAttribute('tabindex') != '-1') {
				datePicker.firstFocusable = elements[i];
				return true;
			}
		}
  };

  function getLastFocusable(elements, datePicker) {
    //get last visible focusable element inside the modal
		for(var i = elements.length - 1; i >= 0; i--) {
			if( (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) &&  elements[i].getAttribute('tabindex') != '-1' ) {
				datePicker.lastFocusable = elements[i];
				return true;
			}
		}
  };

  function trapFocus(event, datePicker) {
    if( datePicker.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of calendar
			event.preventDefault();
			datePicker.lastFocusable.focus();
		}
		if( datePicker.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of calendar
			event.preventDefault();
			datePicker.firstFocusable.focus();
		}
  };

  function resetLabelCalendarTrigger(datePicker) {
    // for SR only - update trigger aria-label to include selected dates
    if(!datePicker.trigger) return;
    var label = '';
    if(datePicker.selectedYear[0] && datePicker.selectedMonth[0] && datePicker.selectedDay[0]) {
      label = label + ', start date selected is '+ new Date(datePicker.selectedYear[0], datePicker.selectedMonth[0], datePicker.selectedDay[0]).toDateString();
    }
    if(datePicker.selectedYear[1] && datePicker.selectedMonth[1] && datePicker.selectedDay[1]) {
      label = label + ', end date selected is '+ new Date(datePicker.selectedYear[1], datePicker.selectedMonth[1], datePicker.selectedDay[1]).toDateString();
    }

    datePicker.trigger.setAttribute('aria-label', datePicker.triggerLabel+label);
  };
  
  function resetLabelCalendarValue(datePicker) {
    // trigger visible label - update value with selected dates
    if(datePicker.dateValueStartEl.length > 0) {
      resetLabel(datePicker, 0, datePicker.dateValueStartEl[0], datePicker.dateValueStartElLabel);
    }
    if(datePicker.dateValueEndEl.length > 0) {
      resetLabel(datePicker, 1, datePicker.dateValueEndEl[0], datePicker.dateValueEndElLabel);
    }
  };

  function resetLabel(datePicker, index, input, initialLabel) {
    (datePicker.selectedYear[index] && datePicker.selectedMonth[index] !== false && datePicker.selectedDay[index]) 
      ? input.textContent = getDateForInput(datePicker, index)
      : input.textContent = initialLabel;
  };

  function resetAriaLive(datePicker) { 
    // SR only - update an aria live region to announce the date that has just been selected
    var content = false;
    if(datePicker.dateSelected[0] && !datePicker.dateSelected[1]) {
      // end date has been selected -> notify users
      content = 'Start date selected is '+ new Date(datePicker.selectedYear[0], datePicker.selectedMonth[0], datePicker.selectedDay[0]).toDateString()+', select end date';
    }
    if(content) datePicker.srLiveReagionM.textContent = content;
  };

  function showInBetweenElements(datePicker, button) {
    // this function is used to add style to elements when the start date has been selected, and user is moving to select end date
    if(datePicker.mouseMoving) return;
    datePicker.mouseMoving = true;
    window.requestAnimationFrame(function(){
      removeInBetweenClass(datePicker);
      resetInBetweenElements(datePicker, button);
      resetStarDateAppearance(datePicker);
      datePicker.mouseMoving = false;
    });
  };

  function resetInBetweenElements(datePicker, endDate) {
    if(!endDate) return;
    // check if date is older than the start date -> do not add the --range class
    if(isPast([datePicker.currentYear, datePicker.currentMonth, parseInt(endDate.textContent)], [datePicker.selectedYear[0], datePicker.selectedMonth[0], datePicker.selectedDay[0]])) return
    if(Util.hasClass(endDate, 'js-date-picker__date--range-start')) {
      Util.addClass(endDate, 'date-picker__date--range-start');
      return;
    } else if(!Util.hasClass(endDate, 'js-date-picker__date--range-end')) {
      Util.addClass(endDate, datePicker.inBetweenClass);
    }
    var prevDay = endDate.closest('li').previousElementSibling;
    if(!prevDay) return;
    var date = prevDay.querySelector('button');
    if(!date) return;
    resetInBetweenElements(datePicker, date);
  };

  function removeInBetweenClass(datePicker) {
    var inBetweenDates = datePicker.element.getElementsByClassName(datePicker.inBetweenClass);
    while(inBetweenDates[0]) {
      Util.removeClass(inBetweenDates[0], datePicker.inBetweenClass);
    }
  };

  function monthIsBetween(datePicker) {
    var beforeEndDate = false;
    var afterStartDate = false;
    // check before end date
    if(datePicker.currentYear < datePicker.selectedYear[1]) {
      beforeEndDate = true;
    } else if(datePicker.currentYear == datePicker.selectedYear[1] && datePicker.currentMonth <= datePicker.selectedMonth[1]) {
      beforeEndDate = true;
    }
    // check after start date
    if(datePicker.currentYear > datePicker.selectedYear[0]) {
      afterStartDate = true;
    } else if(datePicker.currentYear == datePicker.selectedYear[0] && datePicker.currentMonth >= datePicker.selectedMonth[0]) {
      afterStartDate = true;
    }
    return beforeEndDate && afterStartDate;
  };

  function isPast(date, now) {
    // date < now
    var newdate = new Date(date[0], date[1], date[2]),
      nowDate = new Date(now[0], now[1], now[2]);
    return newdate < nowDate;
  };

  function keyNavigationInBetween(datePicker) {
    if(datePicker.dateSelected[0] && !datePicker.dateSelected[1]) showInBetweenElements(datePicker, datePicker.element.querySelector('.js-date-picker__date[tabindex="0"]'));
  };

  function resetStarDateAppearance(datePicker) {
    // the start date apperance is modified when there are --range elements (e.g., remove corners)
    if(!datePicker.dateSelected[0]) return;
    var inBetweenDates = datePicker.datePicker.getElementsByClassName(datePicker.inBetweenClass);
    if(inBetweenDates.length == 0) {
      var startDate = datePicker.datePicker.getElementsByClassName('date-picker__date--range-start');
      if(startDate.length > 0) Util.removeClass(startDate[0], 'date-picker__date--range-start');
    }
  };

  function initPredefinedOptions(datePicker) {
    if(!datePicker.predefOptions || !Util.hasClass(datePicker.predefOptions, 'js-date-range-select')) return;
    
    var select = datePicker.predefOptions.querySelector('select');
    if(!select) return;

    // check initial value and toggle date range
    if(select.options[select.selectedIndex].value == 'custom') Util.removeClass(datePicker.element, 'is-hidden');

    select.addEventListener('change', function(event) {
      if(select.options[select.selectedIndex].value == 'custom') {
        // reveal date picker
        Util.removeClass(datePicker.element, 'is-hidden');
        placeCalendar(datePicker);
        datePicker.trigger.focus();
      } else {
        Util.addClass(datePicker.element, 'is-hidden');
      }
    });
  };

  function placeCalendar(datePicker) {
    // reset position
    datePicker.datePicker.style.left = '0px';
    datePicker.datePicker.style.right = 'auto';
    
    //check if you need to modify the calendar postion
    var pickerBoundingRect = datePicker.datePicker.getBoundingClientRect();

    if(pickerBoundingRect.right > window.innerWidth) {
      datePicker.datePicker.style.left = 'auto';
      datePicker.datePicker.style.right = '0px';
    }
  };

  DateRange.defaults = {
    element : '',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dateFormat: 'd-m-y',
    dateSeparator: '/'
  };

  window.DateRange = DateRange;

  var dateRange = document.getElementsByClassName('js-date-range');
  if( dateRange.length > 0 ) {
		for( var i = 0; i < dateRange.length; i++) {(function(i){
      var opts = {element: dateRange[i]};
      if(dateRange[i].getAttribute('data-date-format')) {
        opts.dateFormat = dateRange[i].getAttribute('data-date-format');
      }
      if(dateRange[i].getAttribute('data-date-separator')) {
        opts.dateSeparator = dateRange[i].getAttribute('data-date-separator');
      }
      if(dateRange[i].getAttribute('data-months')) {
        opts.months = dateRange[i].getAttribute('data-months').split(',').map(function(item) {return item.trim();});
      }
      new DateRange(opts);
    })(i);}
	}
}());
// File#: _2_dropdown
// Usage: codyhouse.co/license
(function() {
  var Dropdown = function(element) {
    this.element = element;
    this.trigger = this.element.getElementsByClassName('js-dropdown__trigger')[0];
    this.dropdown = this.element.getElementsByClassName('js-dropdown__menu')[0];
    this.triggerFocus = false;
    this.dropdownFocus = false;
    this.hideInterval = false;
    // sublevels
    this.dropdownSubElements = this.element.getElementsByClassName('js-dropdown__sub-wrapper');
    this.prevFocus = false; // store element that was in focus before focus changed
    this.addDropdownEvents();
  };
  
  Dropdown.prototype.addDropdownEvents = function(){
    //place dropdown
    var self = this;
    this.placeElement();
    this.element.addEventListener('placeDropdown', function(event){
      self.placeElement();
    });
    // init dropdown
    this.initElementEvents(this.trigger, this.triggerFocus); // this is used to trigger the primary dropdown
    this.initElementEvents(this.dropdown, this.dropdownFocus); // this is used to trigger the primary dropdown
    // init sublevels
    this.initSublevels(); // if there are additional sublevels -> bind hover/focus events
  };

  Dropdown.prototype.placeElement = function() {
    // remove inline style first
    this.dropdown.removeAttribute('style');
    // check dropdown position
    var triggerPosition = this.trigger.getBoundingClientRect(),
      isRight = (window.innerWidth < triggerPosition.left + parseInt(getComputedStyle(this.dropdown).getPropertyValue('width')));

    var xPosition = isRight ? 'right: 0px; left: auto;' : 'left: 0px; right: auto;';
    this.dropdown.setAttribute('style', xPosition);
  };

  Dropdown.prototype.initElementEvents = function(element, bool) {
    var self = this;
    element.addEventListener('mouseenter', function(){
      bool = true;
      self.showDropdown();
    });
    element.addEventListener('focus', function(){
      self.showDropdown();
    });
    element.addEventListener('mouseleave', function(){
      bool = false;
      self.hideDropdown();
    });
    element.addEventListener('focusout', function(){
      self.hideDropdown();
    });
  };

  Dropdown.prototype.showDropdown = function(){
    if(this.hideInterval) clearInterval(this.hideInterval);
    // remove style attribute
    this.dropdown.removeAttribute('style');
    this.placeElement();
    this.showLevel(this.dropdown, true);
  };

  Dropdown.prototype.hideDropdown = function(){
    var self = this;
    if(this.hideInterval) clearInterval(this.hideInterval);
    this.hideInterval = setTimeout(function(){
      var dropDownFocus = document.activeElement.closest('.js-dropdown'),
        inFocus = dropDownFocus && (dropDownFocus == self.element);
      // if not in focus and not hover -> hide
      if(!self.triggerFocus && !self.dropdownFocus && !inFocus) {
        self.hideLevel(self.dropdown, true);
        // make sure to hide sub/dropdown
        self.hideSubLevels();
        self.prevFocus = false;
      }
    }, 300);
  };

  Dropdown.prototype.initSublevels = function(){
    var self = this;
    var dropdownMenu = this.element.getElementsByClassName('js-dropdown__menu');
    for(var i = 0; i < dropdownMenu.length; i++) {
      var listItems = dropdownMenu[i].children;
      // bind hover
      new menuAim({
        menu: dropdownMenu[i],
        activate: function(row) {
        	var subList = row.getElementsByClassName('js-dropdown__menu')[0];
        	if(!subList) return;
        	Util.addClass(row.querySelector('a'), 'dropdown__item--hover');
        	self.showLevel(subList);
        },
        deactivate: function(row) {
        	var subList = row.getElementsByClassName('dropdown__menu')[0];
        	if(!subList) return;
        	Util.removeClass(row.querySelector('a'), 'dropdown__item--hover');
        	self.hideLevel(subList);
        },
        submenuSelector: '.js-dropdown__sub-wrapper',
      });
    }
    // store focus element before change in focus
    this.element.addEventListener('keydown', function(event) { 
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        self.prevFocus = document.activeElement;
      }
    });
    // make sure that sublevel are visible when their items are in focus
    this.element.addEventListener('keyup', function(event) {
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        // focus has been moved -> make sure the proper classes are added to subnavigation
        var focusElement = document.activeElement,
          focusElementParent = focusElement.closest('.js-dropdown__menu'),
          focusElementSibling = focusElement.nextElementSibling;

        // if item in focus is inside submenu -> make sure it is visible
        if(focusElementParent && !Util.hasClass(focusElementParent, 'dropdown__menu--is-visible')) {
          self.showLevel(focusElementParent);
        }
        // if item in focus triggers a submenu -> make sure it is visible
        if(focusElementSibling && !Util.hasClass(focusElementSibling, 'dropdown__menu--is-visible')) {
          self.showLevel(focusElementSibling);
        }

        // check previous element in focus -> hide sublevel if required 
        if( !self.prevFocus) return;
        var prevFocusElementParent = self.prevFocus.closest('.js-dropdown__menu'),
          prevFocusElementSibling = self.prevFocus.nextElementSibling;
        
        if( !prevFocusElementParent ) return;
        
        // element in focus and element prev in focus are siblings
        if( focusElementParent && focusElementParent == prevFocusElementParent) {
          if(prevFocusElementSibling) self.hideLevel(prevFocusElementSibling);
          return;
        }

        // element in focus is inside submenu triggered by element prev in focus
        if( prevFocusElementSibling && focusElementParent && focusElementParent == prevFocusElementSibling) return;
        
        // shift tab -> element in focus triggers the submenu of the element prev in focus
        if( focusElementSibling && prevFocusElementParent && focusElementSibling == prevFocusElementParent) return;
        
        var focusElementParentParent = focusElementParent.parentNode.closest('.js-dropdown__menu');
        
        // shift tab -> element in focus is inside the dropdown triggered by a siblings of the element prev in focus
        if(focusElementParentParent && focusElementParentParent == prevFocusElementParent) {
          if(prevFocusElementSibling) self.hideLevel(prevFocusElementSibling);
          return;
        }
        
        if(prevFocusElementParent && Util.hasClass(prevFocusElementParent, 'dropdown__menu--is-visible')) {
          self.hideLevel(prevFocusElementParent);
        }
      }
    });
  };

  Dropdown.prototype.hideSubLevels = function(){
    var visibleSubLevels = this.dropdown.getElementsByClassName('dropdown__menu--is-visible');
    if(visibleSubLevels.length == 0) return;
    while (visibleSubLevels[0]) {
      this.hideLevel(visibleSubLevels[0]);
   	}
   	var hoveredItems = this.dropdown.getElementsByClassName('dropdown__item--hover');
   	while (hoveredItems[0]) {
      Util.removeClass(hoveredItems[0], 'dropdown__item--hover');
   	}
  };

  Dropdown.prototype.showLevel = function(level, bool){
    if(bool == undefined) {
      //check if the sublevel needs to be open to the left
      Util.removeClass(level, 'dropdown__menu--left');
      var boundingRect = level.getBoundingClientRect();
      if(window.innerWidth - boundingRect.right < 5 && boundingRect.left + window.scrollX > 2*boundingRect.width) Util.addClass(level, 'dropdown__menu--left');
    }
    Util.addClass(level, 'dropdown__menu--is-visible');
    Util.removeClass(level, 'dropdown__menu--is-hidden');
  };

  Dropdown.prototype.hideLevel = function(level, bool){
    if(!Util.hasClass(level, 'dropdown__menu--is-visible')) return;
    Util.removeClass(level, 'dropdown__menu--is-visible');
    Util.addClass(level, 'dropdown__menu--is-hidden');
    
    level.addEventListener('transitionend', function cb(event){
      if(event.propertyName != 'opacity') return;
      level.removeEventListener('transitionend', cb);
      if(Util.hasClass(level, 'dropdown__menu--is-hidden')) Util.removeClass(level, 'dropdown__menu--is-hidden dropdown__menu--left');
      if(bool && !Util.hasClass(level, 'dropdown__menu--is-visible')) level.setAttribute('style', 'width: 0px; overflow: hidden;');
    });
  };

  window.Dropdown = Dropdown;

  var dropdown = document.getElementsByClassName('js-dropdown');
  if( dropdown.length > 0 ) { // init Dropdown objects
    for( var i = 0; i < dropdown.length; i++) {
      (function(i){new Dropdown(dropdown[i]);})(i);
    }
  }
}());
// File#: _2_menu-bar
// Usage: codyhouse.co/license
(function() {
  var MenuBar = function(element) {
    this.element = element;
    this.items = Util.getChildrenByClassName(this.element, 'menu-bar__item');
    this.mobHideItems = this.element.getElementsByClassName('menu-bar__item--hide');
    this.moreItemsTrigger = this.element.getElementsByClassName('js-menu-bar__trigger');
    initMenuBar(this);
  };

  function initMenuBar(menu) {
    setMenuTabIndex(menu); // set correct tabindexes for menu item
    initMenuBarMarkup(menu); // create additional markup
    checkMenuLayout(menu); // set menu layout
    Util.addClass(menu.element, 'menu-bar--loaded'); // reveal menu

    // custom event emitted when window is resized
    menu.element.addEventListener('update-menu-bar', function(event){
      checkMenuLayout(menu);
      if(menu.menuInstance) menu.menuInstance.toggleMenu(false, false); // close dropdown
    });

    // keyboard events 
    // open dropdown when pressing Enter on trigger element
    if(menu.moreItemsTrigger.length > 0) {
      menu.moreItemsTrigger[0].addEventListener('keydown', function(event) {
        if( (event.keyCode && event.keyCode == 13) || (event.key && event.key.toLowerCase() == 'enter') ) {
          if(!menu.menuInstance) return;
          menu.menuInstance.selectedTrigger = menu.moreItemsTrigger[0];
          menu.menuInstance.toggleMenu(!Util.hasClass(menu.subMenu, 'menu--is-visible'), true);
        }
      });

      // close dropdown on esc
      menu.subMenu.addEventListener('keydown', function(event) {
        if((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape')) { // close submenu on esc
          if(menu.menuInstance) menu.menuInstance.toggleMenu(false, true);
        }
      });
    }
    
    // navigate menu items using left/right arrows
    menu.element.addEventListener('keydown', function(event) {
      if( (event.keyCode && event.keyCode == 39) || (event.key && event.key.toLowerCase() == 'arrowright') ) {
        navigateItems(menu.items, event, 'next');
      } else if( (event.keyCode && event.keyCode == 37) || (event.key && event.key.toLowerCase() == 'arrowleft') ) {
        navigateItems(menu.items, event, 'prev');
      }
    });
  };

  function setMenuTabIndex(menu) { // set tabindexes for the menu items to allow keyboard navigation
    var nextItem = false;
    for(var i = 0; i < menu.items.length; i++ ) {
      if(i == 0 || nextItem) menu.items[i].setAttribute('tabindex', '0');
      else menu.items[i].setAttribute('tabindex', '-1');
      if(i == 0 && menu.moreItemsTrigger.length > 0) nextItem = true;
      else nextItem = false;
    }
  };

  function initMenuBarMarkup(menu) {
    if(menu.mobHideItems.length == 0 ) { // no items to hide on mobile - remove trigger
      if(menu.moreItemsTrigger.length > 0) menu.element.removeChild(menu.moreItemsTrigger[0]);
      return;
    }

    if(menu.moreItemsTrigger.length == 0) return;

    // create the markup for the Menu element
    var content = '';
    menu.menuControlId = 'submenu-bar-'+Date.now();
    for(var i = 0; i < menu.mobHideItems.length; i++) {
      var item = menu.mobHideItems[i].cloneNode(true),
        svg = item.getElementsByTagName('svg')[0],
        label = item.getElementsByClassName('menu-bar__label')[0];

      svg.setAttribute('class', 'icon menu__icon');
      content = content + '<li role="menuitem"><span class="menu__content js-menu__content">'+svg.outerHTML+'<span>'+label.innerHTML+'</span></span></li>';
    }

    Util.setAttributes(menu.moreItemsTrigger[0], {'role': 'button', 'aria-expanded': 'false', 'aria-controls': menu.menuControlId, 'aria-haspopup': 'true'});

    var subMenu = document.createElement('menu'),
      customClass = menu.element.getAttribute('data-menu-class');
    Util.setAttributes(subMenu, {'id': menu.menuControlId, 'class': 'menu js-menu '+customClass});
    subMenu.innerHTML = content;
    document.body.appendChild(subMenu);

    menu.subMenu = subMenu;
    menu.subItems = subMenu.getElementsByTagName('li');

    menu.menuInstance = new Menu(menu.subMenu); // this will handle the dropdown behaviour
  };

  function checkMenuLayout(menu) { // switch from compressed to expanded layout and viceversa
    var layout = getComputedStyle(menu.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(menu.element, 'menu-bar--collapsed', layout == 'collapsed');
  };

  function navigateItems(list, event, direction, prevIndex) { // keyboard navigation among menu items
    event.preventDefault();
    var index = (typeof prevIndex !== 'undefined') ? prevIndex : Util.getIndexInArray(list, event.target),
      nextIndex = direction == 'next' ? index + 1 : index - 1;
    if(nextIndex < 0) nextIndex = list.length - 1;
    if(nextIndex > list.length - 1) nextIndex = 0;
    // check if element is visible before moving focus
    (list[nextIndex].offsetParent === null) ? navigateItems(list, event, direction, nextIndex) : Util.moveFocus(list[nextIndex]);
  };

  function checkMenuClick(menu, target) { // close dropdown when clicking outside the menu element
    if(menu.menuInstance && !menu.moreItemsTrigger[0].contains(target) && !menu.subMenu.contains(target)) menu.menuInstance.toggleMenu(false, false);
  };

  // init MenuBars objects
  var menuBars = document.getElementsByClassName('js-menu-bar');
  if( menuBars.length > 0 ) {
    var j = 0,
      menuBarArray = [];
    for( var i = 0; i < menuBars.length; i++) {
      var beforeContent = getComputedStyle(menuBars[i], ':before').getPropertyValue('content');
      if(beforeContent && beforeContent !='' && beforeContent !='none') {
        (function(i){menuBarArray.push(new MenuBar(menuBars[i]));})(i);
        j = j + 1;
      }
    }
    
    if(j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-menu-bar');
      // update Menu Bar layout on resize  
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 150);
      });

      // close menu when clicking outside it
      window.addEventListener('click', function(event){
        menuBarArray.forEach(function(element){
          checkMenuClick(element, event.target);
        });
      });

      function doneResizing() {
        for( var i = 0; i < menuBars.length; i++) {
          (function(i){menuBars[i].dispatchEvent(customEvent)})(i);
        };
      };
    }
  }
}());
if(!Util) function Util () {};

Util.addClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.add(classList[0]);
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.cssSupports = function(property, value) {
  return CSS.supports(property, value);
};

// File#: _2_slider-multi-value
// Usage: codyhouse.co/license
(function() {
	var SliderMulti = function(element) {
		this.element = element;
		this.rangeWrapper = this.element.getElementsByClassName('slider__range');
		this.rangeInput = this.element.getElementsByClassName('slider__input');
		this.rangeMin = this.rangeInput[0].getAttribute('min');
		this.rangeMax = this.rangeInput[0].getAttribute('max');
		this.sliderWidth = window.getComputedStyle(this.element.getElementsByClassName('slider__range')[0]).getPropertyValue('width');
		this.thumbWidth = getComputedStyle(this.element).getPropertyValue('--slide-thumb-size');
		initSliderMulti(this);
	};

	function initSliderMulti(slider) {
		// toggle custom class based on browser support
		toggleMsClass(slider);

		// init bg color of the slider
		updateRangeColor(slider);

		slider.element.addEventListener('updateRange', function(event){
			checkRangeValues(slider, event.detail);
			updateRangeColor(slider);
		});

		// custom event emitted after window resize
		slider.element.addEventListener('update-slider-multi-value', function(event){
			slider.sliderWidth = window.getComputedStyle(slider.element.getElementsByClassName('slider__range')[0]).getPropertyValue('width');
			updateRangeColor(slider);
		});
	};

	function checkRangeValues(slider, index) {
		// if min value was changed -> make sure min value is smaller than max value 
		// if max value was changed -> make sure max value is bigger than min value 
		var i = (index == 0) ? 1 : 0,
			limit = parseFloat(slider.rangeInput[i].value);
		if( (index == 0 && slider.rangeInput[0].value >= limit) || (index == 1 && slider.rangeInput[1].value <= limit) ) {
			slider.rangeInput[index].value = limit;
			slider.element.dispatchEvent(new CustomEvent('inputRangeLimit', {detail: index}))
		}
	};

	function updateRangeColor(slider) { // update background fill color of the slider
		var percentageStart = parseInt((slider.rangeInput[0].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin)*100),
			percentageEnd = parseInt((slider.rangeInput[1].value - slider.rangeMin)/(slider.rangeMax - slider.rangeMin)*100), 
			start = 'calc('+percentageStart+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)',
			end = 'calc('+percentageEnd+'*('+slider.sliderWidth+' - 0.5*'+slider.thumbWidth+')/100)';

		slider.rangeWrapper[0].style.setProperty('--slider-fill-value-start', start);
		slider.rangeWrapper[0].style.setProperty('--slider-fill-value-end', end);
	};

	function toggleMsClass(slider) {
		var cssVariablesSupport = Util.cssSupports('--color-value', 'red'),
			imeAlignSuport = Util.cssSupports('-ms-ime-align', 'auto');
		if(imeAlignSuport || !cssVariablesSupport) Util.addClass(slider.element, 'slider--ms-fallback'); // IE and Edge (<=18) Fallback
	};

	//initialize the SliderMulti objects
	var slidersMulti = document.getElementsByClassName('js-slider');
	if( slidersMulti.length > 0 ) {
		var slidersMultiArray = [];
		for( var i = 0; i < slidersMulti.length; i++) {(function(i){
			if(slidersMulti[i].getElementsByClassName('slider__input').length > 1) slidersMultiArray.push(new SliderMulti(slidersMulti[i]));
		})(i);}
		if(slidersMultiArray.length > 0) {
			var resizingId = false,
        customEvent = new CustomEvent('update-slider-multi-value');
      
      window.addEventListener('resize', function() {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });

      function doneResizing() {
        for( var i = 0; i < slidersMultiArray.length; i++) {
          (function(i){slidersMultiArray[i].element.dispatchEvent(customEvent)})(i);
        };
      };
		}
	}
}());
if(!Util) function Util () {};

Util.hasClass = function(el, className) {
  return el.classList.contains(className);
};

Util.addClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.add(classList[0]);
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.remove(classList[0]);
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
  if(bool) Util.addClass(el, className);
  else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName('body')[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};


Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};


Util.cssSupports = function(property, value) {
  return CSS.supports(property, value);
};

Util.extend = function() {
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// File#: _2_slideshow-preview-mode
// Usage: codyhouse.co/license
(function() {
	var SlideshowPrew = function(opts) {
		this.options = Util.extend(SlideshowPrew.defaults , opts);
		this.element = this.options.element;
		this.list = this.element.getElementsByClassName('js-slideshow-pm__list')[0];
		this.items = this.list.getElementsByClassName('js-slideshow-pm__item');
		this.controls = this.element.getElementsByClassName('js-slideshow-pm__control-wrapper'); 
		this.selectedSlide = 0;
		this.autoplayId = false;
		this.autoplayPaused = false;
		this.navigation = false;
		this.navCurrentLabel = false;
		this.ariaLive = false;
		this.moveFocus = false;
		this.animating = false;
		this.supportAnimation = Util.cssSupports('transition');
		this.itemWidth = false;
		this.itemMargin = false;
		this.containerWidth = false;
		this.resizeId = false;
		// we will need this to implement keyboard nav
		this.firstFocusable = false;
		this.lastFocusable = false;
		// fallback for browsers not supporting flexbox
		initSlideshow(this);
		initSlideshowEvents(this);
		initAnimationEndEvents(this);
		Util.addClass(this.element, 'slideshow-pm--js-loaded');
	};

	SlideshowPrew.prototype.showNext = function(autoplay) {
		showNewItem(this, this.selectedSlide + 1, 'next', autoplay);
	};

	SlideshowPrew.prototype.showPrev = function() {
		showNewItem(this, this.selectedSlide - 1, 'prev');
	};

	SlideshowPrew.prototype.showItem = function(index) {
		showNewItem(this, index, false);
	};

	SlideshowPrew.prototype.startAutoplay = function() {
		var self = this;
		if(this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
			self.autoplayId = setInterval(function(){
				self.showNext(true);
			}, self.options.autoplayInterval);
		}
	};

	SlideshowPrew.prototype.pauseAutoplay = function() {
		var self = this;
		if(this.options.autoplay) {
			clearInterval(self.autoplayId);
			self.autoplayId = false;
		}
	};

	function initSlideshow(slideshow) { // basic slideshow settings
		// if no slide has been selected -> select the first one
		if(slideshow.element.getElementsByClassName('slideshow-pm__item--selected').length < 1) Util.addClass(slideshow.items[0], 'slideshow-pm__item--selected');
		slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('slideshow-pm__item--selected')[0]);
		// now set translate value to the container element
		setTranslateValue(slideshow);
		setTranslate(slideshow);
		resetSlideshowNav(slideshow, 0, slideshow.selectedSlide);
		setFocusableElements(slideshow);
		// if flexbox is not supported, set a width for the list element
		if(!flexSupported) resetSlideshowFlexFallback(slideshow);
		// now add class to animate while translating
		setTimeout(function(){Util.addClass(slideshow.list, 'slideshow-pm__list--has-transition');}, 50);
		// add arai-hidden to not selected slides
		for(var i = 0; i < slideshow.items.length; i++) {
			(i == slideshow.selectedSlide) ? slideshow.items[i].removeAttribute('aria-hidden') : slideshow.items[i].setAttribute('aria-hidden', 'true');
		}
		// create an element that will be used to announce the new visible slide to SR
		var srLiveArea = document.createElement('div');
		Util.setAttributes(srLiveArea, {'class': 'sr-only js-slideshow-pm__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
		slideshow.element.appendChild(srLiveArea);
		slideshow.ariaLive = srLiveArea;
	};

	function initSlideshowEvents(slideshow) {
		// if slideshow navigation is on -> create navigation HTML and add event listeners
		if(slideshow.options.navigation) {
			var navigation = document.createElement('ol'),
				navChildren = '';
			
			navigation.setAttribute('class', slideshow.options.navClass);
			for(var i = 0; i < slideshow.items.length; i++) {
				var className = (i == slideshow.selectedSlide) ? 'class="'+slideshow.options.navItemClass+' '+slideshow.options.navItemClass+'--selected js-slideshow-pm__nav-item"' :  'class="'+slideshow.options.navItemClass+' js-slideshow-pm__nav-item"',
					navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-slideshow-pm__nav-current-label">Current Item</span>' : '';
				navChildren = navChildren + '<li '+className+'><button class="reset '+slideshow.options.navBtnClass+'"><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</button></li>';
			}

			navigation.innerHTML = navChildren;
			slideshow.navCurrentLabel = navigation.getElementsByClassName('js-slideshow-pm__nav-current-label')[0]; 
			slideshow.element.appendChild(navigation);
			slideshow.navigation = slideshow.element.getElementsByClassName('js-slideshow-pm__nav-item');

			navigation.addEventListener('click', function(event){
				navigateSlide(slideshow, event, true);
			});
			navigation.addEventListener('keyup', function(event){
				navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
			});
		}
		// slideshow arrow controls
		if(slideshow.controls.length > 0) {
			slideshow.controls[0].addEventListener('click', function(event){
				event.preventDefault();
				slideshow.showPrev();
				updateAriaLive(slideshow);
			});
			slideshow.controls[1].addEventListener('click', function(event){
				event.preventDefault();
				slideshow.showNext(false);
				updateAriaLive(slideshow);
			});
		}
		// navigate slideshow when clicking on preview
		if(slideshow.options.prewNav) {
			slideshow.element.addEventListener('click', function(event){
				var item = event.target.closest('.js-slideshow-pm__item');
				if(item && !Util.hasClass(item, 'slideshow-pm__item--selected')) {
					slideshow.showItem(Util.getIndexInArray(slideshow.items, item));
				}
			});
		}
		// swipe events
		if(slideshow.options.swipe) {
			//init swipe
			new SwipeContent(slideshow.element);
			slideshow.element.addEventListener('swipeLeft', function(event){
				slideshow.showNext(false);
			});
			slideshow.element.addEventListener('swipeRight', function(event){
				slideshow.showPrev();
			});
		}
		// autoplay
		if(slideshow.options.autoplay) {
			slideshow.startAutoplay();
			// pause autoplay if user is interacting with the slideshow
			slideshow.element.addEventListener('mouseenter', function(event){
				slideshow.pauseAutoplay();
				slideshow.autoplayPaused = true;
			});
			slideshow.element.addEventListener('focusin', function(event){
				slideshow.pauseAutoplay();
				slideshow.autoplayPaused = true;
			});
			slideshow.element.addEventListener('mouseleave', function(event){
				slideshow.autoplayPaused = false;
				slideshow.startAutoplay();
			});
			slideshow.element.addEventListener('focusout', function(event){
				slideshow.autoplayPaused = false;
				slideshow.startAutoplay();
			});
		}
		// keyboard navigation
		initKeyboardEvents(slideshow);
		// reset on resize
    window.addEventListener('resize', function(event){
    	slideshow.pauseAutoplay();
      clearTimeout(slideshow.resizeId);
      slideshow.resizeId = setTimeout(function(){
        resetSlideshowResize(slideshow);
        setTimeout(function(){slideshow.startAutoplay();}, 60);
      }, 250)
    });
	};

	function initKeyboardEvents(slideshow) {
		// tab on selected slide -> if last focusable -> move to prev or next arrow
		// tab + shift selected slide -> if first focusable -> move to container
		if(slideshow.controls.length > 0) {
			// tab+shift on prev arrow -> move focus to last focusable element inside the selected slide (or to the slider container)
			slideshow.controls[0].addEventListener('keydown', function(event){
				if( (event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab') && event.shiftKey ) moveFocusToLast(slideshow);
			});
			// tab+shift on next arrow -> if first slide selectes -> move focus to last focusable element inside the selected slide (or to the slider container)
			slideshow.controls[1].addEventListener('keydown', function(event){
				if( (event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab') && event.shiftKey && (slideshow.selectedSlide == 0)) moveFocusToLast(slideshow);
			});
		}
		// check tab is pressed when focus is inside selected slide
		slideshow.element.addEventListener('keydown', function(event){
			if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
				var target = event.target.closest('.js-slideshow-pm__item');
				if(target && Util.hasClass(target, 'slideshow-pm__item--selected')) moveFocusOutsideSlide(slideshow, event);
				else if(target || Util.hasClass(event.target, 'js-slideshow-pm') && !event.shiftKey) moveFocusToSelectedSlide(slideshow);
			} 
		});

		// detect tab moves to slideshow 
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab') {
				var target = event.target.closest('.js-slideshow-prew__item');
				if(target || Util.hasClass(event.target, 'js-slideshow-prew') && !event.shiftKey) moveFocusToSelectedSlide(slideshow);
			}
		});
	};

	function moveFocusToLast(slideshow) {
		event.preventDefault();
		if(slideshow.lastFocusable)	{
			slideshow.lastFocusable.focus();
		} else {
			Util.moveFocus(slideshow.element);
		}
	};

	function moveFocusToSelectedSlide(slideshow) { // focus is inside a slide that is not selected
		event.preventDefault();
		if(slideshow.firstFocusable)	{
			slideshow.firstFocusable.focus();
		} else if(slideshow.controls.length > 0) {
			(slideshow.selectedSlide == 0) ? slideshow.controls[1].getElementsByTagName('button')[0].focus() : slideshow.controls[0].getElementsByTagName('button')[0].focus();
		} else if(slideshow.options.navigation) {
			slideshow.navigation.getElementsByClassName('js-slideshow-pm__nav-item')[0].getElementsByTagName('button')[0].focus();
		}
	};

	function moveFocusOutsideSlide(slideshow, event) {
		if(event.shiftKey && slideshow.firstFocusable && event.target == slideshow.firstFocusable) {
			// shift+tab -> focus was on first foucusable element inside selected slide -> move to container
			event.preventDefault();
			Util.moveFocus(slideshow.element);
		} else if( !event.shiftKey && slideshow.lastFocusable && event.target == slideshow.lastFocusable) {
			event.preventDefault();
			
			if(slideshow.selectedSlide != 0) slideshow.controls[0].getElementsByTagName('button')[0].focus();
			else slideshow.controls[1].getElementsByTagName('button')[0].focus();
		}
	};

	function initAnimationEndEvents(slideshow) {
		slideshow.list.addEventListener('transitionend', function(){
			setTimeout(function(){ // add a delay between the end of animation and slideshow reset - improve animation performance
				resetAnimationEnd(slideshow);
			}, 100);
		});
	};

	function resetAnimationEnd(slideshow) {
		if(slideshow.moveFocus) Util.moveFocus(slideshow.items[slideshow.selectedSlide]);
		slideshow.items[slideshow.selectedSlide].removeAttribute('aria-hidden');
		slideshow.animating = false;
		slideshow.moveFocus = false;
		slideshow.startAutoplay();
	};

	function navigateSlide(slideshow, event, keyNav) { 
		// user has interacted with the slideshow navigation -> update visible slide
		var target = event.target.closest('.js-slideshow-pm__nav-item');
		if(keyNav && target && !Util.hasClass(target, slideshow.options.navItemClass+'--selected')) {
			slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
			slideshow.moveFocus = true;
			updateAriaLive(slideshow);
		}
	};

	function showNewItem(slideshow, index, bool, autoplay) {
		if(slideshow.animating && slideshow.supportAnimation) return;
		if(autoplay) {
			if(index < 0) index = slideshow.items.length - 1;
			else if(index >= slideshow.items.length) index = 0;
		}
		if(index < 0 || index >= slideshow.items.length) return;
		slideshow.animating = true;
		Util.removeClass(slideshow.items[slideshow.selectedSlide], 'slideshow-pm__item--selected');
		slideshow.items[slideshow.selectedSlide].setAttribute('aria-hidden', 'true'); //hide to sr element that is exiting the viewport
		Util.addClass(slideshow.items[index], 'slideshow-pm__item--selected');
		resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
		slideshow.selectedSlide = index;
		setTranslate(slideshow);
		slideshow.pauseAutoplay();
		setFocusableElements(slideshow);
		if(!transitionSupported) resetAnimationEnd(slideshow);
		emitSlideshowEvent(slideshow, 'newSlide');
	};

	function updateAriaLive(slideshow) {
		slideshow.ariaLive.innerHTML = 'Item '+(slideshow.selectedSlide + 1)+' of '+slideshow.items.length;
	};

	function resetSlideshowResize(slideshow) {
		Util.removeClass(slideshow.list, 'slideshow-pm__list--has-transition');
		setTimeout(function(){
			setTranslateValue(slideshow);
			setTranslate(slideshow);
			Util.addClass(slideshow.list, 'slideshow-pm__list--has-transition');
		}, 30)
	};

	function setTranslateValue(slideshow) {
		var itemStyle = window.getComputedStyle(slideshow.items[slideshow.selectedSlide]);

		slideshow.itemWidth = parseFloat(itemStyle.getPropertyValue('width'));
		slideshow.itemMargin = parseFloat(itemStyle.getPropertyValue('margin-right'));
		slideshow.containerWidth = parseFloat(window.getComputedStyle(slideshow.element).getPropertyValue('width'));
	};

	function setTranslate(slideshow) {
		var translate = parseInt(((slideshow.itemWidth + slideshow.itemMargin) * slideshow.selectedSlide * (-1)) + ((slideshow.containerWidth - slideshow.itemWidth)*0.5));
    slideshow.list.style.transform = 'translateX('+translate+'px)';
    slideshow.list.style.msTransform = 'translateX('+translate+'px)';
  };

  function resetSlideshowNav(slideshow, newIndex, oldIndex) {
  	if(slideshow.navigation) {
			Util.removeClass(slideshow.navigation[oldIndex], slideshow.options.navItemClass+'--selected');
			Util.addClass(slideshow.navigation[newIndex], slideshow.options.navItemClass+'--selected');
			slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
			slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
		}
		if(slideshow.controls.length > 0) {
			Util.toggleClass(slideshow.controls[0], 'slideshow-pm__control-wrapper--active', newIndex != 0);
			Util.toggleClass(slideshow.controls[1], 'slideshow-pm__control-wrapper--active', newIndex != (slideshow.items.length - 1));
  	}
  };

  function setFocusableElements(slideshow) {
  	//get all focusable elements inside the selected slide
		var allFocusable = slideshow.items[slideshow.selectedSlide].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
		getFirstVisible(slideshow, allFocusable);
		getLastVisible(slideshow, allFocusable);
  };

  function getFirstVisible(slideshow, elements) {
  	slideshow.firstFocusable = false;
		//get first visible focusable element inside the selected slide
		for(var i = 0; i < elements.length; i++) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				slideshow.firstFocusable = elements[i];
				return true;
			}
		}
  };

  function getLastVisible(slideshow, elements) {
  	//get last visible focusable element inside the selected slide
  	slideshow.lastFocusable = false;
		for(var i = elements.length - 1; i >= 0; i--) {
			if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
				slideshow.lastFocusable = elements[i];
				return true;
			}
		}
  };

  function resetSlideshowFlexFallback(slideshow) {
		slideshow.list.style.width = ((slideshow.items.length+1)*(slideshow.itemMargin+slideshow.itemWidth))+'px';
		for(var i = 0; i < slideshow.items.length; i++) {slideshow.items[i].style.width = slideshow.itemWidth+'px';}
  };

	function emitSlideshowEvent(slideshow, eventType) {
    if(eventType == 'newSlide') {
      var detail = slideshow.selectedSlide;
    }
    slideshow.element.dispatchEvent(new CustomEvent(eventType, {detail: detail}));
  };

	SlideshowPrew.defaults = {
    element : '',
    navigation : true,
    autoplay : false,
    autoplayInterval: 5000,
    prewNav: false,
    swipe: false,
		navClass: 'slideshow-pm__navigation',
		navItemClass: 'slideshow-pm__nav-item',
		navBtnClass: 'slideshow-pm__nav-btn'
  };

  window.SlideshowPrew = SlideshowPrew;
	
	// initialize the slideshowsPrew objects
	var slideshowsPrew = document.getElementsByClassName('js-slideshow-pm'),
		flexSupported = Util.cssSupports('align-items', 'stretch'),
		transitionSupported = Util.cssSupports('transition');
	if( slideshowsPrew.length > 0 ) {
		for( var i = 0; i < slideshowsPrew.length; i++) {
			(function(i){
				var navigation = (slideshowsPrew[i].getAttribute('data-navigation') && slideshowsPrew[i].getAttribute('data-navigation') == 'off') ? false : true,
					autoplay = (slideshowsPrew[i].getAttribute('data-autoplay') && slideshowsPrew[i].getAttribute('data-autoplay') == 'on') ? true : false,
					autoplayInterval = (slideshowsPrew[i].getAttribute('data-autoplay-interval')) ? slideshowsPrew[i].getAttribute('data-autoplay-interval') : 5000,
					prewNav = (slideshowsPrew[i].getAttribute('data-pm-nav') && slideshowsPrew[i].getAttribute('data-pm-nav') == 'on' ) ? true : false, 
					swipe = (slideshowsPrew[i].getAttribute('data-swipe') && slideshowsPrew[i].getAttribute('data-swipe') == 'on') ? true : false,
					navClass = slideshowsPrew[i].getAttribute('data-pm-nav-class') ? slideshowsPrew[i].getAttribute('data-pm-nav-class') : 'slideshow-pm__navigation',
					navItemClass = slideshowsPrew[i].getAttribute('data-pm-nav-item-class') ? slideshowsPrew[i].getAttribute('data-pm-nav-item-class') : 'slideshow-pm__nav-item',
					navBtnClass = slideshowsPrew[i].getAttribute('data-pm-nav-btn-class') ? slideshowsPrew[i].getAttribute('data-pm-nav-btn-class') : 'slideshow-pm__nav-btn';
				new SlideshowPrew({element: slideshowsPrew[i], navigation: navigation, autoplay : autoplay, autoplayInterval : autoplayInterval, swipe : swipe, prewNav: prewNav, navClass: navClass, navItemClass: navItemClass, navBtnClass: navBtnClass});
			})(i);
		}
	}

}());
if(!Util) function Util () {};

Util.hasClass = function(el, className) {
  return el.classList.contains(className);
};

Util.addClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.add(classList[0]);
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.remove(classList[0]);
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName('body')[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};


Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};


Util.cssSupports = function(property, value) {
  return CSS.supports(property, value);
};

Util.extend = function() {
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// File#: _2_slideshow
// Usage: codyhouse.co/license
(function() {
	var Slideshow = function(opts) {
		this.options = Util.extend(Slideshow.defaults , opts);
		this.element = this.options.element;
		this.items = this.element.getElementsByClassName('js-slideshow__item');
		this.controls = this.element.getElementsByClassName('js-slideshow__control'); 
		this.selectedSlide = 0;
		this.autoplayId = false;
		this.autoplayPaused = false;
		this.navigation = false;
		this.navCurrentLabel = false;
		this.ariaLive = false;
		this.moveFocus = false;
		this.animating = false;
		this.supportAnimation = Util.cssSupports('transition');
		this.animationOff = (!Util.hasClass(this.element, 'slideshow--transition-fade') && !Util.hasClass(this.element, 'slideshow--transition-slide') && !Util.hasClass(this.element, 'slideshow--transition-prx'));
		this.animationType = Util.hasClass(this.element, 'slideshow--transition-prx') ? 'prx' : 'slide';
		this.animatingClass = 'slideshow--is-animating';
		initSlideshow(this);
		initSlideshowEvents(this);
		initAnimationEndEvents(this);
	};

	Slideshow.prototype.showNext = function() {
		showNewItem(this, this.selectedSlide + 1, 'next');
	};

	Slideshow.prototype.showPrev = function() {
		showNewItem(this, this.selectedSlide - 1, 'prev');
	};

	Slideshow.prototype.showItem = function(index) {
		showNewItem(this, index, false);
	};

	Slideshow.prototype.startAutoplay = function() {
		var self = this;
		if(this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
			self.autoplayId = setInterval(function(){
				self.showNext();
			}, self.options.autoplayInterval);
		}
	};

	Slideshow.prototype.pauseAutoplay = function() {
		var self = this;
		if(this.options.autoplay) {
			clearInterval(self.autoplayId);
			self.autoplayId = false;
		}
	};

	function initSlideshow(slideshow) { // basic slideshow settings
		// if no slide has been selected -> select the first one
		if(slideshow.element.getElementsByClassName('slideshow__item--selected').length < 1) Util.addClass(slideshow.items[0], 'slideshow__item--selected');
		slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('slideshow__item--selected')[0]);
		// create an element that will be used to announce the new visible slide to SR
		var srLiveArea = document.createElement('div');
		Util.setAttributes(srLiveArea, {'class': 'sr-only js-slideshow__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
		slideshow.element.appendChild(srLiveArea);
		slideshow.ariaLive = srLiveArea;
	};

	function initSlideshowEvents(slideshow) {
		// if slideshow navigation is on -> create navigation HTML and add event listeners
		if(slideshow.options.navigation) {
			// check if navigation has already been included
			if(slideshow.element.getElementsByClassName('js-slideshow__navigation').length == 0) {
				var navigation = document.createElement('ol'),
					navChildren = '';

				var navClasses = slideshow.options.navigationClass+' js-slideshow__navigation';
				if(slideshow.items.length <= 1) {
					navClasses = navClasses + ' is-hidden';
				}
				
				navigation.setAttribute('class', navClasses);
				for(var i = 0; i < slideshow.items.length; i++) {
					var className = (i == slideshow.selectedSlide) ? 'class="'+slideshow.options.navigationItemClass+' '+slideshow.options.navigationItemClass+'--selected js-slideshow__nav-item"' :  'class="'+slideshow.options.navigationItemClass+' js-slideshow__nav-item"',
						navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-slideshow__nav-current-label">Current Item</span>' : '';
					navChildren = navChildren + '<li '+className+'><button class="reset"><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</button></li>';
				}
				navigation.innerHTML = navChildren;
				slideshow.element.appendChild(navigation);
			}
			
			slideshow.navCurrentLabel = slideshow.element.getElementsByClassName('js-slideshow__nav-current-label')[0]; 
			slideshow.navigation = slideshow.element.getElementsByClassName('js-slideshow__nav-item');

			var dotsNavigation = slideshow.element.getElementsByClassName('js-slideshow__navigation')[0];

			dotsNavigation.addEventListener('click', function(event){
				navigateSlide(slideshow, event, true);
			});
			dotsNavigation.addEventListener('keyup', function(event){
				navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
			});
		}
		// slideshow arrow controls
		if(slideshow.controls.length > 0) {
			// hide controls if one item available
			if(slideshow.items.length <= 1) {
				Util.addClass(slideshow.controls[0], 'is-hidden');
				Util.addClass(slideshow.controls[1], 'is-hidden');
			}
			slideshow.controls[0].addEventListener('click', function(event){
				event.preventDefault();
				slideshow.showPrev();
				updateAriaLive(slideshow);
			});
			slideshow.controls[1].addEventListener('click', function(event){
				event.preventDefault();
				slideshow.showNext();
				updateAriaLive(slideshow);
			});
		}
		// swipe events
		if(slideshow.options.swipe) {
			//init swipe
			new SwipeContent(slideshow.element);
			slideshow.element.addEventListener('swipeLeft', function(event){
				slideshow.showNext();
			});
			slideshow.element.addEventListener('swipeRight', function(event){
				slideshow.showPrev();
			});
		}
		// autoplay
		if(slideshow.options.autoplay) {
			slideshow.startAutoplay();
			// pause autoplay if user is interacting with the slideshow
			if(!slideshow.options.autoplayOnHover) {
				slideshow.element.addEventListener('mouseenter', function(event){
					slideshow.pauseAutoplay();
					slideshow.autoplayPaused = true;
				});
				slideshow.element.addEventListener('mouseleave', function(event){
					slideshow.autoplayPaused = false;
					slideshow.startAutoplay();
				});
			}
			if(!slideshow.options.autoplayOnFocus) {
				slideshow.element.addEventListener('focusin', function(event){
					slideshow.pauseAutoplay();
					slideshow.autoplayPaused = true;
				});
				slideshow.element.addEventListener('focusout', function(event){
					slideshow.autoplayPaused = false;
					slideshow.startAutoplay();
				});
			}
		}
		// detect if external buttons control the slideshow
		var slideshowId = slideshow.element.getAttribute('id');
		if(slideshowId) {
			var externalControls = document.querySelectorAll('[data-controls="'+slideshowId+'"]');
			for(var i = 0; i < externalControls.length; i++) {
				(function(i){externalControlSlide(slideshow, externalControls[i]);})(i);
			}
		}
		// custom event to trigger selection of a new slide element
		slideshow.element.addEventListener('selectNewItem', function(event){
			// check if slide is already selected
			if(event.detail) {
				if(event.detail - 1 == slideshow.selectedSlide) return;
				showNewItem(slideshow, event.detail - 1, false);
			}
		});

		// keyboard navigation
		slideshow.element.addEventListener('keydown', function(event){
			if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
				slideshow.showNext();
			} else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
				slideshow.showPrev();
			}
		});
	};

	function navigateSlide(slideshow, event, keyNav) { 
		// user has interacted with the slideshow navigation -> update visible slide
		var target = ( Util.hasClass(event.target, 'js-slideshow__nav-item') ) ? event.target : event.target.closest('.js-slideshow__nav-item');
		if(keyNav && target && !Util.hasClass(target, 'slideshow__nav-item--selected')) {
			slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
			slideshow.moveFocus = true;
			updateAriaLive(slideshow);
		}
	};

	function initAnimationEndEvents(slideshow) {
		// remove animation classes at the end of a slide transition
		for( var i = 0; i < slideshow.items.length; i++) {
			(function(i){
				slideshow.items[i].addEventListener('animationend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
				slideshow.items[i].addEventListener('transitionend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
			})(i);
		}
	};

	function resetAnimationEnd(slideshow, item) {
		setTimeout(function(){ // add a delay between the end of animation and slideshow reset - improve animation performance
			if(Util.hasClass(item,'slideshow__item--selected')) {
				if(slideshow.moveFocus) Util.moveFocus(item);
				emitSlideshowEvent(slideshow, 'newItemVisible', slideshow.selectedSlide);
				slideshow.moveFocus = false;
			}
			Util.removeClass(item, 'slideshow__item--'+slideshow.animationType+'-out-left slideshow__item--'+slideshow.animationType+'-out-right slideshow__item--'+slideshow.animationType+'-in-left slideshow__item--'+slideshow.animationType+'-in-right');
			item.removeAttribute('aria-hidden');
			slideshow.animating = false;
			Util.removeClass(slideshow.element, slideshow.animatingClass); 
		}, 100);
	};

	function showNewItem(slideshow, index, bool) {
		if(slideshow.items.length <= 1) return;
		if(slideshow.animating && slideshow.supportAnimation) return;
		slideshow.animating = true;
		Util.addClass(slideshow.element, slideshow.animatingClass); 
		if(index < 0) index = slideshow.items.length - 1;
		else if(index >= slideshow.items.length) index = 0;
		// skip slideshow item if it is hidden
		if(bool && Util.hasClass(slideshow.items[index], 'is-hidden')) {
			slideshow.animating = false;
			index = bool == 'next' ? index + 1 : index - 1;
			showNewItem(slideshow, index, bool);
			return;
		}
		// index of new slide is equal to index of slide selected item
		if(index == slideshow.selectedSlide) {
			slideshow.animating = false;
			return;
		}
		var exitItemClass = getExitItemClass(slideshow, bool, slideshow.selectedSlide, index);
		var enterItemClass = getEnterItemClass(slideshow, bool, slideshow.selectedSlide, index);
		// transition between slides
		if(!slideshow.animationOff) Util.addClass(slideshow.items[slideshow.selectedSlide], exitItemClass);
		Util.removeClass(slideshow.items[slideshow.selectedSlide], 'slideshow__item--selected');
		slideshow.items[slideshow.selectedSlide].setAttribute('aria-hidden', 'true'); //hide to sr element that is exiting the viewport
		if(slideshow.animationOff) {
			Util.addClass(slideshow.items[index], 'slideshow__item--selected');
		} else {
			Util.addClass(slideshow.items[index], enterItemClass+' slideshow__item--selected');
		}
		// reset slider navigation appearance
		resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
		slideshow.selectedSlide = index;
		// reset autoplay
		slideshow.pauseAutoplay();
		slideshow.startAutoplay();
		// reset controls/navigation color themes
		resetSlideshowTheme(slideshow, index);
		// emit event
		emitSlideshowEvent(slideshow, 'newItemSelected', slideshow.selectedSlide);
		if(slideshow.animationOff) {
			slideshow.animating = false;
			Util.removeClass(slideshow.element, slideshow.animatingClass);
		}
	};

	function getExitItemClass(slideshow, bool, oldIndex, newIndex) {
		var className = '';
		if(bool) {
			className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-out-right' : 'slideshow__item--'+slideshow.animationType+'-out-left'; 
		} else {
			className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-out-left' : 'slideshow__item--'+slideshow.animationType+'-out-right';
		}
		return className;
	};

	function getEnterItemClass(slideshow, bool, oldIndex, newIndex) {
		var className = '';
		if(bool) {
			className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-in-right' : 'slideshow__item--'+slideshow.animationType+'-in-left'; 
		} else {
			className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-in-left' : 'slideshow__item--'+slideshow.animationType+'-in-right';
		}
		return className;
	};

	function resetSlideshowNav(slideshow, newIndex, oldIndex) {
		if(slideshow.navigation) {
			Util.removeClass(slideshow.navigation[oldIndex], 'slideshow__nav-item--selected');
			Util.addClass(slideshow.navigation[newIndex], 'slideshow__nav-item--selected');
			slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
			slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
		}
	};

	function resetSlideshowTheme(slideshow, newIndex) {
		var dataTheme = slideshow.items[newIndex].getAttribute('data-theme');
		if(dataTheme) {
			if(slideshow.navigation) slideshow.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
			if(slideshow.controls[0]) slideshow.controls[0].parentElement.setAttribute('data-theme', dataTheme);
		} else {
			if(slideshow.navigation) slideshow.navigation[0].parentElement.removeAttribute('data-theme');
			if(slideshow.controls[0]) slideshow.controls[0].parentElement.removeAttribute('data-theme');
		}
	};

	function emitSlideshowEvent(slideshow, eventName, detail) {
		var event = new CustomEvent(eventName, {detail: detail});
		slideshow.element.dispatchEvent(event);
	};

	function updateAriaLive(slideshow) {
		slideshow.ariaLive.innerHTML = 'Item '+(slideshow.selectedSlide + 1)+' of '+slideshow.items.length;
	};

	function externalControlSlide(slideshow, button) { // control slideshow using external element
		button.addEventListener('click', function(event){
			var index = button.getAttribute('data-index');
			if(!index || index == slideshow.selectedSlide + 1) return;
			event.preventDefault();
			showNewItem(slideshow, index - 1, false);
		});
	};

	Slideshow.defaults = {
    element : '',
    navigation : true,
    autoplay : false,
		autoplayOnHover: false,
		autoplayOnFocus: false,
    autoplayInterval: 5000,
		navigationItemClass: 'slideshow__nav-item',
    navigationClass: 'slideshow__navigation',
    swipe: false
  };

	window.Slideshow = Slideshow;
	
	//initialize the Slideshow objects
	var slideshows = document.getElementsByClassName('js-slideshow');
	if( slideshows.length > 0 ) {
		for( var i = 0; i < slideshows.length; i++) {
			(function(i){
				var navigation = (slideshows[i].getAttribute('data-navigation') && slideshows[i].getAttribute('data-navigation') == 'off') ? false : true,
					autoplay = (slideshows[i].getAttribute('data-autoplay') && slideshows[i].getAttribute('data-autoplay') == 'on') ? true : false,
					autoplayOnHover = (slideshows[i].getAttribute('data-autoplay-hover') && slideshows[i].getAttribute('data-autoplay-hover') == 'on') ? true : false,
					autoplayOnFocus = (slideshows[i].getAttribute('data-autoplay-focus') && slideshows[i].getAttribute('data-autoplay-focus') == 'on') ? true : false,
					autoplayInterval = (slideshows[i].getAttribute('data-autoplay-interval')) ? slideshows[i].getAttribute('data-autoplay-interval') : 5000,
					swipe = (slideshows[i].getAttribute('data-swipe') && slideshows[i].getAttribute('data-swipe') == 'on') ? true : false,
					navigationItemClass = slideshows[i].getAttribute('data-navigation-item-class') ? slideshows[i].getAttribute('data-navigation-item-class') : 'slideshow__nav-item',
          navigationClass = slideshows[i].getAttribute('data-navigation-class') ? slideshows[i].getAttribute('data-navigation-class') : 'slideshow__navigation';
				new Slideshow({element: slideshows[i], navigation: navigation, autoplay : autoplay, autoplayOnHover: autoplayOnHover, autoplayOnFocus: autoplayOnFocus, autoplayInterval : autoplayInterval, swipe : swipe, navigationItemClass: navigationItemClass, navigationClass: navigationClass});
			})(i);
		}
	}
}());
// File#: _3_advanced-filter
// Usage: codyhouse.co/license
(function() {
  // the AdvFilter object is used to handle: 
  // - number of results
  // - form reset
  // - filtering sections label (to show a preview of the option selected by the users)
  var AdvFilter = function(element) {
    this.element = element; 
    this.form = this.element.getElementsByClassName('js-adv-filter__form');
    this.resultsList = this.element.getElementsByClassName('js-adv-filter__gallery')[0];
    this.resultsCount = this.element.getElementsByClassName('js-adv-filter__results-count');
    initAdvFilter(this);
  };

  function initAdvFilter(filter) {
    if(filter.form.length > 0) {
      // reset form
      filter.form[0].addEventListener('reset', function(event){
        setTimeout(function(){
          resetFilters(filter);
          resetGallery(filter);
        });
      });
      // update section labels on form change
      filter.form[0].addEventListener('change', function(event){
        var section = event.target.closest('.js-adv-filter__item');
        if(section) resetSelection(filter, section);
        else if( event.target.classList.contains('js-adv-filter__form') ) {
          // reset the entire form lables
          var sections = filter.form[0].getElementsByClassName('js-adv-filter__item');
          for(var i = 0; i < sections.length; i++) resetSelection(filter, sections[i]);
        }
      });
    }

    // reset results count
    if(filter.resultsCount.length > 0) {
      filter.resultsList.addEventListener('filter-selection-updated', function(event){
        updateResultsCount(filter);
      });
    }
  };

  function resetFilters(filter) {
    // check if there are custom form elemets - reset appearance
    // custom select
    var customSelect = filter.element.getElementsByClassName('js-select');
    if(customSelect.length > 0) {
      for(var i = 0; i < customSelect.length; i++) customSelect[i].dispatchEvent(new CustomEvent('select-updated'));
    }
    // custom slider
    var customSlider = filter.element.getElementsByClassName('js-slider');
    if(customSlider.length > 0) {
      for(var i = 0; i < customSlider.length; i++) customSlider[i].dispatchEvent(new CustomEvent('slider-updated'));
    }
  };

  function resetSelection(filter, section) {
    // change label value based on input types
    var labelSelection = section.getElementsByClassName('js-adv-filter__selection');
    if(labelSelection.length == 0) return;
    // select
    var select = section.getElementsByTagName('select');
    if(select.length > 0) {
      labelSelection[0].textContent = getSelectLabel(section, select[0]);
      return;
    }
    // input number
    var number = section.querySelectorAll('input[type="number"]');
    if(number.length > 0) {
      labelSelection[0].textContent = getNumberLabel(section, number);
      return;
    }
    // input range
    var slider = section.querySelectorAll('input[type="range"]');
    if(slider.length > 0) {
      labelSelection[0].textContent = getSliderLabel(section, slider);
      return;
    }
    // radio/checkboxes
    var radio = section.querySelectorAll('input[type="radio"]'),
      checkbox = section.querySelectorAll('input[type="checkbox"]');
    if(radio.length > 0) {
      labelSelection[0].textContent = getInputListLabel(section, radio);
      return;
    } else if(checkbox.length > 0) {
      labelSelection[0].textContent = getInputListLabel(section, checkbox);
      return;
    }
  };

  function getSelectLabel(section, select) {
    if(select.multiple) {
      var label = '',
        counter = 0;
      for (var i = 0; i < select.options.length; i++) {
        if(select.options[i].selected) {
          label = label + '' + select.options[i].text;
          counter = counter + 1;
        } 
        if(counter > 1) label = section.getAttribute('data-multi-select-text').replace('{n}', counter);
      }
      return label;
    } else {
      return select.options[select.selectedIndex].text;
    }
  };

  function getNumberLabel(section, number) {
    var counter = 0;
    for(var i = 0; i < number.length; i++) {
      if(number[i].value != number[i].min) counter = counter + 1;
    }
    if(number.length > 1) { // multiple input number in this section
      if(counter > 0) {
        return section.getAttribute('data-multi-select-text').replace('{n}', counter);
      } else {
        return section.getAttribute('data-default-text');
      }
      
    } else {
      if(number[0].value == number[0].min) return section.getAttribute('data-default-text');
      else return section.getAttribute('data-number-format').replace('{n}', number[0].value);
    }
  };

  function getSliderLabel(section, slider) {
    var label = '',
      labelFormat = section.getAttribute('data-number-format');
    for(var i = 0; i < slider.length; i++) {
      if(i != 0 ) label = label+' - ';
      label = label + labelFormat.replace('{n}', slider[i].value);
    }
    return label;
  };

  function getInputListLabel(section, inputs) {
    var counter = 0;
      label = '';
    for(var i = 0; i < inputs.length; i++) {
      if(inputs[i].checked) {
        var labelElement = inputs[i].parentNode.getElementsByTagName('label');
        if(labelElement.length > 0) label = labelElement[0].textContent;
        counter = counter + 1;
      }
    }
    if(counter > 1) return section.getAttribute('data-multi-select-text').replace('{n}', counter);
    else if(counter == 0 ) return section.getAttribute('data-default-text');
    else return label;
  };

  function resetGallery(filter) {
    // emit change event + reset filtering 
    filter.form[0].dispatchEvent(new CustomEvent('change'));
    filter.resultsList.dispatchEvent(new CustomEvent('update-filter-results'));
  };

  function updateResultsCount(filter) {
    var resultItems = filter.resultsList.children,
      counter = 0;
    for(var i = 0; i < resultItems.length; i++) {
      if(isVisible(resultItems[i])) counter = counter + 1;
    }
    filter.resultsCount[0].textContent = counter;
  };

  function isVisible(element) {
		return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
	};
  
  //initialize the AdvFilter objects
	var advFilter = document.getElementsByClassName('js-adv-filter');
	if( advFilter.length > 0 ) {
		for( var i = 0; i < advFilter.length; i++) {
			(function(i){new AdvFilter(advFilter[i]);})(i);
		}
  }

  // Remove the code below if you want to use a custom filtering function (e.g., you need to fetch your results from a database)
  
  // The code below is used for filtering of page content (animation of DOM elements, no fetching results from database).  
  // It uses the Filter component (https://codyhouse.co/ds/components/app/filter) - you can modify the custom filtering functions based on your needs
  // Check the info page of the component for info on how to use it: https://codyhouse.co/ds/components/info/filter
  var gallery = document.getElementById('adv-filter-gallery');
  if(gallery) {
    new Filter({
      element: gallery, // this is your gallery element
      priceRange: function(items){ // this is the price custom function
        var filteredArray = [],
          minVal = document.getElementById('slider-min-value').value,
          maxVal = document.getElementById('slider-max-value').value;
        for(var i = 0; i < items.length; i++) {
          var price = parseInt(items[i].getAttribute('data-price'));
          filteredArray[i] = (price >= minVal) && (price <= maxVal);
        } 
        return filteredArray;
      },
      indexValue: function(items){ // this is the index custom function
        var filteredArray = [],
          value = document.getElementById('index-value').value;
        for(var i = 0; i < items.length; i++) {
          var index = parseInt(items[i].getAttribute('data-sort-index'));
          filteredArray[i] = index >= value;
        } 
        return filteredArray;
      },
      searchInput: function(items) {
        var filteredArray = [],
          value = document.getElementById('search-products').value;
        for(var i = 0; i < items.length; i++) {
          var searchFilter = items[i].getAttribute('data-search');
          filteredArray[i] = searchFilter == '' || searchFilter.toLowerCase().indexOf(value.toLowerCase()) > -1;
        } 
        return filteredArray;
      }
    });
  }
}());
(function() {
  /* 
    Examples of Area Charts
    More on https://codyhouse.co/ds/components/info/area-chart
  */

  var statsCard1 = document.getElementById('stats-card-chart-1');
  if(statsCard1) {
    new Chart({
      element: statsCard1,
      type: 'area',
      xAxis: {
        labels: false,
        guides: false
      },
      yAxis: {
        labels: false,
        range: [0, 16], // 16 is the max value in the chart data
        step: 1
      },
      datasets: [
        {
          data: [1, 2, 3, 12, 8, 7, 10, 4, 9, 5, 16, 3]
        }
      ],
      tooltip: {
        enabled: true,
      },
      padding: 6,
      animate: true
    });
  };

  var statsCard2 = document.getElementById('stats-card-chart-2');
  if(statsCard2) {
    new Chart({
      element: statsCard2,
      type: 'area',
      xAxis: {
        labels: false,
        guides: false
      },
      yAxis: {
        labels: false,
        range: [0, 11], // 11 is the max value in the chart data
        step: 1
      },
      datasets: [
        {
          data: [8, 5, 6, 10, 8, 4, 5, 6, 11, 5, 7, 4]
        }
      ],
      tooltip: {
        enabled: true,
      },
      padding: 6,
      animate: true
    });
  };

  var statsCard3 = document.getElementById('stats-card-chart-3');
  if(statsCard3) {
    new Chart({
      element: statsCard3,
      type: 'area',
      xAxis: {
        labels: false,
        guides: false
      },
      yAxis: {
        labels: false,
        range: [0, 16], // 16 is the max value in the chart data
        step: 1
      },
      datasets: [
        {
          data: [8, 12, 6, 15, 10, 8, 15, 8, 12, 7, 16, 13]
        }
      ],
      tooltip: {
        enabled: true,
      },
      padding: 6,
      animate: true
    });
  };

  var statsCard4 = document.getElementById('stats-card-chart-4');
  if(statsCard4) {
    new Chart({
      element: statsCard4,
      type: 'area',
      xAxis: {
        labels: false,
        guides: false
      },
      yAxis: {
        labels: false,
        range: [0, 16], // 16 is the max value in the chart data
        step: 1
      },
      datasets: [
        {
          data: [5, 16, 3, 2, 9, 7, 16, 3, 10, 4, 9, 5]
        }
      ],
      tooltip: {
        enabled: true,
      },
      padding: 6,
      animate: true
    });
  };

  // Smooth Area Chart
  var areaChart1 = document.getElementById('area-chart-card-1');
  if(areaChart1) {
    new Chart({
      element: areaChart1,
      type: 'area',
      smooth: true,
      xAxis: {
        line: true,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ticks: true
      },
      yAxis: {
        labels: true
      },
      datasets: [
        {
          data: [1, 2, 3, 12, 8, 7, 10, 4, 9, 5, 16, 3]
        }
      ],
      tooltip: {
        enabled: true,
        customHTML: function(index, chartOptions, datasetIndex) {
          return '<span class="color-contrast-medium">'+chartOptions.xAxis.labels[index] + ':</span> $'+chartOptions.datasets[datasetIndex].data[index]+'';
        }
      },
      animate: true
    });
  }

  // Negative Values
  var areaChart2 = document.getElementById('area-chart-card-2');
  if(areaChart2) {
    new Chart({
      element: areaChart2,
      type: 'area',
      fillOrigin: true,
      xAxis: {
        line: true,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ticks: true
      },
      yAxis: {
        labels: true
      },
      datasets: [
        {
          data: [10, 7, 4, -1, -5, -7, -6, -4, -1, 3, 5, 2]
        }
      ],
      tooltip: {
        enabled: true,
        customHTML: function(index, chartOptions, datasetIndex) {
          return '<span class="color-contrast-medium">'+chartOptions.xAxis.labels[index] + ':</span> '+chartOptions.datasets[datasetIndex].data[index]+'$';
        }
      },
      animate: true
    });
  }

  // Multi-Set Area Chart
  var areaChart3 = document.getElementById('area-chart-card-3');
  if(areaChart3) {
    new Chart({
      element: areaChart3,
      type: 'area',
      xAxis: {
        line: true,
        ticks: true,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yAxis: {
        labels: true
      },
      datasets: [
        {data: [5, 7, 11, 13, 18, 16, 17, 13, 16, 8, 15, 8]},
        {data: [1, 2, 3, 6, 4, 11, 9, 10, 9, 4, 7, 3]}
      ],
      tooltip: {
        enabled: true,
        position: 'top',
        customHTML: function(index, chartOptions, datasetIndex) {
          var html = '<p class="margin-bottom-xxs">Total '+chartOptions.xAxis.labels[index] + '</p>';
          html = html + '<p class="flex items-center"><span class="height-xxxs width-xxxs radius-50% bg-primary margin-right-xxs"></span>$'+chartOptions.datasets[0].data[index]+'</p>';
          html = html + '<p class="flex items-center"><span class="height-xxxs width-xxxs radius-50% bg-accent margin-right-xxs"></span>$'+chartOptions.datasets[1].data[index]+'</p>';
          return html;
        }
      },
      animate: true
    });
  }

  // External Data Value Area Chart
  var areaChart4 = document.getElementById('area-chart-card-4');
  if(areaChart4) {
    new Chart({
      element: areaChart4,
      type: 'area',
      xAxis: {
        line: true,
        ticks: true,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yAxis: {
        labels: true
      },
      datasets: [
        {data: [1, 2, 3, 6, 4, 11, 9, 10, 9, 4, 7, 3]},
      ],
      animate: true,
      externalData : {
        customXHTML: function(index, chartOptions, datasetIndex) {
          return ' '+chartOptions.xAxis.labels[index];
        }
      }
    });
  }

  /* 
    Examples of Column Charts
    More on https://codyhouse.co/ds/components/info/column-chart
  */

  // Column Chart
  var columnChart1 = document.getElementById('column-chart-1');
  if(columnChart1) {
    new Chart({
      element: columnChart1,
      type: 'column',
      xAxis: {
        line: true,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ticks: true
      },
      yAxis: {
        labels: true
      },
      datasets: [
        {data: [1, 2, 3, 12, 8, 7, 10, 4, 9, 5, 16, 3]},
      ],
      column: {
        width: '60%',
        gap: '2px',
        radius: '4px'
      },
      tooltip: {
        enabled: true,
        customHTML: function(index, chartOptions, datasetIndex) {
          return '<span class="color-contrast-medium">'+chartOptions.xAxis.labels[index] + ':</span> $'+chartOptions.datasets[datasetIndex].data[index]+'';
        }
      },
      animate: true
    });
  };

  // Negative Values
  var columnChart2 = document.getElementById('column-chart-2');
  if(columnChart2) {
    new Chart({
      element: columnChart2,
      type: 'column',
      xAxis: {
        line: true,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ticks: true
      },
      yAxis: {
        labels: true
      },
      datasets: [
        {data: [1, 4, 8, 5, 3, -2, -5, -7, 4, 9, 5, 10, 3]},
      ],
      column: {
        width: '60%',
        gap: '2px',
        radius: '4px'
      },
      tooltip: {
        enabled: true,
        customHTML: function(index, chartOptions, datasetIndex) {
          return '<span class="color-contrast-medium">'+chartOptions.xAxis.labels[index] + ':</span> '+chartOptions.datasets[datasetIndex].data[index]+'$';
        }
      },
      animate: true
    });
  };

  // Multi-Set Column Chart
  var columnChart3 = document.getElementById('column-chart-3');
  if(columnChart3) {
    new Chart({
      element: columnChart3,
      type: 'column',
      xAxis: {
        line: true,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ticks: true
      },
      yAxis: {
        labels: true
      },
      datasets: [
        {data: [1, 2, 3, 12, 8, 7, 10, 4, 9, 5, 16, 3]},
        {data: [4, 8, 10, 12, 15, 11, 7, 3, 5, 2, 12, 6]}
      ],
      column: {
        width: '60%',
        gap: '2px',
        radius: '4px'
      },
      tooltip: {
        enabled: true,
        customHTML: function(index, chartOptions, datasetIndex) {
          var html = '<p class="margin-bottom-xxs">Total '+chartOptions.xAxis.labels[index] + '</p>';
          html = html + '<p class="flex items-center"><span class="height-xxxs width-xxxs radius-50% bg-primary margin-right-xxs"></span>$'+chartOptions.datasets[0].data[index]+'</p>';
          html = html + '<p class="flex items-center"><span class="height-xxxs width-xxxs radius-50% bg-contrast-higher margin-right-xxs"></span>$'+chartOptions.datasets[1].data[index]+'</p>';
          return html;
        },
        position: 'top'
      },
      animate: true
    });
  };

  // Stacked Column Chart
  var columnChart4 = document.getElementById('column-chart-4');
  if(columnChart4) {
    new Chart({
      element: columnChart4,
      type: 'column',
      stacked: true,
      xAxis: {
        line: true,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ticks: true
      },
      yAxis: {
        labels: true
      },
      datasets: [
        {data: [1, 2, 3, 12, 8, 7, 10, 4, 9, 5, 16, 3]},
        {data: [4, 8, 10, 12, 15, 11, 7, 3, 5, 2, 12, 6]}
      ],
      column: {
        width: '60%', 
        gap: '2px',
        radius: '4px'
      },
      tooltip: {
        enabled: true,
        customHTML: function(index, chartOptions, datasetIndex) {
          var html = '<p class="margin-bottom-xxs">Total '+chartOptions.xAxis.labels[index] + '</p>';
          html = html + '<p class="flex items-center"><span class="height-xxxs width-xxxs radius-50% bg-primary margin-right-xxs"></span>$'+chartOptions.datasets[0].data[index]+'</p>';
          html = html + '<p class="flex items-center"><span class="height-xxxs width-xxxs radius-50% bg-contrast-higher margin-right-xxs"></span>$'+chartOptions.datasets[1].data[index]+'</p>';
          return html;
        },
        position: 'top'
      },
      animate: true
    });
  };

  /* 
    Examples of Line Charts
    More on https://codyhouse.co/ds/components/info/line-chart
  */

  // Smooth Line Chart
  var lineChart1 = document.getElementById('line-chart-1');
  if(lineChart1) {
    new Chart({
      element: lineChart1,
      type: 'line',
      smooth: true,
      xAxis: {
        line: true,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ticks: true
      },
      yAxis: {
        labels: true
      },
      datasets: [
        {
          data: [1, 2, 3, 12, 8, 7, 10, 4, 9, 5, 16, 3]
        }
      ],
      tooltip: {
        enabled: true,
        customHTML: function(index, chartOptions, datasetIndex) {
          return '<span class="color-contrast-medium">'+chartOptions.xAxis.labels[index] + ':</span> $'+chartOptions.datasets[datasetIndex].data[index]+'';
        }
      },
      animate: true
    }); 
  };

  // Timeline Chart
  var lineChart2 = document.getElementById('line-chart-2');
  if(lineChart2) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function getNiceDate(timestamp) {
      // custom function to transform timestamp values to formatted dates
      var date = new Date(timestamp);
      var day = date.getDate(),
        month = date.getMonth();
      return day+' '+months[month]; //e.g., '12 Mar'
    };

    new Chart({
      element: lineChart2,
      type: 'line',
      xAxis: {
        line: true,
        ticks: true,
        labels: true,
        // range: [firstDate, lastDate]
        // use new Date('yyyy-mm-dd').getTime() to get the timestamp value of your date
        range: [new Date('2018-02-25').getTime(), new Date('2018-03-05').getTime()],
        step: (86400000*2), // two days
        labelModifier: function(value) {
          return getNiceDate(value);
        },
      },
      yAxis: {
        legend: 'Temp',
        labels: true
      },
      datasets: [
        {
          data: [
            [new Date('2018-02-25').getTime(), 1], 
            [new Date('2018-02-26').getTime(), 10], 
            [new Date('2018-02-27').getTime(), 7], 
            [new Date('2018-02-28').getTime(), 12], 
            [new Date('2018-03-01').getTime(), 8],
            [new Date('2018-03-02').getTime(), 10], 
            [new Date('2018-03-03').getTime(), 4],
            [new Date('2018-03-04').getTime(), 8], 
            [new Date('2018-03-05').getTime(), 10]
          ]
        }
      ],
      tooltip: {
        enabled: true,
        customHTML: function(index, chartOptions, datasetIndex) {
          return '<span class="color-contrast-medium">'+getNiceDate(chartOptions.datasets[datasetIndex].data[index][0])+' - </span> '+chartOptions.datasets[datasetIndex].data[index][1] + '°C';
        }
      },
      animate: true
    });
  };

  // Multi-Line Chart
  var lineChart3 = document.getElementById('line-chart-3');
  if(lineChart3) {
    new Chart({
      element: lineChart3,
      type: 'line',
      xAxis: {
        line: true,
        ticks: true,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yAxis: {
        labels: true
      },
      datasets: [
        {data: [1, 2, 3, 6, 4, 11, 9, 10, 9, 4, 7, 3]},
        {data: [5, 7, 11, 13, 18, 16, 17, 13, 16, 8, 15, 8]}
      ],
      tooltip: {
        enabled: true,
        position: 'top',
        customHTML: function(index, chartOptions, datasetIndex) {
          var html = '<p class="margin-bottom-xxs">Total '+chartOptions.xAxis.labels[index] + '</p>';
          html = html + '<p class="flex items-center"><span class="height-xxxs width-xxxs radius-50% bg-primary margin-right-xxs"></span>$'+chartOptions.datasets[0].data[index]+'</p>';
          html = html + '<p class="flex items-center"><span class="height-xxxs width-xxxs radius-50% bg-accent margin-right-xxs"></span>$'+chartOptions.datasets[1].data[index]+'</p>';
          return html;
        }
      },
      animate: true
    });
  };

  // External Data Value
  var lineChart4 = document.getElementById('line-chart-4');
  if(lineChart4) {
    new Chart({
      element: lineChart4,
      type: 'line',
      xAxis: {
        line: true,
        ticks: true,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: {
        labels: true
      },
      datasets: [
        {data: [1, 2, 3, 6, 4, 11, 9, 10, 9, 4, 7, 3]},
      ],
      animate: true,
      externalData : {
        customXHTML: function(index, chartOptions, datasetIndex) {
          return ' '+chartOptions.xAxis.labels[index];
        }
      }
    });
  };
}());
// File#: _3_dashboard-navigation
// Usage: codyhouse.co/license
(function() {
  var appUi = document.getElementsByClassName('js-app-ui');
  if(appUi.length > 0) {
    var appMenuBtn = appUi[0].getElementsByClassName('js-app-ui__menu-btn');
    if(appMenuBtn.length < 1) return;
    var appExpandedClass = 'app-ui--nav-expanded';
    var firstFocusableElement = false,
      // we'll use these to store the node that needs to receive focus when the mobile menu is closed 
      focusMenu = false;

    // toggle navigation on mobile
    appMenuBtn[0].addEventListener('click', function(event) {
      var openMenu = !Util.hasClass(appUi[0], appExpandedClass);
      Util.toggleClass(appUi[0], appExpandedClass, openMenu);
      appMenuBtn[0].setAttribute('aria-expanded', openMenu);
      if(openMenu) {
        firstFocusableElement = getMenuFirstFocusable();
        if(firstFocusableElement) firstFocusableElement.focus(); // move focus to first focusable element
      } else if(focusMenu) {
        focusMenu.focus();
        focusMenu = false;
      }
    });

    // listen for key events
    window.addEventListener('keyup', function(event){
      // listen for esc key
      if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
        // close navigation on mobile if open
        if(appMenuBtn[0].getAttribute('aria-expanded') == 'true' && isVisible(appMenuBtn[0])) {
          focusMenu = appMenuBtn[0]; // move focus to menu trigger when menu is close
          appMenuBtn[0].click();
        }
      }
      // listen for tab key
      if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
        // close navigation on mobile if open when nav loses focus
        if(appMenuBtn[0].getAttribute('aria-expanded') == 'true' && isVisible(appMenuBtn[0]) && !document.activeElement.closest('.js-app-ui__nav')) appMenuBtn[0].click();
      }
    });
    
    // listen for resize
    var resizingId = false;
    window.addEventListener('resize', function() {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 500);
    });

    function doneResizing() {
      if( !isVisible(appMenuBtn[0]) && Util.hasClass(appUi[0], appExpandedClass)) appMenuBtn[0].click();
    };

    function getMenuFirstFocusable() {
      var mobileNav = appUi[0].getElementsByClassName('js-app-ui__nav');
      if(mobileNav.length < 1) return false;
      var focusableEle = mobileNav[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"]), [controls], summary'),
        firstFocusable = false;
      for(var i = 0; i < focusableEle.length; i++) {
        if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
          firstFocusable = focusableEle[i];
          break;
        }
      }
      
      return firstFocusable;
    };
    
    function isVisible(element) {
      return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    };
  }
}());
// File#: _3_interactive-table
// Usage: codyhouse.co/license
(function() {
  var IntTable = function(element) {
    this.element = element;
    this.header = this.element.getElementsByClassName('js-int-table__header')[0];
    this.headerCols = this.header.getElementsByTagName('tr')[0].children;
    this.body = this.element.getElementsByClassName('js-int-table__body')[0];
    this.sortingRows = this.element.getElementsByClassName('js-int-table__sort-row');
    initIntTable(this);
  };

  function initIntTable(table) {
    // check if table has actions
    initIntTableActions(table);
    // check if there are checkboxes to select/deselect a row/all rows
    var selectAll = table.element.getElementsByClassName('js-int-table__select-all');
    if(selectAll.length > 0) initIntTableSelection(table, selectAll);
    // check if there are sortable columns
    table.sortableCols = table.element.getElementsByClassName('js-int-table__cell--sort');
    if(table.sortableCols.length > 0) {
      // add a data-order attribute to all rows so that we can reset the order
      setDataRowOrder(table);
      // listen to the click event on a sortable column
      table.header.addEventListener('click', function(event){
        var selectedCol = event.target.closest('.js-int-table__cell--sort');
        if(!selectedCol || event.target.tagName.toLowerCase() == 'input') return;
        sortColumns(table, selectedCol);
      });
      table.header.addEventListener('change', function(event){ // detect change in selected checkbox (SR only)
        var selectedCol = event.target.closest('.js-int-table__cell--sort');
        if(!selectedCol) return;
        sortColumns(table, selectedCol, event.target.value);
      });
      table.header.addEventListener('keydown', function(event){ // keyboard navigation - change sorting on enter
        if( event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {
          var selectedCol = event.target.closest('.js-int-table__cell--sort');
          if(!selectedCol) return;
          sortColumns(table, selectedCol);
        }
      });

      // change cell style when in focus
      table.header.addEventListener('focusin', function(event){
        var closestCell = document.activeElement.closest('.js-int-table__cell--sort');
        if(closestCell) Util.addClass(closestCell, 'int-table__cell--focus');
      });
      table.header.addEventListener('focusout', function(event){
        for(var i = 0; i < table.sortableCols.length; i++) {
          Util.removeClass(table.sortableCols[i], 'int-table__cell--focus');
        }
      });
    }
  };

  function initIntTableActions(table) {
    // check if table has actions and store them
    var tableId = table.element.getAttribute('id');
    if(!tableId) return;
    var tableActions = document.querySelector('[data-table-controls="'+tableId+'"]');
    if(!tableActions) return;
    table.actionsSelection = tableActions.getElementsByClassName('js-int-table-actions__items-selected');
    table.actionsNoSelection = tableActions.getElementsByClassName('js-int-table-actions__no-items-selected');
  };

  function initIntTableSelection(table, select) { // checkboxes for rows selection
    table.selectAll = select[0];
    table.selectRow = table.element.getElementsByClassName('js-int-table__select-row');
    // select/deselect all rows
    table.selectAll.addEventListener('click', function(event){ // we cannot use the 'change' event as on IE/Edge the change from "indeterminate" to either "checked" or "unchecked"  does not trigger that event
      toggleRowSelection(table);
    });
    // select/deselect single row - reset all row selector 
    table.body.addEventListener('change', function(event){
      if(!event.target.closest('.js-int-table__select-row')) return;
      toggleAllSelection(table);
    });
    // toggle actions
    toggleActions(table, table.element.getElementsByClassName('int-table__row--checked').length > 0);
  };

  function toggleRowSelection(table) { // 'Select All Rows' checkbox has been selected/deselected
    var status = table.selectAll.checked;
    for(var i = 0; i < table.selectRow.length; i++) {
      table.selectRow[i].checked = status;
      Util.toggleClass(table.selectRow[i].closest('.int-table__row'), 'int-table__row--checked', status);
    }
    toggleActions(table, status);
  };

  function toggleAllSelection(table) { // Single row has been selected/deselected
    var allChecked = true,
      oneChecked = false;
    for(var i = 0; i < table.selectRow.length; i++) {
      if(!table.selectRow[i].checked) {allChecked = false;}
      else {oneChecked = true;}
      Util.toggleClass(table.selectRow[i].closest('.int-table__row'), 'int-table__row--checked', table.selectRow[i].checked);
    }
    table.selectAll.checked = oneChecked;
    // if status if false but one input is checked -> set an indeterminate state for the 'Select All' checkbox
    if(!allChecked) table.selectAll.indeterminate = oneChecked;
    toggleActions(table, oneChecked);
  };

  function setDataRowOrder(table) { // add a data-order to rows element - will be used when resetting the sorting 
    var rowsArray = table.body.getElementsByTagName('tr');
    for(var i = 0; i < rowsArray.length; i++) {
      rowsArray[i].setAttribute('data-order', i);
    }
  };

  function sortColumns(table, selectedCol, customOrder) {
    // determine sorting order (asc/desc/reset)
    var order = customOrder || getSortingOrder(selectedCol),
      colIndex = Util.getIndexInArray(table.headerCols, selectedCol);
    // sort table
    sortTableContent(table, order, colIndex, selectedCol);
    
    // reset appearance of the th column that was previously sorted (if any) 
    for(var i = 0; i < table.headerCols.length; i++) {
      Util.removeClass(table.headerCols[i], 'int-table__cell--asc int-table__cell--desc');
    }
    // reset appearance for the selected th column
    if(order == 'asc') Util.addClass(selectedCol, 'int-table__cell--asc');
    if(order == 'desc') Util.addClass(selectedCol, 'int-table__cell--desc');
    // reset checkbox selection
    if(!customOrder) selectedCol.querySelector('input[value="'+order+'"]').checked = true;
  };

  function getSortingOrder(selectedCol) { // determine sorting order
    if( Util.hasClass(selectedCol, 'int-table__cell--asc') ) return 'desc';
    if( Util.hasClass(selectedCol, 'int-table__cell--desc') ) return 'none';
    return 'asc';
  };

  function sortTableContent(table, order, index, selctedCol) { // determine the new order of the rows
    var rowsArray = table.body.getElementsByTagName('tr'),
      switching = true,
      i = 0,
      shouldSwitch;
    while (switching) {
      switching = false;
      for (i = 0; i < rowsArray.length - 1; i++) {
        var contentOne = (order == 'none') ? rowsArray[i].getAttribute('data-order') : rowsArray[i].children[index].textContent.trim(),
          contentTwo = (order == 'none') ? rowsArray[i+1].getAttribute('data-order') : rowsArray[i+1].children[index].textContent.trim();

        shouldSwitch = compareValues(contentOne, contentTwo, order, selctedCol);
        if(shouldSwitch) {
          table.body.insertBefore(rowsArray[i+1], rowsArray[i]);
          switching = true;
          break;
        }
      }
    }
  };

  function compareValues(val1, val2, order, selctedCol) {
    var compare,
      dateComparison = selctedCol.getAttribute('data-date-format');
    if( dateComparison && order != 'none') { // comparing dates
      compare =  (order == 'asc' || order == 'none') ? parseCustomDate(val1, dateComparison) > parseCustomDate(val2, dateComparison) : parseCustomDate(val2, dateComparison) > parseCustomDate(val1, dateComparison);
    } else if( !isNaN(val1) && !isNaN(val2) ) { // comparing numbers
      compare =  (order == 'asc' || order == 'none') ? Number(val1) > Number(val2) : Number(val2) > Number(val1);
    } else { // comparing strings
      compare =  (order == 'asc' || order == 'none') 
        ? val2.toString().localeCompare(val1) < 0
        : val1.toString().localeCompare(val2) < 0;
    }
    return compare;
  };

  function parseCustomDate(date, format) {
    var parts = date.match(/(\d+)/g), 
      i = 0, fmt = {};
    // extract date-part indexes from the format
    format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });

    return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
  };

  function toggleActions(table, selection) {
    if(table.actionsSelection && table.actionsSelection.length > 0) {
      Util.toggleClass(table.actionsSelection[0], 'is-hidden', !selection);
    }
    if(table.actionsNoSelection && table.actionsNoSelection.length > 0) {
      Util.toggleClass(table.actionsNoSelection[0], 'is-hidden', selection);
    }
  };

  //initialize the IntTable objects
	var intTable = document.getElementsByClassName('js-int-table');
	if( intTable.length > 0 ) {
		for( var i = 0; i < intTable.length; i++) {
			(function(i){new IntTable(intTable[i]);})(i);
    }
  }
}());
// File#: _3_testimonial-banner
// Usage: codyhouse.co/license
(function() {
  var Tbanner = function(element) {
    this.element = element;
    this.slideshowContent = this.element.getElementsByClassName('js-t-banner__content-slideshow');
    this.slideshowBg = this.element.getElementsByClassName('js-t-banner__bg-slideshow');
    this.navControls = this.element.getElementsByClassName('js-slideshow__control');

    initSlideshow(this);
    initBannerNavigation(this);
  };

  function initSlideshow(banner) {
    // init background and content slideshows
    banner.slideshowContentObj = new Slideshow({element: banner.slideshowContent[0], navigation: false}); 
    banner.slideshowBgObj = new Slideshow({element: banner.slideshowBg[0], navigation: false});
  };

  function initBannerNavigation(banner) {
    if(banner.navControls.length < 2) return;
    // use arrows to navigate the slideshow
    banner.navControls[0].addEventListener('click', function(){
      updateSlideshow(banner, 'prev');
    });

    banner.navControls[1].addEventListener('click', function(){
      updateSlideshow(banner, 'next');
    });
  };

  function updateSlideshow(banner, direction) {
    if(direction == 'next') {
      banner.slideshowContentObj.showNext();
      banner.slideshowBgObj.showNext();
    } else {
      banner.slideshowContentObj.showPrev();
      banner.slideshowBgObj.showPrev();
    }
  };

  // init Tbanner obj
  var tBanner = document.getElementsByClassName('js-t-banner');
  if(tBanner.length > 0) {
    for( var i = 0; i < tBanner.length; i++) {
      new Tbanner(tBanner[i]);
    }
  }
}());