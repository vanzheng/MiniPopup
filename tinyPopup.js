(function($) {
    function PopupLayer(opts) {
        this.settings = opts;
        this.mask = $(opts.mask);
        this.popup = opts.popup;
        this.popup.data('tinypopup', this);

        var _this = this;
        if (opts.adaptive) {
            $(window).bind('resize', function() {
                _this.setPosition();
            });
        }
    }

    PopupLayer.prototype = {
        setPosition: function() {
            var scrollWidth, scrollHeight, clientWidth, clientHeight, scrollTop, realWidth, realHeight, ww, wh, popupWidth, popupHeight;
            var $container = $(this.settings.container);

            if (this.settings.container.toLowerCase() === 'body') {
                scrollWidth = document.documentElement.scrollWidth || document.body.scrollWidth;
                scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
                clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                realWidth = scrollWidth > clientWidth ? scrollWidth : clientWidth;
                realHeight = scrollHeight > clientHeight ? scrollHeight : clientHeight;
                ww = $(window).width();
                wh = $(window).height();
                popupWidth = this.popup.outerWidth();
                popupHeight = this.popup.outerHeight();
            }
            else {
                scrollWidth = $container[0].scrollWidth;
                scrollHeight = $container[0].scrollHeight;
                clientWidth = $container[0].clientWidth;
                clientHeight = $container[0].clientHeight;
                scrollTop = $container[0].scrollTop;
                realWidth = scrollWidth > clientWidth ? scrollWidth : clientWidth;
                realHeight = scrollHeight > clientHeight ? scrollHeight : clientHeight;
                ww = $container[0].clientWidth;
                wh = $container[0].clientHeight;
                popupWidth = this.popup.outerWidth();
                popupHeight = this.popup.outerHeight();
            }

            if (this.hasMaskLayer()) {
                this.mask.css({
                    'top': 0,
                    'left': 0
                }).width(realWidth).height(realHeight);
            }

            this.popup.css({
                'left': (ww - popupWidth) / 2,
                'top': scrollTop + (wh - popupHeight) / 2
            });
        },
        open: function(callback) {
            var _popup = this.popup;

            this.settings.beforeOpen();
            this.setPosition();

            if (this.hasMaskLayer()) {
                this.mask.fadeIn(this.settings.speed);
                _popup.fadeIn(this.settings.speed, callback);
            }
            else {
                _popup.fadeIn(this.settings.speed, callback);
            }
        },
        close: function(callback) {
            this.settings.beforeClose();
            this.popup.fadeOut(this.settings.speed, callback);
            this.mask.fadeOut(this.settings.speed);
        },
        hasMaskLayer: function() {
            var mask = this.settings.mask;
            if (mask && mask.length > 0 && $(mask).length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    };

    $.fn.tinyPopup = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var opts;

        return this.each(function() {
            var _this = $(this);

            // If the arguments is object, create a new PopupLayer object.
            if (typeof args.length === 0 || typeof(args[0]) === 'object') {
                opts = args.length === 0 ? $.fn.tinyPopup.defaults : $.extend({}, $.fn.tinyPopup.defaults, args[0]);
                opts.popup = _this;
                new PopupLayer(opts);
            }

            // If the arguments is a string, get PopupLayer instance from data.
            else if (typeof(args[0]) === 'string') {
                var method = args[0];
                var popupLayer = _this.data('tinypopup');

                if (popupLayer === undefined) {
                    return;
                }

                if (popupLayer[method] === undefined) {
                    $.error('Invalid method name ' + method + ' to tinyPopup plugin');
                }
                else {
                    popupLayer[method].apply(popupLayer, args.slice(1));
                }
            }
            else {
                $.error("Invalid arguments to tinyPopup plugin: " + args);
            }
        });
    }

    $.fn.tinyPopup.defaults = {
        mask: '.tiny-popup-mask',
        container: 'body',
        speed: 300,
        adaptive: true,
        beforeOpen: function() {},
        beforeClose: function() {}
    };
})(jQuery);
