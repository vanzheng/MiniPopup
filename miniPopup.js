/**
* @author vanzheng
*/

(function($) {
    function PopupLayer(opts) {
        this.settings = opts;
        this.mask = $(opts.mask);
        this.popup = opts.popup;
        this.popup.data('minipopup', this);

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
            var containerLeft, containerTop;
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
                popupWidth = this.popup.outerWidth(true);
                popupHeight = this.popup.outerHeight(true);
                containerLeft = 0;
                containerTop = 0;
            }
            else {
                scrollTop = 0;
                ww = $container.outerWidth();
                wh = $container.outerHeight();
                realWidth = $container.outerWidth();
                realHeight = $container.outerHeight();
                popupWidth = this.popup.outerWidth(true);
                popupHeight = this.popup.outerHeight(true);
                containerLeft = $container.offset().left;
                containerTop = $container.offset().top;
            }

            if (this.hasMaskLayer()) {
                this.mask.css({
                    'top': containerTop,
                    'left': containerLeft,
                    'position': 'absolute'
                }).width(realWidth).height(realHeight);
            }

            this.popup.css({
                'left': containerLeft + (ww - popupWidth) / 2,
                'top': containerTop + scrollTop + (wh - popupHeight) / 2,
                'position': 'absolute'
            });
        },

        /**
        * @name miniPopup#open
        *
        * @public
        * @desc Opens popup.
        * @param {Function} callback While popup is opened, it trigger callback function.
        * @method
        */
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

        /**
        * @name miniPopup#close
        *
        * @public
        * @desc Closes popup.
        * @param {Function} callback While popup is closed, it trigger callback function.
        * @method
        */
        close: function(callback) {
            this.settings.beforeClose();
            this.popup.fadeOut(this.settings.speed, callback);
            this.mask.fadeOut(this.settings.speed);
        },

        /**
        * Identify the popup whether has mask layer.
        */
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

    /**
    * jQuery plugin initialization
    * 
    * @name miniPopup
    * @class
    * @extends jQuery
    * @public
    * @param {Object} option
    * @param {String} option.mask The mask, the mask layer selector.
    * @param {String} option.container The container, the popup container selector.
    * @param {Number} option.speed The speed, the mask layer and popup fade in and fade out speed.
    * @param {Boolean} option.adaptive The adaptive, The mask layer and popup adaptive while window resized.
    * @param {Function} option.beforeOpen before popup open trigger the function.
    * @param {Function} option.beforeClass before popup close trigger the function.
    */
    $.fn.miniPopup = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var opts;

        return this.each(function() {
            var _this = $(this);

            // If the arguments is object, create a new PopupLayer object.
            if (typeof args.length === 0 || typeof(args[0]) === 'object') {
                opts = args.length === 0 ? $.fn.miniPopup.defaults : $.extend({}, $.fn.miniPopup.defaults, args[0]);
                opts.popup = _this;
                new PopupLayer(opts);
            }

            // If the arguments is a string, get PopupLayer instance from data.
            else if (typeof(args[0]) === 'string') {
                var method = args[0];
                var popupLayer = _this.data('minipopup');

                if (popupLayer === undefined) {
                    return;
                }

                if (popupLayer[method] === undefined) {
                    $.error('Invalid method name ' + method + ' to miniPopup plugin');
                }
                else {
                    popupLayer[method].apply(popupLayer, args.slice(1));
                }
            }
            else {
                $.error("Invalid arguments to miniPopup plugin: " + args);
            }
        });
    }

    /**
    * The miniPopup plugin defaults.
    *
    * @public
    * @type {object}
    */
    $.fn.miniPopup.defaults = {
        mask: '.mini-popup-mask',
        container: 'body',
        speed: 300,
        adaptive: true,
        beforeOpen: function() {},
        beforeClose: function() {}
    };
})(jQuery);
