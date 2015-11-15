
/* ======================================================
 #CORE
 ====================================================== */
; (function (jQuery, undefined) {
    if (undefined) { undefined = null; return; }
    var ENV = this;

    /**
     * @ _CORE
     */
    var _CORE = new (function Core() {
        var thus = this;

        var Mediator = function Mediator(parent) {
            var thus = this;
            var parent = parent || this
              , siblings = parent.$children || []
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
                  , event = new ChannelEvent({ channel: channel });

                args.unshift(event);

                for (var i = 0, len = this.$channels[channel].length; i < len; i++) {
                    var subscription = this.$channels[channel][i];
                    subscription.handler.apply(subscription.context, args);
                }

                return this;
            }

            function on() {
                return this.$subscribe.apply(this, arguments);
            }

            function trigger() {
                return this.$publish.apply(this, arguments);
            }

            function post() {

                for (var i = 0, len = this.$siblings.length; i < len; i++) {
                    var sibling = this.$siblings[i];
                    if (sibling !== this) {
                        sibling.$publish.apply(sibling, arguments);
                    }
                }

                return this;
            }

            function fire() {
                this.$trigger.apply(this, arguments).$emit.apply(this, arguments).$post.apply(this, arguments).$broadcast.apply(this, arguments);
                return this;
            }

            function emit() {

                if (parent !== this) {
                    parent.$publish.apply(parent, arguments);
                    parent.$emit.apply(parent, arguments);
                }

                return this;
            }

            function broadcast() {

                for (var i = 0, len = children.length; i < len; i++) {
                    var child = children[i];
                    child.$publish.apply(child, arguments);
                    child.$broadcast.apply(child, arguments);
                }

                return this;
            }

            function anycast() {
                //this.what(?);
                return this;
            }

            function split(object) {
                object.$channels = channels;
                object.$subscribe = subscribe;
                object.$publish = publish;
                object.$on = on;
                object.$trigger = trigger;
                object.$installTo = installTo;

                return object;
            }

            function installTo(object) {
                object.$parent = parent;
                object.$children = children;
                object.$siblings = siblings;
                object.$channels = channels;
                object.$subscribe = subscribe;
                object.$publish = publish;
                object.$on = on;
                object.$trigger = trigger;
                object.$post = post;
                object.$fire = fire;
                object.$emit = emit;
                object.$broadcast = broadcast;
                object.$installTo = installTo;
                object.$spawn = spawn;

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
            this.$siblings = siblings;
            this.$channels = channels;
            this.$subscribe = subscribe;
            this.$publish = publish;
            this.$on = on;
            this.$trigger = trigger;
            this.$post = post;
            this.$fire = fire;
            this.$emit = emit;
            this.$broadcast = broadcast;
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

        var Debugger = function Debugger() {
            var thus = this;

            function debug(on) {
                debug = on ? true : false;
            }

            function log(severity, message) {  // TODO: Discussion:= Logging may become a plugin to core.
                // TODO: Should we make seperate functions for debug/log/info/warn/error
                if (debug) {
                    console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
                } else {
                    //send to the server
                }
                return this;
            }

            // export precepts
            this.debugging = true;
            this.debug = debug;
            this.log = log;

            return this;
        };

        var Utilities = function Utilities() {
            var thus = this;

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

            function _toString(anything) { return Object.prototype.toString.call(anything); };

            function is_array(arr) {
                return jQuery.isArray(arr);
            }

            function is_object(obj) {
                return jQuery.isPlainObject(obj);
            }

            function extend() {
                return jQuery.extend.apply(jQuery, arguments);
            }

            function cookie(options) {
                return jQuery.cookie.apply(jQuery, arguments);
            }

            function remove_cookie(name) {
                console.log('@', arguments);
                return jQuery.removeCookie.apply(jQuery, arguments);
            }

            function rfc4() {
                // SEE RFC4122 specification (https://www.ietf.org/rfc/rfc4122.txt)
                var templateString = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
                var uuid = templateString.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

                return uuid;
            }

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

            function parse_uri(uri) {
                return new URLComponents(uri);
            }

            // export precepts
            this.to_s = _toString;
            this.is_arr = is_array;
            this.is_obj = is_object;
            this.extend = extend;
            this.cookie = cookie;
            this.remove_cookie = remove_cookie;
            this.generate_uuid = rfc4;
            this.debounce = debounce;
            this.throttle = throttle;
            this.parse_uri = parse_uri;

            return this;
        };

        var DocumentUtilities = function DocumentUtilities() {
            var thus = this;

            function query(selector, context) {
                var $el;

                if (context) {
                    $el = jQuery(context).find(selector);
                } else {
                    $el = jQuery(selector);
                }

                return Array.prototype.slice.call($el, 0);
            }

            function bind(element, evt, fn) {
                if (element && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    jQuery(element).bind(evt, fn);
                } else {
                    //log wrong arguments
                }
            }

            function unbind(element, evt, fn) {
                if (element && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    jQuery(element).unbind(evt, fn);
                } else {
                    //log wrong arguments
                }
            }

            function triggerEvent(element, event, data, elem, onlyHandlers) {
                if (!element || !event) throw new Error('DOM Event Dispatch Error: No element or event was provided');
                var $el = jQuery(element), args = Array.prototype.slice.call(arguments, 1);
                $el.trigger.apply($el, args);

                return this;
            }

            function create(element) {
                return document.createElement(element);  // TODO: Broken Window ( "[element]" ). Return nodelist (align with .find to return a set).
            }

            function applyAttrs(element, attrs) {
                return jQuery(element).attr(attrs);
            }

            function hasClass(element, attrs) {
                return jQuery(element).hasClass(attrs);
            }

            function addClass(element, attrs) {
                jQuery(element).addClass(attrs);
                return this;
            }

            function removeClass(element, attrs) {
                jQuery(element).removeClass(attrs);
                return this;
            }

            function applyData(element, attrs) {
                return jQuery(element).data(attrs);
            }

            function getInnerHTML(element) {
                return jQuery(element).html();
            }

            function setInnerHTML(element, content) {
                jQuery(element).html(content);
                return this;
            }

            function getOuterHTML(element) {
                return jQuery(element)[0].outerHTML;
            }

            function setOuterHTML(element, content) {
                jQuery(element).replaceWith(content);
                return this;
            }

            function getValue(element) {
                return jQuery(element).val();
            }

            function setValue(element, v) {
                jQuery(element).val(v);
                return this;
            }

            function getStyle(element, style) {
                return jQuery(element).css(style);
            }

            function setStyles(element, styles, value) {
                var $el = jQuery(element)
                  , args = Array.prototype.slice.call(arguments, 1)
                ;
                $el.css.apply($el, args);
                return this;
            }

            function serializeForm(element) {
                return jQuery(element).serialize();
            }

            function animate(element, options) {
                jQuery(element).animate(options);
                return this;
            }

            function offset(element, options) {
                //TODO: we may want to accept an arg to set the offset, but I don't need that now.
                var $el = jQuery(element), args = Array.prototype.slice.call(arguments, 1);
                return $el.offset.apply($el, args);
            }

            function append(element, attrs) {
                jQuery(element).append(attrs);
                return this;
            }

            function remove(element, attrs) {
                var toRemove = jQuery(element)
                if (attrs) {
                    toRemove = toRemove.find(attrs)
                }
                toRemove.remove();
                return this;
            }

            function empty(element) {
                jQuery(element).empty();
                return this;
            }

            function getOuterHeight(element, includeMargins) {
                //TODO: we may want to accept an arg to set the outerHeight, but I don't need that now.
                return jQuery(element).outerHeight(!!includeMargins);
            }

            function slideUp(element, attrs) {
                jQuery(element).slideUp(attrs);
                return this;
            }

            function slideDown(element, attrs) {
                jQuery(element).slideDown(attrs);
                return this;
            }

            function each(element, fn) {
                jQuery(element).each(fn);
                return this;
            }

            function size(element) {
                jQuery(element).size();
                return this;
            }

            function hide(element) {
                jQuery(element).hide();
                return this;
            }

            function show(element) {
                jQuery(element).show();
                return this;
            }



            // export precepts
            this.query = query;
            this.bind = bind;
            this.unbind = unbind;
            this.trigger_event = triggerEvent;
            this.create = create;
            this.apply_attrs = applyAttrs;
            this.has_class = hasClass;
            this.add_class = addClass;
            this.remove_class = removeClass;
            this.apply_data = applyData;
            this.get_innerHTML = getInnerHTML;
            this.set_innerHTML = setInnerHTML;
            this.get_outerHTML = getOuterHTML;
            this.set_outerHTML = setOuterHTML;
            this.get_value = getValue;
            this.set_value = setValue;
            this.get_style = getStyle;
            this.set_styles = setStyles;
            this.serialize_form = serializeForm;
            this.animate = animate;
            this.offset = offset;
            this.append = append;
            this.remove = remove;
            this.empty = empty;
            this.outer_height = getOuterHeight;
            this.slide_up = slideUp;
            this.slide_down = slideDown;
            this.each = each;
            this.size = size;
            this.hide = hide;
            this.show = show;

            return this;
        };

        var HTTP = function HTTP() {
            var thus = this;

            var HTTP_Promise_Interface = function HTTP_Promise_Interface(deferred) {

                this.success = deferred.success;
                this.error = deferred.error;
                this.complete = deferred.complete;
                this.progress = deferred.progress;

                return this;
            };

            function GET(url, options, onSuccess) {
                var req = jQuery.get.call(jQuery, url, options, onSuccess);
                return new this.Promise(req);
            }

            function POST(url, options, onSuccess) {
                var req = jQuery.post.call(jQuery, url, options, onSuccess);
                return new this.Promise(req);
            }

            function PUT(url, options, onSuccess) {
                var options = _CORE.extend(options, {
                    method: 'PUT',
                    success: onSuccess || _CORE.noop,
                    error: _CORE.noop
                });
                var req = jQuery.ajax(url, options, onSuccess);

                return new this.Promise(req);
            }

            function DELETE(url, options, onSuccess) {
                var options = _CORE.extend(options, {
                    method: 'DELETE',
                    success: onSuccess || _CORE.noop,
                    error: _CORE.noop
                });
                var req = jQuery.ajax(url, options, onSuccess);

                return new HTTP_Promise_Interface(req);
            }

            function jsonp() { }

            // export precepts
            this.get = GET;
            this.post = POST;
            this.put = PUT;
            this['delete'] = DELETE;
            this.jsonp = jsonp;

            return this;
        };



        function configure(object) {
            jQuery.extend(true, this.settings, object);
            return this;
        }

        function registerSandbox(Sandbox) {
            if (!Sandbox || !Sandbox.call) return;
            this.log(1, "REGISTERING SANDBOX");
            this.log(1, "CONSTRUCTING ROOT_SCOPE SANDBOX");

            this.Sandbox = Sandbox;
            this.rootscope_sandbox = new Sandbox(this, 'root_scope', window);
            this.register_sandbox = this.noop;

            return this;
        }

        function registerDirector(Director) {
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
        }

        function registerValue(key, value) {
            this.values[key] = value;
            return this;
        }

        function registerModule(moduleId, Module) {

            if (typeof moduleId === 'string' && typeof Module === 'function') {
                //this.log(1, "REGISTERING MODULE : " + moduleId);
                // parent.$spawn(Module.prototype);
                this.modules[moduleId] = {  // TODO: Register should create a promise whose onFulfill-handler constructs an object.
                    Module: Module,
                    id: moduleId,
                    instances: []
                };
            } else {
                //this.log(1, "Module '" + to_s(moduleId) + "' Registration : FAILED : one or more arguments are of incorrect type")
            }

            return this;
        }

        function registerService(Service) {
            var id = this.rfc4();
            var sandbox = new function Utils() { }, instance;
            // this.$installTo(Service.prototype);
            instance = new Service(sandbox);
            this.modules[id] = {
                Module: Service,
                id: id,
                instances: [instance]
            };

            return this;
        }

        function start(moduleId, context, scopeId, medium) {  // TODO: Start should resolve a promise whose onFulfill-handler constructs an object.
            var mod = this.modules[moduleId]
              , data = this.values[moduleId]
              , sandbox
              , instance
              , details
              ;

            if (mod) {
                //this.log(1, "CONSTRUCTING MODULE : " + moduleId);
                //console.log('>>', moduleId, medium);
                console.log('>>', moduleId, context);
                sandbox = new this.Sandbox(this, moduleId, context);
                instance = new mod.Module(sandbox);
                details = { module: mod, instance: instance, data: data };
                medium.$installTo(instance);

                this.trigger_event({ type: '$core://created/module', data: details });

                if (instance && instance.init && instance.destroy) {
                    //this.log(1, "INITIALIZING MODULE : " + moduleId);
                    mod.instances.push({ instance: instance, data: data });
                    instance.init(data);
                } else {
                    //this.log(1, "Module '" + moduleId + "' Registration : FAILED : instance has no init or destroy functions");
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

        function autoRegisterModules(root, medium) {
            var scopeSelector = '[data-behavior]'
              , $root = $(root)
              , $parent = $root.find(scopeSelector)
              , hasBehavior = $root.is(scopeSelector)
              ;
            var slug = $root.attr('data-behavior')
              , moduleIds = $.unique(slug.replace(/^[,;\s]+|[,;\s]+$/g, '').replace(/[,;\s]+/g, '|').replace(/[|]+$/g, '').split('|')).sort()
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

        function initialize() {
            var thus = this;
            var $root = $('html');

            this.log(1, "INITIALIZING CORE");

            $(document).ready(function () {
                thus.log(1, "ARM (AUTOMATIC MODULE REGISTRATION)");
                thus.arm($root[0], thus);
            });

        }
        
        // export precepts
        Debugger.apply(this);
        Utilities.apply(this);
        Mediator.apply(this);
        EventHubAdapter.call(this, new Mediator());
        //this.mediator = new Mediator();
        this.event_hub = new EventHubAdapter(this);
        this.http = new HTTP();
        this.dom = new DocumentUtilities();
        this.Sandbox = null;
        this.rootscope_sandbox = null;
        this.Director = null;
        this.director = null;
        this.settings = {};
        this.values = {};
        this.modules = {};
        this.register_configuration = configure;
        this.register_sandbox = registerSandbox;
        this.register_director = registerDirector;
        this.register_value = registerValue;
        this.register_module = registerModule;
        this.register_service = registerService;
        this.start = start;
        this.stop = stop;
        this.start_all = startAll;
        this.stop_all = stopAll;
        this.arm = autoRegisterModules;
        this.init = initialize;

        console.log('$', this);

        return this;
    })();


    var Vertex = ENV['V'] = ENV['Vertices'] = new (function Vertices(_CORE) {
        var STATIC = this;
        var definiendaMap = {
            '$CONFIG': 'config',
            '$SANDBOX': 'sandbox',
            '$APP': 'director',
            ' VALUE ': function (key, value) {
                // _CORE.register_value(key, value);
                // core writes to memory store as this.values[key] = value;
                // on module start: instance = new this.modules[id].Module(sandbox);...
                // instance.init( new this.values[id] ) --> id === key
            },
            ' MODULE ': function (id, Module) {
                _CORE.register_module(id, Module);
            },
            ' SERVICE ': function (Service) {  // Services receive a special sandbox including $CONFIG
                _CORE.register_service(Service);
            }
        };

        var Vertex = function Vertex() {
            var thus = this;

            function config(_config) {
                _CORE.register_configuration(_config);
                return this;
            }

            function sandbox(Sandbox) {
                _CORE.register_sandbox(Sandbox);
                return this;
            }

            function director(Director) {
                _CORE.register_director(Director);
                return this;
            }

            function value(key, value) {
                _CORE.register_value(key, value);
                return this;
            }

            function module(id, Module) {
                _CORE.register_module(id, Module);
                return this;
            }

            function service(Service) {
                _CORE.register_service(Service);
                return this;
            }

            // export precepts
            this.config = config;
            this.sandbox = sandbox;
            this.director = director;
            this.value = value;
            this.module = module;
            this.service = service;

            return this;
        };

        var V = Vertex.call(function V(id, definienda) {
            var Module = (id && id.call) ? id : definienda
              , id = (Module === id) ? false : id
              ;  // Determines if V was invoked as: V('id', Mod) or V(Mod)
            var config = id && !Module && (typeof id !== 'string') && id
              , value = id && Module && !Module.call && Module
              , id = (config) ? false : id
              , Module = (value) ? false : Module
              ;  // Determines if V was invoked as: V(new fn Config() {}) or V('key', val)
            var instantiative = (this instanceof V)
              , method = 'register'
              ;

            if (instantiative) {
                return console.log('#instanceof', this instanceof V);
                //return new Vertices( new Core() );
            }

            if (id) {  // TODO: abstract the Module vs value conditions
                if (Module) {
                    if (id in definiendaMap) {
                        method = definiendaMap[id];
                        Array.prototype.splice.call(arguments, 0, 1);
                    } else {  // normal module definition
                        method = 'module';
                    }
                } else {  // if value
                    method = 'value';
                }
            } else if (Module) {
                method = 'service';
            } else {  // if config
                method = 'config';
            }

            return V[method].apply(V, arguments);
        });

        V.define = V.register = V;

        return V;
    })(_CORE);



}).call(this, $);