
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
		'animationStepCount': 10,
		'useAnimation': true,

		//the following options are being calculated
		'animatedItemScale': null,
		'animatedItemCount': null,
		'visibleItemCount': null,
		'itemDefaultWidth': null,
		'itemDefaultHeight': null,
		'centerItemIndex': null,
		'defaultCenterItemIndex': null
	};

	//SPOE =)
	SashnCarousel.prototype.init = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, SashnCarousel.DEFAULTS, options);
		this.isCurrentlyBeingAnimated = false;
		this.$items = this.$element.find(this.options.itemSelector);
		this.visibleItemIndices = [];
		this.currentSubPosition = 1;
		this.myTimeout = null;
		this.$itemsToAnimate = [];
		this.isCurrentlyBeingAnimated = false;

		this.calculateOptions();
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

	SashnCarousel.prototype.getPositionCss = function(pos, step) {
		var o = this.options
		,	step = step || 0
		,	factor = o.animatedItemScale[pos] + (pos == o.animatedItemCount-1 ? 0 : (o.animatedItemScale[pos+1] - o.animatedItemScale[pos]) * step/o.animationStepCount)
		,	width = o.itemDefaultWidth * factor
		,	height = o.itemDefaultHeight * factor
		,	getLeftCss = function(pos, step) {
				var left = 0;
				for (var i = 0; i <= pos; i++) {
					var itemWidth = o.itemDefaultWidth * o.animatedItemScale[i];
					if (i == pos) {
						itemWidth *= step;
					}
					left += itemWidth;
				};
				return left;
			};

		return {
			'width': width,
			'height': height,
			'top': (o.itemDefaultHeight - height) / 2,
			'left': getLeftCss(pos, step/o.animationStepCount),
			'z-index': factor * 100
		};
	};

	SashnCarousel.prototype.adjustItemPositions = function() {
		this.determineVisibleItemIndices();
		this.$items.hide();
		for (var i = 0; i < this.options.visibleItemCount; i++) {
			//this.getPositionCss(i+1) <-- the +1 is needed, because this.getPositionCss already returns the css for the fade in/fade out (outer) item, which needs to be skipped in this situation
			this.$items.eq(this.visibleItemIndices[i]).css(this.getPositionCss(i+1)).show();
		};
	};

	SashnCarousel.prototype.determineVisibleItemIndices = function() {
		var o = this.options;
		
		this.visibleItemIndices = [];
		for (var i = 0; i < o.visibleItemCount; i++) {
			var index = this.adjustIndex(o.centerItemIndex + i - o.defaultCenterItemIndex);
			this.visibleItemIndices.push(index);
		};
	};

	SashnCarousel.prototype.adjustIndex = function(index) {
		var itemCount = this.$items.length;

		if (index < 0) {
			index += itemCount;
		} else if (index >= itemCount) {
			index -= itemCount;
		}
		return index;
	};

	SashnCarousel.prototype.initControls = function() {
		var o = this.options
		,	self = this
		,	$btnLeft = this.$element.find(o.btnLeftSelector)
		,	$btnRight = this.$element.find(o.btnRightSelector);

		$btnLeft.click(function() {
			self.animate('left');
		});
		$btnRight.click(function() {
			self.animate('right');
		});
	};

	SashnCarousel.prototype.animate = function(direction) {
		var o = this.options;

		//start animation
		if (!this.isCurrentlyBeingAnimated) {
			var directionModifier = direction == 'left' ? 0 : 1
			,	$farLeftItem = this.$items.eq(this.adjustIndex(o.centerItemIndex - Math.floor(o.animatedItemCount/2)))
			,	$farRightItem = this.$items.eq(this.adjustIndex(o.centerItemIndex + Math.floor(o.animatedItemCount/2)));

			this.isCurrentlyBeingAnimated = true;

			//show and hide items on the far left and right side
			if (direction == 'left') {
				$farLeftItem.show();
				$farRightItem.hide();
			} else {
				$farLeftItem.hide();
				$farRightItem.show();
			}

			//prepare $itemsToAnimate
			for (var i = 0; i < o.animatedItemCount -1; i++) {
				this.$itemsToAnimate.push(this.$items.eq(this.adjustIndex(o.centerItemIndex - Math.floor(o.animatedItemCount/2) +i +directionModifier)));
			};
		}

		if (this.currentSubPosition < o.animationStepCount) {
			for (var i = 0; i < this.$itemsToAnimate.length; i++) {
				if (direction == 'left') {
					this.$itemsToAnimate[i].css(this.getPositionCss(i, this.currentSubPosition));
				} else {
					this.$itemsToAnimate[i].css(this.getPositionCss(i, o.animationStepCount-this.currentSubPosition));
				}
			};
			this.currentSubPosition += 1;
			this.myTimeout = setTimeout(function(that, direction) {
				return function() {
					that.animate(direction);
				};
			}(this, direction), 100/o.animationStepCount);
		} else {
			//end animation
			var directionModifier = direction == 'left' ? -1 : 1;

			this.isCurrentlyBeingAnimated = false;
			this.currentSubPosition = 1;
			this.$itemsToAnimate = [];
			clearTimeout(this.myTimeout);

			o.centerItemIndex = this.adjustIndex(o.centerItemIndex + directionModifier);
			this.adjustItemPositions();
		}
	};


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




