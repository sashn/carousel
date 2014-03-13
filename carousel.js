
;(function($) {

	"use strict";

	var ScrollableTabs = function(element, options) {
		this.init(element, options);
	};

	ScrollableTabs.DEFAULTS = {
	};

	//SPOE =)
	ScrollableTabs.prototype.init = function(element, options) {
		this.$container = $(element).addClass('scrollable-tabs-container');
		this.options = $.extend({}, ScrollableTabs.DEFAULTS, options);

		// save items, then empty container
		if (this.$container.find('.scrollable-tabs-item').length > 0) {
			var $tempItems = this.$container.find('.scrollable-tabs-item');
		} else {
			var $tempItems = this.$container.find('ul li');
		}
		this.$container.empty();

		// buttons
		this.$container.append($('<button class="scrollable-tabs-button-left">prev</button>'));
		this.$container.append($('<button class="scrollable-tabs-button-right">prev</button>'));
		this.$btnLeft = this.$container.find('.scrollable-tabs-button-left');
		this.$btnRight = this.$container.find('.scrollable-tabs-button-right');

		// viewport
		this.$container.append($('<div class="scrollable-tabs-viewport"></div>'));
		this.$viewport = this.$container.find('.scrollable-tabs-viewport');

		// items
		this.$viewport.append($('<ul class="scrollable-tabs-items-container"></ul>'));
		this.$itemsContainer = this.$container.find('.scrollable-tabs-items-container');
		for (var i = 0, itemCount = $tempItems.length; i < itemCount; i++) {
			this.$itemsContainer.append($('<li class="scrollable-tabs-item">' + $tempItems.eq(i).html() + '</li>'));
		};

		// clearfixes
		this.$container.append($('<div style="clear:both;"></div>'));
		this.$itemsContainer.append($('<div style="clear:both;"></div>'));

		this.initControls();
	};

	ScrollableTabs.prototype.initControls = function() {
		// var self = this;

		// this.$btnRight.click(function() {
		// 	self.next();
		// });
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




