; (function () {
    //, arm: function ($elements) {

    //    function resolveBehavior(context, i, moduleId) {
    //        !!moduleId && this.start(moduleId, context);
    //    }

    //    var getBehavior = function (i, node) {
    //        var slug = $(node).data('behavior')
    //          , behavior = $.unique(slug.replace(/^[,;\s]+|[,;\s]+$/, '').split(/[,;\s]+/g))  // TODO: refine+test
    //          , context = $(node).is('html') && document || node
    //        ;

    //        jQuery.each(behavior, resolveBehavior.bind(this, context));

    //    }.bind(this);

    //    $elements.each(getBehavior);
    //},
    //init: function () {
    //    var $elements = $('[data-behavior]');

    //    $elements.ready(function (e) {
    //        this.arm($elements);
    //    }.bind(this));

    //}
    ///* ======================================================
    //   #CORE
    //   ====================================================== */

    //; (function () {
    //    var ENV = this;

    //    var _CORE = (function () {
    //        var moduleData = {},
    //        to_s = function (anything) { return Object.prototype.toString.call(anything); },
    //        debug = true;

    //        var Mediator = function Mediator(parent) {
    //            var thus = this;
    //            var parent = parent || this
    //              , children = []
    //              , channels = {}
    //            ;

    //            var ChannelEvent = function ChannelEvent(options) {

    //                function stopPropagation() {
    //                    this.prapagationStopped = true;
    //                }

    //                // export
    //                this.type = options.channel;
    //                this.prapagationStopped = false;
    //                this.stopPropagation = stopPropagation;

    //                return this;
    //            };

    //            function subscribe(channel, handler) {
    //                if (!this.$channels[channel]) this.$channels[channel] = [];
    //                var subscription = { context: this, handler: handler, channel: channel };
    //                this.$channels[channel].push(subscription);

    //                return this;
    //            }

    //            function publish(channel) {
    //                if (!this.$channels[channel]) this.$channels[channel] = [];
    //                var args = Array.prototype.slice.call(arguments, 1)
    //                  , event = new ChannelEvent({ channel: channel })
    //                  ;
    //                args.unshift(event);

    //                for (var i = 0, len = this.$channels[channel].length; i < len; i++) {
    //                    var subscription = this.$channels[channel][i];
    //                    if (!event.propagationStopped) {
    //                        subscription.handler.apply(subscription.context, args);
    //                    }
    //                }

    //                return this;
    //            }

    //            function on() {
    //                return this.$subscribe.apply(this, arguments);
    //            }

    //            function trigger() {
    //                return this.$publish.apply(this, arguments);
    //            }

    //            function fire() {
    //                for (var i = 0, len = this.$siblings.length; i < len; i++) {
    //                    var sibling = this.$siblings[i];
    //                    sibling.$publish.apply(sibling, arguments);
    //                }

    //                return this;
    //            }

    //            function emit() {
    //                if (parent !== this) {
    //                    parent.$publish.apply(parent, arguments);
    //                    //parent.$emit.apply(parent, arguments);  // is indefinite bubbling the most appealing strategy?
    //                }

    //                return this;
    //            }

    //            function broadcast() {  // twins, siblings, parent++, children++

    //                for (var i = 0, len = children.length; i < len; i++) {
    //                    var child = children[i];
    //                    child.$publish.apply(child, arguments);
    //                }

    //                return this;
    //            }

    //            function anycast() {  // twins & siblings
    //                this.$fire.apply(this, arguments).$emit.apply(this, arguments).$broadcast.apply(this, arguments);
    //                return this;
    //            }

    //            function installTo(object) {
    //                object.$channels = channels;
    //                object.$subscribe = subscribe;
    //                object.$publish = publish;
    //                object.$on = on;
    //                object.$trigger = trigger;
    //                object.$installTo = installTo;

    //                return object;
    //            }

    //            function spawn(object) {
    //                var instance = Mediator.apply(object, [this]);
    //                this.$children.push(instance);
    //                return object;
    //            }

    //            // broadcast -> transfer message to all recipients symultaneously
    //            // anycast -> route datagrams from single sender to topolocically nearest node(s) in group of potential receivers
    //            // multicast -> 1-to-many or many-to-many; addressed to a group of nodes symultaneously
    //            // unicast -> sending of messages to single network destination
    //            // geocast -> specialized form of multicast; nodes are targeted by geographical context
    //            // we are bending, if not breaking, these definitions

    //            // export precepts
    //            this.$parent = parent;
    //            this.$children = children;
    //            this.$siblings = this.$parent.$children;
    //            this.$channels = channels;
    //            this.$subscribe = subscribe;
    //            this.$publish = publish;
    //            this.$on = on;
    //            this.$trigger = trigger;
    //            this.$fire = fire;
    //            this.$emit = emit;
    //            this.$broadcast = broadcast;
    //            this.$anycast = anycast;
    //            this.$installTo = installTo;
    //            this.$spawn = spawn;

    //            return this;
    //        };

    //        var root = new Mediator();

    //        //console.log('^', root);
    //        //console.log('^', root === root.$parent);
    //        //console.log('^', root.$children);
    //        //console.log('^', root.$channels);

    //        var sibling1 = root.$installTo(new function Sibling1() { });

    //        //console.log('~1', sibling1);
    //        //console.log('~1', sibling1.$channels === root.$channels);

    //        var child1 = root.$spawn(new function Child1() { });

    //        //console.log('+1', child1);
    //        //console.log('+1', child1.$parent === root);

    //        var child2 = root.$spawn(new function Child2() { });

    //        //console.log('+2', child2);
    //        //console.log('+2', child2.$parent === root);

    //        var child1Child1 = child1.$spawn(new function Child1Child1() { });

    //        //console.log('+1+1', child1Child1);
    //        //console.log('+1+1', child1Child1.$parent === child1);

    //        var child1Child1Child1 = child1Child1.$spawn(new function Child1Child1Child1() { });

    //        //console.log('+1+1+1', child1Child1Child1);
    //        //console.log('+1+1+1', child1Child1Child1.$parent === child1Child1);

    //        root.$on('root1', function (e, data) {
    //            console.log('@root #root1 #args', e, data);
    //        });

    //        sibling1.$on('root1', function (e, data) {
    //            console.log('@sibling1 #root1 #args', e, data);
    //        });

    //        child1.$on('root1', function (e, data) {
    //            console.log('@child1 #root1 #args', e, data);
    //        });

    //        child2.$on('root1', function (e, data) {
    //            console.log('@child2 #root1 #args', e, data);
    //        });

    //        child1Child1.$on('root1', function (e, data) {
    //            console.log('@child1Child1 #root1 #args', e, data);
    //        });

    //        child1Child1Child1.$on('root1', function (e, data) {
    //            console.log('@child1Child1Child1 #root1 #args', e, data);
    //        });

    //        //root.$fire('root1', { root: 'fire' });
    //        //root.$emit('root1', { root: 'emit' });
    //        //root.$broadcast('root1', { root: 'broadcast' });
    //        //root.$anycast('root1', { root: 'anycast' });

    //        //sibling1.$fire('root1', { sibling1: 'fire' });

    //        child1.$fire('root1', { child1: 'fire' });
    //        child1.$emit('root1', { child1: 'emit' });
    //        child1.$broadcast('root1', { child1: 'broadcast' });
    //        child1.$anycast('root1', { child1: 'anycast' });


    //        return {
    //            debug: function (on) {
    //                debug = on ? true : false;
    //            },
    //            Sandbox: null,
    //            window_sandbox: null,
    //            Mediator: null,
    //            mediator: null,
    //            register_sandbox: function (Sandbox) {
    //                if (!Sandbox || !Sandbox.call) return;
    //                this.Sandbox = Sandbox;
    //                this.window_sandbox = new Sandbox(this, 'root_scope', window);

    //                return this;
    //            },
    //            register_mediator: function (Mediator) {
    //                if (!this.Sandbox || !Mediator || !Mediator.call) return;
    //                var sandbox = this.window_sandbox;

    //                Mediator.prototype = this;
    //                this.Mediator = Mediator;
    //                this.mediator = new Mediator(sandbox);

    //                return this;
    //            },
    //            register: function (moduleID, Module) {
    //                var temp;
    //                console.log("REGISTERING MODULE : " + moduleID);
    //                moduleData[moduleID] = {
    //                    Module: Module,
    //                    instance: null
    //                };
    //            },
    //            start: function (moduleID, context) {
    //                var mod = moduleData[moduleID];
    //                console.log("STARTING MODULE : " + moduleID);
    //                if (mod) {
    //                    mod.instance = new mod.Module(new this.Sandbox(this, moduleID, context));
    //                    mod.instance.init();
    //                }
    //            },
    //            start_all: function () {
    //                var moduleID;
    //                console.log(moduleData);
    //                for (moduleID in moduleData) {
    //                    if (moduleData.hasOwnProperty(moduleID)) {
    //                        this.start(moduleID);
    //                    }
    //                }
    //            },
    //            stop: function (moduleID) {
    //                var data;
    //                if (data = moduleData[moduleID] && data.instance) {
    //                    data.instance.destroy;
    //                    data.instance = null;
    //                } else {
    //                    this.log(1, "Stop Module '" + moduleID + "': FAILED : module does not exist or has not been started");
    //                }
    //            },
    //            stop_all: function () {
    //                var moduleId;
    //                for (moduleID in moduleData) {
    //                    if (moduleData.hasOwnProperty(moduleID)) {
    //                        this.stop(moduleID);
    //                    }
    //                }
    //            },
    //            registerEvents: function (evts, mod) {
    //                if (this.is_obj(evts) && mod) {
    //                    if (moduleData[mod]) {
    //                        moduleData[mod].events = evts;
    //                    } else {
    //                        this.log(1, "ERROR");
    //                    }
    //                } else {
    //                    this.log(1, "ERROR");
    //                }
    //            },
    //            triggerEvent: function (evt) {
    //                var mod;
    //                for (mod in moduleData) {
    //                    if (moduleData.hasOwnProperty(mod)) {
    //                        mod = moduleData[mod];
    //                        if (mod.events && mod.events[evt.type]) {
    //                            mod.events[evt.type](evt.data);
    //                        }
    //                    }
    //                }
    //            },
    //            removeEvents: function (evts, mod) {
    //                if (this.is_obj(evts) && mod && (mod = moduleData[mod] && mod.events)) {
    //                    delete mod.events;
    //                }
    //            },
    //            log: function (severity, message) {
    //                if (debug) {
    //                    console.log[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
    //                } else {
    //                    //send to the server
    //                }
    //            },
    //            dom: {
    //                query: function (selector, context) {
    //                    var $el;

    //                    if (context) {
    //                        $el = jQuery(context).find(selector);
    //                    } else {
    //                        $el = jQuery(selector);
    //                    }

    //                    return $el[0];
    //                },
    //                bind: function (element, evt, fn) {
    //                    if (element && evt) {
    //                        if (typeof evt === 'function') {
    //                            fn = evt;
    //                            evt = 'click';
    //                        }
    //                        jQuery(element).bind(evt, fn);
    //                    } else {
    //                        //log wrong arguments
    //                    }
    //                },
    //                unbind: function (element, evt, fn) {
    //                    if (element && evt) {
    //                        if (typeof evt === 'function') {
    //                            fn = evt;
    //                            evt = 'click';
    //                        }
    //                        jQuery(element).unbind(evt, fn);
    //                    } else {
    //                        //log wrong arguments
    //                    }
    //                },
    //                create: function (element) {
    //                    return document.createElement(element);
    //                },
    //                apply_attrs: function (element, attrs) {
    //                    jQuery(element).attr(attrs);
    //                },
    //                has_class: function (element, attrs) {
    //                    return jQuery(element).hasClass(attrs);
    //                },
    //                add_class: function (element, attrs) {
    //                    jQuery(element).addClass(attrs);
    //                },
    //                remove_class: function (element, attrs) {
    //                    jQuery(element).removeClass(attrs)
    //                }
    //            },
    //            is_arr: function (arr) {
    //                return jQuery.isArray(arr);
    //            },
    //            is_obj: function (obj) {
    //                return jQuery.isPlainObject(obj);
    //            },
    //            arm: function autoRegisterModules(root, parent) {  // , [data-behavior]:first + [data-behavior]
    //                var scopeSelector = '[data-behavior]'
    //                  , $root = $(root)
    //                  , $parent = $root.find(scopeSelector)
    //                  , hasBehavior = $root.is(scopeSelector)
    //                  ;
    //                var behaviors = $root.attr('data-behavior')
    //                  , moduleIds = $.unique( behaviors.replace(/[,;\s]+/g, '|').replace(/[|]+$/g, '').split('|') )
    //                  ;

    //                var applyBehavior = function applyBehavior(scope, behavior, i, a) {
    //                    var scope = ($root.is('html')) ? document : scope;
    //                    this.start(behavior, behaviors, scope, parent);
    //                }.bind(this, $root[0]);

    //                var arm = function arm(i, scope) {
    //                    var $firstScope = $(scope);

    //                    if (!$($firstScope.parent()).is($parent)) {
    //                        autoRegisterModules.call(this, $firstScope);
    //                    }
    //                }.bind(this);

    //                moduleIds.forEach(applyBehavior);
    //                $parent.each(arm);

    //            },
    //            init: function () {
    //                var $elements = $('[data-behavior]');
    //                var $root = $('html');

    //                this.arm($root[0], $root[0]);

    //                ($elements).ready(function (e) {
    //                    var moduleList = [];
    //                    ($elements).each(function () {
    //                        moduleList.push($(this).data('behavior'));
    //                    });

    //                    // Get unique modules (remove dups)
    //                    moduleList = $.unique(moduleList.sort()).sort();

    //                    // Start all the unique modules
    //                    $.each(moduleList, function (index, value) {
    //                        _CORE.start(this);
    //                    });
    //                });
    //            }
    //        };

    //    }());


    //    var CORE = ENV['CORE'] = new (function Facade(CORE) {
    //        var thus = this;
    //        var idMap = {
    //            '$APP': function (Module) {
    //                CORE.register_mediator(Module);
    //            },
    //            '$SANDBOX': function (Module) {
    //                CORE.register_sandbox(Module);
    //            },
    //            '%DEFAULT%': function (id, Module) {
    //                CORE.register(id, Module);
    //            }
    //        };

    //        function register(id, Module) {
    //            var registrar = idMap[id];
    //            registrar && registrar(Module) || idMap['%DEFAULT%'](id, Module);

    //            return this;
    //        }

    //        _CORE.init();

    //        // export
    //        this.register = register;

    //        return this;
    //    })(_CORE);


    //}).call(this, jQuery);
})();





/* ======================================================
 #CORE
 ====================================================== */
; (function (jQuery, undefined) {
    if (undefined) { undefined = null; return; }
    var ENV = this;

    /**
     * @ _CORE
     */
    var _CORE = (function () {
        var moduleData = {}
          , to_s = function (anything) { return Object.prototype.toString.call(anything); }
          , debug = true
        ;

        var Mediator = function Mediator(parent) {
            var thus = this;
            var parent = parent || this
              , children = []
              , channels = {}
            ;

            var ChannelEvent = function ChannelEvent(options) {

                function stopPropagation() {
                    this.prapagationStopped = true;
                }

                // export
                this.type = options.channel;
                this.prapagationStopped = false;
                this.stopPropagation = stopPropagation;

                return this;
            };

            function subscribe(channel, handler) {
                if (!this.$channels[channel]) this.$channels[channel] = [];
                var subscription = { context: this, handler: handler, channel: channel };
                this.$channels[channel].push(subscription);

                return this;
            }

            function publish(channel) {
                if (!this.$channels[channel]) this.$channels[channel] = [];
                var args = Array.prototype.slice.call(arguments, 1)
                  , event = new ChannelEvent({ channel: channel })
                ;
                args.unshift(event);

                for (var i = 0, len = this.$channels[channel].length; i < len; i++) {
                    var subscription = this.$channels[channel][i];
                    if (!event.propagationStopped) {
                        subscription.handler.apply(subscription.context, args);
                    }
                }

                return this;
            }

            function on() {
                return this.$subscribe.apply(this, arguments);
            }

            function trigger() {
                return this.$publish.apply(this, arguments);
            }

            function fire() {
                for (var i = 0, len = this.$siblings.length; i < len; i++) {
                    var sibling = this.$siblings[i];
                    sibling.$publish.apply(sibling, arguments);
                }

                return this;
            }

            function emit() {
                if (parent !== this) {
                    parent.$publish.apply(parent, arguments);
                    //parent.$emit.apply(parent, arguments);  // is indefinite bubbling the most appealing strategy?
                }

                return this;
            }

            function broadcast() {  // twins, siblings, parent++, children++

                for (var i = 0, len = children.length; i < len; i++) {
                    var child = children[i];
                    child.$publish.apply(child, arguments);
                }

                return this;
            }

            function anycast() {  // twins & siblings
                this.$fire.apply(this, arguments).$emit.apply(this, arguments).$broadcast.apply(this, arguments);
                return this;
            }

            function installTo(object) {
                object.$channels = channels;
                object.$subscribe = subscribe;
                object.$publish = publish;
                object.$on = on;
                object.$trigger = trigger;
                object.$installTo = installTo;

                return object;
            }

            function spawn(object) {
                var instance = Mediator.apply(object, [this]);
                this.$children.push(instance);
                return object;
            }

            // broadcast -> transfer message to all recipients symultaneously
            // anycast -> route datagrams from single sender to topolocically nearest node(s) in group of potential receivers
            // multicast -> 1-to-many or many-to-many; addressed to a group of nodes symultaneously
            // unicast -> sending of messages to single network destination
            // geocast -> specialized form of multicast; nodes are targeted by geographical context
            // we are bending, if not breaking, these definitions

            // export precepts
            this.$parent = parent;
            this.$children = children;
            this.$siblings = this.$parent.$children;
            this.$channels = channels;
            this.$subscribe = subscribe;
            this.$publish = publish;
            this.$on = on;
            this.$trigger = trigger;
            this.$fire = fire;
            this.$emit = emit;
            this.$broadcast = broadcast;
            this.$anycast = anycast;
            this.$installTo = installTo;
            this.$spawn = spawn;

            return this;
        };

        var root = new Mediator();

        //console.log('^', root);
        //console.log('^', root === root.$parent);
        //console.log('^', root.$children);
        //console.log('^', root.$channels);

        var sibling1 = root.$installTo(new function Sibling1() { });

        //console.log('~1', sibling1);
        //console.log('~1', sibling1.$channels === root.$channels);

        var child1 = root.$spawn(new function Child1() { });

        //console.log('+1', child1);
        //console.log('+1', child1.$parent === root);

        var child2 = root.$spawn(new function Child2() { });

        //console.log('+2', child2);
        //console.log('+2', child2.$parent === root);

        var child1Child1 = child1.$spawn(new function Child1Child1() { });

        //console.log('+1+1', child1Child1);
        //console.log('+1+1', child1Child1.$parent === child1);

        var child1Child1Child1 = child1Child1.$spawn(new function Child1Child1Child1() { });

        //console.log('+1+1+1', child1Child1Child1);
        //console.log('+1+1+1', child1Child1Child1.$parent === child1Child1);

        root.$on('root1', function (e, data) {
            console.log('@root #root1 #args', e, data);
        });

        sibling1.$on('root1', function (e, data) {
            console.log('@sibling1 #root1 #args', e, data);
        });

        child1.$on('root1', function (e, data) {
            console.log('@child1 #root1 #args', e, data);
        });

        child2.$on('root1', function (e, data) {
            console.log('@child2 #root1 #args', e, data);
        });

        child1Child1.$on('root1', function (e, data) {
            console.log('@child1Child1 #root1 #args', e, data);
        });

        child1Child1Child1.$on('root1', function (e, data) {
            console.log('@child1Child1Child1 #root1 #args', e, data);
        });

        //root.$fire('root1', { root: 'fire' });
        //root.$emit('root1', { root: 'emit' });
        //root.$broadcast('root1', { root: 'broadcast' });
        //root.$anycast('root1', { root: 'anycast' });

        //sibling1.$fire('root1', { sibling1: 'fire' });

        child1.$fire('root1', { child1: 'fire' });
        child1.$emit('root1', { child1: 'emit' });
        child1.$broadcast('root1', { child1: 'broadcast' });
        child1.$anycast('root1', { child1: 'anycast' });



        var EventHub = function EventHub() {
            var thus = this
              , channels = {}
            ;

            function subscribe(channel, handler) {
                if (!this.$channels[channel]) this.$channels[channel] = [];
                var subscription = { context: this, handler: handler };
                this.$channels[channel].push(subscription);

                return this;
            }

            function publish(channel) {
                if (!this.$channels[channel]) this.$channels[channel] = [];
                var args = Array.prototype.slice.call(arguments, 1);

                for (var i = 0, len = this.$channels[channel].length; i < len; i++) {
                    var subscription = this.$channels[channel][i];
                    subscription.handler.apply(subscription.context, args);
                }

                return this;
            }

            // TODO: Allow alternative params. Channels-to-Handlers is a many-to-many relationship. Also, allow empty args: repeal subscriptions for all with context.
            function unsubscribe(channel, handler) {
                var context = this;

                for (var i = 0, len = this.$channels[channel].length; i < len; i++) {
                    var subscription = this.$channels[channel][i];

                    if (subscription.context === context) {
                        if (handler) {

                            if (subscription.handler === handler) {
                                this.$channels[channel].splice(i, 1);
                            }

                        } else {
                            this.$channels[channel].splice(i, 1);
                        }

                    }

                }

                return this;
            }

            function on() {
                return subscribe.apply(this, arguments);
            }

            function emit() {
                return publish.apply(this, arguments);
            }

            function off() {
                return unsubscribe.apply(this, arguments);
            }

            function installTo(object) {
                object.$channels = channels;
                object.$subscribe = subscribe;
                object.$publish = publish;
                object.$unsubscribe = unsubscribe;
                object.$on = on;
                object.$emit = emit;
                object.$off = off;
                object.$installTo = installTo;
                object.$spawn = spawn;

                return object;
            }

            function spawn(object) {
                var instance = EventHub.apply(object);
                return instance;
            }

            // export precepts
            this.$channels = channels;
            this.$subscribe = subscribe;
            this.$publish = publish;
            this.$unsubscribe = unsubscribe;
            this.$on = on;
            this.$emit = emit;
            this.$off = off;
            this.$installTo = installTo;
            this.$spawn = spawn;

            return this;
        };

        var EventHubAdapter = function EventHubAdapter(_eventHub) {
            var thus = this, eventHub = _eventHub;

            function register_events(events) {
                for (var type in events) {
                    var handler = events[type];
                    eventHub.$subscribe(type, handler);
                }

                return this;
            }

            function trigger_event(event) {
                var type = event.type, data = event.data;
                eventHub.$publish(type, data);

                return this;
            }

            function remove_events(events) {
                for (var type in events) {
                    var handler = events[type];
                    eventHub.$unsubscribe(type, handler);
                }

                return this;
            }

            function install_to(object) {
                var colleague = eventHub.$installTo(new function Colleague() { });
                var adapter = EventHubAdapter.apply(object, [colleague]);

                // deny install_to on context to ensure Sandbox integrity (keep shallow hierarchy)
                delete adapter.install_to;  // adapter === object >> true

                return adapter;
            }

            // export precepts
            this.register_events = register_events;
            this.trigger_event = trigger_event;
            this.remove_events = remove_events;
            this.install_to = install_to;

            return this;
        };

        var URLComponents = function URLComponents(url) {
            var parser = document.createElement('a');
            parser.href = url;

            // export
            this.hash = parser.hash;
            this.host = parser.host;
            this.hostname = parser.hostname;
            this.href = parser.href;
            this.origin = parser.origin;
            this.pathname = parser.pathname;
            this.port = parser.port;
            this.protocol = parser.protocol;
            this.search = parser.search;
            // extra exports
            this.hashValue = this.hash.split('#')[1]

            return this;
        };

        return EventHubAdapter.call({
            debug: function (on) {
                debug = on ? true : false;
            },
            log: function (severity, message) {  // TODO: Discussion:= Logging may become a plugin to core.
                // TODO: Should we make seperate functions for debug/log/info/warn/error
                if (debug) {
                    console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
                } else {
                    //send to the server
                }
                return this;
            },
            Sandbox: null,
            rootscope_sandbox: null,
            Director: null,
            director: null,
            register_sandbox: function (Sandbox) {
                if (!Sandbox || !Sandbox.call) return;
                this.log(1, "REGISTERING SANDBOX");
                this.log(1, "CONSTRUCTING ROOT_SCOPE SANDBOX");

                this.Sandbox = Sandbox;
                this.rootscope_sandbox = new Sandbox(this, 'root_scope', window);
                this.register_sandbox = this.noop;

                return this;
            },
            register_director: function (Director) {
                if (!this.Sandbox || !Director || !Director.call) return;
                var sandbox = this.rootscope_sandbox;

                this.log(1, "REGISTERING DIRECTOR");
                this.log(1, "CONSTRUCTING DIRECTOR");

                Director.prototype = this;
                this.Director = Director;
                this.director = new Director(sandbox);
                this.log(1, "INITIALIZING DIRECTOR");
                this.director.init();
                this.register_director = this.noop;

                return this;
            },
            register: function (moduleId, Module) {

                if (typeof moduleId === 'string' && typeof Module === 'function') {
                    this.log(1, "REGISTERING MODULE : " + moduleId)
                    moduleData[moduleId] = {  // TODO: Register should create a promise whose onFulfill-handler constructs an object.
                        Module: Module,
                        id: moduleId,
                        instances: []
                    };
                } else {
                    this.log(1, "Module '" + to_s(moduleId) + "' Registration : FAILED : one or more arguments are of incorrect type")
                }

            },
            start: function (moduleId, context) {  // TODO: Start should resolve a promise whose onFulfill-handler constructs an object.
                var mod = moduleData[moduleId], instance, sandbox;

                if (mod) {
                    this.log(1, "CONSTRUCTING MODULE : " + moduleId);
                    sandbox = new this.Sandbox(this, moduleId, context);
                    instance = new mod.Module(sandbox);

                    this.trigger_event({ type: '$core://created/module', data: mod });

                    if (instance && instance.init && instance.destroy) {
                        this.log(1, "INITIALIZING MODULE : " + moduleId);
                        mod.instances.push(instance);
                        instance.init();
                    } else {
                        this.log(1, "Module '" + moduleId + "' Registration : FAILED : instance has no init or destroy functions");
                    }

                }

                return this;
            },
            start_all: function () {
                var moduleId;
                this.log(1, moduleData);
                for (moduleId in moduleData) {
                    if (moduleData.hasOwnProperty(moduleId)) {
                        this.start(moduleId);
                    }
                }
            },
            stop: function (moduleId) {
                var data;

                if (data = moduleData[moduleId] && data.instance) {
                    data.instance.destroy;
                    data.instance = null;

                    this.trigger_event({ type: '$core://stopped/module', data: data });
                } else {
                    this.log(1, "Stop Module '" + moduleId + "': FAILED : module does not exist or has not been started");
                }

                return this;
            },
            stop_all: function () {
                var moduleId;

                for (moduleId in moduleData) {
                    if (moduleData.hasOwnProperty(moduleId)) {
                        this.stop(moduleId);
                    }
                }

                return this;
            },
            event_hub: new EventHubAdapter(new EventHub()),
            dom: {
                query: function (selector, context) {
                    var $el;

                    if (context) {
                        $el = jQuery(context).find(selector);
                    } else {
                        $el = jQuery(selector);
                    }

                    return Array.prototype.slice.call($el, 0);
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
                trigger_event: function (element, event, data, elem, onlyHandlers) {
                    if (!element || !event) throw new Error('DOM Event Dispatch Error: No element or event was provided');
                    var $el = jQuery(element), args = Array.prototype.slice.call(arguments, 1);
                    $el.trigger.apply($el, args);

                    return this;
                },
                create: function (element) {
                    return document.createElement(element);  // TODO: Broken Window ( "[element]" ). Return nodelist (align with .find to return a set).
                },
                apply_attrs: function (element, attrs) {
                    return jQuery(element).attr(attrs);
                },
                has_class: function (element, attrs) {
                    return jQuery(element).hasClass(attrs);
                },
                add_class: function (element, attrs) {
                    jQuery(element).addClass(attrs);
                    return this;
                },
                remove_class: function (element, attrs) {
                    jQuery(element).removeClass(attrs);
                    return this;
                },
                apply_data: function (element, attrs) {
                    return jQuery(element).data(attrs);
                },
                get_innerHTML: function (element) {
                    return jQuery(element).html();
                },
                set_innerHTML: function (element, content) {
                    jQuery(element).html(content);
                    return this;
                },
                get_outerHTML: function (element) {
                    return jQuery(element)[0].outerHTML;
                },
                set_outerHTML: function (element, content) {
                    jQuery(element).replaceWith(content);
                    return this;
                },
                get_value: function (element) {
                    return jQuery(element).val();
                },
                set_value: function (element, v) {
                    jQuery(element).val(v);
                    return this;
                },
                get_style: function (element, style) {
                    return jQuery(element).css(style);
                },
                set_styles: function (element, styles, value) {
                    var $el = jQuery(element)
                      , args = Array.prototype.slice.call(arguments, 1)
                    ;
                    $el.css.apply($el, args);
                    return this;
                },
                serialize_form: function (element) {
                    return jQuery(element).serialize();
                },
                animate: function (element, options) {
                    jQuery(element).animate(options);
                    return this;
                },
                offset: function (element, options) {
                    //TODO: we may want to accept an arg to set the offset, but I don't need that now.
                    var $el = jQuery(element), args = Array.prototype.slice.call(arguments, 1);
                    return $el.offset.apply($el, args);
                },
                append: function (element, attrs) {
                    jQuery(element).append(attrs);
                    return this;
                },
                remove: function (element, attrs) {
                    var toRemove = jQuery(element)
                    if (attrs) {
                        toRemove = toRemove.find(attrs)
                    }
                    toRemove.remove();
                    return this;
                },
                empty: function (element) {
                    jQuery(element).empty();
                    return this;
                },
                outer_height: function (element, includeMargins) {
                    //TODO: we may want to accept an arg to set the outerHeight, but I don't need that now.
                    return jQuery(element).outerHeight(!!includeMargins);
                },
                combo_box: function (element, options) {
                    jQuery(element).combobox(options);
                    return this;
                },
                slide_up: function (element, attrs) {
                    jQuery(element).slideUp(attrs);
                    return this;
                },
                slide_down: function (element, attrs) {
                    jQuery(element).slideDown(attrs);
                    return this;
                },
                each: function (element, fn) {
                    jQuery(element).each(fn);
                    return this;
                },
                size: function (element) {
                    jQuery(element).size();
                    return this;
                },
                hide: function (element) {
                    jQuery(element).hide();
                    return this;
                },
                show: function (element) {
                    jQuery(element).show();
                    return this;
                }
            },
            http: {
                Promise: function HTTP_Promise_Interface(deferred) {

                    this.success = deferred.success;
                    this.error = deferred.error;
                    this.complete = deferred.complete;
                    this.progress = deferred.progress;

                    return this;
                },
                get: function GET(url, options, onSuccess) {
                    var req = jQuery.get.call(jQuery, url, options, onSuccess);
                    return new this.Promise(req);
                },
                post: function POST(url, options, onSuccess) {
                    var req = jQuery.post.call(jQuery, url, options, onSuccess);
                    return new this.Promise(req);
                },
                put: function PUT(url, options, onSuccess) {
                    var options = _CORE.extend(options, {
                        method: 'PUT',
                        success: onSuccess || _CORE.noop,
                        error: _CORE.noop
                    });
                    var req = jQuery.ajax(url, options, onSuccess);

                    return new this.Promise(req);
                },
                'delete': function DELETE(url, options, onSuccess) {
                    var options = _CORE.extend(options, {
                        method: 'DELETE',
                        success: onSuccess || _CORE.noop,
                        error: _CORE.noop
                    });
                    var req = jQuery.ajax(url, options, onSuccess);

                    return new this.Promise(req);
                },
                jsonp: function send_jsonp() { }
            },
            is_arr: function (arr) {
                return jQuery.isArray(arr);
            },
            is_obj: function (obj) {
                return jQuery.isPlainObject(obj);
            },
            extend: function mixin() {
                return jQuery.extend.apply(jQuery, arguments);
            },
            cookie: function (options) {
                return jQuery.cookie.apply(jQuery, arguments);
            },
            remove_cookie: function (name) {
                console.log('@', arguments);
                return jQuery.removeCookie.apply(jQuery, arguments);
            },
            rfc4: function generateUUID() {
                // SEE RFC4122 specification (https://www.ietf.org/rfc/rfc4122.txt)
                var templateString = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
                var uuid = templateString.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

                return uuid;
            },
            debounce: function debounce(fn, delay) {
                var timer = null;
                return function () {
                    var context = this, args = arguments;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        fn.apply(context, args);
                    }, delay);
                };
            },
            throttle: function throttle(fn, threshhold, scope) {
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
            },
            noop: jQuery.noop,
            parse_uri: function (uri) {
                return new URLComponents(uri);
            },
            arm: function autoRegisterModules(root, parent) {  // , [data-behavior]:first + [data-behavior]
                var scopeSelector = '[data-behavior]'
                  , $root = $(root)
                  , $parent = $root.find(scopeSelector)
                  , hasBehavior = $root.is(scopeSelector)
                ;
                var slug = $root.attr('data-behavior')
                  , moduleIds = $.unique(slug.replace(/^[,;\s]+|[,;\s]+$/g, '').replace(/[,;\s]+/g, '|').replace(/[|]+$/g, '').split('|')).sort()
                  , scopeId = moduleIds.join(' ')
                  ;

                var resolveBehavior = function resolveBehavior(scope, behavior, i, a) {
                    var scope = ($root.is('html')) ? document : scope;
                    this.start(behavior, scope, parent, slug);
                }.bind(this, $root[0]);

                var resolveChildren = function resolveChildren(i, scope) {
                    var $firstScope = $(scope);

                    if (!$($firstScope.parent()).is($parent)) {
                        autoRegisterModules.call(this, $firstScope);
                    }

                }.bind(this);

                moduleIds.forEach(resolveBehavior);
                $parent.each(resolveChildren);

            },
            init: function () {
                var thus = this;
                var $root = $('html');

                this.log(1, "INITIALIZING CORE");

                $(document).ready(function () {
                    thus.log(1, "ARM (AUTOMATIC MODULE REGISTRATION)");
                    thus.arm($root[0], $root[0]);
                });

            }
        }, new EventHub() );
    }());


    var Vertex = ENV['V'] = ENV['Vertices'] = new (function Vertices(_CORE) {
        var STATIC = this;
        var typeIdMap = {
            '$SANDBOX': function (sandbox) {
                _CORE.register_sandbox(sandbox);
            },
            '$APP': function (Director) {
                _CORE.register_director(Director);
                this['$APP'] = _CORE.noop;
            },
            '%DEFAULT%': function (id, Module) {
                _CORE.register(id, Module);
            }
        };

        var Vertex = function Vertex() {
            var thus = this;

            function register(id, Module) {
                if (!!id) {
                    if (typeIdMap[id]) {
                        typeIdMap[id](Module);
                    } else {
                        typeIdMap['%DEFAULT%'](id, Module);
                    }
                } else {
                    // handle services & Non-DOM modules. E.G: CORE.register(Constructor);
                }

                return this;
            }

            // export precepts
            this.register = register;

            return this;
        };
        
        var V = Vertex.apply(Vertex).call(function V() {
            return V.register.apply(V, arguments);
        });

        return V;
    })(_CORE);

    

}).call(this, $);