
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

    $('#mobilemenu-icon,  #mobilemenu-close').click(function(e) {
      var mainMenu = $('#main-nav');
      var mainMenuWidth = mainMenu.innerWidth();
      // move search form into mobile menu
      var searchForm =  $('.tools .search-form').detach();
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
      if($('body').hasClass('mobilemenu-open')) {
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
        searchForm =  $('.search-form', mainMenu).detach();
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
        searchForm =  $('.tools .search-form').detach();
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