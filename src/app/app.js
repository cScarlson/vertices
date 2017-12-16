
;(function iif() {
    
    
    var Utils = function Utils() {
        var thus = this;
        
        // export precepts
        this.debounce = new Function();
        this.timeout = setTimeout.bind(window);
        
        return this;
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
        
        var Scaffold = function Scaffold(element) {  // Interface
            var thus = this;
            
            function bootstrap(options) {  // V.bootstrap should only be available to Components
                V.bootstrap(options);
                return this;
            }
            
            // export precepts
            Sandbox.call(this, director);
            this.target = element;
            this.element = new jQuery(element);
            this.select = jQuery.bind(jQuery);
            this.bootstrap = bootstrap;
            
            return this;  // (f)
        };
        
        var f = Scaffold.call(function f(selector) {  // Default action
            var $element = f.element.find(selector), element = $element[0];
            return new ComponentSandbox(element);
        }, element);
        
        return f;
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
    
    
    // MODULES
    
    
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
        
        /**
         * @Intention: Handles bootstrapping after partial is loaded.
         * @Variance: A different handler can be used for different types of elements.
         *      * For a full list of elements that support automatic conversion of remote-source-attributes,
         *      * see: https://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value
         */
        function handleAnchorTemplate(template) {
            var $template = $('.app');
            $.element.replaceWith($template.element);
            $.bootstrap({ target: $template.target });
        }
        
        function init(data) {
            $.element.load($.target.href, handleAnchorTemplate);
            $.publish('include:initialized', { datum: true });
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });
    
    
    V('partial', function Partial($) {
        var thus = this;
        
        function handleBackgroundChanged(e, data) {
            if (data.datum) $.element.css({ 'background': 'orangered' });
        }
        
        function init(data) {
            var $h1 = $('h1');
            console.log('>--))>', $h1.element);
            
            setTimeout($h1.element.trigger.bind($h1.element, 'change-background'), 4000);
            $.element.on('background-changed', handleBackgroundChanged);
            $.publish('app:initialized', { datum: true });
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    })
    // Notice V() --> V: V(e)(t)(c);
    ('partial-child', function PartialChild($) {
        var thus = this;
        
        function handleCSS() {
            $.element.css({ 'background-color': '#fff', 'border-left': 'solid 1px orangered', 'color': '#333' });
            $.element.trigger('background-changed', { datum: true });
        }
        
        function init(data) {
            $.element.on('change-background', handleCSS);
            $.publish('child:initialized', { datum: true });
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });
    
    
    V('test', function Test($) {
        var thus = this;
        
        function init(data) {
            $.element.css({ 'background-color': '#fff', 'border-left': 'solid 1px orangered', 'color': '#333' });
            $.publish('test:initialized', { datum: true });
            return this;
        }
        
        // export precepts
        this.init = init;
        
        return this;
    });
    
    
    director.init();
    window.addEventListener( 'load', V.bootstrap.bind(V, { target: document }) );
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

