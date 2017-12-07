
// IoT
;(function () {
    'use strict';
    
    // var wifi = new function Wifi() {
    //     this.connect = function c() {};
    // };
    // var bluetooth = new function Bluetooth() {
    //     this.connect = function c() {};
    // };
    // var file = new function File() {
    //     this.read = function c() {};
    // };
    
    
    // var Utils = function Utils() {
    //     this.debounce = new Function();
    //     this.http = { get: new Function() };
    // };
    
    
    // var ComponentSandbox = function ComponentSandbox(module) {
    //     this.connect = function c() { module.connect.apply(module, arguments); return this; };
    // };
    // var ServiceSandbox = function ServiceSandbox(utils) {
    //     this.connect = function c() {};
    // };
    // var DirectorSandbox = function DirectorSandbox(services) {
    //     this.read = function c() {};
    // };
    
    
    // var decorators = {
    //     components: ComponentSandbox,
    //     services: ServiceSandbox,
    //     director: DirectorSandbox,
    // };
    
    // var configuration = {
    //     targets: [ wifi, bluetooth, file ],
    //     map: map,
    //     decorators: decorators,
    //     utils: new Utils(),
    // };
    
    // function map(modules) {
    //     modules.forEach(function m(module) {
            
    //     });
    // }
    
    // V.config(configuration);
    // // var V = new V(configuration);
    
})();

// DOM
;(function () {
    'use strict';
    // ATTENTION!
    // TODO: Design better Configuration and better Bootstrapping
    
    var Utils = function Utils() {
        this.debounce = new Function();
        this.timeout = setTimeout.bind(window);
    };
    
    
    var EventHub = function EventHub($) {
        var thus = this;
        
        function publish(channel) {
            $.publish.apply($, arguments);
            return this;
        }
        
        function subscribe(channel, handler) {
            $.subscribe.apply($, arguments);
            return this;
        }
        
        // export precepts
        this.channels = $.channels;
        this.publish = publish;
        this.subscribe = subscribe;
        
        return this;
    };
    
    var ComponentSandbox = function ComponentSandbox($) {
        var thus = this;
        var element = $.element, director = $.director;
        var $el = new jQuery(element);
        
        function publish(channel) {
            director.publish.apply(director, arguments);
            return this;
        }
        
        function subscribe(channel, handler) {
            director.subscribe.apply(director, arguments);
            return this;
        }
        
        function css() {
            $el.css.apply($el, arguments);
            return this;
        }
        
        // export precepts
        EventHub.call(this, director);
        this.id = element.id;
        this.css = css;
        
        return this;
    };
    var ServiceSandbox = function ServiceSandbox($) {
        var thus = this;
        var http = $.http, director = $.director;
        
        // export precepts
        EventHub.call(this, director);
        
        return this;
    };
    var DirectorSandbox = function DirectorSandbox(services) {
        var services = services || [];
        
        function start(sandbox, data) {
            var Service = data.Constructor;
            // ... _configuration.decorators.services
        }
        
        function init(sandbox) {
            for (var id in this.services) {
                var data = this.services[id];
                this.start(sandbox, data);
            }
            return this;
        }
        
        // export precepts
        this.services = services;
        this.init = init;
        
        return this;
    };
    
    
    var decorators = {
        components: ComponentSandbox || 'ComponentSandbox',  // Hard or soft reference
        services: ServiceSandbox || 'ServiceSandbox',  // Hard or soft reference
        director: DirectorSandbox || 'DirectorSandbox',  // Hard or soft reference
        all: 'EventHub'  // Hard or soft reference
    };
    
    var configuration = {
        target: document,
        bootstrap: bootstrap,
        decorators: decorators,
    };
    
    function bootstrap($, element) {
        var element = element;
        var selector = '[data-behavior]';
        var data = element.dataset || {};
        var ex = /[\s]+/img;
        var slug = data.behavior || element.v || '';
        var components = slug.split(ex);
        var children = element.children;// element.querySelectorAll(selector);
        (this, document, data, slug, components, children);
        
        var resolveScope = function resolveScope(parent, child) {
            var isDirectDescendant = (child.parentNode === parent);
            (this, parent, child, isDirectDescendant);
            if (isDirectDescendant) bootstrap.call(this, $, child);
        }.bind(this, element);
        
        // components.forEach(this.mount.bind(this, element));
        // Array.prototype.forEach.call(children, resolveScope);
        
        // ... or? ...
        
        Array.prototype.forEach.call(children, resolveScope);  // TODO: Optimize!!!
        if (!!slug) components.forEach(this.mount.bind(this, element));
    }
    
    V.config(configuration);
    // var V = new V(configuration);
    // V(ComponentSandbox)(ServiceSandbox)(DirectorSandbox);  // Hard or soft reference
    
    
    V.director(function Director(services) {
        var thus = this;
        var channels = {
            'SOMETHING:CHANGED': 'something/changed'
        };
        var handlers = {
            'something/changed': handleSomethingChanged.bind(this),
        };
        
        function init() {
            Director.prototype.init();
            return this;
        }
        
        function publish(channel) {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(this.hub);
            this.utils.timeout(this.hub.publish.bind.apply(this.hub.publish, args), 0);
            // hack (component.init() needs to happen in parallel after boostrap)
            
            return this;
        }
        function subscribe(channel, handler) {
            this.hub.subscribe.apply(this.hub, arguments);
            return this;
        }
        
        // HANDLERS
        function handleSomethingChanged() {}
        
        // export precepts
        this.channels = channels;
        this.init = init;
        this.publish = publish;
        this.subscribe = subscribe;
        
        return this;
    });
    
    V('document', function DocumentComponent($) {
        var thus = this;
        
        function init(data) {
            console.log('#DocumentComponent #init', $);
            $.subscribe($.channels['SOMETHING:CHANGED'], function t(e, data) {
                console.log('#document', e, data);
            });
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });
    
    V('test', function TestComponent($) {
        var thus = this;
        
        function init(data) {
            // console.log('#TestComponent #init', $);
            $.publish($.channels['SOMETHING:CHANGED'], $.id);
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });
    
    V('example', function ExampleComponent($) {
        var thus = this;
        
        function init(data) {
            console.log('#ExampleComponent #init', $);
            $.css({ background: 'orangered' });
            $.subscribe($.channels['SOMETHING:CHANGED'], function t(e, data) {
                console.log('#example', e, data);
            });
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });
    
    Utils.call(V.utils);
    window.onload = V.bootstrap.bind(V, configuration);
    
})();


// DOM
;(function iif() {
    
    
    var Utils = function Utils() {
        this.debounce = new Function();
        this.timeout = setTimeout.bind(window);
    };
    
    var EventHub = function EventHub() {
        var thus = this;
        var channels = { };
        
        function publish(channel) {
            console.log('publish', arguments);
            return this;
        }
        
        function subscribe(channel, handler) {
            console.log('subscribe', arguments);
            return this;
        }
        
        function unsubscribe(channel, handler) {
            console.log('unsubscribe', arguments);
            return this;
        }
        
        // export precepts
        this.channels = channels;
        this.publish = publish;
        this.subscribe = subscribe;
        this.unsubscribe = unsubscribe;
        
        return this;
    };
    
    var Director = function Director() {
        var thus = this;
        var hub = new EventHub();
        var channels = {
            'DATA:CHANGED': 'data/changed'
        };
        var publishers = {
            'data/changed': handleDataChanged.bind(this),
        };
        
        function publish() {
            // hub.publish.apply();
        }
        // ... subscribe() unsubscribe()
        
        // export precepts
        this.publish = publish;
        
        return this;
    };
    
    var Sandbox = function Sandbox(director) {
        var thus = this;
        
        // export precepts
        // ...
        
        return this;
    };
    
    V.config({
        selector: '[data-behavior]',
        target: document,
        bootstrap: function bootstrap(target) {
            var element = target;
            var selector = this.selector;
            var data = element.dataset || {};
            var ex = /[\s]+/img;
            var slug = data.behavior || element.v || '';
            var components = slug.split(ex);
            var children = element.children;// element.querySelectorAll(selector);
            (this, document, data, slug, components, children);
            
            var resolveScope = function resolveScope(parent, child) {
                var isDirectDescendant = (child.parentNode === parent);
                (this, parent, child, isDirectDescendant);
                if (isDirectDescendant) bootstrap.call(this, child);
            }.bind(this, element);
            
            // components.forEach(this.bootstrap.bind(this, element));
            // Array.prototype.forEach.call(children, resolveScope);
            
            // ... or? ...
            
            Array.prototype.forEach.call(children, resolveScope);  // TODO: Optimize!!!
            if (!!slug) components.forEach(this.bootstrap.bind(this, element));
        },
        decorators: {
            components: ComponentSandbox
        },
    });
    
})();

