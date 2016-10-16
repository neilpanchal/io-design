$K.infinity.pause(),
    function(i) {
        i.Pillar = function(t, n) {
            this.element = i(n), this._init(t)
        }, i.Pillar.settings = {
            items: "",
            responsiveHold: !0,
            maxMobileWidth: 767,
            columns: 3,
            spacing: 10,
            gutter: -1,
            balanceColumns: !0,
            variability: "none",
            variabilityAmt: 0,
            variabilityOverride: 2,
            maxWidthsSum: 100,
            threshold: 25,
            flush: !1
        }, i.Pillar.prototype = {
            _init: function(t) {
                var n = this;
                t instanceof Object || (i.Pillar.settings.items = t), this.options = i.extend(!0, {}, i.Pillar.settings, t), this.options.gutter < 0 && (this.options.gutter = this.options.spacing), this._columns = [], this.namespace = "xxxxxx".replace(/[x]/g, function() {
                    return String.fromCharCode(Math.floor(26 * Math.random() + 65)).toLowerCase()
                }), this.options.columns instanceof Object ? i.each(this.options.columns, function(i, t) {
                    var a = {
                        cols: t
                    };
                    "max" !== i && (a.width = parseInt(i, 10)), n._columns.push(a)
                }) : this._columns.push({
                    cols: 1,
                    width: parseInt(this.options.maxMobileWidth, 10)
                }, {
                    cols: this.options.columns
                }), this.options.flush ? this.element.css({
                    marginLeft: -this.options.spacing
                }) : this.element.css("margin", "0 " + (this.options.gutter > 0 ? this.options.gutter / 2 : 0) + "px"), i(window).off(".pbind").on("k-infinite-loaded.pbind", function() {
                    n._updatePillars()
                }), this._createPillar(function() {
                    n._resize()
                })
            },
            _createPillar: function(t) {
                var n, a, e, s = i("<div/>").addClass("pillar").css({
                        display: "inline",
                        "float": "left",
                        boxSizing: "border-box"
                    }).attr("data-koken-pillar", this.namespace),
                    o = i("<div/>"),
                    l = this._getWidthIdent(),
                    r = this;
                if (i('[data-koken-pillar="' + this.namespace + '"].size_' + l).length) return t && t(), void 0;
                i.each(this._columns, function(i, t) {
                    return n = "size_" + (t.width || "max"), a = t.cols, t.width == l ? !1 : void 0
                }), e = r.options.flush ? {
                    paddingLeft: r.options.spacing
                } : {
                    paddingLeft: r.options.spacing / 2,
                    paddingRight: r.options.spacing / 2
                };
                for (var p = 0, h = a; h > p; p++) {
                    var d = Math.floor(100 / a * 100) / 100,
                        c = function() {
                            var i = [];
                            if ("even" === r.options.variability || "odd" === r.options.variability)
                                for (var t = 0; a > t; t++) i.push(t % 2 > 0 && "even" === r.options.variability || 0 >= t % 2 && "odd" === r.options.variability ? d - r.options.variabilityAmt : d + r.options.variabilityAmt);
                            else if ("random" === r.options.variability)
                                for (var t = 0; a > t; t++) {
                                    var n = Math.floor(Math.random() * (r.options.variabilityAmt - 0 + 1) + 0);
                                    i.push(0 == Math.round(Math.random()) ? d - n : d + n)
                                }
                            var e = i.reduce(function(i, t) {
                                return i + t
                            }, 0);
                            if (e != r.options.maxWidthsSum) {
                                var s = Math.abs((e - r.options.maxWidthsSum) / a);
                                i = i.map(function(i) {
                                    return e > r.options.maxWidthsSum ? i - s : i + s
                                })
                            }
                            return i
                        };
                    "none" !== r.options.variability && !r.options.widths && a > r.options.variabilityOverride && (r.options.widths = c());
                    var u = s.clone().width(d + "%");
                    r.options.widths && u.width(r.options.widths[p] + "%"), u.css(e), o.append(u.hide().addClass(n))
                }
                this.element.prepend(o.children()), i('[data-koken-pillar="' + this.namespace + '"].size_' + l).show(), t && t()
            },
            _updatePillars: function() {
                $K.infinity.pause();
                var t = this,
                    n = i("> " + this.options.items, this.element);
                n.length <= 0 && (n = i(this.options.items, this.element)), n = n.filter(function() {
                    return !i(this).closest('[data-koken-pillar="' + t.namespace + '"]').length
                });
                var a = {};
                n.length > 0 && n.each(function(n) {
                    var e = i(this);
                    e.parent().hasClass("k-control-structure") && 1 === e.parent().children().length && (e = e.parent()), i.each(t._columns, function(s, o) {
                        var l = n % o.cols,
                            r = "size_" + (o.width || "max"),
                            p = e.clone(!0, !0);
                        0 === i('[data-koken-pillar="' + t.namespace + '"].' + r).length || e.attr("data-" + r) || (a["pillar_" + l + "_" + r] = a["pillar_" + l + "_" + r] || [], p.add(p.find("img")).css("display", "block"), t._setSpacing.call(t, p, l), t.options.imageLoaded && p.find("img").off(".pimage").on("k-image-loaded.pimage", t.options.imageLoaded), a["pillar_" + l + "_" + r].push(p), e.attr("data-" + r, !0))
                    })
                }), i.each(a, function(n, a) {
                    var e = n.split("_"),
                        s = i('[data-koken-pillar="' + t.namespace + '"].size_' + e.pop() + ":eq(" + e[1] + ")");
                    s && s.append(a)
                }), setTimeout(function() {
                    var n;
                    "boolean" == typeof t.options.responsiveHold ? n = t.options.responsiveHold ? i("[data-koken-pillar=" + t.namespace + "] img[data-base]") : i("[data-koken-pillar=" + t.namespace + "] [data-responsive-hold]") : "string" == typeof t.options.responsiveHold ? n = i(t.options.responsiveHold) : "object" == typeof t.options.responsiveHold && t.options.responsiveHold.length && (n = t.options.responsiveHold), n.attr({
                        "data-lazy-hold": !0,
                        "data-responsive-hold": !0
                    }), $K.responsiveImages(i("[data-koken-pillar=" + t.namespace + "] [data-responsive-hold]", t.element), function() {
                        t.options.balanceColumns ? t._balancePillars.call(t) : setTimeout(function() {
                            i("[data-lazy-hold]").attr("data-lazy-hold", null), $K.infinity.resume()
                        }, 0)
                    })
                }, 0)
            },
            _balancePillars: function() {
                var t = this;
                $K.infinity.pause();
                var n = this._getPillarStats(),
                    a = i(">:last-child", n.longest),
                    e = a.outerHeight(!0);
                if ("none" !== this.options.variability) {
                    var s = n.shortest.width();
                    s != n.longest.width() && (e = s * e / a.width())
                }
                n.difference > e && n.difference - e > this.options.threshold ? (n.shortest.append(a), this._setSpacing(a, n.shortest.index()), "none" !== this.options.variability ? $K.responsiveImages(a.find("img[data-presets]"), function() {
                    t._balancePillars.call(t)
                }) : t._balancePillars.call(t)) : setTimeout(function() {
                    i("[data-lazy-hold]").attr("data-lazy-hold", null), $K.infinity.resume()
                }, 0)
            },
            _getPillarStats: function() {
                var t, n, a = [],
                    e = 0,
                    s = 0;
                return i('[data-koken-pillar="' + this.namespace + '"].size_' + this._getWidthIdent(), this.element).each(function() {
                    var o = i(this),
                        l = o.outerHeight(!0);
                    (!n || l > e) && (n = o, e = l), (!t || s > l) && (t = o, s = l), a.push(o)
                }), {
                    pillars: a,
                    shortest: t,
                    longest: n,
                    difference: e - s
                }
            },
            _setSpacing: function(t) {
                t = t.hasClass("k-control-structure") ? t.children().first() : t, this.options.spacing > 0 && i(t).css("margin-bottom", this.options.spacing)
            },
            _getWidthIdent: function() {
                if (this._widthIdent) return this._widthIdent;
                var t, n = i(window).width();
                return i.each(this._columns, function(i, a) {
                    return n <= a.width ? (t = a.width, !1) : void 0
                }), this._widthIdent = t || "max", this._widthIdent
            },
            _resize: function() {
                var t = this,
                    n = 0;
                i(window).on("k-resize." + this.namespace, function() {
                    i(window).width() !== n && (t._widthIdent = !1, n = i(window).width(), t.options.widths = null, t._createPillar(function() {
                        i('[data-koken-pillar="' + t.namespace + '"]').hide(), i('[data-koken-pillar="' + t.namespace + '"].size_' + t._getWidthIdent()).show(), t.options.viewportChange && t.options.viewportChange.call(t), setTimeout(function() {
                            t._updatePillars.call(t)
                        }, 0)
                    }))
                })
            }
        }, i.fn.pillar = function(t) {
            return i(this).each(function() {
                i.data(this, "pillar", new i.Pillar(t, this))
            }), this
        }
    }(jQuery);
