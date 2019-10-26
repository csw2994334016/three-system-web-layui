/** EasyWeb iframe v3.1.1 data:2019-03-24 License By http://easyweb.vip */

layui.define(["layer", 'config'], function (f) {
    var $ = layui.jquery;
    var layer = layui.layer;
    var config = layui.config;
    var a = ".layui-layout-admin>.layui-body";
    var l = a + ">.layui-tab";
    var e = ".layui-layout-admin>.layui-side>.layui-side-scroll";
    var j = ".layui-layout-admin>.layui-header";
    var b = "admin-pagetabs";
    var d = "admin-side-nav";
    var c = "theme-admin";
    var openIndex;
    var admin = {
        defaultTheme: "theme-admin",
        tableName: "easyweb",
        flexible: function (n) {
            var o = $(".layui-layout-admin").hasClass("admin-nav-mini");
            if (o == !n) {
                return
            }
            if (n) {
                $(".layui-layout-admin").removeClass("admin-nav-mini")
            } else {
                $(".layui-layout-admin").addClass("admin-nav-mini")
            }
            admin.removeNavHover()
        },
        activeNav: function (n) {
            if (!n) {
                n = window.location.pathname;
                n = n.substring(n.indexOf("/"))
            }
            if (n && n != "") {
                $(e + ">.layui-nav .layui-nav-item .layui-nav-child dd").removeClass("layui-this");
                $(e + ">.layui-nav .layui-nav-item").removeClass("layui-this");
                var r = $(e + '>.layui-nav a[lay-href="' + n + '"]');
                if (r && r.length > 0) {
                    if ($(e + ">.layui-nav").attr("lay-accordion") == "true") {
                        $(e + ">.layui-nav .layui-nav-itemed").removeClass("layui-nav-itemed")
                    }
                    r.parent().addClass("layui-this");
                    r.parent("dd").parents(".layui-nav-child").parent().addClass("layui-nav-itemed");
                    $('ul[lay-filter="' + d + '"]').addClass("layui-hide");
                    var p = r.parents(".layui-nav");
                    p.removeClass("layui-hide");
                    $(j + ">.layui-nav>.layui-nav-item").removeClass("layui-this");
                    $(j + '>.layui-nav>.layui-nav-item>a[nav-bind="' + p.attr("nav-id") + '"]').parent().addClass("layui-this");
                    var o = r.offset().top + r.outerHeight() + 30 - admin.getPageHeight();
                    var q = 50 + 65 - r.offset().top;
                    if (o > 0) {
                        $(e).animate({
                            "scrollTop": $(e).scrollTop() + o
                        }, 100)
                    } else {
                        if (q > 0) {
                            $(e).animate({
                                "scrollTop": $(e).scrollTop() - q
                            }, 100)
                        }
                    }
                } else {
                }
            } else {
                console.warn("active url is null")
            }
        },
        popupRight: function (n) {
            if (n.title == undefined) {
                n.title = false;
                n.closeBtn = false
            }
            if (n.anim == undefined) {
                n.anim = 2
            }
            if (n.fixed == undefined) {
                n.fixed = true
            }
            n.isOutAnim = false;
            n.offset = "r";
            n.shadeClose = true;
            n.area = "336px";
            n.skin = "layui-layer-adminRight";
            n.move = false;
            return admin.open(n)
        },
        open: function (o) {
            if (!o.area) {
                o.area = (o.type == 2) ? ["360px", "300px"] : "360px"
            }
            if (!o.skin) {
                o.skin = "layui-layer-admin"
            }
            if (!o.offset) {
                o.offset = "35px"
            }
            if (o.fixed == undefined) {
                o.fixed = false
            }
            o.resize = o.resize != undefined ? o.resize : false;
            o.shade = o.shade != undefined ? o.shade : 0.1;
            var n = o.end;
            o.end = function () {
                layer.closeAll("tips");
                n && n()
            };
            openIndex = layer.open(o);
            return openIndex;
        },
        closeOpen: function () {
            layer.close(openIndex);
        },
        req: function (url, data, success, method) {
            admin.ajax({
                url: url,
                data: JSON.stringify(data),
                type: method,
                dataType: "json",
                contentType: "application/json",
                success: success
            })
        },
        ajax: function (param) {
            var successCallback = param.success;
            param.success = function (result, status, xhr) {
                // 判断登录过期和没有权限
                console.log(result);
                var jsonRs;
                if ("json" === param.dataType.toLowerCase() || 'application/json' === param.dataType.toLowerCase()) {
                    jsonRs = result
                } else if ('html' === param.dataType.toLowerCase() || 'text' === param.dataType.toLowerCase()) {
                    jsonRs = admin.parseJSON(result)
                }
                if (jsonRs) {
                    if (jsonRs.code === 401) {
                        config.removeToken();
                        layer.msg('登录信息过期', {icon: 2, time: 1500}, function () {
                            location.replace('/');
                        }, 1000);
                    }
                }
                successCallback(result, status, xhr)
            };
            param.error = function (xhr) {
                // param.success({
                //     code: xhr.status,
                //     msg: xhr.responseText
                // })
                param.success(admin.parseJSON(xhr.responseText))
            };
            param.beforeSend = function (xhr) {
                console.log(param.data);
                console.log(param.url);
                var token = config.getToken();
                if (token) {
                    // console.log('Bearer ' + token.access_token);
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token.access_token);
                }
            };
            $.ajax(param)
        },
        ajaxSuccessBefore: function (n, o) {
            return true
        },
        getAjaxHeaders: function (n) {
            var o = new Array();
            return o
        },
        parseJSON: function (p) {
            if (typeof p == "string") {
                try {
                    var o = JSON.parse(p);
                    if (typeof o == "object" && o) {
                        return o
                    }
                } catch (n) {
                }
            }
        },
        // 从服务器刷新用户登录的token
        refreshToken: function () {
            var field = {};
            field.access_token = config.getToken().access_token;
            field.refresh_token = config.getToken().refresh_token;
            field.grant_type = 'refresh_token';
            field.client_id = config.client_id;
            field.client_secret = config.client_secret;
            $.ajax({
                url: config.base_server + '/sys/refresh_token',
                // data: field,
                // type: 'POST',
                // dataType: 'JSON',
                data: JSON.stringify(field),
                type: 'POST',
                contentType: "application/json;charset=UTF-8",
                async: false,
                success: function (data) {
                    console.log(data);
                    if (data.access_token) {
                        config.putToken(data);
                        top.location.reload();
                    } else {
                        layer.msg('刷新token失败，请联系管理员', {icon: 5});
                    }
                },
                error: function (xhr) {
                    console.log(xhr);
                    if (xhr.status === 400) {
                        layer.msg('账号或密码错误', {icon: 5});
                    } else {
                        layer.msg('刷新token失败，请联系管理员', {icon: 5});
                    }
                }
            });
        },
        showLoading: function (q, p, o) {
            var n = ['<div class="ball-loader"><span></span><span></span><span></span><span></span></div>', '<div class="rubik-loader"></div>'];
            if (!q) {
                q = "body"
            }
            if (p == undefined) {
                p = 1
            }
            $(q).addClass("page-no-scroll");
            var r = $(q).children(".page-loading");
            if (r.length <= 0) {
                $(q).append('<div class="page-loading">' + n[p - 1] + "</div>");
                r = $(q).children(".page-loading")
            }
            o && r.css("background-color", "rgba(255,255,255," + o + ")");
            r.show()
        },
        removeLoading: function (o, q, n) {
            if (!o) {
                o = "body"
            }
            if (q == undefined) {
                q = true
            }
            var p = $(o).children(".page-loading");
            if (n) {
                p.remove()
            } else {
                q ? p.fadeOut() : p.hide()
            }
            $(o).removeClass("page-no-scroll")
        },
        putTempData: function (n, o) {
            if (o != undefined && o != null) {
                layui.sessionData("tempData", {
                    key: n,
                    value: o
                })
            } else {
                layui.sessionData("tempData", {
                    key: n,
                    remove: true
                })
            }
        },
        getTempData: function (n) {
            var o = layui.sessionData("tempData");
            if (o) {
                return o[n]
            } else {
                return false
            }
        },
        rollPage: function (q) {
            var o = $(l + ">.layui-tab-title");
            var p = o.scrollLeft();
            if ("left" === q) {
                o.animate({
                    "scrollLeft": p - 120
                }, 100)
            } else {
                if ("auto" === q) {
                    var n = 0;
                    o.children("li").each(function () {
                        if ($(this).hasClass("layui-this")) {
                            return false
                        } else {
                            n += $(this).outerWidth()
                        }
                    });
                    o.animate({
                        "scrollLeft": n - 120
                    }, 100)
                } else {
                    o.animate({
                        "scrollLeft": p + 120
                    }, 100)
                }
            }
        },
        refresh: function (n) {
            var p;
            if (!n) {
                p = $(l + ">.layui-tab-content>.layui-tab-item.layui-show>.admin-iframe");
                if (!p || p.length <= 0) {
                    p = $(a + ">div>.admin-iframe")
                }
            } else {
                p = $(l + '>.layui-tab-content>.layui-tab-item>.admin-iframe[lay-id="' + n + '"]');
                if (!p || p.length <= 0) {
                    p = $(a + ">.admin-iframe")
                }
            }
            if (p && p[0]) {
                try {
                    p[0].contentWindow.location.reload(true)
                } catch (o) {
                    p.attr("src", p.attr("src"))
                }
            } else {
                console.warn(n + " is not found")
            }
        },
        closeThisTabs: function (n) {
            admin.closeTabOperNav();
            var o = $(l + ">.layui-tab-title");
            if (!n) {
                if (o.find("li").first().hasClass("layui-this")) {
                    layer.msg("主页不能关闭", {
                        icon: 2
                    });
                    return
                }
                o.find("li.layui-this").find(".layui-tab-close").trigger("click")
            } else {
                if (n == o.find("li").first().attr("lay-id")) {
                    layer.msg("主页不能关闭", {
                        icon: 2
                    });
                    return
                }
                o.find('li[lay-id="' + n + '"]').find(".layui-tab-close").trigger("click")
            }
        },
        closeOtherTabs: function (n) {
            if (!n) {
                $(l + ">.layui-tab-title li:gt(0):not(.layui-this)").find(".layui-tab-close").trigger("click")
            } else {
                $(l + ">.layui-tab-title li:gt(0)").each(function () {
                    if (n != $(this).attr("lay-id")) {
                        $(this).find(".layui-tab-close").trigger("click")
                    }
                })
            }
            admin.closeTabOperNav()
        },
        closeAllTabs: function () {
            $(l + ">.layui-tab-title li:gt(0)").find(".layui-tab-close").trigger("click");
            $(l + ">.layui-tab-title li:eq(0)").trigger("click");
            admin.closeTabOperNav()
        },
        closeTabOperNav: function () {
            $(".layui-icon-down .layui-nav .layui-nav-child").removeClass("layui-show")
        },
        changeTheme: function (t) {
            if (t) {
                layui.data(admin.tableName, {
                    key: "theme",
                    value: t
                });
                if (c == t) {
                    t = undefined
                }
            } else {
                layui.data(admin.tableName, {
                    key: "theme",
                    remove: true
                })
            }
            admin.removeTheme(top);
            !t || top.layui.link(admin.getThemeDir() + t + ".css", t);
            var u = top.window.frames;
            for (var p = 0; p < u.length; p++) {
                var r = u[p];
                try {
                    admin.removeTheme(r)
                } catch (s) {
                }
                if (t && r.layui) {
                    r.layui.link(admin.getThemeDir() + t + ".css", t)
                }
                var q = r.frames;
                for (var o = 0; o < q.length; o++) {
                    var n = q[o];
                    try {
                        admin.removeTheme(n)
                    } catch (s) {
                    }
                    if (t && n.layui) {
                        n.layui.link(admin.getThemeDir() + t + ".css", t)
                    }
                }
            }
        },
        removeTheme: function (n) {
            if (!n) {
                n = window
            }
            if (n.layui) {
                var o = "layuicss-theme";
                n.layui.jquery('link[id^="' + o + '"]').remove()
            }
        },
        getThemeDir: function () {
            return layui.cache.base + "theme/"
        },
        closeThisDialog: function () {
            parent.layer.close(parent.layer.getFrameIndex(window.name))
        },
        closeDialog: function (n) {
            var o = $(n).parents(".layui-layer").attr("id").substring(11);
            layer.close(o)
        },
        iframeAuto: function () {
            parent.layer.iframeAuto(parent.layer.getFrameIndex(window.name))
        },
        getPageHeight: function () {
            return document.documentElement.clientHeight || document.body.clientHeight
        },
        getPageWidth: function () {
            return document.documentElement.clientWidth || document.body.clientWidth
        },
        removeNavHover: function () {
            $(".admin-nav-hover>.layui-nav-child").css({
                "top": "auto",
                "max-height": "none",
                "overflow": "auto"
            });
            $(".admin-nav-hover").removeClass("admin-nav-hover")
        },
        setNavHoverCss: function (p) {
            var n = $(".admin-nav-hover>.layui-nav-child");
            if (p && n.length > 0) {
                var r = (p.offset().top + n.outerHeight()) > window.innerHeight;
                if (r) {
                    var o = p.offset().top - n.outerHeight() + p.outerHeight();
                    if (o < 50) {
                        var q = admin.getPageHeight();
                        if (p.offset().top < q / 2) {
                            n.css({
                                "top": "50px",
                                "max-height": q - 50 + "px",
                                "overflow": "auto"
                            })
                        } else {
                            n.css({
                                "top": p.offset().top,
                                "max-height": q - p.offset().top,
                                "overflow": "auto"
                            })
                        }
                    } else {
                        n.css("top", o)
                    }
                } else {
                    n.css("top", p.offset().top)
                }
                i = true
            }
        }
    };
    admin.events = {
        flexible: function (o) {
            var n = $(".layui-layout-admin").hasClass("admin-nav-mini");
            admin.flexible(n)
        },
        refresh: function () {
            admin.refresh()
        },
        back: function () {
            history.back()
        },
        theme: function () {
            var n = $(this).attr("data-url");
            admin.popupRight({
                id: "layer-theme",
                type: 2,
                content: n ? n : "page/tpl/tpl-theme.html"
            })
        },
        note: function () {
            var n = $(this).attr("data-url");
            admin.popupRight({
                id: "layer-note",
                title: "便签",
                type: 2,
                closeBtn: false,
                content: n ? n : "page/tpl/tpl-note.html"
            })
        },
        message: function () {
            var n = $(this).attr("data-url");
            admin.popupRight({
                id: "layer-notice",
                type: 2,
                content: n ? n : "page/tpl/tpl-message.html"
            })
        },
        psw: function () {
            var n = $(this).attr("data-url");
            admin.open({
                id: "pswForm",
                type: 2,
                title: "修改密码",
                shade: 0,
                content: n ? n : "page/tpl/tpl-password.html"
            })
        },
        logout: function () {
            var n = $(this).attr("data-url");
            layer.confirm("确定要退出登录吗？", {
                title: "温馨提示",
                skin: "layui-layer-admin"
            }, function () {
                layer.load(2);
                admin.req(config.base_server + '/sys/logout', null, function (data) {
                    layer.closeAll('loading');
                    // console.log(data);
                    if (200 === data.code) {
                        config.removeToken();
                        location.replace('page/system/login.html');
                    } else {
                        layer.msg(data.msg, {icon: 2});
                    }
                }, 'GET');
            })
        },
        fullScreen: function (t) {
            var v = "layui-icon-screen-full",
                p = "layui-icon-screen-restore";
            var n = $(this).find("i");
            var s = document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || false;
            if (s) {
                var r = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
                if (r) {
                    r.call(document)
                } else {
                    if (window.ActiveXObject) {
                        var u = new ActiveXObject("WScript.Shell");
                        u && u.SendKeys("{F11}")
                    }
                }
                n.addClass(v).removeClass(p)
            } else {
                var o = document.documentElement;
                var q = o.requestFullscreen || o.webkitRequestFullscreen || o.mozRequestFullScreen || o.msRequestFullscreen;
                if (q) {
                    q.call(o)
                } else {
                    if (window.ActiveXObject) {
                        var u = new ActiveXObject("WScript.Shell");
                        u && u.SendKeys("{F11}")
                    }
                }
                n.addClass(p).removeClass(v)
            }
        },
        leftPage: function () {
            admin.rollPage("left")
        },
        rightPage: function () {
            admin.rollPage()
        },
        closeThisTabs: function () {
            admin.closeThisTabs()
        },
        closeOtherTabs: function () {
            admin.closeOtherTabs()
        },
        closeAllTabs: function () {
            admin.closeAllTabs()
        },
        closeDialog: function () {
            admin.closeThisDialog()
        },
        closePageDialog: function () {
            admin.closeDialog(this)
        }
    };
    $("body").on("click", "*[ew-event]", function () {
        var n = $(this).attr("ew-event");
        var o = admin.events[n];
        o && o.call(this, $(this))
    });
    $("body").on("click", "*[ew-href]", function () {
        var n = $(this).attr("ew-href");
        var o = $(this).text();
        top.layui.index.openTab({
            title: o,
            url: n
        })
    });
    $("body").on("mouseenter", "*[lay-tips]", function () {
        var n = $(this).attr("lay-tips");
        var o = $(this).attr("lay-direction");
        var p = $(this).attr("lay-bg");
        layer.tips(n, this, {
            tips: [o || 3, p || "#333333"],
            time: -1
        })
    }).on("mouseleave", "*[lay-tips]", function () {
        layer.closeAll("tips")
    });
    var i = false;
    $("body").on("mouseenter", ".layui-layout-admin.admin-nav-mini .layui-side .layui-nav .layui-nav-item>a", function () {
        if (admin.getPageWidth() > 750) {
            var p = $(this);
            $(".admin-nav-hover>.layui-nav-child").css("top", "auto");
            $(".admin-nav-hover").removeClass("admin-nav-hover");
            p.parent().addClass("admin-nav-hover");
            var n = $(".admin-nav-hover>.layui-nav-child");
            if (n.length > 0) {
                admin.setNavHoverCss(p)
            } else {
                var o = p.find("cite").text();
                layer.tips(o, p, {
                    tips: [2, "#333333"],
                    time: -1
                })
            }
        }
    }).on("mouseleave", ".layui-layout-admin.admin-nav-mini .layui-side .layui-nav .layui-nav-item>a", function () {
        layer.closeAll("tips")
    });
    $("body").on("mouseleave", ".layui-layout-admin.admin-nav-mini .layui-side", function () {
        i = false;
        setTimeout(function () {
            if (!i) {
                admin.removeNavHover()
            }
        }, 500)
    });
    $("body").on("mouseenter", ".layui-layout-admin.admin-nav-mini .layui-side .layui-nav .layui-nav-item.admin-nav-hover .layui-nav-child", function () {
        i = true
    });
    if (!layui.contextMenu) {
        $(document).off("click.ctxMenu").on("click.ctxMenu", function () {
            var q = top.window.frames;
            for (var n = 0; n < q.length; n++) {
                var o = q[n];
                try {
                    o.layui.jquery(".ctxMenu").remove()
                } catch (p) {
                }
            }
            top.layui.jquery(".ctxMenu").remove()
        })
    }
    var g = layui.data(admin.tableName);
    if (g && g.theme) {
        (g.theme == c) || layui.link(admin.getThemeDir() + g.theme + ".css", g.theme)
    } else {
        if (c != admin.defaultTheme) {
            layui.link(admin.getThemeDir() + admin.defaultTheme + ".css", admin.defaultTheme)
        }
    }
    f("admin", admin)
});
