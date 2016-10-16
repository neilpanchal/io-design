(function($) {

	$.pjaxTransition = function(options) {

		if (!$.support.pjax) return;

		var defaults = {
			container: '.pjax-transition-container',
			linkSelector: 'a',
			transition: function() {
				var el = this.next.find('[data-pjax-transition]');
				if (!el.length) {
					el = this.next;
				}

				el.css('opacity', 0);
				this.current.replaceWith(this.next);

				this.fire('start');

				el.animate({ opacity: 1 }, options.duration / 2, $.proxy(function() {
					this.done();
				}, this));
			},
			beforeTransition: function() {
				var el = this.current.find('[data-pjax-transition]');
				if (!el.length) {
					el = this.current;
				}
				el.animate({ opacity: 0 }, options.duration / 2, $.proxy(function() {
					this.transition();
				}, this));
			},
			duration: 500,
			animateHistory: false,
			loadWhileAnimating: false,
			scrollTo: 0
		};

		options = $.extend({}, defaults, options);

		var first = $(options.container + ':first');
		first.addClass('pjax-container-current');

		// Need to setup and fill staging div with initial value of container
		// so that back button works.
		$('<script />')
			.attr('id', 'pjax-container-staging')
			.attr('type', 'text/html')
			.html($('.pjax-container-current').clone())
			.appendTo('body');

		// API object to pass to transition functions
		var api = {
			ready: false,
			context: first.parent(),
			scriptTag: false,
			fire: function(name) {
				this.context.trigger('pjax:transition:' + name);
			},
			transition: function() {
				if (this.ready && this.next) {
					if (options.scrollTo === false) {
						this.next.css('height', this.current.height());
					} else {
						$(window).scrollTop(typeof options.scrollTo === 'function' ? options.scrollTo.call(this) : options.scrollTo);
					}
					this.next.addClass('pjax-container-current');
					options.transition.apply(this, [ options ]);
				} else {
					this.ready = true;
				}
			},
			done: function() {
				this.insertScripts();

				$('.pjax-container-current').find('iframe').each(function() {
					$(this).attr('src', $(this).attr('data-src'));
				});

				setTimeout($.proxy(function() {
					this.next.css('height', '');
					this.next = false;
				}, this), 100);

				this.fire('end');
				this.ready = false;
			},
			insertScripts: function() {
				if (this.scriptTag) {
					this.next.append(this.scriptTag);
					this.scriptTag = false;
				}
			}
		}

		// Keep track of whether the current pjax is a popState event.
		// We only want to react to pjax:end if it is.
		var isPop = false;
		$(document).on('pjax:popstate', function() {
			isPop = true;
		});

		var lastHref = '';

		$(document).on('click', options.linkSelector, function(e) {
			if (e.currentTarget.href === lastHref) {
				e.preventDefault();
				return false;
			}
			lastHref = e.currentTarget.href;
		});

		$(document).on('pjax:start', function() {
			api.current = $('.pjax-container-current:first');
			api.fire('begin');

			if (typeof options.beforeTransition === 'function' && options.loadWhileAnimating) {
				options.beforeTransition.apply(api, [ options ]);
			} else {
				api.ready = true;
			}
		});

		var nextTimeoutLength = 0;

		$(document).on('pjax:success pjax:end', function(event, xhr, pjaxOptions) {
			// Only respond to pjax:end when browser's forward/back button is used
			if (event.type === 'pjax:end' && !isPop) return;
			isPop = false;

			// setTimeout here to give pjax popState a chance to render.
			// Could probably use requestAnimationFrame here but lazy.
			setTimeout(function() {
				api.next = $('#pjax-container-staging').find(options.container).clone();

				api.next.find('iframe').each(function() {
					$(this).attr('data-src', $(this).attr('src'));
					$(this).attr('src', null);
				});

				// Remove scripts. We'll reinsert them in api.insertScripts once the element
				// has been moved out of the staging area.
				var scripts = api.next.find('script');
				if (scripts.length) {
					api.scriptTag = $('<script/>');
					scripts.each(function() {
						api.scriptTag.append($(this).html());
					});
					scripts.remove();
				} else {
					api.scriptTag = false;
				}

				if (event.type === 'pjax:end' && !options.animateHistory) {
					api.fire('beforeRestore');
					api.next.addClass('pjax-container-current');
					api.current.replaceWith(api.next);
					api.done();
					api.fire('restore');
				} else {
					if (options.loadWhileAnimating || typeof options.beforeTransition !== 'function') {
						api.transition();
					} else {
						options.beforeTransition.apply(api, [ options ]);
					}
				}
			}, nextTimeoutLength);

			nextTimeoutLength = event.type === 'pjax:end' ? 250 : 0;
		});

		$(document).pjax(options.linkSelector, '#pjax-container-staging', { scrollTo: false });
	}

})( jQuery );
