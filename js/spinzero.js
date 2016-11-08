window.SpinZero = {
	Pillar: {
		spacing: false,
		maxCols: false,
		init: function() {
			$('#kpgrid_content')
				.pillar({
					items: '.kpgriditem',
					spacing: this.spacing,
					flush: true,
					columns: {
				        '479': this.mobCol,
				        '767': this.mobCol,
				        '944': this.tabletCol,
				        '1024': this.tabletCol,
				        'max': this.maxCols // Width > than highest set width (949 in this case) get 5 columns; max is required when using breakpoints
				    },
				    imageLoaded: function() {
				    	$(this).closest('.kpgriditem').addClass('loaded')
				    },
				    variability: this.variability,
				    variabilityAmt: this.variability_amt
				});
		}
	}
};

$(document).on('k-img-resize', function(e, img) {
	var $img = $(img);
	if ($img.hasClass('k-lazy-loading')) {
		$img.parent().parent().find('.spinner_pos').addClass('active');
	}
});

$(document).on('k-image-loading', function(e, img) {
	var $img = $(img),
		$embed = $img.closest('.k-content-embed');

	if ($embed.length) {
		$embed
			.prepend('<div class="spinner_pos active"><div class="spinner"></div></div>')
			.css('position', 'relative');
	}
})

$(document).on('k-image-fading', function(e) {
	$(e.target).parent().parent().find('.spinner_pos').removeClass('active');
});

$(document).on('k-image-loaded', function(e) {
	$(e.target).closest('figure').find('.spinner_pos').removeClass('active');
	$(e.target).parent().find('.spinner_pos').remove();
})

$(document).on('pjax:transition:start pjax:transition:restore', function() {
	SpinZero.Pillar.init();
});

$(document).on('pjax:transition:begin', function() {
	$K.infinity.pause();
});

$(document).on('pjax:timeout', function(event) {
  // Prevent default timeout redirection behavior
  event.preventDefault()
});

window.NProgress && NProgress.configure({ showSpinner: false });

$(document).on('pjax:transition:begin koken:lightbox:loading', function() {
	window.NProgress && NProgress.start();
	$.sidr('close', 'sidr-left');
});

$(document).on('pjax:transition:start pjax:transition:end koken:lightbox:loaded', function() {
	window.NProgress && NProgress.done();
	$.sidr('close', 'sidr-left');
});

$(function() {
	$('#mob-menu').sidr({
		name: 'sidr-left'
	});

	$.pjaxTransition({
		linkSelector: 'a[data-koken-internal]',
		loadWhileAnimating: true
	});

	SpinZero.Pillar.init();

	var lastScrollTop = 0, delta = 5;
    $(window).scroll(function(event){

    	if ( $('body').hasClass('footer_hide') && $('footer.main').is(":visible") ) {

			var st = $(this).scrollTop();

			if(Math.abs(lastScrollTop - st) <= delta)
			return;

			if (st > lastScrollTop && st > 0) {
				var fh = $('footer.main').outerHeight() * -1;
				$('footer.main').css('bottom',fh);
			} else {
				$('footer.main').css('bottom',0);
			}
			lastScrollTop = st;

		}

	});

});

$(window).on('k-resize', function() {
	var box = $('#title_ph');
	if (box.length > 0) {
		var rh = Math.round($('header.main').height() - 10);
		box.html( 'Recommended hi-res image height: '  + rh + 'px');
	}
});

$(document).on('click', '.cover_scroll_link', function() {
	$.scrollTo(this.hash, 500, {easing:'swing'} );
	return false;
});
document.addEventListener("DOMContentLoaded",
    function() {
        var div, n,
            v = document.getElementsByClassName("youtube-player");
        for (n = 0; n < v.length; n++) {
            div = document.createElement("div");
            div.setAttribute("data-id", v[n].dataset.id);
            div.innerHTML = labnolThumb(v[n].dataset.id);
            div.onclick = labnolIframe;
            v[n].appendChild(div);
        }
    });

function labnolThumb(id) {
    var thumb = '<img src="https://i.ytimg.com/vi/ID/maxresdefault.jpg">',
        play = '<div class="play"></div>';
    return thumb.replace("ID", id) + play;
}

function labnolIframe() {
    var iframe = document.createElement("iframe");
    var embed = "https://www.youtube.com/embed/ID/?rel=0&vq=hd1080&autoplay=1&showinfo=0&controls=1";
    iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
    iframe.setAttribute("height", "720");
    iframe.setAttribute("width", "1280");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "1");
    iframe.setAttribute("controls", "0");
    iframe.setAttribute("autoplay", "0");
    iframe.setAttribute("showinfo", "0");


    this.parentNode.replaceChild(iframe, this);
}
