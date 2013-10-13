
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
		'visibleItemScale': [0.5, 0.7, 1.0, 0.7, 0.5],
		'itemDefaultWidth': null,
		'itemDefaultHeight': null,
		'centerItemIndex': null,
		'defaultCenterItemIndex': null
		

	},
	$items: {},
	positionCss: [],
	visibleItemIndices: [],

	init: function(options) {
		this.initConfiguration(options);
		this.initCarouselPositionCss();
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


		//push css for left vanishing state
		pushPositionCss(0);

		//push css for left vanishing state
		for (var i = 0, visibleItemCount = o.visibleItemScale.length; i < visibleItemCount; i++) {
			pushPositionCss(o.visibleItemScale[i]);
		};

		//push css for right vanishing state
		pushPositionCss(0);
	},
	adjustItemPositions: function() {
		this.determineVisibleItemIndices();
		this.$items.hide();
		for (var i = this.visibleItemIndices.length - 1; i >= 0; i--) {
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
		carousel.cycleCarousel(-1);
	},
	cycleRight: function(carousel) {
		carousel.cycleCarousel(1);
	},
	cycleCarousel: function(delta) {
		this.options.centerItemIndex = this.adjustIndex(this.options.centerItemIndex + delta);
		this.determineVisibleItemIndices();
		this.adjustItemPositions();
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

	calculateOptions: {
		visibleItemCount: function(self) {
			var visibleItemCount = self.options.visibleItemScale.length +2; //add 2 for vanishing states
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


