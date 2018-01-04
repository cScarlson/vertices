
;(function save() {
    function defaultBootstrap(root, medium) {
        var scopeSelector = '[data-behavior]'
          , $root = $(root)
          , $parent = $root.find(scopeSelector)
          , hasBehavior = $root.is(scopeSelector)
          ;
        var slug = $root.attr('data-behavior')
          , formattedSlug = slug && slug.replace(/^[,;\s]+|[,;\s]+$/g, '').replace(/[,;\s]+/g, '|').replace(/[|]+$/g, '') || ''
          , moduleIds = $.unique(formattedSlug.split('|')).sort()
          , scopeId = moduleIds.join(' ')
          ;
        var childMedium = medium.$spawn(new function ChildScope() { this.element = root; });
        

        var resolveBehavior = function resolveBehavior(scope, behavior, i, a) {
            var scope = ($root.is('html')) ? document : scope;
            this.start(behavior, scope, scopeId, childMedium);
        }.bind(this, $root[0]);

        var resolveChildren = function resolveChildren(i, scope) {
            var $firstScope = $(scope);
            if (!$($firstScope.parent()).is($parent)) {
                autoRegisterModules.call(this, $firstScope, childMedium);
            }

        }.bind(this);

        moduleIds.forEach(resolveBehavior);
        $parent.each(resolveChildren);

    }
})();

var ENV = window || this;
;(function iif(undefined) {
    'use strict';
    if (!!undefined) return;
    var ENV = this;
    
    var utils = new function Utils() {
        
        function extend(target) {
            var objects = Array.prototype.slice.call(arguments, 1);
            var object = objects.shift(), args = [target].concat(objects);
            
            for (var key in object) {
                var value = object[key];
                target[key] = target[key] || { };
                if ({ 'Object': true }[value.constructor.name]) extend(target[key], value);
                else target[key] = value;
            }
            
            if (!objects.length) return target;
            return extend.apply(this, args);
        }
        
        function escapeHTML(s) {
            return s.replace(/[&"<>]/g, function (c) {
                return {
                    '&': '&amp;',
                    '"': '&quot;',
                    '<': '&lt;',
                    '>': '&gt;'
                }[c];
            });
        }

        /**
         * @ THX: Douglas Crockford (String.prototype.supplant)
         * @ INTERPOLATE
         */
        function interpolate(str) {
            return function interpolate(o) {
                return str.replace(/{([^{}]*)}/g, function (a, b) {
                    var r = o[b], val = (typeof r === 'string' || typeof r === 'number' ? r : a);
                    return escapeHTML(val);  // TODO: escape HTML-Entities
                });
            }
        }

        /**
         * @ THX: Douglas Crockford (String.prototype.supplant)
         * @ INSECURE_INTERPOLATE
         */
        function INSECURE_INTERPOLATE(str) {
            return function interpolate(o) {
                return str.replace(/{([^{}]*)}/g, function (a, b) {
                    var r = o[b], val = (typeof r === 'string' || typeof r === 'number' ? r : a);
                    return val;  // TODO: escape HTML-Entities
                });
            }
        }

        // #ThxRemy!
        // https://remysharp.com/2010/07/21/throttling-function-calls
        function debounce(fn, delay) {
            var timer = null;
            return function () {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        }
        
        // #ThxRemy!
        // https://remysharp.com/2010/07/21/throttling-function-calls
        function throttle(fn, threshhold, scope) {
            threshhold || (threshhold = 250);
            var last,
                deferTimer;
            return function () {
                var context = scope || this;

                var now = +new Date,
                    args = arguments;
                if (last && now < last + threshhold) {
                    // hold on to it
                    clearTimeout(deferTimer);
                    deferTimer = setTimeout(function () {
                        last = now;
                        fn.apply(context, args);
                    }, threshhold);
                } else {
                    last = now;
                    fn.apply(context, args);
                }
            };
        }
        
        /**
         * @ URLComponents
         */
        var URLComponents = function URLComponents(url) {
            var parser = document.createElement('a');
            parser.href = url;

            this.hash = parser.hash;
            this.host = parser.host;
            this.hostname = parser.hostname;
            this.href = parser.href;
            this.origin = parser.origin;
            this.pathname = parser.pathname;
            this.port = parser.port;
            this.protocol = parser.protocol;
            this.search = parser.search;

            return this;
        };
        var ParameterMap = function ParameterMap(str) {
            var pair = str.split('=');
            this.name = pair[0];
            this.value = pair[1];
            return this;
        };
        var QueryMap = function QueryMap(q) {
            var query = decodeURIComponent(q);
            var exp = /[^\?|\&]([^=]+)\=([^&]+)/g;
            var res = query.match(exp);

            for (var i = 0, len = res.length; i < len; i++) {
                var map = new ParameterMap(res[i]);
                this[map.name] = map.value;
            }

            return this;
        };
        
        /**
         * @ EXTERPOLATE | PARSE ROUTE-URI
         */
        function exterpolate(str) {
            var str = str || '';
            var re = /:[^\s/]+|{+[^\s/]+}+/g;
            var matcher = new RegExp(str.replace(re, '([\\w-]+)'));

            return function getValues(string) {
                if (!string.match(matcher)) return false;
                var string = string || '';
                var result = string.match(matcher);
                var keys = str.match(re);
                var values = result.slice(1);
                var map = {};

                if (keys && values) {
                    for (var i = 0, len = keys.length; i < len; i++) {
                        var key = keys[i].replace(/[:{}]+/g, '');
                        var val = values[i];
                        if (key !== val) map[key] = val;
                    }
                }

                return map;
            };
        }
        
        // export precepts
        this.console = window.console;
        this.extend = extend;
        this.interpolate = interpolate;
        this.INSECURE_INTERPOLATE = INSECURE_INTERPOLATE;
    };
    
    var Core = function Core($) {
        var thus = this;
        var utils = $.utils;
        var services = { };
        var components = { };
        var configuration = {  // ... defaults
            selector: '[data-v]' || '[data-behavior]',
            datasets: '[v-attribute]',  // includes <script type="application/json"> { items: [...] } </scrpt>
            bootstrap: function defaultBootstrap(target) {
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
                services: function DefaultServicesSandbox(utils) { return utils; },
                components: function DefaultComponentSandbox(element) { return element; },
            }
        };
        
        function configure(config) {
            this.utils.extend(this.configuration, config);
            return this.utils.extend({ }, this.configuration);
        }
        function registerService(Service) {
            var id = Service.constructor;
            var service = { id: id, Constructor: Service };
            this.services[id] = this.services[id] || service;
            
            return this;
        }
        function registerComponent(id, Component) {
            var component = { id: id, Constructor: Component };
            this.components[id] = this.components[id] || component;
            return this;
        }
        
        function automaticallyRegisterModules(options) {
            var config = this.configuration
                , bootstrap = config.bootstrap
                , target = options.target
                ;
            
            this.startServices();
            bootstrap.call(config, target, this);
        }
        
        function startServices() {
            var config = this.configuration
                , decorators = config.decorators
                , ServiceSandbox = decorators.services
                ;
            
            for (var id in this.services) {
                var _service = this.services[id]
                    , Service = _service.Constructor
                    , sandbox = new ServiceSandbox(utils)
                    , service = new Service(sandbox)
                    ;
                service.init();
            }
            
            return this;
        }
        
        /**
         * Gets called by this.configuration.bootstrap
         * TODO: Rename `details` to `api` and provide an API for mapping, starting, stopping & destroying (etc) modules.
         */
        function bootstrap(element, data, id) {
            if (!element || !id) return null;
            if (!this.components[id]) return utils.console.warn("Unregistered Component: " + id) && null || null;
            
            var config = this.configuration
                , decorators = config.decorators
                , ComponentSandbox = decorators.components
                ;
            var component = this.components[id]
                , Component = component.Constructor
                , sandbox = new ComponentSandbox(element)
                , instance = new Component(sandbox)
                , data = data || { }
                ;
            var details = {
                id: id,
                instance: instance,
                element: element,
                data: data,
            };
            instance.init(data);
            
            return details;
        }
        
        function init(options) {
            if (!options) throw Error("Vertices Core initialized without options");
            this.arm(options);
            this.registerComponent = this.utils.noop;
            this.registerService = this.utils.noop;
            
            return this;
        }
        
        // export precepts
        this.utils = utils;
        this.configuration = configuration;
        this.services = services;
        this.components = components;
        this.configure = configure;
        this.registerService = registerService;
        this.registerComponent = registerComponent;
        this.arm = automaticallyRegisterModules;
        this.startServices = startServices;
        this.bootstrap = bootstrap;
        this.init = init;
        
        return this;
    };
    
    var Facade = function Facade(core) {
        var thus = this;
        
        function configure() {
            return core.configure.apply(core, arguments);
        }
        function service(Service) {
            core.registerService.apply(core, arguments);
            return this;
        }
        function component(id, Component) {
            core.registerComponent.apply(core, arguments);
            return this;
        }
        
        function register(id, Component) {
            var method = { '$component': 'component', '$service': 'service' }[ id ]
                , method = method || { 'function': 'service', 'string': 'component' }[ typeof id ]
                ;
            this[method].apply(this, arguments);
            
            return this;
        }
        
        function bootstrap(options) {
            core.init(options);
            return this;
        }
        
        // export precepts
        this.utils = core.utils;
        this.config = configure;
        this.service = service;
        this.component = component;
        this.register = register;
        this.bootstrap = bootstrap;
        
        return this;
    };
    
    /**
     * API
     */
    var Vertex = new (function Vertices(Core, Facade, utils) {
        var $ = { utils: utils };
        
        var V = Facade.call(function V() {
            if (this instanceof V) return ( new Vertices(Core, Facade, utils) );
            return V.register.apply(V, arguments);
        }, new Core($));
        
        return V;
    })(Core, Facade, utils);
    
    ENV['V'] = ENV['Vertices'] = Vertex;
}).call(ENV);
