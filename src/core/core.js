
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

;(function (undefined) {
    'use strict';
    if (undefined) return;
    var ENV = this || {};
    
    var utils = new function Utils() {
        
        function extend(target) {
            var objects = Array.prototype.slice.call(arguments, 1);
            var object = objects.shift(), args = [target].concat(objects);
            
            for (var key in object) {
                var value = object[key];
                if ({ 'Object': true }[value.constructor.name]) extend(target[key], value);
                else target[key] = value;
            }
            
            if (!objects.length) return target;
            return extend.apply(this, args);
        }
        
        // export precepts
        this.console = window.console;
        this.extend = extend;
    };
    
    var Core = function Core($) {
        var thus = this;
        var utils = $.utils;
        var _services = { };
        var _components = { };
        var _configuration = {  // ... defaults
            selector: '[v]',
            target: document,
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
            this.utils.extend(_configuration, config);
            return this;
        }
        function registerService(Service) {
            var id = Service.constructor;
            var service = { id: id, Constructor: Service };
            _services[id] = _services[id] || service;
            
            return this;
        }
        function registerComponent(id, Component) {
            var component = { id: id, Constructor: Component };
            _components[id] = _components[id] || component;
            return this;
        }
        
        function automaticallyRegisterModules() {
            var config = _configuration
              , bootstrap = config.bootstrap
              , target = config.target
              ;
            
            this.startServices();
            bootstrap.call(this, target);
        }
        
        function startServices() {
            var config = _configuration
              , decorators = config.decorators
              , ServiceSandbox = decorators.services
              ;
            
            for (var id in _services) {
                var _service = _services[id]
                  , Service = _service.Constructor
                  , sandbox = new ServiceSandbox(utils)
                  , service = new Service(sandbox)
                  ;
                service.init();
            }
            
            return this;
        }
        
        /**
         * Gets called by _configuration.bootstrap
         */
        function bootstrap(element, id) {
            if (!id || !element) return this;
            if (!_components[id]) return utils.console.warn("Unregistered Component: " + id);
            
            var config = _configuration
              , decorators = config.decorators
              , ComponentSandbox = decorators.components
              ;
            var _component = _components[id]
              , Component = _component.Constructor
              , sandbox = new ComponentSandbox(element)
              , component = new Component(sandbox)
              , data = element.dataset || { }
              ;
            component.init(data);
            
            return this;
        }
        
        function init() {
            this.arm();
            this.registerComponent = this.utils.noop;
            this.registerService = this.utils.noop;
            
            return this;
        }
        
        // export precepts
        this.utils = utils;
        this.configure = configure;
        this.services = _services;
        this.components = _components;
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
            core.configure.apply(core, arguments);
            return this;
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
        
        function bootstrap() {
            core.init();
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
}).call(this);
