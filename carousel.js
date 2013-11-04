
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
		'subPositionCount': 10,
		'useAnimation': true

	},

	$items: {},
	positionCss: [],
	subPositionCss: [],
	visibleItemIndices: [],

	currentSubPosition: 1,
	myTimeout: null,
	$itemsToAnimate: [],
	direction: null,
	isCurrentlyBeingAnimated: false,


	init: function(options) {
		this.initConfiguration(options);
		this.initCarouselPositionCss();
		this.initControls();
		this.adjustItemPositions();
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
		var o = this.options;

		for (var i = 0; i < o.visibleItemCount; i++) {
			for (var j = 0; j < o.subPositionCount; j++) {
				if (i == o.visibleItemCount-1 && j > 0) {
					break;
				}

				var factor = o.visibleItemScale[i] + (i == o.visibleItemCount-1 ? 0 : (o.visibleItemScale[i+1] - o.visibleItemScale[i]) * j/o.subPositionCount)
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
	getLeftCss: function(fullPosition, subPositionOffset) {
		var o = this.options
		,	left = 0;

		for (i = 0; i <= fullPosition; i++) {
			var itemWidth = o.itemDefaultWidth * o.visibleItemScale[i];

			if (i == fullPosition) {
				itemWidth *= subPositionOffset;
			}

			left += itemWidth;
		};

		return left;
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
		if (this.options.useAnimation) {
			this.direction = "right";
			this.animate();
		} else {
			this.cycleCarousel(-1);
		}
	},
	cycleRight: function(carousel) {
		if (this.options.useAnimation) {
			this.direction = "left";
			this.animate();
		} else {
			this.cycleCarousel(1);
		}
	},
	cycleCarousel: function(delta) {
		this.options.centerItemIndex = this.adjustIndex(this.options.centerItemIndex + delta);
		this.adjustItemPositions();
	},

	adjustItemPositions: function() {
		this.determineVisibleItemIndices();
		this.$items.hide();
		for (var i = 0; i < this.options.visibleItemCount; i++) {
			this.$items.eq(this.visibleItemIndices[i]).css(this.getFullPositionCss(i)).show();
		};
	},
	getFullPositionCss: function(index) {
		return this.positionCss[index * this.options.subPositionCount];
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


	animate: function() {
		var o = this.options;

		if (!this.isCurrentlyBeingAnimated) {
			this.beforeAnimation();
		}

		if (this.currentSubPosition < o.subPositionCount) {
			for (var i = 0; i < this.$itemsToAnimate.length; i++) {
				if (this.direction == "left") {
					this.$itemsToAnimate[i].css(this.positionCss[(i+1)*o.subPositionCount - this.currentSubPosition]);
				} else {
					this.$itemsToAnimate[i].css(this.positionCss[i*o.subPositionCount + this.currentSubPosition]);
				}
			};
			this.currentSubPosition += 1;
			this.myTimeout = setTimeout(function() {
				carousel.animate();
			}, 100/o.subPositionCount);
		} else {
			this.afterAnimation();
		}
	},
	beforeAnimation: function(index) {
		var o = this.options
		,	directionModifier = (this.direction == "left" ? 1 : 0)
		,	$farLeftItem = this.$items.eq(this.visibleItemIndices[0])
		,	$farRightItem = this.$items.eq(this.visibleItemIndices[o.visibleItemCount-1]);

		this.isCurrentlyBeingAnimated = true;

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

		this.isCurrentlyBeingAnimated = false;
		this.currentSubPosition = 1;
		this.$itemsToAnimate = [];
		clearTimeout(this.myTimeout);

		this.options.centerItemIndex = this.adjustIndex(this.options.centerItemIndex + directionModifier);
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


