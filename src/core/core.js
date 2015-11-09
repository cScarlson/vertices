/* ======================================================
   #CORE
   ====================================================== */

; (function () {
    var ENV = this;

    var _CORE = (function () {
        var moduleData = {},
        to_s = function (anything) { return Object.prototype.toString.call(anything); },
        debug = true;

        var mediator = new function Mediator() {
            var thus = this;

            // export precepts
            this.$channels;
            this.$subscribe;
            this.$publish;
            this.$installTo;
            this.$spawn;
            this.$on = this.$subscribe;
            this.$fire = this.$publish;
            this.$emit = 'parent';
            this.$broadcast = 'children';
            this.$anycast = '$fire | $emit | $broadcast';

            return this;
        };

        return {
            debug: function (on) {
                debug = on ? true : false;
            },
            Sandbox: null,
            window_sandbox: null,
            Mediator: null,
            mediator: null,
            register_sandbox: function (Sandbox) {
                if (!Sandbox || !Sandbox.call) return;
                this.Sandbox = Sandbox;
                this.window_sandbox = new Sandbox(this, 'root_scope', window);

                return this;
            },
            register_mediator: function (Mediator) {
                if (!this.Sandbox || !Mediator || !Mediator.call) return;
                var sandbox = this.window_sandbox
                  , mediator = new Mediator(sandbox)
                ;
                this.Mediator = Mediator;
                this.mediator = mediator;

                return this;
            },
            register: function (moduleID, Module) {
                var temp;
                console.log("REGISTERING MODULE : " + moduleID);
                moduleData[moduleID] = {
                    Module: Module,
                    instance: null
                };
            },
            start: function (moduleID, context) {
                var mod = moduleData[moduleID];
                console.log("STARTING MODULE : " + moduleID);
                if (mod) {
                    mod.instance = new mod.Module(new this.Sandbox(this, moduleID, context));
                    mod.instance.init();
                }
            },
            start_all: function () {
                var moduleID;
                console.log(moduleData);
                for (moduleID in moduleData) {
                    if (moduleData.hasOwnProperty(moduleID)) {
                        this.start(moduleID);
                    }
                }
            },
            stop: function (moduleID) {
                var data;
                if (data = moduleData[moduleID] && data.instance) {
                    data.instance.destroy;
                    data.instance = null;
                } else {
                    this.log(1, "Stop Module '" + moduleID + "': FAILED : module does not exist or has not been started");
                }
            },
            stop_all: function () {
                var moduleId;
                for (moduleID in moduleData) {
                    if (moduleData.hasOwnProperty(moduleID)) {
                        this.stop(moduleID);
                    }
                }
            },
            registerEvents: function (evts, mod) {
                if (this.is_obj(evts) && mod) {
                    if (moduleData[mod]) {
                        moduleData[mod].events = evts;
                    } else {
                        this.log(1, "ERROR");
                    }
                } else {
                    this.log(1, "ERROR");
                }
            },
            triggerEvent: function (evt) {
                var mod;
                for (mod in moduleData) {
                    if (moduleData.hasOwnProperty(mod)) {
                        mod = moduleData[mod];
                        if (mod.events && mod.events[evt.type]) {
                            mod.events[evt.type](evt.data);
                        }
                    }
                }
            },
            removeEvents: function (evts, mod) {
                if (this.is_obj(evts) && mod && (mod = moduleData[mod] && mod.events)) {
                    delete mod.events;
                }
            },
            log: function (severity, message) {
                if (debug) {
                    console.log[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
                } else {
                    //send to the server
                }
            },
            dom: {
                query: function (selector, context) {
                    var $el;

                    if (context) {
                        $el = jQuery(context).find(selector);
                    } else {
                        $el = jQuery(selector);
                    }

                    return $el[0];
                },
                bind: function (element, evt, fn) {
                    if (element && evt) {
                        if (typeof evt === 'function') {
                            fn = evt;
                            evt = 'click';
                        }
                        jQuery(element).bind(evt, fn);
                    } else {
                        //log wrong arguments
                    }
                },
                unbind: function (element, evt, fn) {
                    if (element && evt) {
                        if (typeof evt === 'function') {
                            fn = evt;
                            evt = 'click';
                        }
                        jQuery(element).unbind(evt, fn);
                    } else {
                        //log wrong arguments
                    }
                },
                create: function (element) {
                    return document.createElement(element);
                },
                apply_attrs: function (element, attrs) {
                    jQuery(element).attr(attrs);
                },
                has_class: function (element, attrs) {
                    return jQuery(element).hasClass(attrs);
                },
                add_class: function (element, attrs) {
                    jQuery(element).addClass(attrs);
                },
                remove_class: function (element, attrs) {
                    jQuery(element).removeClass(attrs)
                }
            },
            is_arr: function (arr) {
                return jQuery.isArray(arr);
            },
            is_obj: function (obj) {
                return jQuery.isPlainObject(obj);
            },
            arm: function autoRegisterModules(root, parent) {  // , [data-behavior]:first + [data-behavior]
                var scopeSelector = '[data-behavior]'
                  , $root = $(root)
                  , $parent = $root.find(scopeSelector)
                  , hasBehavior = $root.is(scopeSelector)
                  ;
                var behaviors = $root.attr('data-behavior')
                  , moduleIds = $.unique( behaviors.replace(/[,;\s]+/g, '|').replace(/[|]+$/g, '').split('|') )
                  ;

                var applyBehavior = function applyBehavior(scope, behavior, i, a) {
                    var scope = ($root.is('html')) ? document : scope;
                    this.start(behavior, behaviors, scope, parent);
                }.bind(this, $root[0]);

                var arm = function arm(i, scope) {
                    var $firstScope = $(scope);

                    if (!$($firstScope.parent()).is($parent)) {
                        autoRegisterModules.call(this, $firstScope);
                    }
                }.bind(this);

                moduleIds.forEach(applyBehavior);
                $parent.each(arm);

            },
            init: function () {
                var $elements = $('[data-behavior]');
                var $root = $('html');

                this.arm($root[0], $root[0]);

                ($elements).ready(function (e) {
                    var moduleList = [];
                    ($elements).each(function () {
                        moduleList.push($(this).data('behavior'));
                    });

                    // Get unique modules (remove dups)
                    moduleList = $.unique(moduleList.sort()).sort();

                    // Start all the unique modules
                    $.each(moduleList, function (index, value) {
                        _CORE.start(this);
                    });
                });
            }
        };

    }());


    var CORE = ENV['CORE'] = new (function Facade(CORE) {
        var thus = this;
        var idMap = {
            '$APP': function (Module) {
                CORE.register_mediator(Module);
            },
            '$SANDBOX': function (Module) {
                CORE.register_sandbox(Module);
            },
            '%DEFAULT%': function (id, Module) {
                CORE.register(id, Module);
            }
        };

        function register(id, Module) {
            var registrar = idMap[id];
            registrar && registrar(Module) || idMap['%DEFAULT%'](id, Module);

            return this;
        }

        _CORE.init();

        // export
        this.register = register;

        return this;
    })(_CORE);


}).call(this, jQuery);