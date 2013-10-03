
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

		'itemCount': null,
		'itemScale': [0.5, 0.7, 1.0, 0.7, 0.5],
		'itemDefaultWidth': null,
		'itemDefaultHeight': null
		

	},
	$items: {},
	positionCss: {},

	init: function(options) {
		this.options = $.extend({}, this.options, options);
		this.$items = $(this.options.itemSelector);

		this.recalculateOptions();
		this.calculateCss();
		this.initItemPositions();
		// this.initControls();
	},
	recalculateOptions: function() {
		var o = this.options;

		for (key in o) {
			if (o[key] === null) {
				if (key == 'itemCount') {
					this.options[key] = o.itemScale.length;
					if (this.options[key]%2 == 0) {
						throw "number of items should always be uneven!";
					}
				} else if (key == 'itemDefaultWidth') {
					this.options[key] = this.$items.eq(0).width();
				} else if (key == 'itemDefaultHeight') {
					this.options[key] = this.$items.eq(0).height();
				};
			};
		};
	},
	calculateCss: function() {
		var o = this.options
		,	width
		,	height
		,	top
		,	left;

		for (var i = 0; i < o.itemCount; i++) {
			width = o.itemScale[i] * o.itemDefaultWidth;
			height = o.itemScale[i] * o.itemDefaultHeight;
			top = (o.itemDefaultHeight - height) / 2;
			left = 0;
			for (var j = 0; j < i; j++) {
				left += this.positionCss[j].width;
			};
			this.positionCss[i] = {
				'width': width,
				'height': height,
				'top': top,
				'left': left,
				'z-index': o.itemScale[i]*100
			};
		};
	},
	initItemPositions: function() {
		this.$items.hide();
		for (var i = 0; i < this.options.itemCount; i++) {
			this.$items.eq(i).css(this.positionCss[i]).show()
		};
	},
	initControls: function() {
		var o = this.options
		,	btnLeft = $(o.btnLeftSelector).get(0)
		,	btnRight = $(o.btnRightSelector).get(0);

		btnLeft.onclick = this.cycleLeft;
		btnRight.onclick = this.cycleRight;
	},
	cycleLeft: function() {
		console.log("cycleLeft");
	},
	cycleRight: function() {
		console.log("cycleRight");
	}





}


