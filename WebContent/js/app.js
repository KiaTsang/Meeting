	/*
	 * VARIABLES
	 * Description: All Global Vars
	 */

//	var $socket;

	var $stompClient;

	// Impacts the responce rate of some of the responsive elements (lower value affects CPU but improves speed)
	$.throttle_delay = 350;

	// The rate at which the menu expands revealing child elements on click
	$.menu_speed = 235;

	// Note: You will also need to change this variable in the "variable.less" file.
	$.navbar_height = 49;

    $.footer_height = 45;

    $.url_root =getUrlRoot();

//    $.index_action="/dashboard_cardpro.jspa";

    $index_href =getUrlRoot(true)+$.index_action;

    //$.search_issue_labelValues =[];
//    $.search_issue_labelIds =[];
//    $.search_global_issue_card_labelIds =[];
//    $.search_global_issue_sys_labelIds =[];
//    $.search_global_issue_white_labelIds =[];
//   // $.search_issue_select2_labelIds =[];
//    $.search_issue_isExact =false;
//    $.search_global_issue_card_isExact =false;
//    $.search_global_issue_sys_isExact =false;
//    $.search_global_issue_white_isExact =false;
//    $.findIssuesbyCondition =$.url_root+"/issue/findIssuesbyCondition.jspa";
//    $.searchIssuesByCondition =$.url_root+"/search/searchIssuesByCondition.jspa";

	/*
	 * APP DOM REFERENCES
	 * Description: Obj DOM reference, please try to avoid changing these
	 */
	$.root_ = $('body');
//	$.left_panel = $('#left-panel');
//    $.footer = $('#footer');
	$.shortcut_dropdown = $('#shortcut');
	$.bread_crumb = $('#ribbon ol.breadcrumb');

    // desktop or mobile
    $.device = null;

	/*
	 * APP CONFIGURATION
	 * Description: Enable / disable certain theme features here
	 */
	$.navAsAjax = true; // Your left nav in your app will no longer fire ajax calls

	// Please make sure you have included "jarvis.widget.js" for this below feature to work
	$.enableJarvisWidgets = true;

	// Warning: Enabling mobile widgets could potentially crash your webApp if you have too many
	// 			widgets running at once (must have $.enableJarvisWidgets = true)
	$.enableMobileWidgets = false;


    /* chart colors default */
    var $chrtBorderColor = "#efefef",
        $chrtGridColor = "#DDD";

    var $customColors = [
    	"#295891", "#E24913", "#356e35", "#727276", "#9DC8F1",
        "#6e3671", "#7e9d3a", "#4c4f53",
        "#FF9F01", "#a90329", "#a57225", "#a8829f",
        "#6595b4"
    ];

	var $boxColors = {
	    'red':'#a90329',
	    'blue':'#296191',
	    'green':'#739E73',
	    'yellow':'#c79121'
	};

	/*
	 * DETECT MOBILE DEVICES
	 * Description: Detects mobile device - if any of the listed device is detected
	 * a class is inserted to $.root_ and the variable $.device is decleard.
	 */

	/* so far this is covering most hand held devices */
	var ismobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

	if (!ismobile) {
		// Desktop
		$.root_.addClass("desktop-detected");
		$.device = "desktop";
	} else {
		// Mobile
		$.root_.addClass("mobile-detected");
		$.device = "mobile";

		// Removes the tap delay in idevices
		// dependency: js/plugin/fastclick/fastclick.js
		// FastClick.attach(document.body);
	}

/* ~ END: CHECK MOBILE DEVICE */

/*
 * DOCUMENT LOADED EVENT
 * Description: Fire when DOM is ready
 */
var app = function() {

    var handleMenuInit = function() {
        $('body').on('click', function(e) {
            $('[rel="popover"]').each(function() {
                //the 'is' for buttons that trigger popups
                //the 'has' for icons within a button that triggers a popup
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });

        // click the 2th level menu item on the left nav
        $("a[data-item-index]").on("click", function(e) {
            sessionStorage.setItem("target_nav", $(this).data("itemIndex"));
            sessionStorage.setItem("isMenu", "");
        });

        /*
         * Fire tooltips
         */
        if ($("[rel=tooltip]").length) {
            $("[rel=tooltip]").tooltip();
        }

        //TODO: was moved from window.load due to IE not firing consist
        nav_page_height();

        // INITIALIZE LEFT NAV
        if (!null) {
            var target = sessionStorage.getItem("target_nav");
            changedLeftNav(target);
            initLeftNav();
//            $('nav > ul').jarvismenu({
//                accordion : true,
//                speed : $.menu_speed,
//                closedSign : '<i class="fa fa-plus-square-o"></i>',
//                openedSign : '<i class="fa fa-minus-square-o"></i>'
//            });
        } else {
            alert("Error - menu anchor does not exist");
        }

        // COLLAPSE LEFT NAV
        $('.minifyme').click(function(e) {
            $('body').toggleClass("minified");

            if (window.localStorage) {
                if ($("body").hasClass("minified")) {
                    localStorage.setItem("isMinified", true);
                } else {
                    localStorage.removeItem("isMinified");
                }
            }

            $(this).effect("highlight", {}, 500);
            e.preventDefault();
        });

        // HIDE MENU
        $('#hide-menu >:first-child > a').click(function(e) {
            $('body').toggleClass("hidden-menu");
            e.preventDefault();
        });

        function initLeftNav() {
            var options = {
                accordion : true,
                speed : $.menu_speed,
                closedSign : '<i class="fa fa-plus-square-o"></i>',
                openedSign : '<i class="fa fa-minus-square-o"></i>'
            };
            var defaults = {
                accordion : 'true',
                speed : 200,
                closedSign : '[+]',
                openedSign : '[-]'
            };

            // Extend our default options with those provided.
            var opts = $.extend(defaults, options);

            //Assign current element to variable, in this case is UL element
            var $this = $('nav > ul');
            //add a mark [+] to a multilevel menu
            $this.children("li").children("a").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");

            //	open active level
            $this.children("li.active").find("a[href='" + $index_href + "']").click();
            $this.children("li.active").children("ul").slideDown(opts.speed).prev().children("b").html(opts.openedSign)

            // bind the event for menu
            $this.on("click", "a[href=#]", function(e) {
                if (opts.accordion) {
                    var $that = $(this),
                        $ul = $that.next(),
                        $visibleUl = $this.find("ul:visible");

                    if (!$ul.is(":visible")) {
                        $ul.slideDown(opts.speed, function() {
                            $that.effect("highlight", {color: "#616161"}, 500)
                                .parent().addClass("open active")
                                .find("b").delay(opts.speed).html(opts.openedSign);
                        });
                    }

                    if ($visibleUl.length) {
                        $visibleUl.slideUp(opts.speed, function() {
                            $(this).parent().removeClass("open active")
                                .find("b").delay(opts.speed).html(opts.closedSign);
                        });
                    }

                    // remove the active menuitem link
                    $this.find("li:not([data-menu-index])").removeClass("active");
                }

                sessionStorage.setItem("target_nav", $(this).parent().data("menuIndex"));
                sessionStorage.setItem("isMenu", "true");
                e.stopPropagation();
            });

            // bind the event for menu items
            $this.on("click", "a[data-menuitem-index]", function(e) {
                sessionStorage.setItem("target_nav", $(this).data("menuitemIndex"));
                sessionStorage.setItem("isMenu", "");
                e.stopPropagation();
            });
        }

        function changedLeftNav(target) {
            if (target && target != "null") {
                $("nav li.active").removeClass("open active");
                var isMenu = new Boolean(sessionStorage.getItem("isMenu")).valueOf();

                if (isMenu) {
                    $("nav").find("li[data-menu-index=" + target + "]").addClass("open active");
                } else {
                    $("nav").find("a[data-menuitem-index=" + target + "]")
                        .parent().addClass("active")
                        .parents("li").addClass("open active");
                }
            }
        }
    }

    var handleShortcutInit = function() {
        $('#show-shortcut').click(function(e) {
            if ($.shortcut_dropdown.is(":visible")) {
                shortcut_buttons_hide();
            } else {
                shortcut_buttons_show();
            }
            e.preventDefault();
        });

        // SHORT CUT (buttons that appear when clicked on user name)
        $.shortcut_dropdown.find('a').click(function(e) {

            e.preventDefault();

            window.location = $(this).attr('href');
            setTimeout(shortcut_buttons_hide, 300);

        });

        // SHORTCUT buttons goes away if mouse is clicked outside of the area
        $(document).mouseup(function(e) {
            if (!$.shortcut_dropdown.is(e.target)// if the target of the click isn't the container...
                && $.shortcut_dropdown.has(e.target).length === 0) {
                shortcut_buttons_hide()
            }
        });

        // SHORTCUT ANIMATE HIDE
        function shortcut_buttons_hide() {
            $.shortcut_dropdown.animate({
                height : "hide"
            }, 300, "easeOutCirc");
            $.root_.removeClass('shortcut-on');

        }

        // SHORTCUT ANIMATE SHOW
        function shortcut_buttons_show() {
            $.shortcut_dropdown.animate({
                height : "show"
            }, 200, "easeOutCirc")
            $.root_.addClass('shortcut-on');
        }

        if($('#header').size() > 0) {
            // $socket = new SockJS("/eipd-itms/in/wst");
//            $socket = new SockJS(getUrlRoot(true) + "/in/wst");
//            $stompClient = Stomp.over($socket);
        }
    }

    var handleSearchInit = function() {
        // SHOW & HIDE MOBILE SEARCH FIELD
        $('#search-mobile').click(function() {
            $.root_.addClass('search-mobile');
        });

        $('#cancel-search-js').click(function() {
            $.root_.removeClass('search-mobile');
        });
    }

    var handleActivityInit = function() {
        $('#activity').click(function(e) {
            var $this = $(this);

            if ($this.find('.badge').hasClass('bg-color-red')) {
                $this.find('.badge').removeClassPrefix('bg-color-');
                $this.find('.badge').text("0");
                // console.log("Ajax call for activity")
            }

            if (!$this.next('.ajax-dropdown').is(':visible')) {
                $this.next('.ajax-dropdown').fadeIn(150);
                $this.addClass('active');
            } else {
                $this.next('.ajax-dropdown').fadeOut(150);
                $this.removeClass('active')
            }

            var mytest = $this.next('.ajax-dropdown').find('.btn-group > .active > input').attr('id');
            e.preventDefault();
        });

        $('input[name="activity"]').change(function() {
            //alert($(this).val())
            var $this = $(this);

            url = $this.attr('id');
            container = $('.ajax-notifications');
        });
    }

    var handleButtonInit = function() {
        $(document).mouseup(function(e) {
            if (!$('.ajax-dropdown').is(e.target)// if the target of the click isn't the container...
                && $('.ajax-dropdown').has(e.target).length === 0) {
                $('.ajax-dropdown').fadeOut(150);
                $('.ajax-dropdown').prev().removeClass("active")
            }
        });

        $('button[data-loading-text]').on('click', function() {
            var btn = $(this)
            btn.button('loading')
            setTimeout(function() {
                btn.button('reset')
            }, 3000)
        });

        // RESET WIDGETS
        $('#refresh').click(function(e) {

            var $this = $(this);

            $.widresetMSG = $this.data('reset-msg');

            $.SmartMessageBox({
                title : "<i class='fa fa-refresh' style='color:green'></i> Clear Local Storage",
                content : $.widresetMSG || "Would you like to RESET all your saved widgets and clear LocalStorage?",
                buttons : '[No][Yes]'
            }, function(ButtonPressed) {
                if (ButtonPressed == "Yes" && localStorage) {
                    localStorage.clear();
                    location.reload();
                }

            });
            e.preventDefault();
        });
    }

    var handleNotificationInit = function() {
        notification_check();

        function notification_check() {
            $this = $('#activity > .badge');

            if (parseInt($this.text()) > 0) {
                $this.addClass("bg-color-red bounceIn animated")
            }
        }
    }

    var handleLoginInit = function() {
        // LOGOUT BUTTON
        $('#logout a').click(function(e) {
            //get the link
            var $this = $(this);
            $.loginURL = $this.attr('href');
            $.logoutMSG = $this.data('logout-msg');

            // ask verification
            $.SmartMessageBox({
                title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
                content : $.logoutMSG || "You can improve your security further after logging out by closing this opened browser",
                buttons : '[No][Yes]'

            }, function(ButtonPressed) {
                if (ButtonPressed == "Yes") {
                    $.root_.addClass('animated fadeOutUp');
                    setTimeout(logout, 1000)
                }
            });
            e.preventDefault();
        });

        /*
         * LOGOUT ACTION
         */
        function logout() {
            window.location = $.loginURL;
        }

        $("#logout").on("click", function(e) {
            if (checkSessionStorageSupported()) {
                sessionStorage.removeItem("target_nav");
            }
        });

        function checkSessionStorageSupported() {
            return window.sessionStorage ? true : false;
        }
    }

    var handlePageInit = function() {
        pageSetUp();
        function pageSetUp() {
            if ($.device === "desktop"){
                // activate tooltips
                $("[rel=tooltip]").tooltip();
                // activate popovers
                $("[rel=popover]").popover();
                // activate popovers with hover states
                $("[rel=popover-hover]").popover({
                    trigger : "hover"
                });
                // activate inline charts
                runAllCharts();
                // setup widgets
                setup_widgets_desktop();
                //setup nav height (dynamic)
                nav_page_height();
                // run form elements
                runAllForms();
            } else {
                // activate popovers
                $("[rel=popover]").popover();
                // activate popovers with hover states
                $("[rel=popover-hover]").popover({
                    trigger : "hover"
                });
                // activate inline charts
                runAllCharts();
                // setup widgets
                setup_widgets_mobile();
                //setup nav height (dynamic)
                nav_page_height();
                // run form elements
                runAllForms();
            }
        }

        function runAllForms() {
            /*
             * BOOTSTRAP SLIDER PLUGIN
             * Usage:
             * Dependency: js/plugin/bootstrap-slider
             */
            if ($.fn.slider) {
                $('.slider').slider();
            }

            /*
             * SELECT2 PLUGIN
             * Usage:
             * Dependency: js/plugin/select2/
             */
            if ($.fn.select2) {
                $('.select2').each(function() {
                    var $this = $(this),
                        width = $this.attr('data-select-width') || '100%',
                        isAllowClear = ($this.data("clear") ? true : false);

                    $this.select2({
                        //showSearchInput : _showSearchInput,
                        allowClear : isAllowClear,
                        width : width
                    });
                });
            }

            /*
             * MASKING
             * Dependency: js/plugin/masked-input/
             */
            if ($.fn.mask) {
                $('[data-mask]').each(function() {

                    var $this = $(this);
                    var mask = $this.attr('data-mask') || 'error...', mask_placeholder = $this.attr('data-mask-placeholder') || 'X';

                    $this.mask(mask, {
                        placeholder : mask_placeholder
                    });
                })
            }

            /*
             * Autocomplete
             * Dependency: js/jqui
             */
            if ($.fn.autocomplete) {
                $('[data-autocomplete]').each(function() {

                    var $this = $(this);
                    var availableTags = $this.data('autocomplete') || ["The", "Quick", "Brown", "Fox", "Jumps", "Over", "Three", "Lazy", "Dogs"];

                    $this.autocomplete({
                        source : availableTags
                    });
                })
            }

            /*
             * JQUERY UI DATE
             * Dependency: js/libs/jquery-ui-1.10.3.min.js
             * Usage:
             */
            if ($.fn.datepicker) {
                $('.datepicker').each(function() {

                    var $this = $(this);
                    var dataDateFormat = $this.attr('data-dateformat') || 'dd.mm.yy';

                    $this.datepicker({
                        dateFormat : dataDateFormat,
                        prevText : '<i class="fa fa-chevron-left"></i>',
                        nextText : '<i class="fa fa-chevron-right"></i>',
                    });
                })
            }

            /*
             * AJAX BUTTON LOADING TEXT
             * Usage: <button type="button" data-loading-text="Loading..." class="btn btn-xs btn-default ajax-refresh"> .. </button>
             */
            $('button[data-loading-text]').on('click', function() {
                var btn = $(this)
                btn.button('loading')
                setTimeout(function() {
                    btn.button('reset')
                }, 3000)
            });

        }

        /*
         * INITIALIZE CHARTS
         * Description: Sparklines, PieCharts
         */
        function runAllCharts() {
            if ($.fn.sparkline) {
                $('.sparkline').each(function() {
                    var $this = $(this);
                    var sparklineType = $this.data('sparkline-type') || 'bar';

                    // BAR CHART
                    if (sparklineType == 'bar') {
                        var barColor = $this.data('sparkline-bar-color') || $this.css('color') || '#0000f0', sparklineHeight = $this.data('sparkline-height') || '26px', sparklineBarWidth = $this.data('sparkline-barwidth') || 5, sparklineBarSpacing = $this.data('sparkline-barspacing') || 2, sparklineNegBarColor = $this.data('sparkline-negbar-color') || '#A90329', sparklineStackedColor = $this.data('sparkline-barstacked-color') || ["#A90329", "#0099c6", "#98AA56", "#da532c", "#4490B1", "#6E9461", "#990099", "#B4CAD3"];
                        $this.sparkline('html', {
                            type : 'bar',
                            barColor : barColor,
                            type : sparklineType,
                            height : sparklineHeight,
                            barWidth : sparklineBarWidth,
                            barSpacing : sparklineBarSpacing,
                            stackedBarColor : sparklineStackedColor,
                            negBarColor : sparklineNegBarColor,
                            zeroAxis : 'false'
                        });
                    }

                    //LINE CHART
                    if (sparklineType == 'line') {
                        var sparklineHeight = $this.data('sparkline-height') || '20px', sparklineWidth = $this.data('sparkline-width') || '90px', thisLineColor = $this.data('sparkline-line-color') || $this.css('color') || '#0000f0', thisLineWidth = $this.data('sparkline-line-width') || 1, thisFill = $this.data('fill-color') || '#c0d0f0', thisSpotColor = $this.data('sparkline-spot-color') || '#f08000', thisMinSpotColor = $this.data('sparkline-minspot-color') || '#ed1c24', thisMaxSpotColor = $this.data('sparkline-maxspot-color') || '#f08000', thishighlightSpotColor = $this.data('sparkline-highlightspot-color') || '#50f050', thisHighlightLineColor = $this.data('sparkline-highlightline-color') || 'f02020', thisSpotRadius = $this.data('sparkline-spotradius') || 1.5;
                        thisChartMinYRange = $this.data('sparkline-min-y') || 'undefined', thisChartMaxYRange = $this.data('sparkline-max-y') || 'undefined', thisChartMinXRange = $this.data('sparkline-min-x') || 'undefined', thisChartMaxXRange = $this.data('sparkline-max-x') || 'undefined', thisMinNormValue = $this.data('min-val') || 'undefined', thisMaxNormValue = $this.data('max-val') || 'undefined', thisNormColor = $this.data('norm-color') || '#c0c0c0', thisDrawNormalOnTop = $this.data('draw-normal') || false;
                        $this.sparkline('html', {
                            type : 'line',
                            width : sparklineWidth,
                            height : sparklineHeight,
                            lineWidth : thisLineWidth,
                            lineColor : thisLineColor,
                            fillColor : thisFill,
                            spotColor : thisSpotColor,
                            minSpotColor : thisMinSpotColor,
                            maxSpotColor : thisMaxSpotColor,
                            highlightSpotColor : thishighlightSpotColor,
                            highlightLineColor : thisHighlightLineColor,
                            spotRadius : thisSpotRadius,
                            chartRangeMin : thisChartMinYRange,
                            chartRangeMax : thisChartMaxYRange,
                            chartRangeMinX : thisChartMinXRange,
                            chartRangeMaxX : thisChartMaxXRange,
                            normalRangeMin : thisMinNormValue,
                            normalRangeMax : thisMaxNormValue,
                            normalRangeColor : thisNormColor,
                            drawNormalOnTop : thisDrawNormalOnTop
                        });
                    }

                    //PIE CHART
                    if (sparklineType == 'pie') {
                        var pieColors = $this.data('sparkline-piecolor') || ["#B4CAD3", "#4490B1", "#98AA56", "#da532c", "#6E9461", "#0099c6", "#990099", "#717D8A"], pieWidthHeight = $this.data('sparkline-piesize') || 90, pieBorderColor = $this.data('border-color') || '#45494C', pieOffset = $this.data('sparkline-offset') || 0;
                        $this.sparkline('html', {
                            type : 'pie',
                            width : pieWidthHeight,
                            height : pieWidthHeight,
                            tooltipFormat : '<span style="color: {{color}}">&#9679;</span> ({{percent.1}}%)',
                            sliceColors : pieColors,
                            offset : 0,
                            borderWidth : 1,
                            offset : pieOffset,
                            borderColor : pieBorderColor
                        });
                    }

                    //BOX PLOT
                    if (sparklineType == 'box') {
                        var thisBoxWidth = $this.data('sparkline-width') || 'auto', thisBoxHeight = $this.data('sparkline-height') || 'auto', thisBoxRaw = $this.data('sparkline-boxraw') || false, thisBoxTarget = $this.data('sparkline-targetval') || 'undefined', thisBoxMin = $this.data('sparkline-min') || 'undefined', thisBoxMax = $this.data('sparkline-max') || 'undefined', thisShowOutlier = $this.data('sparkline-showoutlier') || true, thisIQR = $this.data('sparkline-outlier-iqr') || 1.5, thisBoxSpotRadius = $this.data('sparkline-spotradius') || 1.5, thisBoxLineColor = $this.css('color') || '#000000', thisBoxFillColor = $this.data('fill-color') || '#c0d0f0', thisBoxWhisColor = $this.data('sparkline-whis-color') || '#000000', thisBoxOutlineColor = $this.data('sparkline-outline-color') || '#303030', thisBoxOutlineFill = $this.data('sparkline-outlinefill-color') || '#f0f0f0', thisBoxMedianColor = $this.data('sparkline-outlinemedian-color') || '#f00000', thisBoxTargetColor = $this.data('sparkline-outlinetarget-color') || '#40a020';
                        $this.sparkline('html', {
                            type : 'box',
                            width : thisBoxWidth,
                            height : thisBoxHeight,
                            raw : thisBoxRaw,
                            target : thisBoxTarget,
                            minValue : thisBoxMin,
                            maxValue : thisBoxMax,
                            showOutliers : thisShowOutlier,
                            outlierIQR : thisIQR,
                            spotRadius : thisBoxSpotRadius,
                            boxLineColor : thisBoxLineColor,
                            boxFillColor : thisBoxFillColor,
                            whiskerColor : thisBoxWhisColor,
                            outlierLineColor : thisBoxOutlineColor,
                            outlierFillColor : thisBoxOutlineFill,
                            medianColor : thisBoxMedianColor,
                            targetColor : thisBoxTargetColor
                        })
                    }

                    //BULLET
                    if (sparklineType == 'bullet') {
                        var thisBulletHeight = $this.data('sparkline-height') || 'auto', thisBulletWidth = $this.data('sparkline-width') || 2, thisBulletColor = $this.data('sparkline-bullet-color') || '#ed1c24', thisBulletPerformanceColor = $this.data('sparkline-performance-color') || '#3030f0', thisBulletRangeColors = $this.data('sparkline-bulletrange-color') || ["#d3dafe", "#a8b6ff", "#7f94ff"]
                        $this.sparkline('html', {
                            type : 'bullet',
                            height : thisBulletHeight,
                            targetWidth : thisBulletWidth,
                            targetColor : thisBulletColor,
                            performanceColor : thisBulletPerformanceColor,
                            rangeColors : thisBulletRangeColors
                        })
                    }

                    //DISCRETE
                    if (sparklineType == 'discrete') {

                        var thisDiscreteHeight = $this.data('sparkline-height') || 26, thisDiscreteWidth = $this.data('sparkline-width') || 50, thisDiscreteLineColor = $this.css('color'), thisDiscreteLineHeight = $this.data('sparkline-line-height') || 5, thisDiscreteThrushold = $this.data('sparkline-threshold') || 'undefined', thisDiscreteThrusholdColor = $this.data('sparkline-threshold-color') || '#ed1c24';
                        $this.sparkline('html', {
                            type : 'discrete',
                            width : thisDiscreteWidth,
                            height : thisDiscreteHeight,
                            lineColor : thisDiscreteLineColor,
                            lineHeight : thisDiscreteLineHeight,
                            thresholdValue : thisDiscreteThrushold,
                            thresholdColor : thisDiscreteThrusholdColor
                        })
                    }

                    //TRISTATE
                    if (sparklineType == 'tristate') {
                        var thisTristateHeight = $this.data('sparkline-height') || 26, thisTristatePosBarColor = $this.data('sparkline-posbar-color') || '#60f060', thisTristateNegBarColor = $this.data('sparkline-negbar-color') || '#f04040', thisTristateZeroBarColor = $this.data('sparkline-zerobar-color') || '#909090', thisTristateBarWidth = $this.data('sparkline-barwidth') || 5, thisTristateBarSpacing = $this.data('sparkline-barspacing') || 2, thisZeroAxis = $this.data('sparkline-zeroaxis') || false;
                        $this.sparkline('html', {
                            type : 'tristate',
                            height : thisTristateHeight,
                            posBarColor : thisBarColor,
                            negBarColor : thisTristateNegBarColor,
                            zeroBarColor : thisTristateZeroBarColor,
                            barWidth : thisTristateBarWidth,
                            barSpacing : thisTristateBarSpacing,
                            zeroAxis : thisZeroAxis
                        })
                    }

                    //COMPOSITE: BAR
                    if (sparklineType == 'compositebar') {
                        var sparklineHeight = $this.data('sparkline-height') || '20px', sparklineWidth = $this.data('sparkline-width') || '100%', sparklineBarWidth = $this.data('sparkline-barwidth') || 3, thisLineWidth = $this.data('sparkline-line-width') || 1, thisLineColor = $this.data('sparkline-color-top') || '#ed1c24', thisBarColor = $this.data('sparkline-color-bottom') || '#333333'
                        $this.sparkline($this.data('sparkline-bar-val'), {
                            type : 'bar',
                            width : sparklineWidth,
                            height : sparklineHeight,
                            barColor : thisBarColor,
                            barWidth : sparklineBarWidth
                            //barSpacing: 5
                        })

                        $this.sparkline($this.data('sparkline-line-val'), {
                            width : sparklineWidth,
                            height : sparklineHeight,
                            lineColor : thisLineColor,
                            lineWidth : thisLineWidth,
                            composite : true,
                            fillColor : false
                        })
                    }

                    //COMPOSITE: LINE
                    if (sparklineType == 'compositeline') {
                        var sparklineHeight = $this.data('sparkline-height') || '20px', sparklineWidth = $this.data('sparkline-width') || '90px', sparklineValue = $this.data('sparkline-bar-val'), sparklineValueSpots1 = $this.data('sparkline-bar-val-spots-top') || null, sparklineValueSpots2 = $this.data('sparkline-bar-val-spots-bottom') || null, thisLineWidth1 = $this.data('sparkline-line-width-top') || 1, thisLineWidth2 = $this.data('sparkline-line-width-bottom') || 1, thisLineColor1 = $this.data('sparkline-color-top') || '#333333', thisLineColor2 = $this.data('sparkline-color-bottom') || '#ed1c24', thisSpotRadius1 = $this.data('sparkline-spotradius-top') || 1.5, thisSpotRadius2 = $this.data('sparkline-spotradius-bottom') || thisSpotRadius1, thisSpotColor = $this.data('sparkline-spot-color') || '#f08000', thisMinSpotColor1 = $this.data('sparkline-minspot-color-top') || '#ed1c24', thisMaxSpotColor1 = $this.data('sparkline-maxspot-color-top') || '#f08000', thisMinSpotColor2 = $this.data('sparkline-minspot-color-bottom') || thisMinSpotColor1, thisMaxSpotColor2 = $this.data('sparkline-maxspot-color-bottom') || thisMaxSpotColor1, thishighlightSpotColor1 = $this.data('sparkline-highlightspot-color-top') || '#50f050', thisHighlightLineColor1 = $this.data('sparkline-highlightline-color-top') || '#f02020', thishighlightSpotColor2 = $this.data('sparkline-highlightspot-color-bottom') || thishighlightSpotColor1, thisHighlightLineColor2 = $this.data('sparkline-highlightline-color-bottom') || thisHighlightLineColor1, thisFillColor1 = $this.data('sparkline-fillcolor-top') || 'transparent', thisFillColor2 = $this.data('sparkline-fillcolor-bottom') || 'transparent';
                        $this.sparkline(sparklineValue, {
                            type : 'line',
                            spotRadius : thisSpotRadius1,
                            spotColor : thisSpotColor,
                            minSpotColor : thisMinSpotColor1,
                            maxSpotColor : thisMaxSpotColor1,
                            highlightSpotColor : thishighlightSpotColor1,
                            highlightLineColor : thisHighlightLineColor1,
                            valueSpots : sparklineValueSpots1,
                            lineWidth : thisLineWidth1,
                            width : sparklineWidth,
                            height : sparklineHeight,
                            lineColor : thisLineColor1,
                            fillColor : thisFillColor1
                        })

                        $this.sparkline($this.data('sparkline-line-val'), {
                            type : 'line',
                            spotRadius : thisSpotRadius2,
                            spotColor : thisSpotColor,
                            minSpotColor : thisMinSpotColor2,
                            maxSpotColor : thisMaxSpotColor2,
                            highlightSpotColor : thishighlightSpotColor2,
                            highlightLineColor : thisHighlightLineColor2,
                            valueSpots : sparklineValueSpots2,
                            lineWidth : thisLineWidth2,
                            width : sparklineWidth,
                            height : sparklineHeight,
                            lineColor : thisLineColor2,
                            composite : true,
                            fillColor : thisFillColor2
                        })
                    }
                });
            }// end if

            /*
             * EASY PIE CHARTS
             * DEPENDENCY: js/plugins/easy-pie-chart/jquery.easy-pie-chart.min.js
             * Usage: <div class="easy-pie-chart txt-color-orangeDark" data-pie-percent="33" data-pie-size="72" data-size="72">
             *			<span class="percent percent-sign">35</span>
             * 	  	  </div>
             */
            if ($.fn.easyPieChart) {
                $('.easy-pie-chart').each(function() {
                    var $this = $(this);
                    var barColor = $this.css('color') || $this.data('pie-color'), trackColor = $this.data('pie-track-color') || '#eeeeee', size = parseInt($this.data('pie-size')) || 25;
                    $this.easyPieChart({
                        barColor : barColor,
                        trackColor : trackColor,
                        scaleColor : false,
                        lineCap : 'butt',
                        lineWidth : parseInt(size / 8.5),
                        animate : 1500,
                        rotate : -90,
                        size : size,
                        onStep : function(value) {
                            this.$el.find('span').text(~~value);
                        }
                    });
                });
            } // end if
        }

        // Setup Desktop Widgets
        function setup_widgets_desktop() {
            if ($.fn.jarvisWidgets && $.enableJarvisWidgets) {
                $('#widget-grid').jarvisWidgets({
                    grid : 'article',
                    widgets : '.jarviswidget',
                    localStorage : true,
                    deleteSettingsKey : '#deletesettingskey-options',
                    settingsKeyLabel : 'Reset settings?',
                    deletePositionKey : '#deletepositionkey-options',
                    positionKeyLabel : 'Reset position?',
                    sortable : false,
                    buttonsHidden : false,
                    // toggle button
                    toggleButton : true,
                    toggleClass : 'fa fa-minus | fa fa-plus',
                    toggleSpeed : 200,
                    onToggle : function() {
                    },
                    // delete btn
                    deleteButton : true,
                    deleteClass : 'fa fa-times',
                    deleteSpeed : 200,
                    onDelete : function() {
                    },
                    // edit btn
                    editButton : true,
                    editPlaceholder : '.jarviswidget-editbox',
                    editClass : 'fa fa-cog | fa fa-save',
                    editSpeed : 200,
                    onEdit : function() {
                    },
                    // color button
                    colorButton : true,
                    // full screen
                    fullscreenButton : true,
                    fullscreenClass : 'fa fa-expand | fa fa-compress',
                    fullscreenDiff : 3,
                    onFullscreen : function() {
                    },
                    // custom btn
                    customButton : false,
                    customClass : 'folder-10 | next-10',
                    customStart : function() {
                        alert('Hello you, this is a custom button...')
                    },
                    customEnd : function() {
                        alert('bye, till next time...')
                    },
                    // order
                    buttonOrder : '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
                    opacity : 1.0,
                    dragHandle : '> header',
                    placeholderClass : 'jarviswidget-placeholder',
                    indicator : true,
                    indicatorTime : 600,
                    ajax : true,
                    timestampPlaceholder : '.jarviswidget-timestamp',
                    timestampFormat : 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
                    refreshButton : true,
                    refreshButtonClass : 'fa fa-refresh',
                    labelError : 'Sorry but there was a error:',
                    labelUpdated : 'Last Update:',
                    labelRefresh : 'Refresh',
                    labelDelete : 'Delete widget:',
                    afterLoad : function() {
                    },
                    rtl : false, // best not to toggle this!
                    onChange : function() {

                    },
                    onSave : function() {

                    },
                    ajaxnav : $.navAsAjax // declears how the localstorage should be saved
                });
            }
        }

        // Setup Desktop Widgets
        function setup_widgets_mobile() {
            if ($.enableMobileWidgets && $.enableJarvisWidgets) {
                setup_widgets_desktop();
            }
        }
    }

    return {
        init: function() {
            handleMenuInit();
            handleShortcutInit();
            handleSearchInit();
            handleActivityInit();
            handleButtonInit();
            handleNotificationInit();
            handleLoginInit();
            handlePageInit();
            login.initTop();
        },
        internationalInit: function(entityName,baseUrl) {
            // 国际化资源加载
            var language = Cookie.getCookie('language');
            if (language == null) {
                language = 'zh';
            }
            var path = "../../i18n/";
            if (baseUrl)
                path = baseUrl + 'i18n/';

            // 加载资浏览器语言对应的资源文件
            jQuery.i18n.properties({
                // 资源文件名称
                name: 'entities',
                language: language,
                // 资源文件路径
                path: path,
                // 用Map的方式使用资源文件中的值
                mode: 'map',
                callback: function() {
                    $("*").each(function(idx, t){
                        if (t.dataset.i18n != undefined) {
                            t.innerHTML = I18n.getI18nPropByKey(entityName + "." + t.dataset.i18n);
                        }
                    });
                }
            });
        }
    };
}();

// 自适应高度
(function($, window, undefined) {

	var elems = $([]), jq_resize = $.resize = $.extend($.resize, {}), timeout_id, str_setTimeout = 'setTimeout', str_resize = 'resize', str_data = str_resize + '-special-event', str_delay = 'delay', str_throttle = 'throttleWindow';

	jq_resize[str_delay] = $.throttle_delay;

	jq_resize[str_throttle] = true;

	$.event.special[str_resize] = {

		setup : function() {
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false;
			}

			var elem = $(this);
			elems = elems.add(elem);
			$.data(this, str_data, {
				w : elem.width(),
				h : elem.height()
			});
			if (elems.length === 1) {
				loopy();
			}
		},
		teardown : function() {
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false;
			}

			var elem = $(this);
			elems = elems.not(elem);
			elem.removeData(str_data);
			if (!elems.length) {
				clearTimeout(timeout_id);
			}
		},

		add : function(handleObj) {
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false;
			}
			var old_handler;

			function new_handler(e, w, h) {
				var elem = $(this), data = $.data(this, str_data);
                if (data != undefined  || data != null) {
                    data.w = w !== undefined ? w : elem.width();
                    data.h = h !== undefined ? h : elem.height();

                    old_handler.apply(this, arguments);
                }
			};
			if ($.isFunction(handleObj)) {
				old_handler = handleObj;
				return new_handler;
			} else {
				old_handler = handleObj.handler;
				handleObj.handler = new_handler;
			}
		}
	};

	function loopy() {
		timeout_id = window[str_setTimeout](function() {
			elems.each(function() {
				var elem = $(this), width = elem.width(), height = elem.height(), data = $.data(this, str_data);
				if (width !== data.w || height !== data.h) {
					elem.trigger(str_resize, [data.w = width, data.h = height]);
				}

			});
			loopy();

		}, jq_resize[str_delay]);

	};

})(jQuery, this);

/*
* NAV OR #LEFT-BAR RESIZE DETECT
* Description: changes the page min-width of #CONTENT and NAV when navigation is resized.
* This is to counter bugs for min page width on many desktop and mobile devices.
* Note: This script uses JSthrottle technique so don't worry about memory/CPU usage
*/

/*已移植*/
// Fix page and nav height
function nav_page_height() {
    $.left_panel = $('#left-panel');
    $.footer = $('#footer');
	var setHeight = $('#main').height();
	//menuHeight = $.left_panel.height();

	var windowHeight = $(window).height() - $.navbar_height ;
	//set height
	if (setHeight > windowHeight) {// if content height exceedes actual window height and menuHeight
		$.left_panel.css('min-height', setHeight + $.footer_height + 'px');
//        console.log($.left_panel.height());
		$.root_.css('min-height', setHeight + $.navbar_height + $.footer_height + 'px');
        $.footer.css('top', setHeight + $.navbar_height + $.footer_height -5 + 'px');

	} else {
		$.left_panel.css('min-height', windowHeight - $.footer_height+ 'px');
		$.root_.css('min-height', windowHeight + $.footer_height + 'px');
        $.footer.css('top', windowHeight + $.navbar_height - $.footer_height -5 + 'px');
	}
}

$('#main').resize(function() {
	nav_page_height();
	check_if_mobile_width();
})

$('nav').resize(function() {
	nav_page_height();
})

function check_if_mobile_width() {
	if ($(window).width() < 979) {
		$.root_.addClass('mobile-view-activated')
	} else if ($.root_.hasClass('mobile-view-activated')) {
		$.root_.removeClass('mobile-view-activated');
	}
}

// TODO: delete this function later on - no longer needed (?)
//var ie = ( function() {
//
//		var undef, v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
//
//		while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
//
//		return v > 4 ? v : undef;
//
//	}()); // do we need this?

/*
 * CUSTOM MENU PLUGIN
 */
$.fn.extend({

	//pass the options variable to the function
	jarvismenu : function(options) {

		var defaults = {
			accordion : 'true',
			speed : 200,
			closedSign : '[+]',
			openedSign : '[-]'
		};

		// Extend our default options with those provided.
		var opts = $.extend(defaults, options);

		//Assign current element to variable, in this case is UL element
		var $this = $(this);

		//add a mark [+] to a multilevel menu
		$this.children("li").children("a").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");

		//open active level
		/*$this.find("li.active").each(function() {
			//avoid jumping to the top of the page when the href is an #
			if ($(this).find("a:first").attr('href') == $index_href) {
				$(this).find("a:first").click(function() {
					return false;
				});
			}
			$(this).find("ul:first").slideDown(opts.speed);
			$(this).parents("ul").parent("li").find("b:first").html(opts.openedSign);
		});*/

		//	open active level
		$this.children("li.active").find("a[href='" + $index_href + "']").click();
		$this.children("li.active").children("ul").slideDown(opts.speed).prev().children("b").html(opts.openedSign)

		// bind the event for menu
		$this.on("click", "a[href=#]", function(e) {
			if (opts.accordion) {
				var $that = $(this),
					$ul = $that.next(),
					$visibleUl = $this.find("ul:visible");

				if (!$ul.is(":visible")) {
					$ul.slideDown(opts.speed, function() {
						$that.effect("highlight", {color: "#616161"}, 500)
							 .parent().addClass("open active")
							 .find("b").delay(opts.speed).html(opts.openedSign);
					});
				}

				if ($visibleUl.length) {
					$visibleUl.slideUp(opts.speed, function() {
						$(this).parent().removeClass("open active")
							   .find("b").delay(opts.speed).html(opts.closedSign);
					});
				}

				// remove the active menuitem link
				$this.find("li:not([data-menu-index])").removeClass("active");
			}

			sessionStorage.setItem("target_nav", $(this).parent().data("menuIndex"));
			sessionStorage.setItem("isMenu", "true");
			e.stopPropagation();
		});

		// bind the event for menu items
		$this.on("click", "a[data-menuitem-index]", function(e) {
		    sessionStorage.setItem("target_nav", $(this).data("menuitemIndex"));
		    sessionStorage.setItem("isMenu", "");
			e.stopPropagation();
		});


	} // end function
});

//jQuery.fn.doesExist = function() {
//	return jQuery(this).length > 0;
//};

/*
 * GOOGLE MAPS
 * description: Append google maps to head dynamically
 */
//var gMapsLoaded = false;
//window.gMapsCallback = function() {
//	gMapsLoaded = true;
//	$(window).trigger('gMapsLoaded');
//}
//window.loadGoogleMaps = function() {
//	if (gMapsLoaded)
//		return window.gMapsCallback();
//	var script_tag = document.createElement('script');
//	script_tag.setAttribute("type", "text/javascript");
//	script_tag.setAttribute("src", "http://maps.google.com/maps/api/js?sensor=false&callback=gMapsCallback");
//	(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
//}

/*
 * LOAD SCRIPTS
 * Usage:
 * Define function = myPrettyCode ()...
 * loadScript("js/my_lovely_script.js", myPrettyCode);
 */
var jsArray = {};
function loadScript(scriptName, callback) {
	if (!jsArray[scriptName]) {
		jsArray[scriptName] = true;

		// adding the script tag to the head as suggested before
		var body = document.getElementsByTagName('body')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = scriptName;

		// then bind the event to the callback function
		// there are several events for cross browser compatibility
		//script.onreadystatechange = callback;
		script.onload = callback;

		// fire the loading
		body.appendChild(script);
	} else if (callback) {// changed else to else if(callback)
		//console.log("JS file already added!");
		//execute function
		callback();
	}
}

// CHECK TO SEE IF URL EXISTS
/*系统未使用*/
//function checkURL() {
//	//get the url by removing the hash
//	var url = location.hash.replace(/^#/, '');
//	container = $('#content');
//	// Do this if url exists (for page refresh, etc...)
//	if (url) {
//		// remove all active class
//		$('nav li.active').removeClass("active");
//		// match the url and add the active class
//		$('nav li:has(a[href="' + url + '"])').addClass("active");
//		var title = ($('nav a[href="' + url + '"]').attr('title'))
//		// change page title from global var
//		document.title = (title || document.title);
//		//console.log("page title: " + document.title);
//		// parse url to jquery
//		//loadURL(url + location.search, container);
//	} else {
//		// grab the first URL from nav
//		var $this = $('nav > ul > li:first-child > a[href!="#"]');
//		//update hash
//		window.location.hash = $this.attr('href');
//	}
//}

// LOAD AJAX PAGES
/*系统未使用*/
//function loadURL(url, container) {
//	$.ajax({
//		type : "GET",
//		url : url,
//		dataType : 'html',
//		cache : true, // (warning: this will cause a timestamp and will call the request twice)
//		beforeSend : function() {
//			// cog placed
//			container.html('<h1><i class="fa fa-cog fa-spin"></i> Loading...</h1>');
//
//			// Only draw breadcrumb if it is main content material
//			// TODO: see the framerate for the animation in touch devices
//
//			if (container[0] == $("#content")[0]) {
//				drawBreadCrumb();
//				// scroll up
//				$("html").animate({
//					scrollTop : 0
//				}, "fast");
//			}
//		},
//		/*complete: function(){
//	    	// Handle the complete event
//	    	// alert("complete")
//		},*/
//		success : function(data) {
//			// cog replaced here...
//			// alert("success")
//
//			container.css({
//				opacity : '0.0'
//			}).html(data).delay(50).animate({
//				opacity : '1.0'
//			}, 300);
//		},
//		error : function(xhr, ajaxOptions, thrownError) {
//			container.html('<h4 style="margin-top:10px; display:block; text-align:left"><i class="fa fa-warning txt-color-orangeDark"></i> Error 404! Page not found.</h4>');
//		},
//		async : false
//	});
//}
//
//// UPDATE BREADCRUMB
///*系统未使用*/
//function drawBreadCrumb() {
//	var nav_elems = $('nav li.active > a'), count = nav_elems.length;
//
//	//console.log("breadcrumb")
//	$.bread_crumb.empty();
//	$.bread_crumb.append($("<li>Home</li>"));
//	nav_elems.each(function() {
//		$.bread_crumb.append($("<li></li>").html($.trim($(this).clone().children(".badge").remove().end().text())));
//		// update title when breadcrumb is finished...
//		if (!--count) document.title = $.bread_crumb.find("li:last-child").text();
//	});
//}

// cache the resources for current login user
//(function() {
//	if(localStorage) {
//			var $globalResources = $("#globalResources");
//			var $specificResources = $("#specificResources");
//			var $roles = $("#roles");
//			var globalResCode = $globalResources.val();
//			var specificResCode = $specificResources.val();
//			var roleName = $roles.val();
//			if($.trim(globalResCode) != '') {
//				var globalResCodes = globalResCode.replace(/^\[|\]$|\s/g, "").split(",");
//				localStorage.setItem("globalResources", globalResCodes);
//				$globalResources.remove();
//			}
//
//			if($.trim(specificResCode) != '') {
//				var specificResCodes = specificResCode.replace(/^\[|\]$|\s/g, "").split(",");
//				localStorage.setItem("specificResources", specificResCodes);
//				$specificResources.remove();
//			}
//
//			if($.trim(roleName) != '') {
//				var roleNames = roleName.replace(/^\[|\]$|\s/g, "").split(",");
//				localStorage.setItem("roles", roleNames);
//				$roles.remove();
//			}
//	}
//})();

//function checkResult(data, objSuccess, callbackError) {
//	var options={
//			'showBox':true,
//			'message':"操作成功",
//			'callback' : function(){}
//	};
//	jQuery.extend(options, objSuccess);
//
//	if(data.success) {
//		if(options.showBox)
//	    {
//			$.smallBox({
//			    title : "信息",
//			    content : "",
//			    color : $boxColors.green,
//			    iconSmall : "fa fa-times",
//				    timeout : 3000
//		   });
//	   }
//
//		if (typeof options.callback == "function") {
//			options.callback(data);
//	     }
//		return;
//	}
//
//	if (typeof callbackError == "function") {
//		callbackError();
//		// return;
//	}
//
//	var errorMsg;
//	try{
//		errorMsg = eval(data.errorMessage);
//	}catch(ex){
//
//		errorMsg = common.placeholderConversion({
//  			  "msg":"错误",
//			  "args":[data.errorMessage]
//		});
//	}
//
//	$.smallBox({
//	    title : errorMsg,
//	    content : "",
//	    color : $boxColors.red,
//	    iconSmall : "fa fa-times",
//	    timeout : 3000
//	});
//	return;
//}

///*
// 全局函数
// */
//function showOperationError(xhr, textStatus, errorThrown) {
//	var msg = exception.global.network;
//	if(errorThrown) {
//		msg += errorThrown;
//	}else if(textStatus) {
//		msg += textStatus;
//	}else {
//		msg += exception.global.againPlease;
//	}
//	$.smallBox({
//	    title : msg,
//	    content : "",
//	    color : $boxColors.red,
//	    iconSmall : "fa fa-times",
//	    timeout : 3000
//	});
//}
//
///*
// 全局函数
// */
//function showSimpleError(msg) {
//	$.smallBox({
//	    title : msg,
//	    content : "",
//	    color : $boxColors.red,
//	    iconSmall : "fa fa-times",
//	    timeout : 3000
//	});
//}
//
function getUrlRoot(onlyPostPath)
{
    var strFullPath=window.document.location.href;
    var strPath=window.document.location.pathname;
    var pos=strFullPath.indexOf(strPath);
    var prePath=strFullPath.substring(0,pos);
    var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
    if(onlyPostPath)
    {
    	return postPath;
    }
    return prePath+postPath;
}

function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion == 7) {
            return 7;
        } else if(fIEVersion == 8) {
            return 8;
        } else if(fIEVersion == 9) {
            return 9;
        } else if(fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if(isEdge) {
        return 'edge';//edge
    } else if(isIE11) {
        return 11; //IE11
    }else{
        return -1;//不是ie浏览器
    }
}

function isTextType(fileName) {
    //用于验证文本扩展名的正则表达式
    var tmpExp = "(.txt|.text|.xml)$";
    var tmpRegExp = new RegExp(tmpExp);
    if (tmpRegExp.test(fileName.toLowerCase()))
        return true;
    else
        return false;
}

//function downloadFile(url) {
//    if (IEVersion() != -1) {
//        //用于验证文本扩展名的正则表达式
//        var tmpExp = "(.txt|.text|.xml)$";
//        var tmpRegExp = new RegExp(tmpExp);
//        if (tmpRegExp.test(url.toLowerCase())){
//            var iWidth = 100;//弹出窗口的宽度
//            var iHeight = 100;//弹出窗口的高度
//            var iTop = (window.screen.height-iHeight)/2 -200; //获得窗口的垂直位置;
//            var iLeft = (window.screen.width-iWidth)/2-200; //获得窗口的水平位置;
//            var test = window.open(url,"_blank",'height='+iHeight+',,innerHeight='+iHeight+',width='+iWidth+',innerWidth='+iWidth+',top='+iTop+',left='+iLeft+',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
//            test.document.execCommand("SaveAs");
//            test.close();
//        } else {
//            window.location.href = url;
//        }
//    } else {
//        window.location.href = url;
//    }
//}

////移除普通数组中指定的元素，数组基本格式：["a", "b"], specificElement=["a"]
//Array.prototype.remove = function(specificElement) {
//    return this.filter(function(ele) {
//      return (specificElement instanceof Array && $.inArray(ele, specificElement) == -1);
//    });
//};
//
////移除普通数组中指定的对象，数组基本格式：[{id: 1, text: "aaa"}], text: "aaa"，比对标准: text相等
//// @Deprecated, use removeJSONBy instead.
//Array.prototype.removeJSON = function(text) {
//    return this.filter(function(ele) {
//      return typeof text == "number" && ele.id != text;
//    });
//};
//
//// 移除普通数组中指定的对象
//// {id: 1, text: xxx}
//Array.prototype.removeJSONBy = function(key, value) {
//    var len = this.length,
//        i;
//
//    for (i = 0; i < len; i++) {
//        if (this[i][key] === value) {
//            this.splice(i, 1);
//            break;
//        }
//    }
//}
//
////移除普通数组中指定的元素，数组基本格式：["a", "b"], item 为 1
//Array.prototype.removeItem = function(item) {
//    for(var i = 0, j = 0, len = this.length; i < len; i++) {
//    	if(item != this[i]) {
//    		this[j++] = this[i];
//    	}
//    }
//    this.length -= 1;
//    return this;
//};
//
//Array.prototype.empty = function() {
//    this.splice(0);
//};

//// 格式化输出指定日期对象
//Date.prototype.Format = function (fmt) {
//    var o = {
//        "M+": this.getMonth() + 1, //月份
//        "d+": this.getDate(), //日
//        "h+": this.getHours(), //小时
//        "m+": this.getMinutes(), //分
//        "s+": this.getSeconds(), //秒
//        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
//        "S": this.getMilliseconds() //毫秒
//    };
//    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//    for (var k in o)
//    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//    return fmt;
//};
//
//
//$.validator.addMethod("customRule", function(value, element, rule) {
//	if (value.length) {
//	    var r = value.match(rule);
//	    if (!r) {
//	        return false;
//	    }
//	}
//
//	return true;
//},"请输入数字、26个英文字母或者下划线组成的字符串");
//
///*
//	防止重复提交。
//	传入的参数是目标HTML DOM元素（注意：不是jQuery DOM元素）。
//	锁定成功返回 true, 锁定失败返回 false 。
//*/
//function lockItms(ele) {
//	if(!ele || typeof(ele) !== 'object') {
//		return false;
//	}
//	if(!ele['lock_dtms']) {
//		ele['lock_dtms'] = true;
//		return true;
//	}
//	return false;
//}
//
////解锁
//function unlockItms(ele) {
//	if(!ele || typeof(ele) !== 'object') {
//		return;
//	}
//	setTimeout(function(){
//    	ele['lock_dtms'] = false;
//	}, 500);
//}
//
////用于防止SmallBox的重复提交。
//function lockSmallBox() {
//	return lockItms($('.SmallBox').get(0));
//}
//
////移除所有的通知。
//function clearSmallBox() {
//	$('#divSmallBoxes').html('');
//}
//
//// define a single global variable
//// Dec 15, 2014
//var Eipd = {
//	namespace: function(ns) {
//		var paths = ns.split("."),
//			obj = this,
//			len = paths.length,
//			i;
//
//		for (i = 0; i < len; i++) {
//			if (!obj[paths[i]]) {
//				obj[paths[i]] = {};
//			}
//
//			obj = obj[paths[i]];
//		}
//
//		return obj;
//	}
//};