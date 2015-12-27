
/* ======================================================
 #CORE
 ====================================================== */
; (function (jQuery, Utilities, Debugger, Mediator, EventHubAdapter, DocumentUtilities, TemplateRepeat, ComponentSandbox, ServiceSandbox, undefined) {
    if (undefined) { undefined = null; return; }
    var ENV = this;

    /**
     * @ _CORE
     */
    var Core = function Core() {
        var thus = this;

        function __extendModule(Module, mixins, sandbox) {
            var mixins = mixins || [];
            function extend(id) {
                var Mixin = __getModule(id);
                Mixin.apply(Module.prototype, [sandbox]);
            }
            mixins.forEach(extend);

            return Module;
        }

        var __getModule = function __getModule(id) {
            var mod = this.modules[id];
            return mod && mod.Module;
        }.bind(this);



        function configure(object) {
            jQuery.extend(true, this.settings, object);
            return this;
        }

        function registerDirector(Director) {
            if (!Director || !Director.call) return;
            var sandbox = new ComponentSandbox(this, 'root_scope', window);

            this.log(1, "REGISTERING DIRECTOR");
            this.log(1, "CONSTRUCTING DIRECTOR");

            Director.prototype = this;
            this.Director = Director;
            this.director = new Director(sandbox);
            this.log(1, "INITIALIZING DIRECTOR");
            this.director.init();  // calls this.init as Director.prototype === this. Uses Template Method Pattern
            this.register_director = this.noop;
            
            return this;
        }

        function registerValue(key, value) {
            this.values[key] = value;
            return this;
        }

        function registerComponent(moduleId, Module, mixins) {

            if (moduleId && moduleId.charAt && Module && Module.call) {
                this.log(1, "REGISTERING MODULE : " + moduleId);
                this.modules[moduleId] = {  // TODO: Register should create a promise whose onFulfill-handler constructs an object.
                    Module: Module,
                    id: moduleId,
                    instances: [],
                    mixins: mixins || []
                };
            } else {
                this.log(1, "Module '" + to_s(moduleId) + "' Registration : FAILED : one or more arguments are of incorrect type")
            }

            return this;
        }

        function registerService(Service) {
            var id = this.generate_uuid();
            var sandbox = new ServiceSandbox(), instance;
            sandbox.settings = this.settings[Service.name];
            sandbox.http = this.http;
            this.$split(Service.prototype);
            instance = new Service(sandbox);
            this.modules[id] = {
                Module: Service,
                id: id,
                instances: [instance]
            };
            instance.init(sandbox);

            return this;
        }

        function getScopeData(moduleId, context) {
            var selectorTemplate = 'script[type="application/json"][data-config="{id}"]'
              , configSelector = this.interpolate(selectorTemplate)({ id: moduleId });
            var $el
              , $config
              , $data = {}
              , data = {}
              , value = this.values[moduleId]
              ;

            if (context === document) {
                $el = jQuery('html')
            } else {
                $el = jQuery(context);
            }

            if ($el && $el.size()) {
                $config = $el.find(configSelector);
                $data = $el.data();

                if ($config && $config.size()) {
                    this.extend(data, JSON.parse($config.html()));
                }

                this.extend(data, $data);

            }

            this.extend(data, { settings: value });
            delete data.behavior

            return data;
        }

        function start(moduleId, context, scopeId, medium) {  // TODO: Start should resolve a promise whose onFulfill-handler constructs an object.
            var mod = this.modules[moduleId]
              , Module
              , sandbox
              , instance
              , data = this.get_scope_data(moduleId, context)
              , mixins = mixins || []
              , details
              ;

            if (mod) {
                this.log(1, "CONSTRUCTING MODULE : " + moduleId);
                Module = mod.Module;
                sandbox = new ComponentSandbox(this, moduleId, context);

                __extendModule(Module, mixins, sandbox);

                instance = new Module(sandbox);
                details = { module: mod, instance: instance, data: data };
                
                this.trigger_event({ type: '$core://created/module', data: details });

                if (instance && instance.init && instance.destroy) {
                    this.log(1, "INITIALIZING MODULE : " + moduleId);
                    mod.instances.push({ instance: instance, data: data });
                    medium.$installTo(instance);
                    instance.init(data);
                } else {
                    this.log(1, "Module '" + moduleId + "' Registration : FAILED : instance has no init or destroy functions");
                }

            }

            return this;
        }

        function stop(moduleId) {
            var data;

            if (data = this.modules[moduleId] && data.instance) {
                data.instance.destroy;
                data.instance = null;

                this.trigger_event({ type: '$core://stopped/module', data: data });
            } else {
                this.log(1, "Stop Module '" + moduleId + "': FAILED : module does not exist or has not been started");
            }

            return this;
        }

        function startAll() {
            var moduleId;
            this.log(1, modulethis.modulesData);
            for (moduleId in this.modules) {
                if (this.modules.hasOwnProperty(moduleId)) {
                    this.start(moduleId);
                }
            }
        }

        function stopAll() {
            var moduleId;

            for (moduleId in mothis.modulesduleData) {
                if (this.modules.hasOwnProperty(moduleId)) {
                    this.stop(moduleId);
                }
            }

            return this;
        }

        function templateRepeat(template, collection) {
            var uuid = jQuery(template).data('uuid') || this.generate_uuid();
            console.log('\n\n', uuid);
            return new TemplateRepeat(template, collection, this.interpolate, uuid);
        }

        function autoRegisterModules(root, medium) {
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

        function initialize(selector) {
            var thus = this;
            var selector = selector || 'html'
              , $root = $(selector);

            this.log(1, "INITIALIZING CORE");

            $(document).ready(function () {
                thus.log(1, "ARM (AUTOMATIC MODULE REGISTRATION)");
                thus.arm($root[0], thus);
            });

            this.doInit();

            return this;
        }
        
        function doInitialize(hookMethod) { }

        // export precepts
        Debugger.apply(this);
        Utilities.apply(this);
        Mediator.apply(this);
        EventHubAdapter.call(this, new Mediator());
        // #convenience
        this.tpl = this.template;
        this.repeat = this.templateRepeat;

        this.event_hub = new EventHubAdapter(this);
        this.http = new HTTP();
        this.dom = new DocumentUtilities();
        this.Director = null;
        this.director = null;
        this.settings = {};
        this.values = {};
        this.modules = {};
        this.register_configuration = configure;
        this.register_director = registerDirector;
        this.register_value = registerValue;
        this.register_component = registerComponent;
        this.register_service = registerService;
        this.get_scope_data = getScopeData;
        this.start = start;
        this.stop = stop;
        this.start_all = startAll;
        this.stop_all = stopAll;
        this.template_repeat = templateRepeat;
        this.arm = autoRegisterModules;
        this.init = initialize;
        this.doInit = doInitialize;

        return this;
    };

    var Facade = function Facade(core) {
        var thus = this;

        function component(id, Module) {
            core.register_component(id, Module);
            return this;
        }

        function service(Module) {
            core.register_service(Module);
            return this;
        }

        function director(Director) {
            core.register_director(Director);
            return this;
        }

        function config(_config) {
            core.register_configuration(_config);
            return this;
        }

        function value(key, value) {
            core.register_value(key, value);
            return this;
        }

        function register(id, definienda, mixins) {
            var args = Array.prototype.slice.call(arguments, 0);
            var Module = (id && id.call) ? id : definienda
              , id = (Module === id) ? false : id
              ;  // Determines if V was invoked as: V('id', Mod) or V(Mod)

            if (id && !Module) {  // if mixin
                mixins = mixins || [];
                mixins.push(id);
                var curry = this.component.bind(this, id, mixins);
                return curry;  // MIGHT BE EASIER TO USE A BETTER CURRY DESIGN -- OR -- A Monad
                // perhaps a curry, having binary actions, which switches on !!Module
            }

            if (id) {  // TODO: abstract the Module vs value conditions
                if (Module) {
                    method = 'component';
                } else {  // if value
                    method = 'value';
                }
            } else if (Module) {
                method = 'service';
            } else {  // if config
                method = 'config';
            }

            return this[method].apply(this, args);
        }

        // export precepts
        this.component = component;
        this.service = service;
        this.director = director;
        this.config = config;
        this.value = value;
        this.register = register;

        return this;
    };

    var Vertex = ENV['V'] = ENV['Vertices'] = new (function Vertices(Core, Facade) {
        var thus = this;

        var V = Facade.call(function V() {
            if (this instanceof V) return new Vertices(Core, Facade);
            return V.register.apply(V, arguments);
        }, new Core());

        return V;
    })(Core, Facade);



}).call(this, $, this.Utilities, this.Debugger, this.Mediator, this.EventHubAdapter, this.DocumentUtilities, this.TemplateRepeat, this.ComponentSandbox, function ServiceSandbox() { });