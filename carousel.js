

;(function($) {

	"use strict";

	var SashnCarousel = function(element, options) {
		this.$element = $(element);

		this.init();
	};

	SashnCarousel.prototype.init = function() {
		console.log(this.$element);
	};

	$.fn.sashnCarousel = function(option) {
		return this.each(function() {
			var pluginName	= 'svm.sashnCarousel'
			,	instance	= $(this).data(pluginName);

			if (!instance) {
				$(this).data(pluginName, (new SashnCarousel(this, option)))
			} else if (typeof instance[option] === 'function') {
				instance[option]();
			}
		})
	}

	// Constructor nachforschen
	// ====================
	$.fn.sashnCarousel.Constructor = SashnCarousel;

	// NO CONFLICT nachforschen
	// ====================

}(window.jQuery));




