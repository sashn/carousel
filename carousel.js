
;(function($) {

	"use strict";

	var ScrollableTabs = function(element, options) {
		this.init(element, options);
	};

	//SPOE =)
	ScrollableTabs.prototype.init = function(element, options) {
		this.$container = $(element).addClass('scrollable-tabs-container');
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

	ScrollableTabs.prototype.getCurrentItemIndex = function() {
		var visibleItemIndex = false
		,	itemsContainerOffset = this.getItemsContainerOffset();

		this.$items.each(function(i) {
			visibleItemIndex = i;

			//is fully visible?
			if ($(this).position().left >= itemsContainerOffset) {
			    return false;
			}
		});

		return visibleItemIndex;
	};

	ScrollableTabs.prototype.lastItemReached = function(offset) {
		var viewportWidth = this.$viewport.width()
		,	itemsContainerWidth = this.$itemsContainer.width()
		,	offset = offset || this.getItemsContainerOffset();

		return offset + viewportWidth >= itemsContainerWidth;
	};

	ScrollableTabs.prototype.goToRightBorder = function() {
		var viewportWidth = this.$viewport.width()
		,	itemsContainerWidth = this.$itemsContainer.width();

		this.applyOffset(itemsContainerWidth - viewportWidth);
	};

	ScrollableTabs.prototype.goToItem = function() {
		
	};

	ScrollableTabs.prototype.applyOffset = function(offset) {
		this.$itemsContainer.animate({'left': - offset});
	};

	ScrollableTabs.prototype.getItemsContainerOffset = function() {
		return parseInt(this.$itemsContainer.css('left')) * -1;
	};

	ScrollableTabs.prototype.resizeHandler = function() {

		// if is at end

		// 	go to end

	};

	ScrollableTabs.prototype.next = function() {
		if (this.lastItemReached()) { //if is at end
			return false;
		}

		var nextItemOffset = this.$items.eq(this.getCurrentItemIndex() + 1).position().left;

		if (this.lastItemReached(nextItemOffset)) { //if next step will arrive at end
			this.goToRightBorder();
		} else {
			this.applyOffset(nextItemOffset);
		}
	};

	ScrollableTabs.prototype.previous = function() {
		if (this.getItemsContainerOffset() <= 0) { //if is at beginning
			return false;
		}

		var previousItemOffset = this.$items.eq(this.getCurrentItemIndex() - 1).position().left;

		this.applyOffset(previousItemOffset);
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




