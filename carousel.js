
;(function($) {

	"use strict";

	var SashnCarousel = function(element, options) {
		this.init(element, options);
	};

	SashnCarousel.DEFAULTS = {
		'containerSelector': '.js-carousel-container',
		'itemSelector': '.js-carousel-item',
		'btnLeftSelector': '.js-carousel-btn-left',
		'btnRightSelector': '.js-carousel-btn-right',

		'visibleItemScale': [0.5, 0.7, 1.0, 0.7, 0.5],
		'subPositionCount': 10,
		'useAnimation': true,

		//the following options are being calculated
		'animatedItemScale': null,
		'animatedItemCount': null,
		'visibleItemCount': null,
		'itemDefaultWidth': null,
		'itemDefaultHeight': null,
		'centerItemIndex': null,
		'defaultCenterItemIndex': null
	}

	//SPOE =)
	SashnCarousel.prototype.init = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, SashnCarousel.DEFAULTS, options);
		this.isCurrentlyBeingAnimated = false;
		this.$items = this.$element.find(this.options.itemSelector);
		this.positionCss = [];
		this.visibleItemIndices = [];
		this.currentSubPosition = 1;
		this.myTimeout = null;
		this.$itemsToAnimate = [];
		this.isCurrentlyBeingAnimated = false;

		this.calculateOptions();
		this.initCarouselPositionCss();
		this.adjustItemPositions();
		this.initControls();
	};

	SashnCarousel.prototype.getOptions = function() {
		window.debugvar = this.options;
	};

	SashnCarousel.prototype.calculateOptions = function() {
		var o = this.options;

		//add one item before and after the visible items. those are needed for fade in/fade out of the outer items during animation
		o.animatedItemScale = $.merge($.merge([0], o.visibleItemScale), [0]);

		o.animatedItemCount = o.animatedItemScale.length;
		o.visibleItemCount = o.visibleItemScale.length;

		o.itemDefaultWidth = this.$items.eq(0).width();
		o.itemDefaultHeight = this.$items.eq(0).height();

		o.defaultCenterItemIndex = Math.floor(o.visibleItemCount/2);
		if(!o.centerItemIndex) {
			o.centerItemIndex = o.defaultCenterItemIndex;
		}
	};

	SashnCarousel.prototype.initCarouselPositionCss = function() {
		var o = this.options;

		for (var i = 0; i < o.animatedItemCount; i++) {
			for (var j = 0; j < o.subPositionCount; j++) {
				if (i == o.animatedItemCount-1 && j > 0) {
					break;
				}

				var factor = o.animatedItemScale[i] + (i == o.animatedItemCount-1 ? 0 : (o.animatedItemScale[i+1] - o.animatedItemScale[i]) * j/o.subPositionCount)
				,	width = o.itemDefaultWidth * factor
				,	height = o.itemDefaultHeight * factor
				,	top = (o.itemDefaultHeight - height) / 2
				,	left = this.getLeftCss(i, j/o.subPositionCount);

				this.positionCss.push({
					'width': width,
					'height': height,
					'top': top,
					'left': left,
					'z-index': factor * 100
				});
			};
		};
	},

	SashnCarousel.prototype.getLeftCss = function(fullPosition, subPositionOffset) {
		var o = this.options
		,	left = 0;

		for (var i = 0; i <= fullPosition; i++) {
			var itemWidth = o.itemDefaultWidth * o.animatedItemScale[i];

			if (i == fullPosition) {
				itemWidth *= subPositionOffset;
			}

			left += itemWidth;
		};

		return left;
	},

	SashnCarousel.prototype.adjustItemPositions = function() {
		this.determineVisibleItemIndices();
		this.$items.hide();
		for (var i = 0; i < this.options.visibleItemCount; i++) {
			//this.getFullPositionCss(i+1) <-- the +1 is needed, because this.positionCss already contains the css for the fade in/fade out (outer) item, which needs to be skipped in this situation
			this.$items.eq(this.visibleItemIndices[i]).css(this.getFullPositionCss(i+1)).show();
		};
	},

	SashnCarousel.prototype.getFullPositionCss = function(index) {
		return this.positionCss[index * this.options.subPositionCount];
	},

	SashnCarousel.prototype.determineVisibleItemIndices = function() {
		var o = this.options;
		
		this.visibleItemIndices = [];
		for (var i = 0; i < o.visibleItemCount; i++) {
			var index = this.adjustIndex(o.centerItemIndex + i - o.defaultCenterItemIndex);
			this.visibleItemIndices.push(index);
		};
	},

	SashnCarousel.prototype.adjustIndex = function(index) {
		var itemCount = this.$items.length;

		if (index < 0) {
			index += itemCount;
		} else if (index >= itemCount) {
			index -= itemCount;
		}
		return index;
	},

	SashnCarousel.prototype.initControls = function() {
		var o = this.options
		,	self = this
		,	action = o.useAnimation ? 'animate' : 'cycle'
		,	$btnLeft = this.$element.find(o.btnLeftSelector)
		,	$btnRight = this.$element.find(o.btnRightSelector);

		$btnLeft.click(function() {
			self[action]('left');
		});
		$btnRight.click(function() {
			self[action]('right');
		});
	},

	SashnCarousel.prototype.cycle = function(direction) {
		var o = this.options
		,	delta = direction == 'left' ? -1 : 1;

		o.centerItemIndex = this.adjustIndex(o.centerItemIndex + delta);
		this.adjustItemPositions();
	}

	SashnCarousel.prototype.animate = function(direction) {
		var o = this.options;

		//start animation
		if (!this.isCurrentlyBeingAnimated) {
			var directionModifier = direction == 'left' ? 1 : 0
			,	$farLeftItem = this.$items.eq(this.adjustIndex(o.centerItemIndex - Math.floor(o.animatedItemCount/2)))
			,	$farRightItem = this.$items.eq(this.adjustIndex(o.centerItemIndex + Math.floor(o.animatedItemCount/2)));

			this.isCurrentlyBeingAnimated = true;

			//show and hide items on the far left and right side
			if (direction == 'left') {
				$farLeftItem.hide();
				$farRightItem.show();
			} else {
				$farLeftItem.show();
				$farRightItem.hide();
			}

			//prepare $itemsToAnimate
			for (var i = 0; i < o.animatedItemCount -1; i++) {
				this.$itemsToAnimate.push(this.$items.eq(this.adjustIndex(o.centerItemIndex - Math.floor(o.animatedItemCount/2) +i +directionModifier)));
			};
		}

		if (this.currentSubPosition < o.subPositionCount) {
			for (var i = 0; i < this.$itemsToAnimate.length; i++) {
				if (direction == 'left') {
					this.$itemsToAnimate[i].css(this.positionCss[(i+1)*o.subPositionCount - this.currentSubPosition]);
				} else {
					this.$itemsToAnimate[i].css(this.positionCss[i*o.subPositionCount + this.currentSubPosition]);
				}
			};
			this.currentSubPosition += 1;
			this.myTimeout = setTimeout(function(that, direction) {
				return function() {
					that.animate(direction);
				};
			}(this, direction), 100/o.subPositionCount);
		} else {
			//end animation
			var directionModifier = direction == 'left' ? 1 : -1;

			this.isCurrentlyBeingAnimated = false;
			this.currentSubPosition = 1;
			this.$itemsToAnimate = [];
			clearTimeout(this.myTimeout);

			o.centerItemIndex = this.adjustIndex(o.centerItemIndex + directionModifier);
			this.adjustItemPositions();
		}
	},











	$.fn.sashnCarousel = function(option) {
		return this.each(function() {
			var pluginName	= 'svm.sashnCarousel'
			,	instance	= $(this).data(pluginName);

			if (!instance) {
				if (typeof option != 'object') {
					option = {};
				}
				$(this).data(pluginName, (new SashnCarousel(this, option)))
			} else if (typeof instance[option] === 'function') {
				instance[option]();
			}
		})
	}

	// Constructor nachforschen
	// ====================
	$.fn.sashnCarousel.Constructor = SashnCarousel;

	// NO CONFLICT nachforschen
	// ====================

}(window.jQuery));




