
;(function (undefined) {
    'use strict';
    if (undefined) return;
    var ENV = this || {};
    
    var Core = function Core($) {
        var thus = this;
        var EventHub = $.EventHub;
        var utils = $.utils
          , hub = new EventHub()
          ;
        var _components = {};
        var _services = {};
        var _Director = null;
        var _configuration = {  // ... defaults
            bootstrap: _defaultBootstrap
        };  // TODO: [ Safely & abstractly ] automate configuration as much as possible
        
        function _defaultBootstrap(root, medium) {
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
        
        function configure(config) {
            this.utils.extend(_configuration, config);
            return this;
        }
        
        function registerComponent(id, Component) {
            var component = { id: id, Constructor: Component };
            _components[id] = _components[id] || component;
            return this;
        }
        function registerService(Service) {
            var id = Service.constructor;
            var service = { id: id, Constructor: Service };
            _services[id] = _services[id] || service;
            
            return this;
        }
        function registerDirector(Director) {
            if (_Director) return this; 
            Director.prototype = this;  // thus === [[core]]
            _Director = Director;
            
            return this;
        }
        
        /**
         * bootstrap
         * @intent: initializes Director
         * @note: #stack; director.init --> this.init --> this.arm --> config.bootstrap 
         */
        function bootstrap(config) {
            var config = config || _configuration
              , decorators = config.decorators
              , DirectorSandbox = decorators.director
              , ServiceSandbox = decorators.services
              , Director = _Director
              , sandbox = new DirectorSandbox(_services)
              ;
              
            (this, config);
            this.configure(config);
            this.director = new Director(this);
            this.director.init();  // usage invokes this.init
            
        }
        function automaticModuleRegistration() {
            var config = config || _configuration
              , $bootstrap = config.bootstrap
              , target = config.target
              , decorators = config.decorators
              ;
            var $ = { target: target };
            
            $bootstrap.call(this, $, target);
        }
        
        function mount(element, id) {
            if (!id || !element) return this;
            if (!_components[id]) return this;
            
            (this, element, id);
            var director = this.director;
            var config = _configuration
              , decorators = config.decorators
              , ComponentSandbox = decorators.components
              ;
            var _component = _components[id]
              , Component = _component.Constructor
              ;
            var $ = {
                element: element,
                director: director,
            };
            var sandbox = new ComponentSandbox($)
              , component = new Component(sandbox)
              ;
            component.init();
            
            return this;
        }
        
        function init() {
            this.arm();
            this.registerComponent = this.utils.noop;
            this.registerService = this.utils.noop;
            this.registerDirector = this.utils.noop;
            
            return this;
        }
        
        // export precepts
        this.hub = hub;
        this.utils = utils;
        this.director = null;
        this.configure = configure;
        this.components = _components;
        this.services = _services;
        this.registerComponent = registerComponent;
        this.registerService = registerService;
        this.registerDirector = registerDirector;
        this.bootstrap = bootstrap;
        this.arm = automaticModuleRegistration;
        this.mount = mount;
        this.init = init;
        
        return this;
    };
    
    var Facade = function Facade(core) {
        var thus = this;
        
        function configure() {
            core.configure.apply(core, arguments);
            return this;
        }
        function director(Director) {
            core.registerDirector.apply(core, arguments);
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
            var method = { '$component': 'component', '$service': 'service', '$director': 'director' }[ id ]
              , method = method || { 'function': 'service', 'string': 'component' }[ typeof id ]
              ;
            this[method].apply(this, arguments);
            
            return this;
        }
        
        function bootstrap(config) {
            core.bootstrap(config);
            return this;
        }
        
        // export precepts
        this.utils = core.utils;
        this.config = configure;
        this.director = director;
        this.service = service;
        this.component = component;
        this.register = register;
        this.bootstrap = bootstrap;
        
        return this;
    };
    
    /**
     * API
     */
    var Vertex = new (function Vertices(Core, Facade, EventHub, Utils) {
        var utils = new Utils();
        var $ = { EventHub: EventHub, utils: utils };
        
        var V = Facade.call(function V(config) {
            if (this instanceof V) return ( new Vertices(Core, Facade, Utils) ).config(config);
            return V.register.apply(V, arguments);
        }, new Core($));
        
        return V;
    })(Core, Facade, this.EventHub, this.Utils);
    
    ENV['V'] = ENV['Vertices'] = Vertex;
}).call(this);
