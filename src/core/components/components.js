

/* ================================================================================================================
    Core Components
    :: Split these files appropriately as growth occurs e.g: /components/backdrop.js, ... etc
   ================================================================================================================ */

;(function (V, undefined) {


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
                'z-index': '999',
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
            var json, js;
            $config = $('._config');
            json = $config.html();
            //js = JSON.parse(json);
            //config = $.extend(config, js);
            //
            //console.log(json);
            //console.log(config);
            //
            //setTimeout(function () {
            //  $.notify({
            //    type: 'ui>$backdrop:show', data: { "":"" }
            //  });
            //  console.log('?notify');
            //}, (1000 * 2));

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

    var Popup = function Popup() {
        var thus = this;

        function noop() { }

        function initialize() {
            this.doInit();
        }

        function destroy() { }

        // export precepts
        this.init = initialize;
        this.doInit = noop;
        this.destroy = destroy;

        return this;
    };

    var ProcessPending = function ProcessPending($) {
        var thus = this;

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
    };

    var Alert = function Alert($) {
        var thus = this;

        function initialize() {
            $.hide();

            // on 'ui>$alert' -> fire 'ui>$backdrop:show'
            // Alert.prototype.init();
        }

        function destroy() { }

        // export precepts
        this.doInit = initialize;
        this.destroy = destroy;

        return this;
    };
    Alert.prototype = new Popup();

    var Modal = function Modal($) {
        var thus = this;

        function initialize() {
            $.css({
                display: 'none'
            });

            // on 'ui>$alert' -> fire 'ui>$backdrop:show'
        }

        function destroy() { }

        // export precepts
        this.init = initialize;
        this.destroy = destroy;

        return this;
    };

    var Include = function Include($) {
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
    };

    V('$backdrop', Backdrop)('$popup', Popup)('$process', ProcessPending)('$alert', Alert)('$modal', Modal)('$include', Include);


})(Vertices);
