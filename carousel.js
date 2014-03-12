
;(function($) {

	"use strict";

	var ScrollableTabs = function(element, options) {
		this.init(element, options);
	};

	ScrollableTabs.DEFAULTS = {
	};

	//SPOE =)
	ScrollableTabs.prototype.init = function(element, options) {

		this.options = $.extend({}, ScrollableTabs.DEFAULTS, options);

		this.$innerContainer = $(element).wrap('<div class="scrollable-tabs-outer-container"></div>');
		this.$outerContainer = $('.scrollable-tabs-outer-container');
		this.$items = this.$innerContainer.children();

		this.$innerContainer.append('<div style="clear:both;"></div>');

		this.$innerContainer.addClass('scrollable-tabs-inner-container');
		this.$items.addClass('scrollable-tabs-item');

		this.calculateOptions();
		this.initControls();
	};

	ScrollableTabs.prototype.calculateOptions = function() {
		// var o = this.options;

		// //add one item before and after the visible items. those are needed for fade in/fade out of the outer items during animation
		// o.animatedItemScale = $.merge($.merge([0], o.visibleItemScale), [0]);

		// o.animatedItemCount = o.animatedItemScale.length;
		// o.visibleItemCount = o.visibleItemScale.length;

		// o.itemDefaultWidth = this.$items.eq(0).width();
		// o.itemDefaultHeight = this.$items.eq(0).height();

		// o.defaultCenterItemIndex = Math.floor(o.visibleItemCount/2);
		// if(!o.centerItemIndex) {
		// 	o.centerItemIndex = o.defaultCenterItemIndex;
		// }
	};

	ScrollableTabs.prototype.initControls = function() {
	};

	ScrollableTabs.prototype.initControls = function() {
	};

	$.fn.scrollableTabs = function(option) {
		return this.each(function() {
			var pluginName	= 're.scrollableTabs'
			,	instance	= $(this).data(pluginName);

			if (!instance) {
				if (typeof option != 'object') {
					option = {};
				}
				$(this).data(pluginName, (new ScrollableTabs(this, option)))
			} else if (typeof instance[option] === 'function') {
				instance[option]();
			}
		})
	}

	$.fn.scrollableTabs.Constructor = ScrollableTabs;

}(window.jQuery));




