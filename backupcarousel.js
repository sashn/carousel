

;(function ($) {

	"use strict";

	var SashnCarousel = function () {
		this.$items = {}
		this.positionCss = []
		this.subPositionCss = []
		this.visibleItemIndices = []
		this.currentSubPosition = 1
		this.myTimeout = null
		this.$itemsToAnimate = []
		this.direction = null
		this.isCurrentlyBeingAnimated = false
	}

	SashnCarousel.DEFAULTS = {
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
	}

	SashnCarousel.prototype.init = function(options) {
		this.initConfiguration(options);
		this.initCarouselPositionCss();
		this.initControls();
		this.adjustItemPositions();
	},

	SashnCarousel.prototype.initConfiguration = function(options) {
		var o = this.options = $.extend({}, this.options, options);

		this.$items = $(o.itemSelector);

		for (key in o) {
			if (o[key] === null && typeof this.calculateOptions[key] == 'function') {
				this.options[key] = this.calculateOptions[key](this);
			};
		};
	},
	SashnCarousel.prototype.initCarouselPositionCss = function() {
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
	SashnCarousel.prototype.getLeftCss = function(fullPosition, subPositionOffset) {
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

	SashnCarousel.prototype.initControls = function() {
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
	SashnCarousel.prototype.cycleLeft = function(carousel) {
		if (this.options.useAnimation) {
			this.direction = "right";
			this.animate();
		} else {
			this.cycleCarousel(-1);
		}
	},
	SashnCarousel.prototype.cycleRight = function(carousel) {
		if (this.options.useAnimation) {
			this.direction = "left";
			this.animate();
		} else {
			this.cycleCarousel(1);
		}
	},
	SashnCarousel.prototype.cycleCarousel = function(delta) {
		this.options.centerItemIndex = this.adjustIndex(this.options.centerItemIndex + delta);
		this.adjustItemPositions();
	},

	SashnCarousel.prototype.adjustItemPositions = function() {
		this.determineVisibleItemIndices();
		this.$items.hide();
		for (var i = 0; i < this.options.visibleItemCount; i++) {
			this.$items.eq(this.visibleItemIndices[i]).css(this.getFullPositionCss(i)).show();
		};
	},
	SashnCarousel.prototype.getFullPositionCss = function(index) {
		return this.positionCss[index * this.options.subPositionCount];
	},
	SashnCarousel.prototype.determineVisibleItemIndices = function() {
		var o = this.options;
		
		this.visibleItemIndices = [];
		for (var i = 0; i < o.visibleItemCount; i++) {
			var index = this.adjustIndex(o.centerItemIndex + i - o.defaultCenterItemIndex);
			this.visibleItemIndices.push(index);
		};
	},
	SashnCarousel.prototype.adjustIndex = function(index) {
		var itemCount = this.$items.length;

		if (index < 0) {
			index += itemCount;
		} else if (index >= itemCount) {
			index -= itemCount;
		}
		return index;
	},


	SashnCarousel.prototype.animate = function() {
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
	SashnCarousel.prototype.beforeAnimation = function(index) {
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
	SashnCarousel.prototype.afterAnimation = function(index) {
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



	// CAROUSEL PLUGIN DEFINITION
	// ==========================

	var old = $.fn.carousel

	$.fn.sashnCarousel = function (option) {
		return this.each(function () {
			var $this   = $(this)
			var data    = $this.data('bs.carousel')
			var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
			var action  = typeof option == 'string' ? option : options.slide

			if (!data)
				$this.data('bs.carousel', (data = new Carousel(this, options)))
			if (typeof option == 'number')
				data.to(option)
			else if (action)
				data[action]()
			else if (options.interval)
				data.pause().cycle()
		})
	}

	$.fn.sashnCarousel.Constructor = SashnCarousel;


	// CAROUSEL NO CONFLICT
	// ====================

	$.fn.sashnCarousel.noConflict = function () {
		$.fn.sashnCarousel = old
		return this
	}

}(window.jQuery);









THIS IS HOW BOOTSTRAP DOES IT
THIS IS HOW BOOTSTRAP DOES IT
THIS IS HOW BOOTSTRAP DOES IT
THIS IS HOW BOOTSTRAP DOES IT
THIS IS HOW BOOTSTRAP DOES IT
THIS IS HOW BOOTSTRAP DOES IT
THIS IS HOW BOOTSTRAP DOES IT
THIS IS HOW BOOTSTRAP DOES IT
THIS IS HOW BOOTSTRAP DOES IT
THIS IS HOW BOOTSTRAP DOES IT
THIS IS HOW BOOTSTRAP DOES IT
THIS IS HOW BOOTSTRAP DOES IT










 ========================================================================
 * Bootstrap: carousel.js v3.0.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);




*/
