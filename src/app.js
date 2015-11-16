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

        //alert("NOTE: Design a conjunction between new V() instances for communication -- probably an .$installTo operation.\n\nAre $APPs Apps? $HUBs? Is the conjuction a $MEDIATOR? $DIRECTOR?");
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
