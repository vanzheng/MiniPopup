/**
 * @author vanzheng
 */

(function($) {
    function PopupLayer(opts) {
        this.settings = opts;
        this.$popup = opts.popup;
        this.$popup.data('minipopup', this);
        this.init();
    }

    PopupLayer.prototype = {
        init: function() {
            var _this = this;

            if (this.settings.modal) {
                this.$maskLayer = $('<div />', {
                    class: this.settings.maskClass
                }).hide().appendTo($('body'));
            }

            if (this.settings.adaptive) {
                $(window).bind('resize', function() {
                    _this.setPosition();
                });
            }

            this.$popup.delegate(this.settings.closeButton, 'click', function(e) {
                e.stopPropagation();
                _this.close($.noop);
            });
        },
        setPosition: function() {
            var scrollWidth,
                scrollHeight,
                clientWidth,
                clientHeight,
                scrollTop,
                realWidth,
                realHeight,
                ww,
                wh,
                popupWidth,
                popupHeight,
                containerLeft,
                containerTop;

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
                containerLeft = 0;
                containerTop = 0;
            }
            else {
                scrollTop = 0;
                ww = $container.outerWidth();
                wh = $container.outerHeight();
                realWidth = $container.outerWidth();
                realHeight = $container.outerHeight();
                containerLeft = $container.offset().left;
                containerTop = $container.offset().top;
            }

            popupWidth = this.$popup.outerWidth();
            popupHeight = this.$popup.outerHeight();

            if (this.settings.modal) {
                this.$maskLayer.css({
                    'top': containerTop,
                    'left': containerLeft,
                    'position': 'absolute',
                    'opacity': this.settings.opacity,
                }).width(realWidth).height(realHeight);
            }

            this.$popup.css({
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
            var _this = this;
            var _popup = this.$popup;

            this.settings.beforeOpen();
            this.setPosition();

            if (this.settings.modal) {
                this.$maskLayer.fadeIn(this.settings.speed);
            }

            _popup.fadeIn(this.settings.speed, this.rectifyCallback(callback));
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
            this.$popup.fadeOut(this.settings.speed, this.rectifyCallback(callback));

            if (this.settings.modal) {
                this.$maskLayer.fadeOut(this.settings.speed);
            }
        },
        rectifyCallback: function(callback) {
            if (typeof callback !== 'function') {
                return $.noop;
            }

            return callback;
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
     * @param {String} option.maskClass The maskClass, the maskClass layer selector.
     * @param {String} option.container The container, the popup container selector.
     * @param {Number} option.speed The speed, the maskClass layer and popup fade in and fade out speed.
     * @param {Boolean} option.adaptive The adaptive, The maskClass layer and popup adaptive while window resized.
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
        maskClass: 'mini-popup-mask',
        container: 'body',
        modal: true,
        speed: 300,
        adaptive: true,
        closeButton: '.close, .cancel',
        opacity: 0.5,
        beforeOpen: function() {},
        beforeClose: function() {}
    };
})(jQuery);
