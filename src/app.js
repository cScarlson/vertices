/**
 * Application Director
 * @ Intent: Extends Core for proprietary, Dependency-Inversive control for dynamic runtime logic, encapsulation of Root-Scope logic,
 * *         and management low-level MLC/security along with any other complexity of its suprastructure.
 */
;Vertices.register('$APP', function ApplicationDirector($) {
    var thus = this;
    var channels = {
        core: {
            '$core://created/module': moduleCreatedHandler,
            '$core://stopped/module': moduleStoppedHandler
        },
        app: {
            hashchange: {
                'core>window.location.hash:change': hashChangeHandler
            }
        }
    };

    function init() {
        this.register_events(channels.core);

        $.addEvent('hashchange', onHashChange).listen(channels.app.hashchange);
        this.$on('test', function (e, data) {
            console.log('@APP#test', this, $.context[0]);
        });

        ApplicationDirector.prototype.init();
    }

    function moduleCreatedHandler(mod) {
        // this.log(mod); -- OR -- Rather, $.notify({ type: 'log://[my-log-level]', data: mod.id });
    }

    function moduleStoppedHandler(mod) {
        // this.log(mod); -- OR -- Rather, $.notify({ type: 'log://[my-log-level]', data: mod.id });
    }

    function onHashChange(e) {
        var originalEvent = e.originalEvent
          , oldURL = originalEvent.oldURL
          , newURL = originalEvent.newURL
          , oldComponents = thus.parse_uri(oldURL)
          , newComponents = thus.parse_uri(newURL)
        ;

        $.notify({ type: 'core>window.location.hash:change', data: { oldURL: oldComponents, newURL: newComponents } });
    }

    function hashChangeHandler(data) {
        // data.oldURL.hash, data.newURL.href, ...
    }

    function destroy() {
        // this.stop_all();
        this.remove_events(channels.core);
    }

    // export precepts
    this.init = init;
    this.destroy = destroy;

    return this;
});

V.register('$backdrop', function Backdrop($) {
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
});

var Popup = function Popup($) {  // TODO: Note, $alert, $prompt & $confirm (etc) should extend Popup
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

V('$popup', Popup)('$process', ProcessPending)('$alert', Alert)('$modal', Modal);

var mod = new V(function Core() {
    var thus = this;

    this.id = 'the-core';

    return this;
});


//V.data({  // equivalent: V['data' | null]('$APP', { ... })
//    app: 'configs'
//});

//V('person', {
//    name: 'Name not found',
//    height: '6`2'
//});
