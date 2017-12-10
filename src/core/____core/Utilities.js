
; (function () {


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

        function noop() {
            return jQuery.noop();
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

        function interpolate(str) {
            return function interpolate(o) {
                return str.replace(/{([^{}]*)}/g, function (a, b) {
                    var r = o[b], val = (typeof r === 'string' || typeof r === 'number' ? r : a);
                    return escapeHTML(val);  // TODO: escape HTML-Entities
                });
            }
        }

        function INSECURE_INTERPOLATE(str) {
            return function interpolate(o) {
                return str.replace(/{([^{}]*)}/g, function (a, b) {
                    var r = o[b], val = (typeof r === 'string' || typeof r === 'number' ? r : a);
                    return val;  // TODO: escape HTML-Entities
                });
            }
        }

        function mutate(s) {
            return function splice() {
                var a = s.split('');
                Array.prototype.splice.apply(a, arguments);
                return a.join('');
            };
        }

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

        // export precepts
        this.to_s = _toString;
        this.is_arr = is_array;
        this.is_obj = is_object;
        this.extend = extend;
        this.noop = noop;
        this.cookie = cookie;
        this.remove_cookie = remove_cookie;
        this.generate_uuid = rfc4;
        this.debounce = debounce;
        this.throttle = throttle;
        this.parse_uri = parse_uri;
        this.escapeHTML = escapeHTML;
        this.interpolate = interpolate;
        this.INSECURE_INTERPOLATE = INSECURE_INTERPOLATE;
        this.mutate = mutate;
        this.exterpolate = exterpolate;
        this.template = template;
        this.templateRepeat = templateRepeat;

        return this;
    };
    
    this.Utilities = Utilities;
}).call(this);
