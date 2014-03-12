
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
		this.prepareMarkup(element);

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

	ScrollableTabs.prototype.prepareMarkup = function(element) {
		var markup = ''
		,	containerId = $(element).attr('id') != undefined ? ' id="' + $(element).attr('id') + '"' : ''
		,	containerClasses = $(element).attr('class') != undefined ? ' ' + $(element).attr('class') + '"' : ''
		,	$items = $(element).children();

		markup += '<div' + containerId + ' class="scrollable-tabs-container' + containerClasses + '">';
		markup += '<button class="scrollable-tabs-button-prev">prev</button>';
		markup += '<button class="scrollable-tabs-button-next">next</button>';
		markup += '<div class="scrollable-tabs-viewport">';
		markup += '<ul class="scrollable-tabs-items-container">';
		for (var i = 0, itemCount = $items.length; i < itemCount; i++) {
			markup += '<li class="scrollable-tabs-item">' + $items.eq(i).html() + '</li>';
		};
		markup += '<div style="clear:both;"></div>';
		markup += '</ul>';
		markup += '</div>';
		markup += '<div style="clear:both;"></div>';
		markup += '</div>';

		$(element).replaceWith(markup);
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




