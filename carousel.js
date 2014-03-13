
;(function($) {

	"use strict";

	var ScrollableTabs = function(element, options) {
		this.init(element, options);
	};

	//SPOE =)
	ScrollableTabs.prototype.init = function(element, options) {
		this.$container = $(element).addClass('scrollable-tabs-container');

		this.initMarkup();
		this.initVariables();
		this.initItemsContainerWidth();
		this.initControls();
	};

	/**
	 * init functions
	 */
	ScrollableTabs.prototype.initMarkup = function() {
		var markup = ''
		,	$tempItems = this.$container.find('ul li');

		markup += '<button class="scrollable-tabs-button-left">prev</button>';
		markup += '<button class="scrollable-tabs-button-right">next</button>';
		markup += '<div class="scrollable-tabs-viewport">';
		markup += '<ul class="scrollable-tabs-items-container">';
		for (var i = 0, itemCount = $tempItems.length; i < itemCount; i++) {
			markup += '<li class="scrollable-tabs-item">' + $tempItems.eq(i).html() + '</li>';
		};
		markup += '<div style="clear:both;"></div>';
		markup += '</ul>';
		markup += '</div>';
		markup += '<div style="clear:both;"></div>';

		this.$container.html(markup);
	};
	ScrollableTabs.prototype.initVariables = function() {
		this.$btnLeft = this.$container.find('.scrollable-tabs-button-left');
		this.$btnRight = this.$container.find('.scrollable-tabs-button-right');
		this.$viewport = this.$container.find('.scrollable-tabs-viewport');
		this.$itemsContainer = this.$container.find('.scrollable-tabs-items-container');
		this.$items = this.$container.find('.scrollable-tabs-item');
	};
	ScrollableTabs.prototype.initItemsContainerWidth = function() {
		var itemsContainerWidth = 0;

		for (var i = 0, itemCount = this.$items.length; i < itemCount; i++) {
			itemsContainerWidth += this.$items.eq(i).outerWidth() + parseInt(this.$items.eq(i).css('margin-left')) + parseInt(this.$items.eq(i).css('margin-right'));
		};

		this.$itemsContainer.css({width: itemsContainerWidth});
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

	/**
	 * public functions
	 */
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

	/**
	 * private functions
	 */
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

	ScrollableTabs.prototype.applyOffset = function(offset) {
		this.$itemsContainer.css({'left': - offset});
	};

	ScrollableTabs.prototype.getItemsContainerOffset = function() {
		return parseInt(this.$itemsContainer.css('left')) * -1;
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


