/** EasyWeb iframe v3.1.1 data:2019-03-24 License By http://easyweb.vip */

layui.define(["layer", "element", "admin", "contextMenu", 'config'], function(s) {
	var $ = layui.jquery;
	var layer = layui.layer;
	var element = layui.element;
	var admin = layui.admin;
	var contextMenu = layui.contextMenu;
	var config = layui.config;
	var a = ".layui-layout-admin>.layui-header";
	var o = ".layui-layout-admin>.layui-side>.layui-side-scroll";
	var j = ".layui-layout-admin>.layui-body";
	var n = j + ">.layui-tab";
	var q = j + ">.layui-body-header";
	var i = "admin-pagetabs";
	var p = "admin-side-nav";
	var k = {};
	var f = false;
	var c;
	var index = {
		pageTabs: true,
		cacheTab: true,
		openTabCtxMenu: true,
		maxTabNum: 20,
		mTabList: [],
		mTabPosition: undefined,
		loadView: function(z) {
			var x = z.menuPath;
			var w = z.menuName;
			if (!x) {
				console.error("url不能为空");
				layer.msg("url不能为空", {
					icon: 2
				});
				return
			}
			if (index.pageTabs) {
				var v = false;
				$(n + ">.layui-tab-title>li").each(function() {
					if ($(this).attr("lay-id") === x) {
						v = true;
						return false
					}
				});
				if (!v) {
					if (index.mTabList.length >= index.maxTabNum) {
						layer.msg("最多打开" + index.maxTabNum + "个选项卡", {
							icon: 2
						});
						admin.activeNav(index.mTabPosition);
						return
					}
					f = true;
					element.tabAdd(i, {
						id: x,
						title: w ? w : "无标题",
						content: '<iframe lay-id="' + x + '" src="' + x + '" frameborder="0" class="admin-iframe"></iframe>'
					});
					if (x != c) {
						index.mTabList.push(z)
					}
					if (index.cacheTab) {
						admin.putTempData("indexTabs", index.mTabList)
					}
				}
				element.tabChange(i, x)
			} else {
				var u = $(j + ">.admin-iframe");
				if (!u || u.length <= 0) {
					var y = '<div class="layui-body-header">';
					y += '      <span class="layui-body-header-title"></span>';
					y += '      <span class="layui-breadcrumb pull-right">';
					y += '         <a ew-href="' + c + '">首页</a>';
					y += "         <a><cite></cite></a>";
					y += "      </span>";
					y += "   </div>";
					y += '   <div style="-webkit-overflow-scrolling: touch;">';
					y += '      <iframe lay-id="' + x + '" src="' + x + '" frameborder="0" class="admin-iframe"></iframe>';
					y += "   </div>";
					$(j).html(y);
					if (x != c) {
						index.setTabTitle(w)
					}
					element.render("breadcrumb")
				} else {
					u.attr("lay-id", x);
					u.attr("src", x);
					index.setTabTitle(w)
				}
				admin.activeNav(x);
				index.mTabList.splice(0, index.mTabList.length);
				if (x != c) {
					index.mTabList.push(z);
					index.mTabPosition = x
				} else {
					index.mTabPosition = undefined
				}
				if (index.cacheTab) {
					admin.putTempData("indexTabs", index.mTabList);
					admin.putTempData("tabPosition", index.mTabPosition)
				}
			}
			if (admin.getPageWidth() <= 750) {
				admin.flexible(true)
			}
		},
		// 从服务器获取登录用户的信息
		getUser: function (success) {
			layer.load(2);
			admin.req(config.three_user_server + '/sys/userInfo', null, function (data) {
				layer.closeAll('loading');
				if (200 === data.code) {
					console.log(data.data);
					config.putUser(data.data);
					success(data.data);
				} else {
					layer.msg('获取用户失败', {icon: 2});
					location.replace('page/system/login.html');
				}
			}, 'GET');
		},
		loadHome: function(w) {
			c = w.menuPath;
			var x = admin.getTempData("indexTabs");
			var u = admin.getTempData("tabPosition");
			var v = (w.loadSetting == undefined ? true : w.loadSetting);
			index.loadView({
				menuPath: c,
				menuName: w.menuName
			});
			if (!index.pageTabs) {
				admin.activeNav(w.menuPath)
			}
			if (v) {
				index.loadSettings(x, u)
			}
		},
		openTab: function(w) {
			var u = w.url;
			var v = w.title;
			if (w.end) {
				k[u] = w.end
			}
			index.loadView({
				menuPath: u,
				menuName: v
			})
		},
		closeTab: function(u) {
			element.tabDelete(i, u)
		},
		loadSettings: function(z, y) {
			if (index.cacheTab) {
				var A = z;
				var w = y;
				if (A) {
					var v = -1;
					for (var x = 0; x < A.length; x++) {
						if (index.pageTabs) {
							index.loadView(A[x])
						}
						if (A[x].menuPath == w) {
							v = x
						}
					}
					if (v != -1) {
						setTimeout(function() {
							index.loadView(A[v]);
							if (!index.pageTabs) {
								admin.activeNav(w)
							}
						}, 150)
					}
				}
			}
			var u = layui.data(admin.tableName);
			if (u) {
				if (u.openFooter != undefined && u.openFooter == false) {
					$("body.layui-layout-body").addClass("close-footer")
				}
				if (u.tabAutoRefresh) {
					$(n).attr("lay-autoRefresh", "true")
				}
			}
		},
		setTabCache: function(u) {
			layui.data(admin.tableName, {
				key: "cacheTab",
				value: u
			});
			index.cacheTab = u;
			if (u) {
				admin.putTempData("indexTabs", index.mTabList);
				admin.putTempData("tabPosition", index.mTabPosition)
			} else {
				admin.putTempData("indexTabs", []);
				admin.putTempData("tabPosition", undefined)
			}
		},
		clearTabCache: function() {
			admin.putTempData("indexTabs", undefined)
		},
		setTabTitle: function(u) {
			if (!index.pageTabs) {
				if (u) {
					$(q).addClass("show");
					var v = $(q + ">.layui-body-header-title");
					v.text(u);
					v.next(".layui-breadcrumb").find("cite").last().text(u)
				} else {
					$(q).removeClass("show")
				}
			}
		},
		setTabTitleHtml: function(u) {
			if (!index.pageTabs) {
				if (u) {
					$(q).addClass("show");
					$(q).html(u)
				} else {
					$(q).removeClass("show")
				}
			}
		},
		closeTabCache: function() {
			console.warn("closeTabCache() has been deprecated, please use clearTabCache().");
			index.clearTabCache()
		},
		loadSetting: function() {
			console.warn("loadSetting() has been deprecated.")
		}
	};
	var l = layui.data(admin.tableName);
	if (l) {
		if (l.openTab != undefined) {
			index.pageTabs = l.openTab
		}
		if (l.cacheTab != undefined) {
			index.cacheTab = l.cacheTab
		}
	}
	var g = ".layui-layout-admin .site-mobile-shade";
	if ($(g).length <= 0) {
		$(".layui-layout-admin").append('<div class="site-mobile-shade"></div>')
	}
	$(g).click(function() {
		admin.flexible(true)
	});
	if (index.pageTabs && $(n).length <= 0) {
		var e = '<div class="layui-tab" lay-allowClose="true" lay-filter="admin-pagetabs">';
		e += '       <ul class="layui-tab-title"></ul>';
		e += '      <div class="layui-tab-content"></div>';
		e += "   </div>";
		e += '   <div class="layui-icon admin-tabs-control layui-icon-prev" ew-event="leftPage"></div>';
		e += '   <div class="layui-icon admin-tabs-control layui-icon-next" ew-event="rightPage"></div>';
		e += '   <div class="layui-icon admin-tabs-control layui-icon-down">';
		e += '      <ul class="layui-nav admin-tabs-select" lay-filter="admin-pagetabs-nav">';
		e += '         <li class="layui-nav-item" lay-unselect>';
		e += "            <a></a>";
		e += '            <dl class="layui-nav-child layui-anim-fadein">';
		e += '               <dd ew-event="closeThisTabs" lay-unselect><a>关闭当前标签页</a></dd>';
		e += '               <dd ew-event="closeOtherTabs" lay-unselect><a>关闭其它标签页</a></dd>';
		e += '               <dd ew-event="closeAllTabs" lay-unselect><a>关闭全部标签页</a></dd>';
		e += "            </dl>";
		e += "         </li>";
		e += "      </ul>";
		e += "   </div>";
		$(j).html(e);
		element.render("nav")
	}
	element.on("nav(" + p + ")", function(x) {
		var w = $(x);
		var u = w.attr("lay-href");
		var y = w.attr("lay-id");
		if (!y) {
			y = u
		}
		if (u && u != "javascript:;") {
			var v = w.text().replace(/(^\s*)|(\s*$)/g, "");
			index.loadView({
				menuId: y,
				menuPath: u,
				menuName: v
			})
		} else {
			admin.setNavHoverCss(w.parentsUntil(".layui-nav-item").parent().children().eq(0))
		}
		if ("true" == ($(o + ">.layui-nav-tree").attr("lay-accordion"))) {
			if ((w.parent().hasClass("layui-nav-itemed")) || (w.parent().hasClass("layui-this"))) {
				$(o + ">.layui-nav .layui-nav-itemed").not(w.parents(".layui-nav-child").parent()).removeClass("layui-nav-itemed");
				w.parent().addClass("layui-nav-itemed")
			}
			w.trigger("mouseenter")
		}
	});
	element.on("tab(" + i + ")", function(w) {
		var v = $(this).attr("lay-id");
		if (v != c) {
			index.mTabPosition = v
		} else {
			index.mTabPosition = undefined
		}
		if (index.cacheTab) {
			admin.putTempData("tabPosition", index.mTabPosition)
		}
		admin.rollPage("auto");
		admin.activeNav(v);
		var x = $(n + ">.layui-tab-content>.layui-tab-item.layui-show .admin-iframe")[0];
		if (x) {
			x.style.height = "99%";
			x.scrollWidth;
			x.style.height = "100%"
		}
		x.focus();
		var u = $(n).attr("lay-autoRefresh");
		if (u === "true" && !f) {
			admin.refresh(v)
		}
		f = false
	});
	element.on("tabDelete(" + i + ")", function(w) {
		var u = index.mTabList[w.index - 1];
		if (u) {
			var v = u.menuPath;
			index.mTabList.splice(w.index - 1, 1);
			if (index.cacheTab) {
				admin.putTempData("indexTabs", index.mTabList)
			}
			if (k[v]) {
				k[v].call()
			}
		}
		if ($(n + ">.layui-tab-title>li.layui-this").length <= 0) {
			$(n + ">.layui-tab-title>li:last").trigger("click")
		}
	});
	$("body").off("click.navMore").on("click.navMore", "[nav-bind]", function() {
		var u = $(this).attr("nav-bind");
		$('ul[lay-filter="' + p + '"]').addClass("layui-hide");
		$('ul[nav-id="' + u + '"]').removeClass("layui-hide");
		if (admin.getPageWidth() <= 750) {
			admin.flexible(false)
		}
		$(a + ">.layui-nav .layui-nav-item").removeClass("layui-this");
		$(this).parent(".layui-nav-item").addClass("layui-this")
	});
	if (index.openTabCtxMenu && index.pageTabs) {
		$(n + ">.layui-tab-title").off("contextmenu.tab").on("contextmenu.tab", "li", function(v) {
			var u = $(this).attr("lay-id");
			contextMenu.show([{
				icon: "layui-icon layui-icon-refresh",
				name: "刷新当前",
				click: function() {
					element.tabChange(i, u);
					var w = $(n).attr("lay-autoRefresh");
					if (!w || w !== "true") {
						admin.refresh(u)
					}
				}
			}, {
				icon: "layui-icon layui-icon-close-fill ctx-ic-lg",
				name: "关闭当前",
				click: function() {
					admin.closeThisTabs(u)
				}
			}, {
				icon: "layui-icon layui-icon-unlink",
				name: "关闭其他",
				click: function() {
					admin.closeOtherTabs(u)
				}
			}, {
				icon: "layui-icon layui-icon-close ctx-ic-lg",
				name: "关闭全部",
				click: function() {
					admin.closeAllTabs()
				}
			}], v.clientX, v.clientY);
			return false
		})
	}
	s("index", index)
});
