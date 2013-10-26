
/*

1 collect items
2 collect css needed for different carousel positions (final + animations in between):
	top, left, width, height
3 init initial item positions
4 init controls (buttons, click on item, etc.)

*/


var carousel = {
	options: {
		'containerSelector': '.js-carousel-container',
		'itemSelector': '.js-carousel-item',
		'btnLeftSelector': '.js-carousel-btn-left',
		'btnRightSelector': '.js-carousel-btn-right',

		'visibleItemCount': null,
		'visibleItemScale': [0, 0.5, 0.7, 1.0, 0.7, 0.5, 0],
		'itemDefaultWidth': null,
		'itemDefaultHeight': null,
		'centerItemIndex': null,
		'defaultCenterItemIndex': null,
		'subPositionCount': 8
		

	},
	$items: {},
	positionCss: [],
	subPositionCss: [],
	visibleItemIndices: [],

	init: function(options) {
		this.initConfiguration(options);
		this.initCarouselPositionCss();
		this.initSubPositionCss();
		this.adjustItemPositions();
		this.initControls();
	},


	initConfiguration: function(options) {
		var o = this.options = $.extend({}, this.options, options);

		this.$items = $(o.itemSelector);

		for (key in o) {
			if (o[key] === null && typeof this.calculateOptions[key] == 'function') {
				this.options[key] = this.calculateOptions[key](this);
			};
		};
	},

	initCarouselPositionCss: function() {
		var o = this.options
		,	width = 0
		,	height = 0
		,	top = 0
		,	left = 0
		,	positionCss = this.positionCss
		,	pushPositionCss = function(sizeFactor) {
				width = sizeFactor * o.itemDefaultWidth;
				height = sizeFactor * o.itemDefaultHeight;
				top = (o.itemDefaultHeight - height) / 2;
				positionCss.push({
					'width': width,
					'height': height,
					'top': top,
					'left': left,
					'z-index': sizeFactor*100
				});
				left += width;
			};

		for (var i = 0, visibleItemCount = o.visibleItemScale.length; i < visibleItemCount; i++) {
			pushPositionCss(o.visibleItemScale[i]);
		};
	},

	initSubPositionCss: function() {
		var o = this.options
		,	width = 0
		,	height = 0
		,	top = 0
		,	left = 0
		,	cssObjects
		,	subPositionSizeFactor;

		for (var i = 0; i < o.visibleItemCount-1; i++) {

			width = this.positionCss[i+1].width - this.positionCss[i].width;
			height = this.positionCss[i+1].height - this.positionCss[i].height;
			top = this.positionCss[i+1].top - this.positionCss[i].top;
			left = this.positionCss[i+1].left - this.positionCss[i].left;
			zIndex = this.positionCss[i+1]['z-index'] - this.positionCss[i]['z-index'];

			cssObjects = [];
			for (var j = 0; j < o.subPositionCount; j++) {
				subPositionSizeFactor = j/o.subPositionCount;
				cssObjects.push({
					'width': this.positionCss[i].width + width * subPositionSizeFactor,
					'height': this.positionCss[i].height + height * subPositionSizeFactor,
					'top': this.positionCss[i].top + top * subPositionSizeFactor,
					'left': this.positionCss[i].left + left * subPositionSizeFactor,
					'z-index': this.positionCss[i]['z-index'] + zIndex * subPositionSizeFactor
				});
			};
			this.subPositionCss.push(cssObjects);
		};

	},

	adjustItemPositions: function() {
		this.determineVisibleItemIndices();
		this.$items.hide();
		for (var i = 0; i < this.options.visibleItemCount; i++) {
			this.$items.eq(this.visibleItemIndices[i]).css(this.positionCss[i]).show();
		};
	},
	initControls: function() {
		var o = this.options
		,	self = this
		,	$btnLeft = $(o.btnLeftSelector)
		,	$btnRight = $(o.btnRightSelector);

		$btnLeft.click(function() {
			self.cycleLeft(self);
		});
		$btnRight.click(function() {
			self.cycleRight(self);
		});
	},

	cycleLeft: function(carousel) {
		// this.cycleCarousel(-1);
		this.direction = "right";
		this.animate();
	},
	cycleRight: function(carousel) {
		// this.cycleCarousel(1);
		this.direction = "left";
		this.animate();
	},
	cycleCarousel: function(delta) {
		// this.options.centerItemIndex = this.adjustIndex(this.options.centerItemIndex + delta);
		// this.determineVisibleItemIndices();
		// this.adjustItemPositions();
	},

	determineVisibleItemIndices: function() {
		var o = this.options;
		
		this.visibleItemIndices = [];
		for (var i = 0; i < o.visibleItemCount; i++) {
			var index = this.adjustIndex(o.centerItemIndex + i - o.defaultCenterItemIndex);
			this.visibleItemIndices.push(index);
		};
	},

	adjustIndex: function(index) {
		var itemCount = this.$items.length;

		if (index < 0) {
			index += itemCount;
		} else if (index >= itemCount) {
			index -= itemCount;
		}
		return index;
	},



	x: 0,
	myTimeout: null,
	$itemsToAnimate: [],
	direction: null,
	isAnimating: false,

	animate: function() {

		var o = this.options;

		if (!this.isAnimating) {
			this.beforeAnimation();
		}

		if (this.x < o.subPositionCount) {
			for (var i = 0; i < this.$itemsToAnimate.length; i++) {
				if (this.direction == "left") {
					this.$itemsToAnimate[i].css(this.subPositionCss[i][o.subPositionCount-1 -this.x]);
				} else {
					this.$itemsToAnimate[i].css(this.subPositionCss[i][this.x]);
				}
			};
			this.x += 1;
			this.myTimeout = setTimeout(function() {
				carousel.animate();
			}, 100);
		} else {
			this.afterAnimation();
		}
	},


	beforeAnimation: function(index) {
		var o = this.options
		,	directionModifier = (this.direction == "left" ? 1 : 0)
		,	$farLeftItem = this.$items.eq(this.visibleItemIndices[0])
		,	$farRightItem = this.$items.eq(this.visibleItemIndices[o.visibleItemCount-1]);

		this.isAnimating = true;

		//show and hide items on the far left and right side
		if (this.direction == "left") {
			$farLeftItem.hide();
			$farRightItem.show();
		} else {
			$farLeftItem.show();
			$farRightItem.hide();
		}

		//prepare $itemsToAnimate
		for (var i = 0; i < o.visibleItemCount -1; i++) {
			this.$itemsToAnimate.push(this.$items.eq(this.visibleItemIndices[i+directionModifier]));
		};
	},

	afterAnimation: function(index) {
		var o = this.options
		,	directionModifier = (this.direction == "left" ? 1 : -1);

		this.isAnimating = false;
		this.x = 0;
		this.$itemsToAnimate = [];
		clearTimeout(this.myTimeout);

		this.options.centerItemIndex = this.adjustIndex(this.options.centerItemIndex + directionModifier);
		this.determineVisibleItemIndices();
		this.adjustItemPositions();
	},
























	calculateOptions: {
		visibleItemCount: function(self) {
			var visibleItemCount = self.options.visibleItemScale.length;
			// if (visibleItemCount%2 == 0) {
			// 	throw "number of visible items should be uneven!";
			// }
			return visibleItemCount;
		},
		itemDefaultWidth: function(self) {
			return self.$items.eq(0).width();
		},
		itemDefaultHeight: function(self) {
			return self.$items.eq(0).height();
		},
		centerItemIndex: function(self) {
			var visibleItemCount = self.options.visibleItemScale.length;
			return Math.floor(visibleItemCount/2);
		},
		defaultCenterItemIndex: function(self) {
			return this.centerItemIndex(self);
		}
	}



}


