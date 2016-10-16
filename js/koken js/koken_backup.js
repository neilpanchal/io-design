! function() {
    window.$K = {
        scrollContainer: !1,
        toggleFullScreen: function(t) {
            var t = t || $(document.documentElement);
            t.requestFullScreen()
        },
        tgif: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        lightbox: {
            entryUrl: !1,
            overflow: "auto",
            entryTitle: !1,
            solo: !1,
            complete: function(t, e) {
                document.title = e, location.href !== t && window.history.replaceState(null, "", t)
            },
            cacheEntry: function(t, e) {
                location.href.match(/lightbox\/$/) || (this.entryUrl = location.href, this.entryTitle = document.title, document.title = e, window.history.replaceState({
                    lightboxEntry: !0
                }, document.title), window.history.pushState(null, "", t))
            },
            load: function(t) {
                $("body").addClass("k-lightbox-loading");
                var e = {
                    width: "100%",
                    height: "100%",
                    position: "fixed",
                    zIndex: 1e4,
                    left: 0,
                    top: 0,
                    opacity: 0
                };
                $("<iframe />").css(e).attr({
                    src: t,
                    id: "k-lightbox-iframe"
                }).on("load", function() {
                    var t = this;
                    requestAnimationFrame(function() {
                        t.contentWindow.focus()
                    })
                }).appendTo("body"), this.overflow = $("body").css("overflow"), $("body").css("overflow", "hidden")
            },
            show: function() {
                $("body").removeClass("k-lightbox-loading"), $(".k-link-lightbox-loading").removeClass("k-link-lightbox-loading"), $(document).trigger("koken:lightbox:loaded"), $("#k-lightbox-iframe").animate({
                    opacity: 1
                }, 400, function() {
                    $(".k-link-lightbox-loading").removeClass("k-link-lightbox-loading")
                })
            },
            exit: function(t) {
                var e = $("#k-lightbox-iframe");
                e.length && (t = t || !1, t || (this.entryUrl && history.pushState(null, "", this.entryUrl), this.entryTitle && (document.title = this.entryTitle)), $("body").css("overflow", this.overflow), $("#k-lightbox-iframe").animate({
                    opacity: 0
                }, {
                    duration: 400,
                    complete: function() {
                        $(this).remove()
                    }
                }))
            }
        },
        loadUrl: function(t) {
            if ($K.lightbox.entryUrl && $K.lightbox.entryUrl === t) $K.lightbox.exit();
            else {
                var e = t.replace(RegExp("https?://" + location.host), ""),
                    i = $('a[href="' + e + '"]');
                window.Turbolinks && window.Turbolinks.supported ? Turbolinks.visit(e) : !$K.location.draft && $.pjax && i.length ? i.first().trigger("click") : location.href = t
            }
        },
        pulse: {
            plugins: {},
            groups: {},
            refs: {},
            overrides: {},
            teardown: function() {
                $.each(this.refs, function(t, e) {
                    e.kill()
                }), this.refs = {}
            },
            register: function(t) {
                this.refs[t.id] && (this.refs[t.id].kill(), delete this.refs[t.id]);
                var e = "#" + t.id,
                    i = $(e).data("pulse-group");
                $(e).children(":not(div.cover)").remove(), this.groups[i] || (this.groups[i] = t.options);
                var n = this.groups[i],
                    a = ["width", "height", "dataUrl", "data", "next", "previous", "toggle", "play", "pause", "fullscreen", "restart"];
                return void 0 === n.link_to && a.push("link_to"), this.overrides[t.id] || (this.overrides[t.id] = {}), $.each(a, $.proxy(function(e, i) {
                    t.options[i] && (this.overrides[t.id][i] = t.options[i])
                }, this)), this.refs[t.id] = Pulse(e, $.extend(n, this.overrides[t.id])), $.each(this.plugins, $.proxy(function(e) {
                    n[e + "_enabled"] && this.refs[t.id][e](n)
                }, this)), this.refs[t.id]
            }
        },
        navigation: {
            sets: [],
            init: !1,
            toggleChilds: function(t, e) {
                var i = e && "none" === e || $(t).hasClass("k-nav-open"),
                    n = t.siblings("ul");
                n.length && (i ? $(t).removeClass("k-nav-open") : $(t).addClass("k-nav-open"), n.css("display", i ? "block" : "block"))
            },
            nest: function() {
                var t = $("a.k-nav-set");
                this.sets.length !== t.length && (this.sets = t, $.each(this.sets, $.proxy(function(t, e) {
                    null === e.onclick && (e.onclick = $.proxy(function(t) {

                    }, this))
                }, this)), this.setCurrent())
            },
            setCurrent: function(t) {
                var e = RegExp("(https?://" + location.host + ")?" + $K.location.root_folder + "(/(index|preview).php\\?)?"),
                    t = t || location.href,
                    i = t.replace(e, "").replace(/&rand=.*$/, "").replace(/&preview=.*/, "") || "/";

                $.each(this.sets, $.proxy(function(t, e) {
                    this.toggleChilds($(e), "none")
                }, this)), $(".k-nav-current").removeClass("k-nav-current"), $.each($(".k-nav-root"), function(t, n) {
                    var a = !1,
                        o = {
                            len: 0,
                            el: !1
                        };
                    $.each($(n).find("a:not(.k-nav-set)"), function(t, n) {
                        n = $(n);
                        var r = n.attr("href").replace(e, "").replace(/&preview=.*/, "");
                        if (i === r) {
                            for (n.addClass("k-nav-current");;) {
                                if (n = n.parent(), n.hasClass("k-nav-root")) break;
                                "ul" === n.get(0).nodeName.toLowerCase() && n.show()
                            }
                            return a = !0, !1
                        }
                        var s = RegExp("^" + r + "(.*)?$");
                        r.length > 1 && s.test(i) && r.length > o.len && (o.el = n, o.len = r.length)
                    }), !a && o.el && o.el.addClass("k-nav-current")
                }), $('a[href="' + i + '"]').addClass("k-nav-current")
            }
        },
        keyboard: {
            bind: function() {
                $("[data-bind-to-key]").each(function() {
                    var t = $(this),
                        e = t.attr("data-bind-to-key"); - 1 !== e.indexOf("→") && (e = e.replace("→", "right")), -1 !== e.indexOf("←") && (e = e.replace("←", "left")), key.unbind(e), key(e, function() {
                        var e = t.attr("href");
                        if (!e || "#" === e) return t.trigger("click"), void 0;
                        if (location.pathname !== e && location.href !== e) {
                            var i = $._data(t.get(0), "events") && $._data(t.get(0), "events").click;
                            if (!i) {
                                var n = $._data(document, "events");
                                n && n.click && $.each(n.click, function(e, n) {
                                    return -1 !== $.inArray(t.get(0), $(n.selector)) ? (i = !0, !1) : void 0
                                })
                            }
                            i && void 0 === t.attr("data-koken-internal") ? t.trigger("click") : $K.loadUrl(e)
                        }
                    })
                })
            },
            scroll: {
                selector: !1,
                offset: 0,
                index: 0,
                move: function(t) {
                    var e = $(this.selector).filter(":visible"),
                        i = !1,
                        n = !1,
                        a = "function" == typeof this.offset ? this.offset.call(this) : this.offset,
                        o = $(document).scrollTop(),
                        r = $(window).height();
                    return $.each(e, function(e, s) {
                        var l = $(s).offset().top;
                        t ? l + $(s).height() > o + r && l > o - a ? i = i ? Math.min(i, l) : l : !n && l > o && (n = l) : o > l && l > o - r ? i = i ? Math.min(i, l) : l : o > l && (n = l)
                    }), !i && n && (i = n), t || i !== !1 || (i = 0), i !== !1 && $("html,body").animate({
                        scrollTop: i + a
                    }), !1
                },
                init: function(t, e) {
                    this.offset = e || 0, this.selector = t, self = this, $(window).off(".kScroll").on("keydown.kScroll", function(t) {
                        -1 !== $.inArray(t.which, [37, 39]) && $K.keyboard.scroll.move(39 === t.which)
                    }), $(document).on("click", "[data-koken-keyboard-scroll-previous]", function() {
                        return $K.keyboard.scroll.move(!1), !1
                    }), $(document).on("click", "[data-koken-keyboard-scroll-next]", function() {
                        return $K.keyboard.scroll.move(!0), !1
                    })
                }
            }
        },
        lazy: {
            queue: [],
            working: [],
            fails: {},
            max: 4,
            out: function(t) {
                $K.lazy.working.splice($.inArray(t, $K.lazy.working), 1), $K.lazy.worker()
            },
            fail: function(t) {
                $K.lazy.fails[t] ? $K.lazy.fails[t] ++ : $K.lazy.fails[t] = 1, $K.lazy.fails[t] < 3 && $K.lazy.queue.push(t), $K.lazy.out(t)
            },
            worker: function() {
                if ($K.lazy.queue.length && $K.lazy.working.length < $K.lazy.max) {
                    var t = $K.lazy.queue.shift(),
                        e = $('img.k-lazy-loading[data-src="' + t + '"]').add('.k-lazy-loading-background[data-src="' + t + '"]'),
                        i = new Image;
                    if ($K.lazy.fails[t] && $K.lazy.fails[t] > 2) return;
                    $K.lazy.working.push(t), i.onerror = function() {
                        $K.lazy.fail(t)
                    }, i.onload = function() {
                        var i = e.filter("img"),
                            n = e.filter(".k-lazy-loading-background");
                        i.removeClass("k-lazy-loading"), n.removeClass("k-lazy-loading-background");
                        var a = i.first().data("lazy-fade");
                        a ? i.css("opacity", .001) : a = 1;
                        var o = n.first().data("lazy-fade");
                        o && n.each(function() {
                            $(this).find("i.k-bg-fader").remove();
                            var t = $(this).html();
                            $(this).empty().css("position", "relative"), $("<i/>").addClass("k-bg-fader").css({
                                width: "100%",
                                height: "100%",
                                "float": "left",
                                backgroundPosition: $(this).css("background-position"),
                                opacity: 0,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                zIndex: 1
                            }).appendTo($(this)), $("<span>").css({
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                zIndex: 2
                            }).html(t).appendTo($(this))
                        }), setTimeout(function() {
                            $K.lazy.out(t), i.attr("src", t), i.attr("data-src", null), i.each(function() {
                                $(this).trigger("k-image-fading", $(this)), $(this).animate({
                                    opacity: 1
                                }, a, function() {
                                    $(this).addClass("k-lazy-loaded"), $(this).trigger("k-image-loaded", $(this))
                                })
                            }), n.each(function() {
                                $(this).addClass("k-lazy-background-loaded"), o ? $(this).find("i.k-bg-fader").css("backgroundImage", "url(" + t + ")").animate({
                                    opacity: 1
                                }, o, function() {
                                    $(this).trigger("k-background-loaded")
                                }) : ($(this).css("backgroundImage", "url(" + t + ")"), $(this).trigger("k-background-loaded"))
                            })
                        }, 0)
                    }, i.src = t, $K.lazy.worker()
                }
            },
            load: function() {
                var t = 1.3 * $(window).height() + $(window).scrollTop(),
                    e = 2 * $(window).width() + $(window).scrollLeft(),
                    i = $("img.k-lazy-loading").add(".k-lazy-loading-background").filter(function() {
                        return !$(this).attr("data-lazy-hold") && $(this).attr("data-src") && $(this).is(":visible")
                    }).sort(function(t, e) {
                        var i = $(t).offset(),
                            n = $(e).offset();
                        return i.top === n.top ? i.left > n.left ? 1 : -1 : i.top > n.top ? 1 : -1
                    });
                $K.lazy.queue = [], $.each(i, function(i, n) {
                    n = $(n);
                    var a = n.offset();
                    if (a.top <= t && a.top + n.height() >= $(window).scrollTop() && a.left <= e && a.left + n.width() >= $(window).scrollLeft()) {
                        var o = n.attr("data-src"); - 1 === $.inArray(o, $K.lazy.queue) && $K.lazy.queue.push(o)
                    }
                }), $K.lazy.worker()
            },
            initTimeout: null,
            init: function() {
                var t = $("img.k-lazy-loading"),
                    e = $(".k-lazy-loading-background");
                t.length && $.each(t, function(t, e) {
                    $(e).attr("src") !== $K.tgif && $(e).attr("src", $K.tgif)
                }), (t.length || e.length) && (clearTimeout(this.initTimeout), this.initTimeout = setTimeout(function() {
                    $K.lazy.load()
                }, 250))
            }
        },
        isRetinaCache: null,
        isRetina: function() {
            return null !== this.isRetinaCache ? this.isRetinaCache : (this.isRetinaCache = $K.retinaEnabled && ("devicePixelRatio" in window && devicePixelRatio > 1 || "matchMedia" in window && matchMedia("(min-resolution:144dpi)").matches), this.isRetinaCache)
        },
        retinafyUrl: function(t) {
            return t = t.replace(".2x.", "."), this.isRetina() && (t = t.replace(/(\.\d{9,10})?\.[a-zA-Z]{3,4}$/, function(t) {
                return ".2x" + t
            })), t
        },
        layout: {
            mosaic: function(t) {
                t = t || "ul.k-mosaic";
                var e = $(t);
                if (e.length) {
                    var i = function() {
                        e.each(function(t, e) {
                            var i = e.className.match(/k-mosaic-(\d+)/)[1],
                                n = $(e),
                                a = n.children(),
                                o = a.filter(":not(.k-mosaic-uneven)"),
                                r = (o.length, a.length),
                                s = r % i,
                                l = n.width(),
                                c = l / i,
                                d = parseInt(a.first().css("margin-right"), 10);
                            if (a.css({
                                    width: Math.floor(c - (i - 1) / i * d),
                                    height: c
                                }), 0 !== s) {
                                var h = $($.makeArray(a).reverse().slice(0, s));
                                d = Math.ceil((h.length - 1) / h.length * d), h.addClass("k-mosaic-uneven").css({
                                    width: Math.min(l, Math.floor(l * (100 / s) / 100 - d))
                                })
                            }
                            var u = 0,
                                f = 1;
                            $.each(n.children(), function(t, e) {
                                u += $(e).outerWidth(!0), f == i || r === t + 1 ? (l > u && $(e).width($(e).width() + (l - u)), u = 0, f = 1) : f++
                            })
                        }), $K.responsiveBackgrounds(), $K.lazy.init()
                    };
                    $(window).on("k-resize", i), i()
                }
            }
        },
        loadImages: function() {
            var t = $("img[data-src]"),
                e = this;
            t.length && $.each(t, function(t, i) {
                var n = $(i),
                    a = e.retinafyUrl(n.attr("data-src"));
                n.hasClass("k-lazy-loading") ? n.attr("data-src", a) : n.attr("src", a)
            })
        },
        resizeVideos: function() {
            $(".mejs-container video").each(function() {
                $v = $(this);
                var t = $v.data("aspect"),
                    e = Math.min($v.parents(".mejs-container").parent().width(), $v.data("width")),
                    i = e / t,
                    n = this.player;
                if (n && (n.setPlayerSize(e, i), n.setControlsSize()), "native" === this.pluginType) {
                    var a = {
                        width: e,
                        height: i
                    };
                    $v.attr(a).css(a)
                } else n && (n.options.videoWidth = e, n.options.videoHeight = i / t, n.media.setVideoSize && n.media.setVideoSize(e, i))
            })
        },
        responsiveBackgrounds: function() {
            var t = $("[data-bg-presets]"),
                e = this;
            $.each(t, function() {
                var t, i = $(this),
                    n = i.width(),
                    a = i.height(),
                    o = n / a,
                    r = !1,
                    s = /([a-z_\.]+)\,([0-9]+)\,([0-9]+)/g,
                    l = i.data("bg-presets"),
                    c = i.data("position") || "focal",
                    d = i.css("background-image"),
                    h = i.data("aspect"),
                    u = {
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover"
                    };
                if (0 !== n && 0 !== a) {
                    if ("focal" === c) {
                        var f = i.data("focal-point").split(","),
                            g = 50,
                            p = 49;
                        o >= h ? p = f[1] : g = f[0], u.backgroundPosition = g + "% " + p + "%"
                    } else u.backgroundPosition = c;
                    for (;
                        (t = s.exec(l)) && (r = e.retinafyUrl(i.data("base") + t[1] + "." + i.data("extension")), !(t[2] >= n && t[3] >= a)););
                    i.hasClass("k-lazy-loading-background") ? i.attr("data-src", r) : (r = "url(" + r + ")", r && r !== d && (u.backgroundImage = r)), i.css(u)
                }
            })
        },
        responsiveImages: function(t, e) {
            var i, n, a, o, r, s, l = t || $("img[data-presets]"),
                c = l.selector,
                d = (l.length, this),
                h = $.browser.msie || /Trident\/7\./.test(navigator.userAgent);
            $.each(l, function(t, e) {
                e = $(e), "object" == typeof e.data("originalDom") && (e = e.replaceWith(e.data("originalDom")), e.css("opacity", 1))
            }), window.setTimeout(function() {
                var t = [],
                    l = [],
                    u = [],
                    f = $(c),
                    g = -1 !== c.indexOf("data-responsive-hold");
                f = f.filter(function() {
                    if (!(!g && $(this).attr("data-responsive-hold") || $(this).parents("script").length || $(this).parents(".k-control-structure").length && "none" === $(this).parents(".k-control-structure").first().css("display"))) {
                        var e = $(this).css(["display", "visibility", "width", "height", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "maxHeight"]);
                        if ("none" !== e.display && "hidden" !== e.visibility) {
                            t.push(e);
                            for (var i = 0, n = $(this); 0 === i;) {
                                n = n.parent();
                                var a = n.css("display");
                                if ("none" === a) return !1;
                                "inline" == a || n.attr("data-koken-ignore-responsive") || (i = n.width())
                            }
                            return u.push(i), l.push({
                                el: n,
                                w: n.width(),
                                h: n.height(),
                                css: n.css(["boxSizing"])
                            }), !0
                        }
                        return !1
                    }
                }), g && f.attr("data-responsive-hold", null), $.each(f, function(e, c) {
                    c = $(c), $(document).trigger("k-img-resize-start", c), "object" == typeof c.data("originalDom") && (c = c.replaceWith(c.data("originalDom")));
                    var f = c.data("presets"),
                        g = c.attr("src") || "",
                        p = t.shift(),
                        k = h || -1 !== p.width.indexOf("%") ? 0 : parseInt(p.width, 10) || 0,
                        m = h || -1 !== p.height.indexOf("%") ? 0 : parseInt(p.height, 10) || 0,
                        v = (parseInt(p.paddingLeft, 10) || 0) + (parseInt(p.paddingRight, 10) || 0),
                        w = (parseInt(p.paddingTop, 10) || 0) + (parseInt(p.paddingBottom, 10) || 0),
                        y = 0,
                        b = c,
                        x = !0;
                    if (k -= v, m -= w, 10 > k && (k = 0), 10 > m && (m = 0), leafObj = l.shift(), leafObj.el.length) {
                        b = leafObj.el, y = u.shift(), s = leafObj.css.boxSizing;
                        var K = Math.max(m, leafObj.h),
                            z = p.maxHeight,
                            C = parseInt(z, 10); - 1 !== z.indexOf("%") && (C = K * (C / 100)), c.data("originalDom") || (k > 0 && k !== y ? (c.data("originalDom", c.clone().attr({
                            "data-lazy-hold": null
                        })), y = Math.min(y, k)) : c.data("originalDom", "noreplace")), r = c.data("respond-to") || "width", isNaN(C) || (K = C, "width" === r && (r = !1));
                        var T, A = y / K,
                            D = /([a-z_\.]+)\,([0-9]+)\,([0-9]+)/g,
                            j = c.data("retain-aspect") || !1,
                            _ = "1:1" === j;
                        if (i = c.data("base"), n = c.data("extension"), c.attr("data-alt") && (c.attr("alt", c.data("alt")), c.attr("data-alt", null)), j && !_) {
                            var M = j.split(":");
                            A = M[0] / M[1], K = Math.round(y / A), c.attr({
                                width: y,
                                height: K
                            });
                            var I = g.match(/\,(\d+)\./);
                            if (I) {
                                var S = Math.abs(y - I[1]) / I[1];
                                if (I[1] >= y || .2 > S) return
                            }
                            var U = Math.max(y, K),
                                R = {
                                    tiny: 60,
                                    small: 100,
                                    medium: 480,
                                    medium_large: 800,
                                    large: 1024,
                                    xlarge: 1600,
                                    huge: 2048
                                },
                                O = "",
                                Y = !1;
                            $.each(R, function(t, e) {
                                if (e >= U) {
                                    var i = e - U;
                                    return (!Y || U - Y > i) && (O = t), !1
                                }
                                O = t, Y = e
                            }), O = $K.imageDefaults[O], g = i + y + "." + K + "." + O.quality + "." + Math.round(100 * O.sharpening) + ".crop." + n
                        } else {
                            for (var E = !1, P = !1, q = 0, B = 0; T = D.exec(f);)
                                if (a = _ || -1 !== T[1].indexOf(".crop"), o = T[2] / T[3], E !== T[2] || P !== T[3]) {
                                    if (g = i + (T[1].replace(/\.crop$/, "") + (a ? ".crop" : "")) + "." + n, E = P = !1, a) {
                                        if ("width" === r) {
                                            if (T[2] >= y) {
                                                B = y, q = y;
                                                break
                                            }
                                        } else if ("height" === r || C) {
                                            if (T[3] >= K) {
                                                B = K, q = K;
                                                break
                                            }
                                        } else if (T[2] >= y && T[3] >= K) {
                                            B = Math.min(y, K), q = B;
                                            break
                                        }
                                    } else if ("width" === r) {
                                        if (T[2] >= y) {
                                            B = y, q = y / o;
                                            break
                                        }
                                    } else if ("height" === r) {
                                        if (T[3] >= K) {
                                            q = K, B = K * o;
                                            break
                                        }
                                    } else {
                                        if (o >= A && T[2] >= y) {
                                            B = y, q = y / o;
                                            break
                                        }
                                        if (A > o && T[3] >= K) {
                                            q = K, B = K * o;
                                            break
                                        }
                                    }
                                    E = T[2], P = T[3]
                                }
                            var U;
                            U = T ? Math.max(T[2], T[3]) : Math.max(E, P), E && ("height" === r && K > P && (E = K * o, P = E / o), B = E, q = P), B > y && "width" === r && (B = y, q = y / o), x = !c.attr("data-longest-side") || c.attr("data-longest-side") < U;
                            var F = {
                                    "data-longest-side": U
                                },
                                L = function(t) {
                                    return Math.round(Math.round(10 * t) / 10)
                                };
                            if (c.attr("width") != B && (F.width = L(B)), c.attr("height") != q && (F.height = L(q)), !F.width && !F.height) return;
                            c.attr(F)
                        }
                        g = d.retinafyUrl(g), g !== c.attr("src") && x && (c.hasClass("k-lazy-loading") || c.hasClass("k-lazy-loaded") ? (c.removeClass("k-lazy-loaded"), c.addClass("k-lazy-loading"), c.attr("data-src", g), c.attr("src", $K.tgif), $(document).trigger("k-image-loading", c)) : c.attr("src", g)), $(document).trigger("k-img-resize", c)
                    }
                }), setTimeout(function() {
                    $K.lazy.init(), $(window).trigger("k-resize"), e && e.call(d)
                }, 1)
            }, 1)
        },
        infinity: {
            $target: [],
            isLoading: !1,
            bttn: !1,
            _paused: !1,
            pause: function() {
                this._paused = !0
            },
            resume: function() {
                this._paused = !1, this.init(), this.check()
            },
            next: function() {
                if (!$K.infinity._paused && $K.infinity.$target.length && $K.location.parameters.page < this.totalPages) {
                    $(window).trigger("k-infinite-loading"), $K.location.parameters.page++, this.isLoading = !0;
                    var t = this,
                        e = location.href.match(/&preview=.*/) || "";
                    $.ajax({
                        url: $K.location.root + $K.location.here.replace(/\/$/, "") + "/page/" + $K.location.parameters.page + "/" + e,
                        success: function(e) {
                            $.each($(e).find(".k-infinite-load"), function(e, i) {
                                $(t.$target[e]).before($(i).children())
                            }), t.isLoading = !1, $(window).trigger("k-infinite-loaded"), $K.ready(), t.check()
                        }
                    }), $K.location.parameters.page === this.totalPages && this.bttn && this.bttn.addClass("k-disabled")
                }
            },
            check: function() {
                if (!$K.infinity._paused && this.$target.length && !this.isLoading) {
                    var t = this.$target.first().siblings(":visible").last();
                    t = t.children(":visible").length ? t.children(":visible").last() : t, t.length && t.offset().top < $(window).scrollTop() + 1.25 * $(window).height() && this.next()
                }
            },
            init: function() {
                if (!$K.infinity._paused && !$K.infinity.$target.length) {
                    var t = $("span.k-infinite-load");
                    if ((t.length || $("br.k-infinite-marker").length) && ($.each(t, function() {
                            $(this).append($("<br/>").css("display", "none").addClass("k-infinite-marker")), $(this).replaceWith($(this).html())
                        }), this.$target = $(".k-infinite-marker"), "" !== this.selector)) {
                        var e = $(this.selector),
                            i = this;
                        this.bttn = e, e.length && (this.totalPages > 1 ? e.off("click").on("click", function() {
                            i.next()
                        }) : e.remove())
                    }
                }
            }
        },
        textPreview: function(t) {
            var e = this.location.host + this.location.real_root_folder + "/admin/#/text/selection:" + t;
            $("<div/>").attr("id", "k_essay_preview").html('You are previewing a draft of this essay. <a href="' + e + '" title="Return to the console">Go back and make edits</a>.').prependTo("body")
        },
        _prepDate: function(t) {
            if (!t.utc) {
                var e = new Date;
                return t.timestamp + 60 * e.getTimezoneOffset()
            }
            return t.timestamp
        },
        formattedDate: function(t) {
            var e = this._prepDate(t);
            return this.date(this.dateFormats.date, e)
        },
        formattedTime: function(t) {
            var e = this._prepDate(t);
            return this.date(this.dateFormats.time, e)
        },
        formattedDateTime: function(t) {
            return this.formattedDate(t) + " " + this.formattedTime(t)
        },
        date: function(t, e) {
            var i, n, a = this,
                o = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                r = /\\?(.?)/gi,
                s = function(t, e) {
                    return n[t] ? n[t]() : e
                },
                l = function(t, e) {
                    for (t = String(t); t.length < e;) t = "0" + t;
                    return t
                };
            return n = {
                d: function() {
                    return l(n.j(), 2)
                },
                D: function() {
                    return n.l().slice(0, 3)
                },
                j: function() {
                    return i.getDate()
                },
                l: function() {
                    return o[n.w()] + "day"
                },
                N: function() {
                    return n.w() || 7
                },
                S: function() {
                    var t = n.j(),
                        e = t % 10;
                    return 3 >= e && 1 == parseInt(t % 100 / 10, 10) && (e = 0), ["st", "nd", "rd"][e - 1] || "th"
                },
                w: function() {
                    return i.getDay()
                },
                z: function() {
                    var t = new Date(n.Y(), n.n() - 1, n.j()),
                        e = new Date(n.Y(), 0, 1);
                    return Math.round((t - e) / 864e5)
                },
                W: function() {
                    var t = new Date(n.Y(), n.n() - 1, n.j() - n.N() + 3),
                        e = new Date(t.getFullYear(), 0, 4);
                    return l(1 + Math.round((t - e) / 864e5 / 7), 2)
                },
                F: function() {
                    return o[6 + n.n()]
                },
                m: function() {
                    return l(n.n(), 2)
                },
                M: function() {
                    return n.F().slice(0, 3)
                },
                n: function() {
                    return i.getMonth() + 1
                },
                t: function() {
                    return new Date(n.Y(), n.n(), 0).getDate()
                },
                L: function() {
                    var t = n.Y();
                    return t % 4 === 0 & t % 100 !== 0 | t % 400 === 0
                },
                o: function() {
                    var t = n.n(),
                        e = n.W(),
                        i = n.Y();
                    return i + (12 === t && 9 > e ? 1 : 1 === t && e > 9 ? -1 : 0)
                },
                Y: function() {
                    return i.getFullYear()
                },
                y: function() {
                    return n.Y().toString().slice(-2)
                },
                a: function() {
                    return i.getHours() > 11 ? "pm" : "am"
                },
                A: function() {
                    return n.a().toUpperCase()
                },
                B: function() {
                    var t = 3600 * i.getUTCHours(),
                        e = 60 * i.getUTCMinutes(),
                        n = i.getUTCSeconds();
                    return l(Math.floor((t + e + n + 3600) / 86.4) % 1e3, 3)
                },
                g: function() {
                    return n.G() % 12 || 12
                },
                G: function() {
                    return i.getHours()
                },
                h: function() {
                    return l(n.g(), 2)
                },
                H: function() {
                    return l(n.G(), 2)
                },
                i: function() {
                    return l(i.getMinutes(), 2)
                },
                s: function() {
                    return l(i.getSeconds(), 2)
                },
                u: function() {
                    return l(1e3 * i.getMilliseconds(), 6)
                },
                e: function() {
                    throw "Not supported (see source code of date() for timezone on how to add support)"
                },
                I: function() {
                    var t = new Date(n.Y(), 0),
                        e = Date.UTC(n.Y(), 0),
                        i = new Date(n.Y(), 6),
                        a = Date.UTC(n.Y(), 6);
                    return t - e !== i - a ? 1 : 0
                },
                O: function() {
                    var t = i.getTimezoneOffset(),
                        e = Math.abs(t);
                    return (t > 0 ? "-" : "+") + l(100 * Math.floor(e / 60) + e % 60, 4)
                },
                P: function() {
                    var t = n.O();
                    return t.substr(0, 3) + ":" + t.substr(3, 2)
                },
                T: function() {
                    return "UTC"
                },
                Z: function() {
                    return 60 * -i.getTimezoneOffset()
                },
                c: function() {
                    return "Y-m-d\\TH:i:sP".replace(r, s)
                },
                r: function() {
                    return "D, d M Y H:i:s O".replace(r, s)
                },
                U: function() {
                    return i / 1e3 | 0
                }
            }, this.date = function(t, e) {
                return a = this, i = void 0 === e ? new Date : e instanceof Date ? new Date(e) : new Date(1e3 * e), t.replace(r, s)
            }, this.date(t, e)
        },
        ready: function() {
            $("noscript").remove(), $("time.k-relative-time").timeago(), $K.responsiveImages(), $K.responsiveBackgrounds(), $K.loadImages(), $K.lazy.init(), $K.navigation.nest(), $K.infinity.init(), $K.keyboard.bind(), $K.layout.mosaic(), $("img").off(".kjs").on("error.kjs", function() {
                var t = $(this),
                    e = t.data("fails") || 0;
                $K.lazy.working.splice($.inArray(t.attr("src"), $K.lazy.working), 1), 3 > e && (e++, t.attr("data-src") || t.attr("data-src", t.attr("src")), t.removeClass("k-lazy-loaded").addClass("k-lazy-loading"), setTimeout(function() {
                    $K.lazy.init()
                }, 100), t.data("fails", e))
            }), $(window).off(".kjs");
            var t, e = $(window).add("body");
            $K.scrollContainer && (e = e.add($($K.scrollContainer))), e.off(".kjs").on("scroll.kjs", function() {
                clearTimeout(t), t = setTimeout(function() {
                    $K.lazy.load(), $K.infinity.bttn || $K.infinity.check(), $(window).trigger("k-scroll")
                }, 300)
            });
            var i;
            $(window).on("resize.kjs orientationchange.kjs", function() {
                $K.resizeVideos(), clearTimeout(i), i = setTimeout(function() {
                    $K.responsiveImages(), $K.responsiveBackgrounds(), $(window).trigger("k-resize")
                }, 250);
                var t = $("#k-lightbox-iframe");
                t.length && $(t.get(0).contentDocument).find("html, body").height($(window).height())
            }), $K.infinity.bttn || $K.infinity.check(), $("body").fitVids(), $(".k-content-embed iframe").show(), $(".k-select").off("change").on("change", function() {
                "__label__" !== $(this).val() && $K.loadUrl($K.location.root + $(this).val() + ($K.location.preview ? "&preview=" + $K.location.preview : ""))
            });
            var n = RegExp("https?://" + location.host + $K.location.root_folder + "(/(index|preview).php\\?)?"),
                a = document.referrer.replace(n, "");
            if (/^https?:/.test(a) && (a = !1), $K.location.urls.album) {
                var o = RegExp($K.location.urls.album.replace(/:[a-z_]+/, "[^/]+") + "/lightbox/?$");
                o.test(a) && (a = a.replace(/\/lightbox\/?$/, ""))
            }
            /\/lightbox\/?$/.test(a) && $.cookie("koken_referrer") ? a = $.cookie("koken_referrer") : /\/lightbox\/?$/.test(a) || $.cookie("koken_referrer", a, {
                path: "/"
            }), $K.location.referrer = a, $(document).trigger("k-ready")
        }
    }, $(document).ready(function() {
        function t() {
            var t = $("body").attr("class") || "";
            $("body").attr("class", t.replace(/k\-source\-([^\s]+)(\sk\-lens\-([^\s]+))?/, $K.location.page_class));
            var t = $("html").attr("class") || "";
            $("html").attr("class", t.replace(/k\-source\-([^\s]+)(\sk\-lens\-([^\s]+))?/, $K.location.page_class)), $K.navigation.setCurrent()
        }
        window.Turbolinks && window.Turbolinks.supported || $K.ready(), $(window).on("popstate", function(t) {
            return $K.lightbox.solo ? !0 : (t.originalEvent.state && t.originalEvent.state.lightboxEntry ? ($K.lightbox.entryUrl = !1, $K.lightbox.exit()) : window === window.top && location.href.match(/\/lightbox\/$/) && ($("#k-lightbox-iframe").length || $K.lightbox.load(location.href)), void 0)
        }), $(document).on("click", "a", function(t) {
            if ($(this).attr("href").match(/\/lightbox\/(&preview=.*)?$/) && !location.href.match(/\/lightbox\//) && (t.preventDefault(), $(this).addClass("k-link-lightbox-loading"), $(document).trigger("koken:lightbox:loading", this), $K.lightbox.load($(this).attr("href"))), $(this).attr("data-koken-share")) {
                var e = $(this).attr("data-koken-share");
                if ("twitter" !== e || -1 === document.location.href.indexOf("preview.php")) {
                    t.preventDefault();
                    var i = {
                            pinterest: 320,
                            "google-plus": 400,
                            twitter: 256
                        },
                        n = 560,
                        a = i[e] || 450,
                        o = window.screen.height / 2 - (a / 2 + 50),
                        r = window.screen.width / 2 - (n / 2 + 10);
                    window.open($(this).attr("href"), "_blank", "top=" + o + ",left=" + r + ",width=" + n + ",height=" + a)
                }
            }
        }), $(window).on("k-pjax-end", function() {
            t()
        }), $(window).on("pjax:transition:start pjax:transition:restore pjax:end", function(t) {
            $.pjaxTransition && "pjax:end" === t.type || ($K.ready(), $K.navigation.setCurrent())
        }), $(window).on("pjax:transition:end", function() {
            $("body").fitVids()
        });
        var e = $.extend({}, $K.location);
        $(document).on("pjax:send", function() {
            e = $.extend({}, $K.location)
        }), $(window).on("pjax:transition:beforeRestore", function() {
            var i = $.extend({}, $K.location);
            $K.location = $.extend({}, e, {
                parameters: {
                    page: 1
                }
            }), e = i, t()
        }), $(document).on("page:fetch pjax:start", function() {
            $(".mejs-container video").each(function() {
                0 === $(this).parents("#pjax-container-staging").length && (this.player.remove(), $(this).remove())
            }), $K.lazy.queue = [], $K.infinity.$target = [], $K.pulse.teardown(), $K.lightbox.exit(!0), $(document).trigger("k-page-fetch")
        }), $(document).on("page:change", function() {
            $K.ready(), $(document).trigger("k-page-change")
        }), $(document).on("page:restore", function() {
            $(document).trigger("k-page-restore")
        })
    })
}();
