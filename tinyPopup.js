(function($) {
    function popupLayer(opts) {
        this.settings = opts;
        this.mask = $(opts.mask);
        this.popup = opts.popup;
        this.popup.data('tinypopup', this);

        var _this = this;
        if (opts.autoPosition) {
            $(window).bind('resize', function() {
                _this.setPosition();
            });
        }
    }

    popupLayer.prototype = {
        setPosition: function () {
            var scrollWidth = document.documentElement.scrollWidth || document.body.scrollWidth;
            var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
            var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var realWidth = scrollWidth > clientWidth ? scrollWidth : clientWidth;
            var realHeight = scrollHeight > clientHeight ? scrollHeight : clientHeight;
            var ww = $(window).width();
            var wh = $(window).height();
            var popupWidth = this.popup.width();
            var popupHeight = this.popup.height();

            this.mask.css({ 'top': 0, 'left': 0 }).width(realWidth).height(realHeight);
            this.popup.css({ 'left': (ww - popupWidth) / 2, 'top': scrollTop + (wh - popupHeight) / 2 });
        },
        open: function () {
            var _popup = this.popup;
            this.settings.beforeOpen();
            this.setPosition();
            this.mask.fadeIn(this.settings.fading, function () {
                _popup.show();
            });
        },
        close: function () {
            this.popup.hide();
            this.mask.hide();
            this.settings.afterClose();
        }
    };

    $.fn.tinyPopup = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var opts;
		
        return this.each(function() {
            var _this = $(this);
            if (typeof args.length === 0 || typeof(args[0]) ===  'object') {
                opts = args.length === 0 ? $.fn.tinyPopup.defaults : $.extend({}, $.fn.tinyPopup.defaults, args[0]);
                opts.popup =_this;
                new popupLayer(opts);
            }
            else if (typeof (args[0]) === 'string') {
                var method = args[0];
                var popup = _this.data('tinypopup');

                if (popup === undefined) {
                    return;
                }

                if (popup[method] === undefined) {
                    $.error('Invalid method name ' + method + ' to tinyPopup plugin');
                }
                else {
                    popup[method].apply(popup, args.slice(1));
                }
            }
            else {
                $.error("Invalid arguments to tinyPopup plugin: " + args);
            }
        });
    }

    $.fn.tinyPopup.defaults = {
        mask: '.tiny-popup-mask',
        fading: 300,
        autoPosition: true,
        beforeOpen: function() { },
        afterClose: function() { }
    };
})(jQuery);