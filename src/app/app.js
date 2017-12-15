
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
    
    var Mediator = function Mediator(EventHub) {
        var thus = this;
        var hub = new EventHub();
        
        function handleDataChanged(channel, data) {
            hub.publish.apply(hub, arguments);
        }
        
        function publish(channel, data) {
            if (!channel) return this.utils.console.warn("Channel " + channel + " is an invalid channel name");
            if (channel in this.publishers) this.publishers.call(this, channel, data);
            else hub.publish.apply(hub, arguments);
            
            return this;
        }
        function subscribe(channel, handler) {
            if (!channel) return this.utils.console.warn("Channel " + channel + " is an invalid channel name");
            if (!handler) return this.utils.console.warn("Handler for " + channel + " is not valid");
            if (channel in this.subscribers) this.subscribers.call(this, channel, data);
            else hub.publish.apply(hub, arguments);
            
            return this;
        }
        function unsubscribe(channel, handler) {
            if (!channel) return this.utils.console.warn("Channel " + channel + " is an invalid channel name");
            if (!handler) return this.utils.console.warn("Handler for " + channel + " is not valid");
            if (channel in this.subscribers) this.subscribers.call(this, channel, data);
            else hub.publish.apply(hub, arguments);
            
            return this;
        }
        
        // export precepts
        this.channels; // required
        this.publishers; // required
        this.subscribers; // required
        this.publish = publish;
        this.subscribe = subscribe;
        this.unsubscribe = unsubscribe;
        
        return this;
    };
    var director = new (function Director(Mediator) {
        var thus = this;
        var channels = {
            'DATA:CHANGED': 'data/changed'
        };
        var publishers = {
            'data/changed': handleDataChanged.bind(this),
        };
        var subscribers = { };
        
        function handleDataChanged(channel, data) {
            hub.publish.apply(hub, arguments);
        }
        
        function init() {
            return this;
        }
        
        // export precepts
        Mediator.call(this, EventHub);
        this.init = init;
        this.channels = channels;
        this.publishers = publishers;
        this.subscribers = subscribers;
        
        return this;
    })(Mediator);
    
    var Sandbox = function Sandbox(director) {
        var thus = this;
        
        function publish(channel, data) {
            director.publish.apply(director, arguments);
            return this;
        }
        function subscribe(channel, data) {
            director.subscribe.apply(director, arguments);
            return this;
        }
        function unsubscribe(channel, data) {
            director.unsubscribe.apply(director, arguments);
            return this;
        }
        
        // export precepts
        Utils.call(this);
        this.publish = publish;
        this.subscribe = subscribe;
        this.unsubscribe = unsubscribe;
        
        return this;
    };
    
    var ServiceSandbox = function ServiceSandbox(utils) {
        var thus = this;
        
        // export precepts
        Sandbox.call(this, director);
        this.utils = utils;
        this.http = jQuery.ajax.bind(jQuery);
        
        return this;
    };
    
    var ComponentSandbox = function ComponentSandbox(element) {
        var thus = this;
        
        // export precepts
        Sandbox.call(this, director);
        this.target = element;
        this.element = new jQuery(element);
        
        return this;
    };
    
    var DataDecorator = function DataDecorator(data) {
        var data = data || { };
        
        jQuery.extend(this, data);
        this.dataset = data;
        
        return this;
    };
    
    var config = V.config({
        selector: '[data-behavior]',
        datasets: '[data-attribute]',
        target: document,
        bootstrap: function bootstrap(target) {
            var element = target;
            var selector = this.selector;
            var data = new DataDecorator(element.dataset);
            var ex = /[\s]+/img;
            var slug = data.behavior || element.v || '';
            var components = slug.split(ex);
            var children = element.children;// element.querySelectorAll(selector);
            
            var resolveScope = function resolveScope(parent, child) {
                var isDirectDescendant = (child.parentNode === parent);
                if (isDirectDescendant) bootstrap.call(this, child);
            }.bind(this, element);
            
            Array.prototype.forEach.call(children, resolveScope);  // TODO: Optimize!!!
            if (!!slug) components.forEach(this.bootstrap.bind(this, element, data));
        },
        decorators: {
            services: ServiceSandbox,
            components: ComponentSandbox
        },
    });
    
    V(function TestService($) {
        var thus = this;
        
        function init() {
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });
    
    V('include', function Include($) {
        var thus = this;
        
        console.log('@include', $);
        
        function handleTemplate(template) {
            console.log('@include#handleTemplate %o', template, config);
            $.element.after(template);
            // config.bootstrap($.target);  // Modules shouls NOT be using config, anyway. They should be using sandbox.
        }
        
        function init(data) {
            $.publish('include:initialized', { datum: true });
            console.log('@Include#init', $, data);
            $.element.load($.target.src, handleTemplate);
            // $.element.load(data.src);
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });
    
    V('childX', function Test($) {
        
        function init(data) {
            $.publish('child:initialized', { datum: true });
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });
    
    V('test', function Test($) {
        
        function init(data) {
            $.publish('test:initialized', { datum: true });
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });
    
    director.init();
    window.addEventListener( 'load', V.bootstrap.bind(V) );
    /**
     * RESOURCES:
     *      * https://www.w3schools.com/howto/howto_html_include.asp
     *      * https://www.html5rocks.com/en/tutorials/webcomponents/imports/
     */
}).call({ });

/**
 * CONCEPTS
 */
// var component = new V('some/path/to/template.html', { selector: 'widget' }, function Component($) {
//     // ...
// });

