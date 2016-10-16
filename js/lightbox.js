! function(t, e) {
    "use strict";

    function n() {
        i.READY || (i.event.determineEventTypes(), i.utils.each(i.gestures, function(t) {
            i.detection.register(t)
        }), i.event.onTouch(i.DOCUMENT, i.EVENT_MOVE, i.detection.detect), i.event.onTouch(i.DOCUMENT, i.EVENT_END, i.detection.detect), i.READY = !0)
    }
    var i = function(t, e) {
        return new i.Instance(t, e || {})
    };
    i.defaults = {
        stop_browser_behavior: {
            userSelect: "none",
            touchAction: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    }, i.HAS_POINTEREVENTS = t.navigator.pointerEnabled || t.navigator.msPointerEnabled, i.HAS_TOUCHEVENTS = "ontouchstart" in t, i.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i, i.NO_MOUSEEVENTS = i.HAS_TOUCHEVENTS && t.navigator.userAgent.match(i.MOBILE_REGEX), i.EVENT_TYPES = {}, i.DIRECTION_DOWN = "down", i.DIRECTION_LEFT = "left", i.DIRECTION_UP = "up", i.DIRECTION_RIGHT = "right", i.POINTER_MOUSE = "mouse", i.POINTER_TOUCH = "touch", i.POINTER_PEN = "pen", i.EVENT_START = "start", i.EVENT_MOVE = "move", i.EVENT_END = "end", i.DOCUMENT = t.document, i.plugins = i.plugins || {}, i.gestures = i.gestures || {}, i.READY = !1, i.utils = {
        extend: function(t, n, i) {
            for (var o in n) t[o] !== e && i || (t[o] = n[o]);
            return t
        },
        each: function(t, n, i) {
            var o, r;
            if ("forEach" in t) t.forEach(n, i);
            else if (t.length !== e) {
                for (o = 0, r = t.length; r > o; o++)
                    if (n.call(i, t[o], o, t) === !1) return
            } else
                for (o in t)
                    if (t.hasOwnProperty(o) && n.call(i, t[o], o, t) === !1) return
        },
        hasParent: function(t, e) {
            for (; t;) {
                if (t == e) return !0;
                t = t.parentNode
            }
            return !1
        },
        getCenter: function(t) {
            var e = [],
                n = [];
            return i.utils.each(t, function(t) {
                e.push("undefined" != typeof t.clientX ? t.clientX : t.pageX), n.push("undefined" != typeof t.clientY ? t.clientY : t.pageY)
            }), {
                pageX: (Math.min.apply(Math, e) + Math.max.apply(Math, e)) / 2,
                pageY: (Math.min.apply(Math, n) + Math.max.apply(Math, n)) / 2
            }
        },
        getVelocity: function(t, e, n) {
            return {
                x: Math.abs(e / t) || 0,
                y: Math.abs(n / t) || 0
            }
        },
        getAngle: function(t, e) {
            var n = e.pageY - t.pageY,
                i = e.pageX - t.pageX;
            return 180 * Math.atan2(n, i) / Math.PI
        },
        getDirection: function(t, e) {
            var n = Math.abs(t.pageX - e.pageX),
                o = Math.abs(t.pageY - e.pageY);
            return n >= o ? t.pageX - e.pageX > 0 ? i.DIRECTION_LEFT : i.DIRECTION_RIGHT : t.pageY - e.pageY > 0 ? i.DIRECTION_UP : i.DIRECTION_DOWN
        },
        getDistance: function(t, e) {
            var n = e.pageX - t.pageX,
                i = e.pageY - t.pageY;
            return Math.sqrt(n * n + i * i)
        },
        getScale: function(t, e) {
            return t.length >= 2 && e.length >= 2 ? this.getDistance(e[0], e[1]) / this.getDistance(t[0], t[1]) : 1
        },
        getRotation: function(t, e) {
            return t.length >= 2 && e.length >= 2 ? this.getAngle(e[1], e[0]) - this.getAngle(t[1], t[0]) : 0
        },
        isVertical: function(t) {
            return t == i.DIRECTION_UP || t == i.DIRECTION_DOWN
        },
        stopDefaultBrowserBehavior: function(t, e) {
            e && t && t.style && (i.utils.each(["webkit", "khtml", "moz", "Moz", "ms", "o", ""], function(n) {
                i.utils.each(e, function(e) {
                    n && (e = n + e.substring(0, 1).toUpperCase() + e.substring(1)), e in t.style && (t.style[e] = e)
                })
            }), "none" == e.userSelect && (t.onselectstart = function() {
                return !1
            }), "none" == e.userDrag && (t.ondragstart = function() {
                return !1
            }))
        }
    }, i.Instance = function(t, e) {
        var o = this;
        return n(), this.element = t, this.enabled = !0, this.options = i.utils.extend(i.utils.extend({}, i.defaults), e || {}), this.options.stop_browser_behavior && i.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior), i.event.onTouch(t, i.EVENT_START, function(t) {
            o.enabled && i.detection.startDetect(o, t)
        }), this
    }, i.Instance.prototype = {
        on: function(t, e) {
            var n = t.split(" ");
            return i.utils.each(n, function(t) {
                this.element.addEventListener(t, e, !1)
            }, this), this
        },
        off: function(t, e) {
            var n = t.split(" ");
            return i.utils.each(n, function(t) {
                this.element.removeEventListener(t, e, !1)
            }, this), this
        },
        trigger: function(t, e) {
            e || (e = {});
            var n = i.DOCUMENT.createEvent("Event");
            n.initEvent(t, !0, !0), n.gesture = e;
            var o = this.element;
            return i.utils.hasParent(e.target, o) && (o = e.target), o.dispatchEvent(n), this
        },
        enable: function(t) {
            return this.enabled = t, this
        }
    };
    var o = null,
        r = !1,
        a = !1;
    i.event = {
        bindDom: function(t, e, n) {
            var o = e.split(" ");
            i.utils.each(o, function(e) {
                t.addEventListener(e, n, !1)
            })
        },
        onTouch: function(t, e, n) {
            var s = this;
            this.bindDom(t, i.EVENT_TYPES[e], function(c) {
                var l = c.type.toLowerCase();
                if (!l.match(/mouse/) || !a) {
                    l.match(/touch/) || l.match(/pointerdown/) || l.match(/mouse/) && 1 === c.which ? r = !0 : l.match(/mouse/) && !c.which && (r = !1), l.match(/touch|pointer/) && (a = !0);
                    var u = 0;
                    r && (i.HAS_POINTEREVENTS && e != i.EVENT_END ? u = i.PointerEvent.updatePointer(e, c) : l.match(/touch/) ? u = c.touches.length : a || (u = l.match(/up/) ? 0 : 1), u > 0 && e == i.EVENT_END ? e = i.EVENT_MOVE : u || (e = i.EVENT_END), (u || null === o) && (o = c), n.call(i.detection, s.collectEventData(t, e, s.getTouchList(o, e), c)), i.HAS_POINTEREVENTS && e == i.EVENT_END && (u = i.PointerEvent.updatePointer(e, c))), u || (o = null, r = !1, a = !1, i.PointerEvent.reset())
                }
            })
        },
        determineEventTypes: function() {
            var t;
            t = i.HAS_POINTEREVENTS ? i.PointerEvent.getEvents() : i.NO_MOUSEEVENTS ? ["touchstart", "touchmove", "touchend touchcancel"] : ["touchstart mousedown", "touchmove mousemove", "touchend touchcancel mouseup"], i.EVENT_TYPES[i.EVENT_START] = t[0], i.EVENT_TYPES[i.EVENT_MOVE] = t[1], i.EVENT_TYPES[i.EVENT_END] = t[2]
        },
        getTouchList: function(t) {
            return i.HAS_POINTEREVENTS ? i.PointerEvent.getTouchList() : t.touches ? t.touches : (t.indentifier = 1, [t])
        },
        collectEventData: function(t, e, n, o) {
            var r = i.POINTER_TOUCH;
            return (o.type.match(/mouse/) || i.PointerEvent.matchType(i.POINTER_MOUSE, o)) && (r = i.POINTER_MOUSE), {
                center: i.utils.getCenter(n),
                timeStamp: (new Date).getTime(),
                target: o.target,
                touches: n,
                eventType: e,
                pointerType: r,
                srcEvent: o,
                preventDefault: function() {
                    this.srcEvent.preventManipulation && this.srcEvent.preventManipulation(), this.srcEvent.preventDefault && this.srcEvent.preventDefault()
                },
                stopPropagation: function() {
                    this.srcEvent.stopPropagation()
                },
                stopDetect: function() {
                    return i.detection.stopDetect()
                }
            }
        }
    }, i.PointerEvent = {
        pointers: {},
        getTouchList: function() {
            var t = this,
                e = [];
            return i.utils.each(t.pointers, function(t) {
                e.push(t)
            }), e
        },
        updatePointer: function(t, e) {
            return t == i.EVENT_END ? this.pointers = {} : (e.identifier = e.pointerId, this.pointers[e.pointerId] = e), Object.keys(this.pointers).length
        },
        matchType: function(t, e) {
            if (!e.pointerType) return !1;
            var n = e.pointerType,
                o = {};
            return o[i.POINTER_MOUSE] = n === e.MSPOINTER_TYPE_MOUSE || n === i.POINTER_MOUSE, o[i.POINTER_TOUCH] = n === e.MSPOINTER_TYPE_TOUCH || n === i.POINTER_TOUCH, o[i.POINTER_PEN] = n === e.MSPOINTER_TYPE_PEN || n === i.POINTER_PEN, o[t]
        },
        getEvents: function() {
            return ["pointerdown MSPointerDown", "pointermove MSPointerMove", "pointerup pointercancel MSPointerUp MSPointerCancel"]
        },
        reset: function() {
            this.pointers = {}
        }
    }, i.detection = {
        gestures: [],
        current: null,
        previous: null,
        stopped: !1,
        startDetect: function(t, e) {
            this.current || (this.stopped = !1, this.current = {
                inst: t,
                startEvent: i.utils.extend({}, e),
                lastEvent: !1,
                name: ""
            }, this.detect(e))
        },
        detect: function(t) {
            if (this.current && !this.stopped) {
                t = this.extendEventData(t);
                var e = this.current.inst.options;
                return i.utils.each(this.gestures, function(n) {
                    return this.stopped || e[n.name] === !1 || n.handler.call(n, t, this.current.inst) !== !1 ? void 0 : (this.stopDetect(), !1)
                }, this), this.current && (this.current.lastEvent = t), t.eventType == i.EVENT_END && !t.touches.length - 1 && this.stopDetect(), t
            }
        },
        stopDetect: function() {
            this.previous = i.utils.extend({}, this.current), this.current = null, this.stopped = !0
        },
        extendEventData: function(t) {
            var e = this.current.startEvent;
            !e || t.touches.length == e.touches.length && t.touches !== e.touches || (e.touches = [], i.utils.each(t.touches, function(t) {
                e.touches.push(i.utils.extend({}, t))
            }));
            var n, o, r = t.timeStamp - e.timeStamp,
                a = t.center.pageX - e.center.pageX,
                s = t.center.pageY - e.center.pageY,
                c = i.utils.getVelocity(r, a, s);
            return "end" === t.eventType ? (n = this.current.lastEvent && this.current.lastEvent.interimAngle, o = this.current.lastEvent && this.current.lastEvent.interimDirection) : (n = this.current.lastEvent && i.utils.getAngle(this.current.lastEvent.center, t.center), o = this.current.lastEvent && i.utils.getDirection(this.current.lastEvent.center, t.center)), i.utils.extend(t, {
                deltaTime: r,
                deltaX: a,
                deltaY: s,
                velocityX: c.x,
                velocityY: c.y,
                distance: i.utils.getDistance(e.center, t.center),
                angle: i.utils.getAngle(e.center, t.center),
                interimAngle: n,
                direction: i.utils.getDirection(e.center, t.center),
                interimDirection: o,
                scale: i.utils.getScale(e.touches, t.touches),
                rotation: i.utils.getRotation(e.touches, t.touches),
                startEvent: e
            }), t
        },
        register: function(t) {
            var n = t.defaults || {};
            return n[t.name] === e && (n[t.name] = !0), i.utils.extend(i.defaults, n, !0), t.index = t.index || 1e3, this.gestures.push(t), this.gestures.sort(function(t, e) {
                return t.index < e.index ? -1 : t.index > e.index ? 1 : 0
            }), this.gestures
        }
    }, i.gestures.Drag = {
        name: "drag",
        index: 50,
        defaults: {
            drag_min_distance: 10,
            correct_for_drag_min_distance: !0,
            drag_max_touches: 1,
            drag_block_horizontal: !1,
            drag_block_vertical: !1,
            drag_lock_to_axis: !1,
            drag_lock_min_distance: 25
        },
        triggered: !1,
        handler: function(t, e) {
            if (i.detection.current.name != this.name && this.triggered) return e.trigger(this.name + "end", t), this.triggered = !1, void 0;
            if (!(e.options.drag_max_touches > 0 && t.touches.length > e.options.drag_max_touches)) switch (t.eventType) {
                case i.EVENT_START:
                    this.triggered = !1;
                    break;
                case i.EVENT_MOVE:
                    if (t.distance < e.options.drag_min_distance && i.detection.current.name != this.name) return;
                    if (i.detection.current.name != this.name && (i.detection.current.name = this.name, e.options.correct_for_drag_min_distance && t.distance > 0)) {
                        var n = Math.abs(e.options.drag_min_distance / t.distance);
                        i.detection.current.startEvent.center.pageX += t.deltaX * n, i.detection.current.startEvent.center.pageY += t.deltaY * n, t = i.detection.extendEventData(t)
                    }(i.detection.current.lastEvent.drag_locked_to_axis || e.options.drag_lock_to_axis && e.options.drag_lock_min_distance <= t.distance) && (t.drag_locked_to_axis = !0);
                    var o = i.detection.current.lastEvent.direction;
                    t.drag_locked_to_axis && o !== t.direction && (t.direction = i.utils.isVertical(o) ? t.deltaY < 0 ? i.DIRECTION_UP : i.DIRECTION_DOWN : t.deltaX < 0 ? i.DIRECTION_LEFT : i.DIRECTION_RIGHT), this.triggered || (e.trigger(this.name + "start", t), this.triggered = !0), e.trigger(this.name, t), e.trigger(this.name + t.direction, t), (e.options.drag_block_vertical && i.utils.isVertical(t.direction) || e.options.drag_block_horizontal && !i.utils.isVertical(t.direction)) && t.preventDefault();
                    break;
                case i.EVENT_END:
                    this.triggered && e.trigger(this.name + "end", t), this.triggered = !1
            }
        }
    }, i.gestures.Hold = {
        name: "hold",
        index: 10,
        defaults: {
            hold_timeout: 500,
            hold_threshold: 1
        },
        timer: null,
        handler: function(t, e) {
            switch (t.eventType) {
                case i.EVENT_START:
                    clearTimeout(this.timer), i.detection.current.name = this.name, this.timer = setTimeout(function() {
                        "hold" == i.detection.current.name && e.trigger("hold", t)
                    }, e.options.hold_timeout);
                    break;
                case i.EVENT_MOVE:
                    t.distance > e.options.hold_threshold && clearTimeout(this.timer);
                    break;
                case i.EVENT_END:
                    clearTimeout(this.timer)
            }
        }
    }, i.gestures.Release = {
        name: "release",
        index: 1 / 0,
        handler: function(t, e) {
            t.eventType == i.EVENT_END && e.trigger(this.name, t)
        }
    }, i.gestures.Swipe = {
        name: "swipe",
        index: 40,
        defaults: {
            swipe_min_touches: 1,
            swipe_max_touches: 1,
            swipe_velocity: .7
        },
        handler: function(t, e) {
            if (t.eventType == i.EVENT_END) {
                if (e.options.swipe_max_touches > 0 && t.touches.length < e.options.swipe_min_touches && t.touches.length > e.options.swipe_max_touches) return;
                (t.velocityX > e.options.swipe_velocity || t.velocityY > e.options.swipe_velocity) && (e.trigger(this.name, t), e.trigger(this.name + t.direction, t))
            }
        }
    }, i.gestures.Tap = {
        name: "tap",
        index: 100,
        defaults: {
            tap_max_touchtime: 250,
            tap_max_distance: 10,
            tap_always: !0,
            doubletap_distance: 20,
            doubletap_interval: 300
        },
        handler: function(t, e) {
            if (t.eventType == i.EVENT_END && "touchcancel" != t.srcEvent.type) {
                var n = i.detection.previous,
                    o = !1;
                if (t.deltaTime > e.options.tap_max_touchtime || t.distance > e.options.tap_max_distance) return;
                n && "tap" == n.name && t.timeStamp - n.lastEvent.timeStamp < e.options.doubletap_interval && t.distance < e.options.doubletap_distance && (e.trigger("doubletap", t), o = !0), (!o || e.options.tap_always) && (i.detection.current.name = "tap", e.trigger(i.detection.current.name, t))
            }
        }
    }, i.gestures.Touch = {
        name: "touch",
        index: -1 / 0,
        defaults: {
            prevent_default: !1,
            prevent_mouseevents: !1
        },
        handler: function(t, e) {
            return e.options.prevent_mouseevents && t.pointerType == i.POINTER_MOUSE ? (t.stopDetect(), void 0) : (e.options.prevent_default && t.preventDefault(), t.eventType == i.EVENT_START && e.trigger(this.name, t), void 0)
        }
    }, i.gestures.Transform = {
        name: "transform",
        index: 45,
        defaults: {
            transform_min_scale: .01,
            transform_min_rotation: 1,
            transform_always_block: !1
        },
        triggered: !1,
        handler: function(t, e) {
            if (i.detection.current.name != this.name && this.triggered) return e.trigger(this.name + "end", t), this.triggered = !1, void 0;
            if (!(t.touches.length < 2)) switch (e.options.transform_always_block && t.preventDefault(), t.eventType) {
                case i.EVENT_START:
                    this.triggered = !1;
                    break;
                case i.EVENT_MOVE:
                    var n = Math.abs(1 - t.scale),
                        o = Math.abs(t.rotation);
                    if (n < e.options.transform_min_scale && o < e.options.transform_min_rotation) return;
                    i.detection.current.name = this.name, this.triggered || (e.trigger(this.name + "start", t), this.triggered = !0), e.trigger(this.name, t), o > e.options.transform_min_rotation && e.trigger("rotate", t), n > e.options.transform_min_scale && (e.trigger("pinch", t), e.trigger("pinch" + (t.scale < 1 ? "in" : "out"), t));
                    break;
                case i.EVENT_END:
                    this.triggered && e.trigger(this.name + "end", t), this.triggered = !1
            }
        }
    }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
        return i
    }) : "object" == typeof module && "object" == typeof module.exports ? module.exports = i : t.Hammer = i
}(this), ! function(t, e) {
    "use strict";

    function n(t, n) {
        t.event.bindDom = function(t, i, o) {
            n(t).on(i, function(t) {
                var n = t.originalEvent || t;
                n.pageX === e && (n.pageX = t.pageX, n.pageY = t.pageY), n.target || (n.target = t.target), n.which === e && (n.which = n.button), n.preventDefault || (n.preventDefault = t.preventDefault), n.stopPropagation || (n.stopPropagation = t.stopPropagation), o.call(this, n)
            })
        }, t.Instance.prototype.on = function(t, e) {
            return n(this.element).on(t, e)
        }, t.Instance.prototype.off = function(t, e) {
            return n(this.element).off(t, e)
        }, t.Instance.prototype.trigger = function(t, e) {
            var i = n(this.element);
            return i.has(e.target).length && (i = n(e.target)), i.trigger({
                type: t,
                gesture: e
            })
        }, n.fn.hammer = function(e) {
            return this.each(function() {
                var i = n(this),
                    o = i.data("hammer");
                o ? o && e && t.utils.extend(o.options, e) : i.data("hammer", new t(this, e || {}))
            })
        }
    }
    "function" == typeof define && "object" == typeof define.amd && define.amd ? define(["hammer", "jquery"], n) : n(t.Hammer, t.jQuery || t.Zepto)
}(this), $(function() {
    function t() {
        $("body").removeClass("loading"), i(), $("#content").animate({
            opacity: 1
        }, 400, function() {
            $(this).trigger("koken:lightbox:imageloaded"), $(this).addClass("animate"), d.playing && $("#rnav a").length && (clearTimeout(h), h = window.setTimeout(u, 5e3))
        })
    }

    function e() {
        !fullScreenApi.supportsFullScreen || window.top !== window.parent && window.top !== window ? $("#lbox-bttn-fs, #lbox-bttn-ns").hide() : $("#lbox-bttn-fs, #lbox-bttn-ns").off("click").bind("click", function() {
            return s ? ($("body").hasClass("full-screen") && (window.parent.history.pushState(null, "", c), window.history.pushState(null, "", c)), $("body").toggleClass("full-screen"), window.parent.$K.toggleFullScreen()) : $(document.documentElement).requestFullScreen(), !1
        }), $("img#the-img").off("load").bind("load", function() {
            t()
        })
    }

    function n() {
        var n, o, r, a = $(window).width(),
            s = $("html").height(),
            c = a / s,
            u = window.theContent,
            h = u.aspect_ratio,
            d = !1;
        if (h >= c ? (n = "width", o = a) : (n = "height", o = s), u.html) {
            var p = $(u.html).attr("src");
            (0 === $("#content iframe").length || $("#content iframe").attr("src") !== p) && $("#content").prepend(u.html).fitVids(), t(), i()
        } else if ("image" === u.file_type) {
            l = !1;
            for (var g in u.presets) {
                var m = u.presets[g];
                if ((!d || m.width > d.width && m.height > d.height) && (d = m, d[n] >= o)) break
            }
            var f = Math.max(d.width, d.height);
            r = decodeURIComponent($K.isRetina() ? d.hidpi_url : d.url);
            var E = {
                width: d.width,
                height: d.height,
                "data-longest-side": f,
                "data-visibility": u.visibility.raw
            };
            $("img#the-img").length ? ($("img#the-img").attr("src") !== r && (E.src = r), $("img#the-img").attr(E)) : (E.src = r, E.id = "the-img", $("<img/>").attr(E).prependTo("#content"))
        } else if (!$("#content video").length) {
            var _ = $("<video/>").attr({
                src: u.original.url,
                preload: "metadata"
            }).css({
                width: "100%",
                height: "100%"
            }).prependTo("#content");
            $("video").mediaelementplayer({
                pluginPath: $K.location.real_root_folder + "/app/site/themes/common/js/",
                enableKeyboard: !1,
                success: function(e) {
                    l = e, $(e).bind("loadedmetadata", function() {
                        t(), _.data("aspect", this.videoWidth / this.videoHeight), _.data("width", this.videoWidth), $K.resizeVideos(), i()
                    })
                }
            })
        }
        e()
    }

    function i() {
        var t = $("footer").outerHeight(!0),
            e = $("html").height() - 2*t,
            n = $.trim($("div.caption").text()).length,
            i = $("#content").hasClass("animate") ? 500 : 1;
        $("#main").css({
            height: e,
            marginBottom: t,
            marginTop: t
        }), n > 0 ? $("#caption-bttns").show() : $("#caption-bttns").hide(), d.caption && n && (e -= $("div.caption").outerHeight(!0));
        var o, r, a = $("#main").width(),
            s = a,
            c = a / e,
            l = window.theContent.aspect_ratio,
            u = $("img#the-img"),
            h = $("#content .mejs-container"),
            p = $("#content iframe"),
            g = parseInt($("#content " + (h.length ? "video" : "img")).css("max-width"), 10);
        if (p.length && (iframeContent = $("#content").children().first(), g = parseInt(iframeContent.css("max-width"), 10)), isNaN(g) || (a = Math.min(g, a), c = a / e), h.length) o = h.width(), r = h.height();
        else if (u.length) {
            var m = u.attr("width"),
                f = u.attr("height");
            l >= c ? (o = a, r = Math.round(o / l)) : (r = e, o = Math.round(r * l)), (o > m || r > f) && (o = m, r = f), $("img#the-img").animate({
                width: o,
                height: r
            }, i)
        } else h = $("#content iframe"), l >= c ? (o = a, r = Math.round(o / l)) : (r = e, o = Math.round(r * l)), o > g && (o = g, r = Math.round(o / l)), iframeContent.animate({
            width: o,
            height: r
        }, i);
        var E;
        E = e > r ? (e - r) / 2 + "px" : 0, $("#content").animate({
            top: E
        }, i), h && s > o ? h.css("left", (s - o) / 2 + "px") : h.css("left", 0)
    }

    function o(t) {
        d[t] = !d[t], p = "playing" === t && d.playing ? !0 : !1, update()
    }

    function r(t) {
        s ? window.parent.$K.loadUrl(t) : location.href = t
    }

    function a() {
        $("head").find('link[rel="prerender"]').remove(), $("#rnav, #lnav").each(function(t, e) {
            var n = $(e).find("a");
            n.length && $("<link/>").attr({
                rel: "prerender",
                href: n.attr("href") + ($.support.pjax ? "?_pjax=true" : "")
            }).appendTo("head")
        })
    }
    $K.lightbox.solo = !0;
    var s = window.parent !== window && window.parent.$K;
    $.support.pjax && s && window.parent.$K.lightbox.cacheEntry(location.href, document.title), s ? window.parent.$K.lightbox.show() : $("body").addClass("solo"), window.scrollTo(0, 1), $(window).on("touchmove", function(t) {
        t.preventDefault()
    });
    var c;
    $(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange", function() {
        fullScreenApi.isFullScreen() === !1 ? ($("body").removeClass("full-screen"), $("<iframe/>").attr("id", "dummy").appendTo("body"), $.pjax({
            url: c,
            container: "#dummy",
            push: !0,
            complete: function() {
                $("#dummy").remove()
            }
        })) : $("body").addClass("full-screen")
    });
    var l = !1,
        u = function() {
            return $("#rnav a").length ? $("#rnav a").addClass("hover").trigger("click") : d.playing && o("playing"), !1
        };
    $(window).bind("resize orientationchange", function() {
        n(), i()
    });
    var h, d = {
            playing: $.cookie("koken_lightbox_play"),
            caption: $.cookie("koken_lightbox_caption")
        },
        p = !1;
    window.update = function() {
        n(), a(), $K.keyboard.bind();
        var t = $("div.caption");
        d.playing && $("#rnav a").length ? ($("#lbox-bttn-pause").show(), $("#lbox-bttn-play").hide()) : (d.playing = !1, p = !1, clearTimeout(h), $("#lbox-bttn-pause").hide(), $("#lbox-bttn-play").show()), d.caption ? (t.fadeIn(), $(".btn-toggle.show").hide(), $(".btn-toggle.hide").show()) : (t.fadeOut(), $(".btn-toggle.show").show(), $(".btn-toggle.hide").hide()), d.playing ? $.cookie("koken_lightbox_play", d.playing, {
            path: "/"
        }) : $.removeCookie("koken_lightbox_play", {
            path: "/"
        }), d.caption ? $.cookie("koken_lightbox_caption", d.caption, {
            path: "/"
        }) : $.removeCookie("koken_lightbox_caption", {
            path: "/"
        }), i(), p && u(), p = !1;
        var e = $("#main").hammer();
        e.on("swipeleft swiperight swipeup tap", function(t) {
            return t.preventDefault(), "a" === t.target.tagName.toLowerCase() ? (window.top.location.href = t.target.href, !1) : "tap" !== t.type || -1 === t.target.className.indexOf("mejs") ? ("tap" === t.type && "div" === t.target.tagName.toLowerCase() ? $("#lbox-bttn-close").trigger("click") : "swipeleft" === t.type || "tap" === t.type ? $("#rnav a").trigger("click") : "swiperight" === t.type && $("#lnav a").trigger("click"), !1) : void 0
        })
    }, $(document).on("click", "#lbox-bttn-play, #lbox-bttn-pause", function() {
        return o("playing"), !1
    }), $(document).on("click", ".btn-toggle", function() {
        return o("caption"), !1
    }), $(document).on("click", "#rnav a, #lnav a", function() {
        return fullScreenApi.isFullScreen() || $("body").hasClass("full-screen") ? (c = $(this).attr("href"), $(document).trigger("pjax:start"), $.ajax({
            url: c,
            beforeSend: function(t) {
                t.setRequestHeader("X-PJAX", "true")
            },
            success: function(t) {
                $("#lbox").html(t)
            }
        })) : $.pjax({
            url: $(this).attr("href"),
            container: "#lbox"
        }), !1
    }), $(document).on("click", "#lbox-bttn-close", function() {
        $.removeCookie("koken_lightbox_play", {
            path: "/"
        }), $.removeCookie("koken_lightbox_caption", {
            path: "/"
        });
        var t = $K.location.root,
            e = !1;
        $K.location.referrer || ($K.location.referrer = location.href.replace(location.protocol + "//" + location.host + t, "").replace(/lightbox\/\??/, ""), e = !0);
        var n, i = location.href.match(/&preview=[a-z_\-0-9]+/) || "",
            o = !1;
        if ($.each(["content", "category_content", "tag_content", "favorite"], function(t, e) {
                return $K.location.urls[e] && (n = "^" + $K.location.urls[e].replace(/\:[a-z_-]+/g, "([^/]+)"), $K.location.referrer.match(RegExp(n))) ? (o = location.href.replace("/lightbox/", "/"), !1) : void 0
            }), o) return r(o), !1;
        if ($K.location.urls.album && $K.location.urls.content) {
            var a = $K.location.urls.content.match(/^\/([a-z\-_]+)/);
            if (n = "^" + $K.location.urls.album.replace(/\:[a-z_-]+/g, "([^/]+)") + a[1] + "/[^/]+/", $K.location.referrer.match(RegExp(n))) return r(location.href.replace("/lightbox/", "/")), !1
        }
        return s ? (window.parent.$K.lightbox.exit(), !1) : (e && ($K.location.referrer = "/"), -1 === $K.location.referrer.indexOf("http://") ? r(t + $K.location.referrer + i) : r($K.location.referrer), !1)
    }), $(document).on("pjax:start", function() {
        $("body").addClass("loading")
    }), $(document).on("pjax:complete", function() {
        s && window.parent.$K.lightbox.complete(location.href, document.title)
    }), $(document).on("pjax:timeout", function(t) {
        t.preventDefault()
    }), $(document).keyup(function(t) {
        switch (t.keyCode) {
            case 32:
                l ? l.paused ? l.play() : l.pause() : o("playing");
                break;
            case 67:
                o("caption");
                break;
            case 70:
                $("#lbox-bttn-fs").trigger("click");
                break;
            case 27:
                $("#lbox-bttn-close").trigger("click")
        }
    }), $K.location.referrer && -1 !== $K.location.referrer.indexOf("/lightbox") || ($.removeCookie("koken_lightbox_play", {
        path: "/"
    }), $.removeCookie("koken_lightbox_caption", {
        path: "/"
    })), s && $(document).on("click", "[data-koken-internal]", function() {
        return window.parent.$K.loadUrl(location.protocol + "//" + location.host + $(this).attr("href")), !1
    }), $(document).on("click", "#lbox-bttn-share", function() {
        return $("#lbox_share_menu").fadeIn(), !1
    }), $(document).on("mouseenter", ".lbox_toggle", function() {
        $("#lbox-bttn-share").addClass("open")
    }), $(document).on("mouseleave", ".lbox_toggle", function() {
        $("#lbox-bttn-share").removeClass("open"), $("#lbox_share_menu").fadeOut()
    }), update()
});
