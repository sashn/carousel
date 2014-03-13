
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
		this.currentItem = 0;

		// save items, then empty container
		if (this.$container.find('.scrollable-tabs-item').length > 0) {
			var $tempItems = this.$container.find('.scrollable-tabs-item');
		} else {
			var $tempItems = this.$container.find('ul li');
		}
		this.$container.empty();

		// buttons
		this.$container.append($('<button class="scrollable-tabs-button-left">prev</button>'));
		this.$container.append($('<button class="scrollable-tabs-button-right">next</button>'));
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
		this.$items = this.$container.find('.scrollable-tabs-item');

		// clearfixes
		this.$container.append($('<div style="clear:both;"></div>'));
		this.$itemsContainer.append($('<div style="clear:both;"></div>'));

		// set items-container width
		this.$itemsContainerWidth = 0;
		for (var i = 0, itemCount = this.$items.length; i < itemCount; i++) {
			var $tempItem = this.$items.eq(i);
			this.$itemsContainerWidth += $tempItem.outerWidth() + parseInt($tempItem.css('margin-left')) + parseInt($tempItem.css('margin-right'));
		};
		this.$itemsContainer.css({width: this.$itemsContainerWidth});

		this.initControls();
	};

	ScrollableTabs.prototype.initControls = function() {
		var self = this;

		this.$btnRight.click(function() {
			self.next();
		});
		this.$btnLeft.click(function() {
			self.previous();
		});
	};

	ScrollableTabs.prototype.next = function() {
		if (this.currentItem < this.$items.length - 1) {
			var newLeft = this.$items.eq(this.currentItem + 1).position().left;
			if (newLeft > this.$itemsContainerWidth - this.$viewport.width()) {
				newLeft = this.$itemsContainerWidth - this.$viewport.width();
			} else {
				this.currentItem += 1;
			}
			this.$itemsContainer.animate({'left': - newLeft});
		}
	};

	ScrollableTabs.prototype.previous = function() {
		if (this.currentItem > 0) {
			var newLeft = this.$items.eq(this.currentItem - 1).position().left;
			if (newLeft > this.$itemsContainerWidth - this.$viewport.width()) {
				newLeft = this.$itemsContainerWidth - this.$viewport.width();
			} else {
				this.currentItem -= 1;
			}
			this.$itemsContainer.animate({'left': - newLeft});
		}
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




