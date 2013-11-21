'use strict';
// Source: src/js/lib/p3.autofill.js

/**!
 * @name            p3.autofill.js
 *
 * @fileOverview    Automatically fill form fields from GET parameters
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version         0.0.3
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>,
 *                  $.p3.request
 * @example         $.p3.autofill('#action-form');
 *
 */
/* global jQuery */
(function($, w) {
var _p3 = $.p3 || {},
        defaults = {
            delimiter:  '|'
        };

    _p3.autofill = function(el, options) {

        var $el = $(el),
            config = $.extend(true, defaults, options),
            url = w.location.href.split('#')[0];

        // Populate form fields from GET variables
        $.each($.p3.request(url).parameters, function(field, value) {
            if (value.indexOf(config.delimiter) > 0) {
                var $checkboxes = $(':checkbox[name="' + field + '"]', $el);
                $.each(value.split(config.delimiter), function (i, val) {
                    $checkboxes.filter('[value="' + val + '"]').prop('checked', true);
                });
            } else {
                $(':radio[name="' + field + '"]', $el).filter('[value="' + value + '"]').prop('checked', true);
                $(':input[name="' + field + '"]', $el).val(value);
                $(':input[value="' + field + '"]', $el).val(value);
            }

        });
    };

    $.p3 = _p3;

}(jQuery, this));;// Source: src/js/lib/p3.console.js
/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 */
(function() {
    if (!window.console) {
        window.console = {};
    }
    // union of Chrome, FF, IE, and Safari console methods
    var m = [
        "log", "info", "warn", "error", "debug", "trace", "dir", "group",
        "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
        "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
    ];

    function noop() {}

    // define undefined methods as noops to prevent errors
    for (var i = 0; i < m.length; i++) {
        if (!window.console[m[i]]) {
                window.console[m[i]] = noop;
        }
    }
})();;// Source: src/js/lib/p3.form_tracking.js
/**!
 * Track Form Abandonment through Google Analytics
 *
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.0.2
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>,
 *                  based on original work by
 *                  <a href="http://www.more-onion.com/">More Onion</a>
 * @requires        <a href="http://jquery.com/">jQuery 1.1.4+</a>,
 *                  Google Analytics tracking script
 * @example         $.p3.form_tracking('#action-form');
 */
/* global jQuery, _gaq */

(function($, w, undef) {
var _p3 = $.p3 || ($.p3 = {}),
        pre = '$.p3.form_tracking :: ',
        G = (typeof w._gaq === 'undefined') ? [] : w._gaq;

    _p3.form_tracking = function(el) {
        // Check google analytics is defined
        if (!G.length) {
            console.warn(pre + 'Google Analytics not found');
        }

        var $el = $(el),
            $input = $el.is(':input') ? $el : $(':input', $el),
            formName = $el.closest('form').attr('id');

        if (!formName) {
            throw new Error(pre + 'Form ' + el +' not found, aborting');
        }

        // Found a form, so monitor
        $input.blur(function() {
            var $this = $(this),
            fieldName = $this.attr('name');

            // If this field has a name
            if (fieldName !== undef) {
                // And it has a value
                if ($input.val().length > 0) {
                    // Track an input event
                    G.push(['_trackEvent', formName, 'completed', fieldName]);
                } else {
                    // Or track a skip event
                    G.push(['_trackEvent', formName, 'skipped', fieldName]);
                }
            }
        });
    };

}(jQuery, this));
;// Source: src/js/lib/p3.mobilemenu.js
// disabled, for now
if (false) {
    (function($) {
        $(window).load(function() {
            if ($('html').hasClass('lt-ie9')) {
                return;
            }

            // generate buttons hidden
            $('.heading-first .logo').parent().append('<a href="#" id="mobilemenu-icon">Menu</a>');
            $('#main-nav').prepend('<a href="#" id="mobilemenu-close">close</a>');
            $('#mobilemenu-icon').hide();
            $('#mobilemenu-close').hide();

            if (!$('body').hasClass('sevensome')) {
                $('#mobilemenu-icon').show();
                $('#mobilemenu-close').show();
            }

            $('#mobilemenu-icon,    #mobilemenu-close').click(function(e) {
                var mainMenu = $('#main-nav');
                var mainMenuWidth = mainMenu.innerWidth();
                // move search form into mobile menu
                var searchForm = $('.tools .search-form').detach();
                $('#nav', mainMenu).before(searchForm);

                $('ul ul', mainMenu).hide();

                // add class has-submenu on li
                $('li ul', mainMenu).closest('li').addClass('has-submenu');
                $('li.has-submenu > a', mainMenu).append('<span class="submenu-icon">v</span>');

                if (mainMenu.is(':visible')) {
                    $('body').animate({right: '0px'}, 300, function() {
                        mainMenu.hide();
                        $('body').removeClass('mobilemenu-open');
                    });
                } else {
                    setMainMenuMinHeight($('body').innerHeight());
                    mainMenu.css({right: '-' + mainMenuWidth + 'px'}).show();
                    $('body').addClass('mobilemenu-open').animate({right: mainMenuWidth + 'px'}, 300, function() {
                        // none
                    });
                }
                $(this).blur();
                e.preventDefault();
                return false;
            });

            // if the link clicked has a ul.menu sibling (i.e. a submenu)
            // we want to show the submenu
            $('html').on('click', '.mobilemenu-open #main-nav li a .submenu-icon', function(e) {
                var a = $(this).parent();
                var li = a.closest('li.has-submenu');
                var ul = a.siblings('ul');
                var holder = a.siblings('.drop-holder');
                if (holder.length > 0) {
                    ul = $('.drop-content > ul', holder);
                }
                if (ul.length > 0) {
                    if (ul.is(':visible')) {
                        ul.hide();
                        $(this).removeClass('submenu-open');
                    } else {
                        ul.show();
                        $(this).addClass('submenu-open');
                    }
                    // lose focus
                    a.blur();
                    // stop propagation - we do not want to follow link when click on submenu-icon
                    e.stopPropagation();
                    return false;
                }
            });

            // reset the visibility when we hit the breakpoint 'desktop'
            $(window).resize(function() {
                var _mobilemenu = $.mobilemenu || {};

                var mainMenu = $('#main-nav');
                var mobileMenuClose = $('#mobilemenu-close');
                var mobileMenuIcon = $('#mobilemenu-icon');
                var searchForm;

                // % on padding will change the main-nav size --> recalc
                if ($('body').hasClass('mobilemenu-open')) {
                    var mainMenuWidth = mainMenu.innerWidth();
                    $('body').css({right: mainMenuWidth + 'px'});
                    mainMenu.css({right: '-' + mainMenuWidth + 'px'});
                    setMainMenuMinHeight($('body').innerHeight());
                }

                // make sure icon and close button are visible when on mobile
                if (!_mobilemenu.breakpoint_passed && !$('body').hasClass('sevensome')) {
                    mobileMenuIcon.show();
                    mobileMenuClose.show();
                }
                // we switch from mobile/tablet to desktop
                if (!_mobilemenu.breakpoint_passed && $('body').hasClass('sevensome')) {
                    $('body').css({right: '0px'});
                    mainMenu.show();
                    mobileMenuClose.hide();
                    mobileMenuIcon.hide();

                    // move search form back into tools menu
                    searchForm = $('.search-form', mainMenu).detach();
                    $('.heading-first .tools').append(searchForm);

                    mainMenu.css({minHeight: '0px'});
                    $('body').removeClass('mobilemenu-open');
                    // reset the display, i.e. remove the element style
                    // otherwise the dropdown css in header.css will not work properly
                    // after the mobilemenu was used
                    $('ul ul', mainMenu).css('display', '');
                    $('.drop-holder', mainMenu).css('display', '');
                    mainMenu.css('overflow', '');

                    _mobilemenu.breakpoint_passed = true;
                }
                // we switch from desktop to tablet/mobile
                if (_mobilemenu.breakpoint_passed && !$('body').hasClass('sevensome')) {
                    mainMenu.hide();
                    mobileMenuClose.show();
                    mobileMenuIcon.show();

                    // move search form into mobile menu
                    searchForm = $('.tools .search-form').detach();
                    $('#nav', mainMenu).before(searchForm);

                    $('body').css({right: '0px'});
                    $('body').removeClass('mobilemenu-open');
                    $('ul ul', mainMenu).show();
                    _mobilemenu.breakpoint_passed = false;
                }

                $.mobilemenu = _mobilemenu;
            });

            function setMainMenuMinHeight(pixel) {
                var mainMenu = $('#main-nav');
                var paddingTop = parseInt(mainMenu.css('padding-top'), 10);
                var paddingBottom = parseInt(mainMenu.css('padding-bottom'), 10);
                mainMenu.css({minHeight: (pixel - paddingTop - paddingBottom) + 'px', maxHeight: (pixel - paddingTop - paddingBottom) + 'px', overflow: 'auto'});
            }
        });
    })(jQuery);

};// Source: src/js/lib/p3.narrow.js
/**!
 * Adds classes to an element (body by default) based on document width
 *
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.0.2
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>,
 *                  based on original work by
 *                  <a href="http://www.more-onion.com/">More Onion</a>
 * @requires        <a href="http://jquery.com/">jQuery 1.1.4+</a>
 * @example         $.p3.narrow([options]);
 */
/* global jQuery */

(function($, w, d) {
var _p3 = $.p3 || {},
        defaults = {
            /* Selector or object to which the classes are added */
            el: 'body',
            /* Class names and their breakpoints */
            sizes: {
                threetwo:   320,
                four:       400,
                five:       500,
                six:        600,
                sixfive:    650,
                seven:      700,
                sevensome:  768,
                eightfive:  850,
                nine:       900,
                tablet:     480,
                desktop:    1024,
                wide:       1350,
                large:      1600
            },
            // Apply changes on resize
            onResize: true,
            // Apply changes on initialisation
            onLoad: true,
            // Throttle resize event timer in milliseconds
            delay: 100
        };

    _p3.narrow = function(options) {
        var config = $.extend(true, defaults, options || {}),
            $window = $(w),
            $el = $(config.el),
            wait = false;

        /**
         * Returns the size of the document plus scrollbars
         * @returns {int}
         */
        function getWidth() {
            if (typeof w.innerWidth === 'number') {
                // Non-IE
                return w.innerWidth;
            } else if (d.documentElement && d.documentElement.clientWidth) {
                // IE 6+ in 'standards compliant mode'
                return d.documentElement.clientWidth;
            }
        }

        /**
         * Assigns classes to the target element
         */
        function checkNarrow() {
            var classString = '',
                width = getWidth();

            // For each configured breakpoint
            $.each(config.sizes, function(cls, size) {
                // If the document is larger or equal to this size
                if (width >= size) {
                    // Add this classname to the element
                    classString += ' ' + cls;
                } else {
                    // Remove this class
                    $el.removeClass(cls);
                }
            });

            // Apply new classes
            $el.addClass(classString);
        }

        /**
         * Executes callback no more than once per interval
         *
         * @param {function}    callback
         * @param {int}         interval
         * @returns {undefined}
         */
        function throttle(callback, interval) {
            if (wait) {
                return;
            }

            wait = true;

            setTimeout(function() {
                wait = false;
            }, interval);

            callback();
        }

        if (config.onResize) {
            $window.resize(function() {
                throttle(checkNarrow, config.delay);
            });
        }

        if (config.onLoad) {
            $window.ready(checkNarrow);
        }
    };

    $.p3 = _p3;

}(jQuery, this, document));
;// Source: src/js/lib/p3.pledge_counter.js
/**!
 *
 *
 * @fileOverview    Greenpeace Pledge Signing Counter for Action Template v0.3
 *                  Animated pledge percentage bar & text,
 *                  Can be event driven or directly invoked, enabling the JSON
 *                  data to be reused with another plugin (eg Recent Signers)
 * @version         0.2
 * @author          Ray Walker <hello@raywalker.it>
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 *                  $.p3.request
 * @example         $.p3.counter('#action-counter'[, options]);
 *
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */
(function($, M, window, undefined) {
var _p3 = $.p3 || {},
    defaults = {
        meterElement:       '.completed',               /* Selector for the bar to animated */
        textElement:        '#action-counter-textual',  /* Selector for the text to update, eg 100 have joined so far. The target is 200 */
        fetchFrequency:     30000,                      /* time to wait to fetch next value from server (in milliseconds) */
        updateSpeed:        25,                         /* this is the value update speed (in milliseconds). Change this value to make animation faster or slower */
        initialAnimationTotalDuration: 2500,            /* change this value to set the total duration of the first fetch animation (how many milliseconds takes
                                                           the progress bar from 0 to the current value */
        dataElement:        'body',                     /* Element where the pledge JSON is stored */
        dataNamespace:      'pledgeCounter',            /* Namespace to use for stored JSON - change this if using multiple counters per page */
        eventDriven:        false,                      /* set to true to trigger update externally */
        fetchDataEvent:     'fetchPledgeData',          /* trigger this event to fetch JSON data from the endpoint */
        fetchCompleteEvent: 'fetchPledgeDataComplete',  /* trigger this event if you have fetched data externally and just want to parse and update display */
        jsonURL:            'https://www.greenpeace.org/api/p3/pledge/config.json',
        params:             {}
    };

    _p3.pledge_counter = function(el, options) {

        var config = $.extend(true, defaults, options || {}),
        $meter = $(config.meterElement, el),
        $text = $(config.textElement, el),
        paused = false,
        currentValue = 0,
        step = 0,
        progress = {
            count: 0,
            target: 0
        },
        request = $.p3.request(config.jsonURL),
        updateProgress = function () {
            if (paused) {
                // We're already updating, come back later
                setTimeout( function() {
                    updateProgress();
                }, config.fetchFrequency);
                return;
            }
            paused = true;

            var value = progress.count;

            if (value < currentValue) {
                currentValue = 0;
            }
            step = Math.ceil((value * config.updateSpeed) / config.initialAnimationTotalDuration, 0);
            if (step <= 0) {
                step = 1;
            }
            $text.text(addCommas(progress.count) + ' have joined so far. The target is ' + addCommas(progress.target) + '.');

            animateProgress();
        },
        animateProgress = function () {
//            console.log(progress.count + ' / ' + progress.target + ' step: ' + initialStep);

            if (currentValue >= progress.count * 1.0) {
                paused = false;
                // Restart the process to check for live changes
//                if (config.eventDriven) {
//                    setTimeout( function () {
//                        $(window).trigger(config.fetchDataEvent);
//                    }, config.fetchFrequency);
//                } else {
//                    setTimeout(fetchJSON, config.fetchFrequency);
//                }
                return;
            }

            if (currentValue + step < progress.count){
                currentValue += step;
            } else {
                currentValue = progress.count;
            }

            var percent = currentValue / progress.target * 100;

            if (percent > 100) {
                percent = 100;
            }

            if (M.csstransforms) {
                $meter.css({
                    width: percent + '%'
                }).html(addCommas(currentValue) + '&nbsp;');
            } else {
                $meter.animate({
                    width: percent + '%'
                }, (config.updateSpeed - 5 >= 0) ? config.updateSpeed : 0, function () {
                    $meter.html(addCommas(currentValue) + '&nbsp;');
                });
            }

            setTimeout(animateProgress, config.updateSpeed);
        },
        addCommas = function (number) {
            var nStr = number + '',
            x = nStr.split('.'),
            x1 = x[0],
            x2 = x.length > 1 ? '.' + x[1] : '',
            rgx = /(\d+)(\d{3})/;

            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },
        parsePledgeData = function (json) {
            // read data from parameter or element
            var jsonData = (undefined === json) ? $(config.dataElement).data(config.dataNamespace) : json;

            if (!jsonData || json.status === 'error' || !jsonData.pledges[0].action) {
                console.log('ERROR');
                $.each(json.errors, function (key, value) {
                    console.log(key + ' => ' + value);
                });
                throw new Error('Errors in pledge data.');
            }

            progress.count = jsonData.pledges[0].action.count;
            progress.target = jsonData.pledges[0].action.target;

            if (isNaN(progress.count) || isNaN(progress.target)) {
                // doesn't exist, or wrong format
                console.log('ERROR: progress data not found, aborting.');
                return false;
            }

            // Display results
            updateProgress();
        },
        fetchJSON = function () {
            var params = $.extend(true, request.parameters, config.params);
            $.getJSON(request.url, params, function(json) {
                parsePledgeData(json);
            }).error( function () {
                throw new Error('$.p3.pledge_counter :: Failed to load JSON from "' + request.url + '"');
            });
        };

        // initialise
        M.load({
            test: window.JSON,
            nope: [
                'dist/js/compat/json.min.js'
            ],
            complete: function() {
                if (M.csstransforms) {
                    $meter.css({"transition-duration": config.updateSpeed + "ms"});
                }
                if (config.eventDriven) {
                    // Event driven fetch and processing means we can decouple data
                    // from this plugin, allowing us to reuse the data without
                    // performing multiple requests
                    $(window).on(config.fetchDataEvent, function() {
                        // trigger this event to initiate a fetch
                        fetchJSON();
                    });

                    $(window).on(config.fetchCompleteEvent, function() {
                        // trigger this event if the JSON has already been fetched and is ready to parse
                        parsePledgeData();
                    });
                } else {
                    fetchJSON();
                }
            }
        });

        return {
            config: config,
            parseJSON: parsePledgeData,
            fetchJSON: fetchJSON
        };

    };

    // Overwrite p3 namespace if no errors
    $.p3 = _p3;

}(jQuery, Modernizr, this));;// Source: src/js/lib/p3.pledge_with_email_only.js
/**!
 * Greenpeace Email-only Pledge Signing for Action Template v0.3
 * @name            p3.pledge_with_email_only.js
 * @fileOverview    Checks if visitor can sign in using only an email address
 *                  Prompts for missing fields
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.3.2
 * @author          Ray Walker <hello@raywalker.it>
 * @requires        <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 *                  <a href="https://github.com/greenpeace/client-code-styleguide/blob/master/js/v03/p3.validation.js">p3.validation.js</a>
 *                  p3.request.js
 * @example         $.p3.pledge_with_email_only('#action-form' [, options]);
 *
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */
(function($, M, undef) {
var _p3 = $.p3 || {},
    defaults = {
        /* Selector for the email input field */
        emailField:             '#UserEmail',
        /* Valid options: 'email', 'uuid' (uuid not yet implemented) */
        identifyUserBy:         'email',
        /* Selector for the registration fields */
        registrationFields:     '#action-form-register',
        /* Selector(s) for the fields we DO NOT want to hide */
        exceptionFields:        '#action-form-message, #action-smallprints',
        /* Endpoint URL to check if the user can sign using only email address */
        signerCheckURL:         'https://www.greenpeace.org/api/public/pledges/signercheck.json',
        /* Use p3.validation plugin to validate the form */
        validateForm:           true,
        /* Endpoint for form validation rules, passed to $.p3.validation */
        validationRulesURL:     'https://www.greenpeace.org/api/p3/pledge/config.json',
        /* Duration to animate the display of hidden missing fields
         * Set to 0 to disable */
        animationDuration:      350,
        /* Disable form input if an error occurs */
        disableOnError:         false,
        /* GET variables to be added to both the signer check and form validation requests */
        params:                 {},
        messageElement:         '<div class="message"></div>'
    };

    // Custom selector to match country codes to country names
    $.expr[":"].p3_empty = function(el) {
        var $el = $(el);
        if ($el.attr('name') === undef) {
            return false;
        }
        return $el.val() === '';
    };

    _p3.pledge_with_email_only = function(el, options) {
        var config = $.extend(true, defaults, options || {}),
        $el = $(el),
        $form = ($el.is('form')) ? $el : $('form', $el),
        $emailField = $(config.emailField),
        $submit = $('input[type=submit]', $form),
        // Keep track of emails we've tested against the signer check endpoint
        checkedUserEmails = [],
        request = $.p3.request(config.signerCheckURL),
        query = {
            url: request.url,
            parameters: $.extend(true, request.parameters, config.params)
        },
        /**
         * Ensures the page identifier is set, throws an error if not defined
         */
        setPageIdentifier = function() {
            if (query.parameters.page === undef) {
                throw new Error('Page identifier not found');
            }
        },
        /**
         * Loads user identifier from the appropriate place
         */
        setUserIdentifier = function() {
            switch (config.identifyUserBy) {
                case 'email':
                    query.parameters.user = $emailField.val();
                    break;
                case 'uuid':
                    throw new Error('uuid not implemented');
                default:
                    throw new Error('config.identifyUserBy: ' + config.identifyUserBy + ' invalid');
            }
        },
        /**
         * Shows a console warning if the expiry parameter is not set
         */
        setExpiryDate = function() {
            if (query.parameters.expire === undef) {
                console.warn('$.p3.pledge_with_email_only :: No expiry date set');
            }
        },
        /**
         * Performs the json query against signer check endpoint
         * @returns     {boolean} True if user can pledge using only email address, false if not
         */
        checkEmail = function(hash) {

            // Disable form input until we've obtained signer check status
            $submit.prop('disabled', 'disabled').addClass('disabled');

            checkedUserEmails[hash] = {
                checked: false
            };

            $.getJSON(query.url, query.parameters, function(response) {
                // Mark this email as having been tested against the endpoint
                checkedUserEmails[hash].checked = true;

                // Re-enable form submit
                $submit.removeProp('disabled').removeClass('disabled');

                if (response.status === 'success') {
                    // User can sign using email only
                    console.log('$.p3.pledge_with_email_only :: signercheck API response success');

                    // Hide and disable unnecessary fields, in case they were
                    // previously displayed for a different email
                    hideFormFields();

                    // and then submit the form
                    submitForm(hash);
                } else {
                    // This user cannot sign with email only
                    // Error handling
                    $.each(response.errors, function (i, error) {
                        switch (error.code) {
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            // Errors 1 through 5 indicate an invalid page
                            throw new Error('$.p3.pledge_with_email_only :: Invalid page: '+ query.parameters.page);
                            // Errors 6 through 12 are not relevant to this operation
                        case 13:
                            // This user has already signed this pledge
                            console.log('$.p3.pledge_with_email_only :: User has already signed this pledge');
                            var $emailContainer = $emailField.parents('.email:first'),
                            $message = $('.message', $emailContainer);

                            if (!$message.length) {
                                // Message container doesn't exist, so add it
                                $emailContainer.append(config.messageElement);
                                $message = $('.message', $emailContainer);
                            }
                            $message.append('<span class="error" for="' + $emailField.attr('id') + '">' + error.pledge.unique + '</span>');
                            $emailField.addClass('error');
                            break;
                        case 15:
                            // User does not exist
                            console.log('$.p3.pledge_with_email_only :: New user, show all fields');
                            showAllFormFields();
                            break;
                        case 16:
                            // User exists, but is missing required fields
                            console.warn('$.p3.pledge_with_email_only :: User exists, but is missing fields');
                            showMissingFields(response.user);
                            break;
                        default:
                            console.warn('Unhandled error code: ' + error.code);
                        }
                    });
                }

            }).fail(function() {
                if (!config.disableOnError) {
                    console.warn('$.p3.pledge_with_email_only :: Failed to load JSON, all form inputs re-enabled');
                    showAllFormFields();
                    $submit.removeProp('disabled').removeClass('disabled');
                } else {
                    throw new Error('$.p3.pledge_with_email_only.js :: Signer API request failed');
                }
            });
        },
        submitForm = function (hash) {
//            console.log('Submitting form with hash ' + hash);
            $(window).trigger('submit_' + hash);
        },
        /**
         * @param   {obj} JSON response.user property
         */
        showMissingFields = function(fields) {
            console.log('$.p3.pledge_with_email_only :: showMissingFields');
            $.each(fields, function(label) {
                if (fields[label] === false) {
                    var $field = $('div.'+label, $form),
                    $input = $(':input', $field);

                    if ($input) {
                        // Enable field
                        $input.removeProp('disabled');

                        // Display the field
                        $field.show(config.animationDuration);
                    } else {
                        console.warn('$.p3.pledge_with_email_only :: ' + label + ' not found');
                    }
                }

            });
        },
        hideFormFields = function () {
            $(config.registrationFields + ' > :not(' + config.exceptionFields + ', #action-submit-full)').hide().find(':input').prop('disabled', 'disabled');
        },
        showAllFormFields = function () {
            $(config.registrationFields + ' > :not(' + config.exceptionFields + ', #action-submit-full)').show(config.animationDuration).find(':input').removeProp('disabled');
        },
        init = function() {
            // Hide unwanted form elements
            hideFormFields();

            setPageIdentifier();
            setExpiryDate();

            // Intercept form submission by the enter key
            $(':input', $form).keypress(function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                    $(this).blur();
                    $submit.focus().click();
                    return false;
                }
            });

            $submit.click( function (e) {
                // Initialise user parameter with email form field
                setUserIdentifier();

                if (query.parameters.user) {

                    if (checkedUserEmails[query.parameters.user] && checkedUserEmails[query.parameters.user].checked) {
//                        console.log('Already tested this email');
                        $(window).trigger('submit_' + query.parameters.user);
                    } else {
//                        console.log('Haven\'t tested this email yet...');
                        // Haven't checked this email, so prevent form submission
                        e.preventDefault();

                        // listen for successful API check
                        $(window).on('submit_' + query.parameters.user, function () {
                            // submit the form
                            $form.submit();
                        });

                        // test the API for this email
                        checkEmail(query.parameters.user);
                    }
                } else {
                    // Skip the theatrics if there's no email address
                    $form.submit();
                }

            });

            if (config.validateForm) {
                // Initialise validation plugin
                $.p3.validation($form, {
                    jsonURL: config.validationRulesURL,
                    params: query.parameters,
                    debug:true,
                    disableOnError: config.disableOnError,
                    submitHandler: function (f) {
                        if ($form.valid()) {
                            f.submit();
                            return true;
                        }
                    }
                });
            }

        };


        M.load({
            test: window.JSON,
            nope: [
                'dist/js/compat/json.min.js'
            ],
            complete: init
        });

        $.p3 = _p3;
    };

}(jQuery, Modernizr));;// Source: src/js/lib/p3.recent_signers.js
/**!
 * Animated Recent Signers for Greenpeace Action Template v0.3
 * INCOMPLETE
 * @fileOverview    Displays the most recent pledge signers, queued and
 *                  animated
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.0.2
 * @author          Ray Walker <hello@raywalker.it>
 * @requires        <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 * @example         $.p3.recent_signers('#action-recent-signers'[, options]);
 * @todo            EVENT DRIVEN DATA UPDATES:  trigger fetches & parsing externally
 *
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */

(function($, M, window, undef) {
var _p3 = $.p3 || {},
        defaults = {
            jsonURL: 'https://www.greenpeace.org/api/p3/pledge/pledges.json',
            /* parameters to be added to the request url */
            params: {},
            /* set to true to delay execution until externally triggered by event */
            eventDriven: false,
            /* trigger this event to fetch JSON data from the endpoint */
            fetchDataEvent: 'fetchPledgeData',
            /* trigger this event if you have fetched data externally and just
             * want to parse and update display */
            fetchCompleteEvent: 'fetchPledgeDataComplete',
            /* delay in milliseconds between signer check updates */
            updateInterval: 5000,
            /* interval between users added to the recent signer list from last
             * update */
            userQueueInterval: 750,
            /* maximum number of users to display at once, excess users are hidden
             * and then removed from the DOM */
            maxUsers: 8,
            /* number of times to check the server for new signers after the first
             * set to 0 to disable updates */
            maxRefreshes: 30,
            /* selector for the country dropdown to map country codes to names */
            countrySelector: '#UserCountry'
        };

    // Custom selector to match country codes to country names
    $.expr[":"].valueNoCase = function(el, i, m) {
        var search = m[3];
        if (!search) {
            return false;
        }

        return $(el).prop('value').toLowerCase() === search.toLowerCase();
    };

    _p3.recent_signers = function(el, options) {
        var config = $.extend(true, defaults, options),
            $el = $(el),
            $ul = false,
            request = $.p3.request(config.jsonURL),
            users = [],
            timer = false,
            refreshNum = 0,
            pledgeQueue = {
                running: false,
                delay: config.userQueueInterval,
                actions: [],
                callback: function() {
                },
                step: function() {
                    if (pledgeQueue.actions.length) {
                        try {
                            pledgeQueue.actions.pop()();
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        pledgeQueue.running = false;
                    }
                },
                run: function() {
                    pledgeQueue.running = true;
                    if (pledgeQueue.actions.length) {
                        pledgeQueue.step();
                        setTimeout(pledgeQueue.run, pledgeQueue.delay);
                    } else {
                        pledgeQueue.running = false;
                        pledgeQueue.callback();
                    }
                }
            },
            fetchJSON = function() {
                if (pledgeQueue.running) {
                    // Still executing last update, restart timer
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        fetchJSON();
                    }, config.updateInterval);
                    // and exit
                    return false;
                }

                var params = $.extend(true, request.parameters, config.params);

                $.getJSON(request.url, params, function(json) {
                    parsePledgeData(json);
                }).fail(function() {
                    throw new Error('$.p3.recent_signers :: Failed to load JSON from "' + request.url + '"');
                });
            },
            parsePledgeData = function(json) {
                var jsonData = (undef === json) ? $(config.dataElement).data(config.dataNamespace) : json;

                // Add fetch first, since array is popped not shifted
                if (refreshNum++ < config.maxRefreshes) {
                    pledgeQueue.actions.push(function() {
                        clearTimeout(timer);
                        timer = setTimeout(function() {
                            fetchJSON();
                        }, config.updateInterval);
                    });
                }

                $.each(jsonData.pledges, function(i, pledge) {

                    if (users[pledge.user.id]) {
                        // Already added, exit $.each
                        return false;
                    } else {
                        // Store this ID
                        users[pledge.user.id] = true;
                    }

                    if (pledge.user.dont_display_name === true) {
                        // Skip to next pledge ...
                        return true;
                    }

                    pledgeQueue.actions.push(function() {
                        // Enqueue this user
                        showUser(pledge.user);
                    });

                });

                // Update existing timestamps
                pledgeQueue.actions.push(function() {
                    updateTimeStamps();
                });

                // Show all pledges in the queue
                pledgeQueue.run();

            },
            /**
             * Retrieves human readable time string from timestamp
             * @param {string} timestamp
             * @returns {unresolved}
             */
            getTimeString = function(time) {
                if (time) {
                    return $.timeago(time);
                }
            },
            getCountryString = function(country) {
                return $(config.countrySelector + ' option:valueNoCase(' + country + ')').text();
            },
            showUser = function(user) {
                var $li = $('<li style="display:none"><span class="since" data-since="' +
                    user.created + '">' + getTimeString(user.created) + '</span><span class="icon flag ' + user.country +
                    '"></span><span class="name">' + user.firstname +
                    ' ' + user.lastname + '</span><span class="country">' +
                    getCountryString(user.country) + '</span></li>');

                // Add to DOM
                $ul.prepend($li);

                // And show
                $li.show(350);

                // Remove any excess users
                if (config.maxUsers && $('li', $ul).length > config.maxUsers) {
                    $('li:last', $ul).hide(350).remove();
                }
            },
            updateTimeStamps = function() {
                $('.since', $ul).each(function() {
                    var $this = $(this);
                    $this.text(getTimeString($this.attr('data-since')));
                });
            };

        // initialise and run

        if (config.updateInterval < 5000) {
            // Update interval sanity check
            config.updateInterval = 5000;
        }

        $ul = $('ul:first', $el);
        if (!$ul.length) {
            $ul = $('<ul></ul>');
            $el.append($ul);
        }

        M.load({
            test: window.JSON,
            nope: [
                'js/vendor/json.min.js'
            ],
            complete: function() {
                if (config.eventDriven) {
                    // Event driven fetch and processing means we can decouple data
                    // from this plugin, allowing us to reuse the data without
                    // performing multiple requests
                    $(window).on(config.fetchDataEvent, function() {
                        // trigger this event to initiate a fetch
                        fetchJSON();
                    });

                    $(window).on(config.fetchCompleteEvent, function() {
                        // trigger this event if the JSON has already been fetched and is ready to parse
                        parsePledgeData();
                    });
                } else {
                    fetchJSON();
                }
            }
        });

    };

    $.p3 = _p3;

}(jQuery, Modernizr, this));
;// Source: src/js/lib/p3.remember_me_cookie.js
/**!
 * p3.remember_me_cookie
 *
 * @fileOverview        Auto fills email field from cookie
 *                      if user has previously opted in
 *                      Stores 'remember me' state from previous pledges
 *                      if browser supports localStorage (all except IE 6-7)
 * @author              <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version             0.1
 * @copyright           Copyright 2013, Greenpeace International
 * @license             MIT License (opensource.org/licenses/MIT)
 * @example             $.p3.remember_me_cookie('#action-form'[, options]);
 * @requires            <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                      <a href="http://modernizr.com/">Modernizr</a>
 *
 */
/* global Modernizr */
(function ($, M) {
var _p3 = $.p3 || {},
    defaults = {
        /* rememberMe input checkbox selector */
        rememberMeSelector: '#RememberMe',
        /* email input field selector */
        emailSelector:      '#UserEmail',
        /* cookie variable name */
        cookieName:         'email',
        /* time in days before the cookie expires */
        expires:            31,
        /* sets secure cookie if protocol is https.  IE does things differently */
        secure:             (window.location.protocol === 'https' || document.location.protocol === 'https' ) ? true : false,
        /* stores value of 'rememberMe' in localStorage if supported */
        keepRememberMeState:true
    };

    _p3.remember_me_cookie = function(el, settings) {

        var config = $.extend(true, defaults, settings || {}),
        $form = $(el).is('form') ? $(el) : $('form:first', el),
        $rememberMe = $(config.rememberMeSelector, $form).first(),
        $emailField = $(config.emailSelector, $form).first(),
        keepRememberMe = (config.keepRememberMeState && M.localstorage) ? true : false;

        $.cookie.defaults = { expires: config.expires, secure: config.secure };

        // Set the email field to the value of the cookie
        $emailField.val($.cookie(config.cookieName));

        // Monitor form submission, and store email field if 'rememberMe' is set
        $form.submit(function () {
            if ($rememberMe.is(':checked')) {
                $.cookie(config.cookieName, $emailField.val());
            } else {
                $.removeCookie(config.cookieName);
            }

            // Remember 'rememberMe' for the next form
            if (keepRememberMe) {
                localStorage.rememberMeGP = $rememberMe.is(':checked') ? 'true' : 'false';
            }

        });

        // Set 'rememberMe' if the value is stored locally
        if (keepRememberMe && "undefined" !== localStorage.rememberMeGP) {
            $rememberMe.prop('checked', localStorage.rememberMeGP === 'true' ? true : false);
        }

    };

    $.p3 = _p3;


}(jQuery, Modernizr));
;// Source: src/js/lib/p3.request.js
/**!
 * $.p3.request
 *
 * Query string parser, returns the url and an object
 * containing the GET parameters in key: value format
 *
 * Required in most $.p3 libraries
 *
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @requires        <a href="http://jquery.com/">jQuery</a>
 * @usage           $.p3.request('http://fish.com?type=salmon');
 * @version         0.1
 * @param           {string} url jQuery
 * @returns         {object} { url: 'http://fish.com', parameters: { type: 'salmon' } }
 */
(function($) {
var _p3 = $.p3 || {};

    _p3.request = function(url) {
        var request = {
          url: false,
          parameters: false
        },
        parts = [],
        getRequestParams = function() {
            var params = {};

            if (parts[1]) {
                parts[1].split(/[&;]/g).forEach(function (param) {
                    var q = param.split(/\=/);
                    if (q.length > 1 && q[0].length && q[1].length) {
                        params[q[0]] = q[1];
                    }
                });
            }
            return params;
        },
        getRequestURL = function() {
            return (parts[0].length) ? parts[0] : url;
        };

        if (url) {
          parts = url.split('?');
        } else {
          return request;
        }

        request.url = getRequestURL();
        request.parameters = getRequestParams();

        return request;
    };

    $.p3 = _p3;

}(jQuery));

;// Source: src/js/lib/p3.social_sharing.js
/**!
 * Social Private Sharing for Greenpeace Action Template v0.3
 *
 * @name            p3.social_sharing.js
 * @fileOverview    Enables social sharing without compromising privacy,
 *                  Obtains share counts from JSON endpoint
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.1.4
 * @author          Ray Walker <hello@raywalker.it>
 * @requires        <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 * @example         $.p3.social_sharing('#action-social-share'[, options]);
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global jQuery, Modernizr */

(function($, M, w) {
var _p3 = $.p3 || {},
        prefix = function () {
            return new Date().getTime() + ' :: $.p3.social_sharing :: ';
        }(),
        defaults = {
            pageURL: false,
            popup: {
                top: 200,
                left: 100,
                width: 550,
                height: 350
            },
            networks: {
                facebook: {
                    enabled: true,
                    url: 'http://www.facebook.com/sharer.php?u=__REFERRER__',
                    count: 0
                },
                twitter: {
                    enabled: true,
                    url: 'https://twitter.com/intent/tweet?original_referer=__REFERRER__&source=tweetbutton&text=__TITLE__&url=__REFERRER__&via=__ACCOUNT__',
                    count: 0,
                    title: false,
                    account: 'greenpeace'
                },
                google: {
                    enabled: true,
                    url: 'https://plus.google.com/share?url=__REFERRER__',
                    count: 0
                },
                linkedin: {
                    enabled: true,
                    url: 'https://www.linkedin.com/cws/share?url=__REFERRER__&original_referer=__REFERRER__',
                    count: 0
                },
                pinterest: {
                    enabled: true,
                    url: 'http://pinterest.com/pin/create/button/?url=__REFERRER__&media=__IMAGE__&description=__DESCRIPTION__',
                    count: 0,
                    image: false,
                    description: false
                }
            },
            precision: 1,
            jsonURL: 'https://www.greenpeace.org/api/p3/pledge/social.json'
        };

    _p3.social_sharing = function(el, options) {

        var config  = $.extend(true, defaults, options || {}),
            $el     = $(el);

        function addCommas(int) {
            var nStr = int + '',
                x = nStr.split('.'),
                x1 = x[0],
                x2 = (x.length > 1 && (x[1] * 1.0) > 0 && int < 100) ? '.' + x[1].replace(/0+$/, "") : '',
                rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }

        function humanise(int) {

            int = int * 1.0;

            // Smaller than 10k doesn't overflow container
            if (int < 10000) {
                return addCommas(int);
            }

            var ordinals = ["", "K", "M", "G", "T", "P", "E"],
                n = int,
                ord = 0;

            while (n > 1000) {
                n /= 1000;
                ord++;
            }

            return addCommas((n.toFixed(config.precision)) * 1.0) + ordinals[ord];
        }

        function init() {

            if (config.pageURL === false) {
                console.warn(prefix + 'page referrer URL is not set, using "' + w.location.href + '"');
                config.pageURL = w.location.href;
            }

            $.each(config.networks, function(network, data) {
                if (data.enabled !== false) {
                    var $li = $('li.' + network, $el),
                        $counter = $('.counter span', $li),
                        $a = $('a', $li),
                        url = data.url;

                    switch (network) {
                        case 'pinterest':
                            if (data.image === false) {
//                            throw new Error('Pinterest sharing requires an image');
                                console.warn(prefix + 'Pinterest sharing requires an image.');
                                data.image = '';
                            }
                            if (data.description === false) {
//                                throw new Error('Pinterest sharing requires a description');
                                console.warn(prefix + 'Pinterest sharing requires a description.');
                                data.description = '';
                            }
                            url = url.replace('__IMAGE__', encodeURIComponent(data.image));
                            url = url.replace('__DESCRIPTION__', encodeURIComponent(data.description));
                            break;
                        case 'twitter':
                            if (data.title === false) {
//                                throw new Error('Twitter sharing requires a title');
                                console.warn(prefix + 'Twitter sharing requires a title.');
                                data.title = '';
                            }
                            url = url.replace('__TITLE__', encodeURIComponent(data.title));
                            url = url.replace('__ACCOUNT__', encodeURIComponent(data.account));
                            break;
                        default:
                            break;
                    }

                    url = url.replace(/__REFERRER__/g, encodeURIComponent(config.pageURL));

                    $a.attr({
                        href: url,
                        target: '_blank'
                    }).click(function(e) {

                        e.preventDefault();

                        w.open(url, 'Share this page', 'left=' + config.popup.left + ',top=' + config.popup.top + ',width=' + config.popup.width + ',height=' + config.popup.height + ',toolbar=0,resizable=1');

                    });

                    // Set counter to humanised number
                    $counter.text(humanise(data.count));
                } // else { console.log(network + ' disabled'); }
            });

        }

        M.load({
            test: w.JSON,
            nope: [
                'dist/js/compat/json.min.js'
            ],
            complete: function() {
                $.getJSON(config.jsonURL, function(json) {
                    $.extend(true, config, json);

                    if (json.status === 'success') {
                        init();
                    } else {
                        console.warn(json);
                        throw new Error(prefix + 'Status: ' + json.status + ': server reported a problem');
                    }

                }).fail(function() {
                    throw new Error(prefix + 'Failed to load JSON: "' + config.jsonURL + '"');
                });

            }
        });

    };

    $.p3 = _p3;

}(jQuery, Modernizr, this));
;// Source: src/js/lib/p3.validation.js

/**!
 * @name            p3.validation.js
 *
 * @fileOverview    Wrapper over the jquery.validation.js plugin for Greenpeace
 *                  Action Template v03
 *                  Validates form data against XRegExp rules, optionally
 *                  obtained via remote API
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version         0.2.6
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 *                  <a href="http://xregexp.com/">XRegExp</a>
 *                  <a href="http://jqueryvalidation.org/">jQuery Validate</a>
 *                  $.p3.request
 * @example         $.p3.validation('#action-form'[, options]);
 *
 */
/* global jQuery, Modernizr, XRegExp */
(function($, M, w) {
var _p3 = $.p3 || {}, // Extends existing $.p3 namespace
    defaults = {
        /* the API endpoint to obtain configuration and rules from
         * set to false to disable remote API call and only use initialisation
         * parameters
         */
        jsonURL: 'https://www.greenpeace.org/api/p3/pledges',
        /* Add default validation rules here */
        rules: {},
        /* Add custom regular expressions to use in rules here
         * see also: http://xregexp.com/
         * and: http://xregexp.com/plugins/#unicode
         */
        tests: {
            // Matches all unicode alphanumeric characters, including accents
            // plus . , - ' /
            // Note for end users: when overriding or creating tests,
            // character strings must be double escaped: \\ instead of \
            // http://stackoverflow.com/questions/16572123/javascript-regex-invalid-range-in-character-class
            alphaPlus: "^[\\p{L}\\p{N}\\.\\-\\'\\,\\/]+$",
            numeric: "^\\p{N}+$",
            alpha: "^\\p{L}+$",
            // Match a url with or without www.
            // http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without-the
            url: "^((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)$"
        },
        /* attempt to submit the form automatically */
        autoSign: false,
        /* validate the form each time a field loses focus */
        onfocusout: false,
        /* validate the form each time keyup is received when a field has focus */
        onkeyup: false,
        // Not implemented
        /* @todo Enable optional error summary area */
        showSummary: false,
        // Forbid form submission if there's an error receiving JSON or
        // when in parsing
        disableOnError: false,
        // Error element to use instead of jquery.validate default <label>
        errorElement: 'span',
        // Overrides jquery.validate default positioning
        errorPlacement: function(error, element) {
            var $el = $(element),
            name = $el.prop('name');
            $el.parents('.' + name).first().find('div.message').html(error);
        },
        // Query string parameters to include in validation request
        params: {},
        // Message container appended to each form field container
        messageElement: '<div class="message"></div>'
    };

    // Adds validation rule where field value must not equal parameter, eg
    // rules: { fish: { valueNotEquals: 'salmon' } }
    $.validator.addMethod("valueNotEquals", function(value, element, arg) {
        return arg !== value;
    }, "Value must not equal arg.");

    _p3.validation = function(el, options) {

        var config = $.extend(true, defaults, options || {}),
        request = $.p3.request(config.jsonURL),
        // Merge request GET variables from all configuration sources: json > parameters > defaults
        query = {
            url: request.url,
            parameters: $.extend(true, request.parameters, config.params)
        },
        getVars = $.p3.request(w.location.href).parameters,
        $el = $(el),
        $form = $el.is('form') ? $el : $('form', el),
        messageDiv = config.messageElement,
        enableForm = function () {
            $(':input', $form).removeProp('disabled').removeClass('disabled');
        },
        disableForm = function () {
            $(':input', $form).prop('disabled', 'disabled').addClass('disabled');
        },
        /* the main action function, called after the getJSON completes */
        validate = function () {
            if (config.disableOnError) {
                disableForm();
            }

            if (config.showSummary) {
                console.warn('$.p3.validation.js :: showSummary not yet implemented');
                // Add the summary element
//                config.summaryElement = $('.errorSummary', el).length ? $('.errorSummary', el) : $(el).prepend('<div class="errorSummary"></div>');
            }

            // Add any custom tests
            $.each(config.tests, function(name, regexp) {
                // Don't trust the user entered config
                try {
                    // Create a new validator method
                    $.validator.addMethod(name, function(value, element) {
                        var reg = new XRegExp(regexp);
                        return this.optional(element) || reg.test(value);
                    });
                } catch (err) {
//                            console.log("Failed to add test '" + name + "' with regex '" + regexp + "'");
                }
            });

            // Add message div to required fields
            // if it doesn't already exist in template
            $(':input', $form).each(function() {
                var $this = $(this),
                name = $this.prop('name'),
                $parent = name ? $this.parents('.' + name).first() : false;
                if ($parent) {
                    if (!$parent.find('div.message').length) {
                        $parent.append(messageDiv);
                    }
                } else {
                    if (!$this.is('[type=submit')) {
                        console.warn('$.p3.pledge_with_email_only :: "' + name + '" field parent not found');
                    }
                }
            });

            enableForm();

            // Initialise the jQuery.validate plugin
            $form.validate(config);

            // Submit the form if auto_sign is true
            if (config.autoSign || getVars.auto_sign === 'true' || getVars.auto_sign === '1') {

                if ($.p3.pledge_with_email_only) {
                    // trigger a submit click, instead of form submission event
                    // because there may be other events intercepting form submission
                    $('input[type=submit]', $form).click();
                } else {
                    $form.submit();
                }
            }
        };



        if (query.url) {
            // Only check for JSON browser object if we intend to use the
            // JSON endpoint, and if it appears to be a valid URL
            M.load({
                test: w.JSON,
                nope: [
                    'dist/js/compat/json.min.js'
                ],
                complete: function() {
                    // Fetch rules from remote service
                    $.getJSON(query.url, query.parameters, function(data) {
                        // Success, extend configuration with remote data
                        config = $.extend(true, config, data);
                    }).fail(function() {
                        // Failed to obtain JSON
                        console.warn('$.p3.validation :: WARNING :: JSON failed to load from: ' + config.jsonURL);

                        if (config.disableOnError) {
                            // Disable validation plugin if can't load JSON
                            disableForm();
                            throw new Error('$.p3.validation :: Form input disabled');
                        } else {
                            // Else try to continue with existing rules...
                            console.warn('$.p3.validation :: Attempting to continuing regardless...');
                        }
                    }).complete( function () {
                        // Perform validation
                        validate();
                    });
                }
            });
        } else {
            // Perform validation using existing rules
            validate();
        }
    };

    // Overwrite previous namespaced object
    $.p3 = _p3;

}(jQuery, Modernizr, this));