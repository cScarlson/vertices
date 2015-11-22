

/* ================================================================================================================
    Core Components
    :: Split these files appropriately as growth occurs e.g: /components/backdrop.js, ... etc
   ================================================================================================================ */

;(function (V, undefined) {
    if (undefined) return;
    var ENV = this;

    /* ================================================================
       TODO: Only expose necessary Classes to environment
     * ================================================================ */


    var Configurable = function Configurable($) {
        var thus = this;

        function getConfigJSON(selector) {
            var $config = selector ? $.find(selector) : $.find('> script[type="application/json"]:first-child')
              , content = $config.html()
              , json = content ? JSON.parse(content) : {}
              , data = $.data()
              , config = $.extend({}, data, json);

            delete config.behavior;

            return config;
        }

        // export precepts
        this.getConfigJSON = getConfigJSON;

        return this;
    };




    /* BACKDROP */

    var Backdrop = function Backdrop($) {
        var thus = this;
        var $config;
        var config = {
            css: {
                background: '#222',
                opacity: 0.8,
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                'z-index': '10000',
                overflow: 'hidden',
                display: 'none'
            }
        };

        function showBackdrop() {
            $.show();
        }

        function closeBackdrop() {
            $.hide();
        }

        function clickHandler() {
            $.notify({ type: 'ui>$backdrop:clicked', data: {} });
        }

        function initialize() {

            $.css(config.css);

            $.addEvent('click', clickHandler);
            $.listen({
                'ui>$backdrop:show': showBackdrop,
                'ui>$backdrop:hide': closeBackdrop
            });
        }

        function destroy() { }

        // export precepts
        this.init = initialize;
        this.destroy = destroy;

        return this;
    };








    /* POPUP */

    var Popup = function Popup($) {
        var thus = Configurable.apply(this, [$]);
        var configs = {
            closeOnBackdropClick: true,
            css: {
                background: '#fff',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '320px',
                height: '180px',
                'z-index': '10001',
                overflow: 'hidden',
                display: 'none'
            }
        };

        function screenResizedHandler() {
            thus.setPosition();
        }

        function backdropClickedHandler() {
            if (configs.closeOnBackdropClick) {
                thus.hide();
            }
        }

        function initialize() {
            $.css(this.configs.css);
            $.listen({
                'ui>screen:resized': screenResizedHandler
            });
            this.hide();
            this.doInit();
        }

        function setPosition() {
            var screen = $.getScreenSize()
              , popupWidth = $.outerWidth()
              , popupHeight = $.outerHeight()
              , offset = { top: ((screen.y - popupHeight) / 2), left: ((screen.x - popupWidth) / 2) };

            $.css(offset);
            this.doSetPosition(offset);

            return this;
        }

        function show() {
            $.listen({ 'ui>$backdrop:clicked': backdropClickedHandler });
            $.notify({ type: 'ui>$backdrop:show', data: {} });
            this.setPosition().doShow();

            return this;
        }

        function hide() {
            this.doHide();
            $.notify({ type: 'ui>$backdrop:hide', data: {} });

            return this;
        }

        function destroy() {
            // detach event listeners etc
            this.doDestroy();
        }

        function doShow() {
            $.show();
            return this;
        }

        function doHide() {
            $.hide();
            return this;
        }

        // EXPORT TEMPLATE METHODS
        this.configs = configs;
        this.init = initialize;
        this.setPosition = setPosition;
        this.show = show;
        this.hide = hide;
        this.destroy = destroy;
        /* EXPORT HOOK METHODS */
        this.doInit = $.noop;
        this.doSetPosition = $.noop;
        this.doShow = doShow;
        this.doHide = doHide;
        this.doDestroy = $.noop;

        return this;
    };




    V('$backdrop', Backdrop)('$popup', Popup)('$process', function ProcessPending($) {
        var thus = Popup.apply(this, [$]);

        function initialize() {
            $.css({
                display: 'none'
            });

            // on 'ui>$process' -> fire 'ui>$backdrop:show'
        }

        function destroy() { }

        // export precepts
        this.init = initialize;
        this.destroy = destroy;

        return this;
    })('$alert', function Alert($) {
        var thus = Popup.apply(this, [$]);
        var $title, $message, $close;

        function showAlert(details) {
            setTitle(details.title);
            setMessage(details.message);
            thus.show();
        }

        function setTitle(title) {
            $title.html(title);
        }

        function setMessage(message) {
            $message.html(message);
        }

        function hideAlert() {
            thus.hide();
        }

        function initialize() {
            $title = $.find('.alert-title');
            $message = $.find('.alert-message');
            $close = $.find('.close');

            $close.css({  // leave this and all other styling to client code.
                position: 'absolute',
                bottom: '4px',
                right: '4px'
            });

            $close.addEvent('click', hideAlert);
            $.listen({
                'ui>$alert:show': showAlert,
                'ui>$alert:hide': hideAlert
            });

            //setTimeout(function () {
            //  $.notify({ type: 'ui>$alert:show', data: { title: "Don't Just Do Something!", message: "Stand There." } });
            //}, (1000 * 3));

        }

        function destroy() { }

        // export precepts
        this.doInit = initialize;
        this.doDestroy = destroy;

        return this;
    })('$modal', function Modal($) {
        var thus = Popup.apply(this, [$]);

        function initialize() {

        }

        function destroy() { }

        // export precepts
        this.init = initialize;
        this.destroy = destroy;

        return this;
    })('$repeat', function Repeat($) {
        var thus = Configurable.apply(this, [$])
          , tmpl = $.context
          , repeater = $.repeat(tmpl, []);

        function initialize() {
            var config = this.getConfigJSON();
            repeater.update(config.data).show();
        }
        function destroy() { }

        // export precepts
        this.init = initialize;
        this.destroy = destroy;

        return this;
    })('$include', function Include($) {
        var thus = this;
        var content;

        $.css({ display: 'none' });

        function initialize() {
            // $.notify: 'http>html:required', 'ui>html:found'
            // $.listen: 'ui>html:found', fn (content) { $.html(content) }
            //$.css({
            //    display: 'none'
            //});
        }

        function destroy() { }

        // export precepts
        this.init = initialize;
        this.destroy = destroy;

        return this;
    });

    ENV['Configurable'] = Configurable;

}).call(Vertices, Vertices);
