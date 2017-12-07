; (function (undefined) {
    'use scrict';
    if (undefined) return;
    var ENV = this;

    var mediator = new (function Mediator() {
        var thus = this;

        var channels = {};

        function subscribe(channel, callback) {
            if (!this.$channels[channel]) this.$channels[channel] = [];
            this.$channels[channel].push({ context: this, callback: callback, channel: channel });
            return this;
        }
        function publish(channel) {
            if (!this.$channels[channel]) this.$channels[channel] = [];
            var args = [{ type: channel }].concat([].slice.call(arguments, 1));

            for (var i = 0, len = this.$channels[channel].length; i < len; i++) {
                var subscription = this.$channels[channel][i];
                subscription.callback.apply(subscription.context, args);
            }

            return this;
        }

        function on() { return subscribe.apply(this, arguments); }
        function emit() { return publish.apply(this, arguments); }

        function installTo(object) {
            object.$channels = channels;
            object.$publish = publish;
            object.$subscribe = subscribe;
            object.$emit = emit;
            object.$on = on;
            object.$installTo = installTo;
            object.$spawn = spawn;

            return object;
        }
        function spawn(object) {
            var instance = Mediator.apply(object);
            return instance;
        }

        this.$channels = channels;
        this.$publish = publish;
        this.$subscribe = subscribe;
        this.$emit = emit;
        this.$on = on;
        this.$installTo = installTo;
        this.$spawn = spawn;

        return this;
    })();


    var utilities = new (function Utilities() {
        'use strict';
        var thus = this;



        // @MIXIN (EXTEND)
        //
        // @desc: Uses TCO-Recursion to add all properties of a 'head-object' to its preceding (tail) object
        //      * DEFAULT is "DEEP"
        function mixin(__splat__) {
            var first = Array.prototype.slice.call(arguments, 0, 1)[0]  // preserve first object in arguments
                , second = Array.prototype.splice.call(arguments, 1, 1)[0]  // remove next (second) argument from arguments
                , key;

            if (second) {
                for (key in second) {
                    if ((typeof second[key]) === 'object' && (typeof first[key]) === 'object') {
                        mixin(first[key], second[key]);
                    } else {
                        first[key] = second[key];
                    }
                }
                mixin.apply(this, arguments);
            }

            return first;
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

        function template($node) {
            return ($node && $node[0]) && $node[0].outerHTML;
        }

        function templateRepeat($template, collection) {
            var tmpl = template($template);

            function compileNode(object) {
                var html = interpolate(tmpl)(object);
                $template.before($(html).removeClass('tmpl'));
            }

            collection.forEach(compileNode);

            //function compileNode(object) {
            //    var html = interpolate(tmpl)(object);
            //    nodes.push($(html).removeClass('tmpl')[0].outerHTML);
            //}
            //
            //collection.forEach(compileNode);
            //$template.before(nodes.join(''));

            return {
                clear: function clear() {
                    $template.siblings().remove();
                    return this;
                },
                append: function append(collection) {
                    templateRepeat($template, collection);
                    return this;
                },
                update: function update(collection) {
                    return this.clear().append(collection);
                }
            };
        }

        function noop() { }

        // export precepts
        this.extend = mixin;
        this.interpolate = interpolate;
        this.INSECURE_INTERPOLATE = INSECURE_INTERPOLATE;
        this.exterpolate = exterpolate;
        this.URLComponents = URLComponents;
        this.ParameterMap = ParameterMap;
        this.QueryMap = QueryMap;
        this.parseRoute = exterpolate;
        this.debounce = debounce;
        this.throttle = throttle;
        this.template = template;
        this.templateRepeat = templateRepeat;
        this.noop = noop;

        return this;
    })();


    /**
     * @ Signal
     * @ Patterns: Command
     */
    var Signal = function Signal(receiver, request) {
        var request = request || 'publish';

        this.trigger = function triggerSignal(channel) {
            var args = [].slice.call(arguments, 0);
            receiver[request]
            && receiver[request].apply(receiver, args)
            && receiver[request].apply(receiver, ['*'].concat(args));
            return this;
        };

        return this;
    };


    var Vertices = new (function Core(mediator, utils, $) {
        var STATIC = mediator.$spawn(this);
        var V = Vertices.call(V);

        function V(id, Module) {
            return Vertices.apply(V, arguments);
        }

        function Vertices(Constructor) {
            var thus = this;
            var signal, ui;

            function __bindUI() {
                STATIC.signal = STATIC.signal || new Signal(mediator, '$publish');

                $('[v-register]').each(function forEach(i, element) {
                    var el = element, rid = element.getAttribute('v-register');
                    thus.$publish('$ui:registry', rid, el);
                });

                //STATIC.ui = new Vue({ el: 'html', data: null, methods: STATIC.signal });
            }

            function initialize() {
                $(document).ready(__bindUI);

                function bind() {
                    //var name = this.name, val = this.raw, vm = this.vm, el = this.el, trigger = vm.trigger;
                    //thus.$publish('$ui:registry', val, el);
                }

                //Vue.directive('register', { bind: bind });

                //sloth({
                //    on: document.querySelectorAll('[v-register]'),
                //    threshold: 100,
                //    callback: function (element) {
                //        var el = element, rid = element.getAttribute('v-register');
                //        thus.$publish('$ui:registry', rid, el);
                //    }
                //});

                return this;
            }

            function define(id, Module) {
                var Module = (id && id.call) ? id : Module, id = (Module === id) ? false : id;

                if (!!id || !!Module) {
                    mediator.$installTo(Module.prototype);

                    if (id) {
                        STATIC.registry.mod[id] = Module;
                        mediator.$publish('$core:registry', id, Module);
                    } else {
                        var instance = new Module(utils);
                        mediator.$publish('$core:registry', id, Module, instance);
                    }
                }

                return this;
            }

            function value(key, value) {
                var val;
                if (key && value) {
                    val = STATIC.values[key] = value;
                } else if (key && !value) {
                    val = STATIC.values[key];
                }
                return val;
            }

            // export precepts
            this.init = initialize;
            this.define = define;
            this.value = value;
            this.extend = utils.extend;
            this.interpolate = utils.interpolate;
            this.INSECURE_INTERPOLATE = utils.INSECURE_INTERPOLATE;
            this.throttle = utils.throttle;
            this.debounce = utils.debounce;
            this.tpl = utils.template;
            this.repeat = utils.templateRepeat;

            return this.define.apply(this, arguments);
        };

        function elementRegistrationHandler(e, signature, element) {
            var identifiers = signature.replace(/[;,\s]*$/g, '').split(/\s+|;\s*|,\s*/g);

            for (var i = 0, len = identifiers.length; i < len; i++) {
                var identifier = identifiers[i];

                if (!identifier) continue;

                var Module = this.registry.mod[identifier];
                if (Module) {
                    var instance = new Module(element, identifier);
                    mediator.$publish('$vertex', identifier, Module, instance, element);
                }
            }

        }

        this.$subscribe('$ui:registry', elementRegistrationHandler);

        // export precepts
        this.signal = null;
        this.ui = null;
        this.registry = { mod: {}, dom: {} };
        this.values = {};

        return this.$installTo(V);
    })(mediator, utilities, $);

    ENV['V'] = ENV['Vertices'] = Vertices;

}).call(this);












// IMPLEMENTATION

/**
 * Created by i0133 on 10/5/15.
 */


/**
 * @ Mediator
 * @ /app.js
 */
V(function Director(utils) {
    'use strict';
    var thus = this;

    function searchTermChangedHandler(e, term) {
        this.$emit('ui:clientSearchChanged', term);
    }

    function registryHandler(e, name, Module, instance) {
        //console.log('@$core:registry', arguments);
    }

    function vertexFormedHandler(e, name, Module, instance, element) {
        //console.log('@$vertex', arguments);
    }

    /*
    mediationFor
        .on('ui:inputChanged'   => 'http:find')
        .on('data:found'        => 'ui:load')
        .on('error:failed'      => 'ui:alertUser')
        .on('http:sent'         => 'ui:loadWheel')
    */
    return this
        .$on('$core:registry', registryHandler)
        .$on('$vertex', vertexFormedHandler)
        .$on('ui:searchTermChanged', searchTermChangedHandler);  // handles <x v-on="event: trigger('ui:searchTermChanged', <ELEMENT>)" />
}).init();


/**
 * @ Search-Box
 * @ /client/search.js
 */
V('search-box', function SearchBox(element, name) {
    'use strict';
    var thus = this;
    var $element = $(element).focus();

    console.log('@SearchBox', this, element);

    function clientSearchChangedHandler(e) {
        var val = $(e.target).val();
        console.log('@SearchBox #clientSearchChangedHandler', val, e.target, e);
        this.$emit('ui:clientSearchChanged', val);
    }

    $element.on('input', clientSearchChangedHandler.bind(this));

    return this;
});


/**
 * @ Client-Table
 * @ /client/table.js
 */
V('client-table', function ClientTable(element, name) {
    'use strict';
    var thus = this;
    var $element = $(element);
    var $tmpl = $($element).find('.client-row.tmpl');

    console.log('@ClientTable', this, element);

    function augmentServerSideResults(term) {
        return term && this.data.accounts.filter(function (item) {
            var matches = (JSON.stringify(item).toLowerCase().indexOf(term.toLowerCase()) > -1);
            return matches && item;
        }) || this.data.accounts;
    }

    function searchTermChangedHandler(e, term) {
        $.ajax({

            url: V.interpolate('{origin}/accounts/search.json')(location),
            method: 'GET',
            data: { q: term },

            success: (function (data) {
                this.data = data;
                this.repeater.update(this.augmentServerSideResults(term));
                this.$emit('data:foundClients', data);
            }).bind(this),

            error: (function (err) {
                this.$emit('error:clientSearchFailed', err);  // signal for user-alert
            }).bind(this)

        });
    }

    this.$on('ui:clientSearchChanged', V.debounce(searchTermChangedHandler, 400));

    this.data = new function ClientsDataModel() { this.accounts = []; };
    this.repeater = V.repeat($tmpl, []);  // Uses V.interpolate(string)(object). Returns { update: fn(), clear: fn(), append: fn() }
    this.augmentServerSideResults = augmentServerSideResults;

    return this;  // or return { ... } if that's your style
});


/**
 * @ HTTP
 * @ /common/http.js
 */
V(function HTTP(utils) {
    'use strict';
    var thus = this;

    function search(term) {
        $.ajax({})
            .beforeSend(this.$emit.bind(this, 'http:sent'))     // User sees load-wheel
            .success(this.$emit.bind(this, 'data:found'))       // data gets routed
            .error(this.$emit.bind(this, 'error:httpFailed'));  // User gets alerted
    }

    function searchHandler(e, term) {
        this.search(term);
        this.$emit('http:requestSent');  // signal for load-wheel
    }

    this.$on('http:search', V.debounce(searchHandler, 400));

    // export precepts
    this.search = search;

    return this;
});