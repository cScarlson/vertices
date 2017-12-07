/* ======================================================
 #SANDBOX
 ====================================================== */

/**
 *
 */
Vertices.register('$SANDBOX', function Sandbox(core, module_selector, element) {

    var DOMContextDecorator = function DOMContextDecorator(core) {

        function find(selector) {
            var nodeList = core.dom.query(selector, this.context);
            return new NodeDecorator(nodeList);
        }

        function hasClass(attrs) {
            return core.dom.has_class(this.context, attrs);
        }

        function addEvent(type, fn) {
            core.dom.bind(this.context, type, fn);
            return this;
        }

        function removeEvent(type, fn) {
            core.dom.unbind(this.context, type, fn);
            return this;
        }

        function triggerEvent(event, data, elem, onlyHandlers) {
            var args = [this.context];
            args.push.apply(args, [].slice.call(arguments, 0));
            core.dom.trigger_event.apply(core.dom, args);

            return this;
        }

        function addClass(attrs) {
            core.dom.add_class(this.context, attrs);
            return this;
        }

        function removeClass(attrs) {
            core.dom.remove_class(this.context, attrs);
            return this;
        }

        function toggleClass(attrs) {
            core.dom.has_class(this.context, attrs) && core.dom.remove_class(this.context, attrs)
            || core.dom.add_class(this.context, attrs);
            return this;
        }

        function hide() {
            core.dom.hide(this.context);
            return this;
        }

        function show() {
            core.dom.show(this.context);
            return this;
        }

        function data(attrs) {
            return core.dom.apply_data(this.context, attrs);
        }

        function attr(attrs) {
            return core.dom.apply_attrs(this.context, attrs);
        }

        function html(content) {
            return (!content && content !== 0) ? core.dom.get_innerHTML(this.context) : core.dom.set_innerHTML(this.context, content)
        }

        function val(value) {
            return (!value) ? core.dom.get_value(this.context) : core.dom.set_value(this.context, value)
        }

        function css(styles, value) {
            var style = (styles && typeof styles === 'object') ? false : styles
              , args = Array.prototype.slice.call(arguments, 0)
            ;
            args.unshift(this.context);

            return (style && !value) ? core.dom.get_style(this.context, style) : core.dom.set_styles.apply(core.dom, args)
        }

        function append(attrs) {
            core.dom.append(this.context, attrs);
            return this;
        }

        function remove(attrs) {
            core.dom.remove(this.context, attrs);
            return this;
        }

        function replaceWith(content) {
            core.dom.set_outerHTML(this.context, content);
        }

        function empty(attrs) {
            core.dom.empty(this.context, attrs);
            return this;
        }

        function toString() {
            return core.dom.get_outerHTML(this.context);
        }

        function scrollTo(selector, offset, animateSpeed) {
            var nodeList;

            if (selector) {
                nodeList = core.dom.query(selector);
            } else {
                nodeList = core.dom.query(this.context);
            }

            core.dom.animate(core.dom.query('html, body'), {
                scrollTop: core.dom.offset(nodeList).top + (offset || 0)
            }, animateSpeed || 0);

            return this;
        }

        function slideUp(attrs) {
            core.dom.slide_up(this.context, attrs);
            return this;
        }

        function slideDown(attrs) {
            core.dom.slide_down(this.context, attrs);
            return this;
        }

        function innerWidth() {
            return core.dom.get_inner_width(this.context);
        }
        function innerHeight() {
            return core.dom.get_inner_height(this.context);
        }

        function width(value) {

            if (!value && value !== 0) {
                return core.dom.get_width(this.context);
            } else {
                core.dom.set_width(this.context, value);
            }

            return this;
        }
        function height(value) {

            if (!value && value !== 0) {
                return core.dom.get_height(this.context);
            } else {
                core.dom.set_height(this.context, value);
            }

            return this;
        }

        function outerWidth(includeMargins) {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(this.context);
            return core.dom.get_outer_width.apply(core.dom, args);
        }
        function outerHeight(includeMargins) {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(this.context);
            return core.dom.get_outer_height.apply(core.dom, args);
        }

        function offset() {
            //TODO: we may want to accept an arg to set the offset, but I don't need that now.
            return core.dom.offset(this.context);
        }

        function outerHeight(includeMargins) {
            //TODO: we may want to accept an arg to set the outer height, but I don't need that now.
            return core.dom.outer_height(this.context, includeMargins);
        }

        function serialize() {
            return core.dom.serialize_form(this.context);
        }

        function comboBox(options) {
            core.dom.combo_box(this.context, options);
            return this;
        }

        function siblings(selector) {
            return core.dom.get_siblings(this.context, selector);
        }

        function each(fn) {
            core.dom.each(this.context, fn);
            return this;
        }

        function size() {
            core.dom.size(this.context);
            return this;
        }

        function log(message) {
            core.log(1, message);
        }

        //TODO: Temp inferface for AJAX for infiniload.
        function getData(url, options) {
            return core.http.get(url, options)
        }
        this.getData = getData;

        // exports
        this.find = find;
        this.addEvent = addEvent;
        this.removeEvent = removeEvent;
        this.triggerEvent = triggerEvent;
        this.hasClass = hasClass;
        this.addClass = addClass;
        this.removeClass = removeClass;
        this.toggleClass = toggleClass;
        this.html = html;
        this.val = val;
        this.css = css;
        this.append = append;
        this.remove = remove;
        this.empty = empty;
        this.replaceWith = replaceWith;
        this.toString = toString;
        this.scrollTo = scrollTo;
        this.offset = offset;
        this.innerWidth = innerWidth;
        this.innerHeight = innerHeight;
        this.width = width;
        this.height = height;
        this.outerWidth = outerWidth;
        this.outerHeight = outerHeight;
        this.serialize = serialize;
        this.comboBox = comboBox;
        this.slideUp = slideUp;
        this.slideDown = slideDown;
        this.attr = attr;
        this.data = data;
        this.siblings = siblings;
        this.each = each;
        this.size = size;
        this.hide = hide;
        this.show = show;
        this.combobox = comboBox;
        this.log = log;

        return this;
    };

    var NodeDecorator = function (element) {
        var element = element;

        // export
        this.length = 0;  // ensure length is 0 push request
        this.context = element;
        Array.prototype.push.apply(this, element);

        return this;
    };
    NodeDecorator.prototype = new DOMContextDecorator(core);

    var Notifications = function Notifications(core) {
        var thus = core.event_hub.install_to(this);

        function notify(evt) {
            if (core.is_obj(evt) && evt.type) {
                thus.trigger_event(evt);
            }

            return this;
        }

        function listen(evts) {
            if (core.is_obj(evts)) {
                thus.register_events(evts);
            }

            return this;
        }

        function ignore(evts) {
            if (core.is_obj(evts)) {
                thus.remove_events(evts);
            } else if (DEBUG) {
                core.log("Ignore needs an object with the event channel and handler (just like listen")
            }

            return this;
        }

        // exports
        this.notify = notify;
        this.listen = listen;
        this.ignore = ignore;

        return this;
    };

    // TODO!
    var Utilities = function Utilities(core) {

        // TODO: notify core of new element as to apply data-behavior. [is "TODO" below necessary?]
        // TODO suggestion (deprecated? see above): return new NodeDecorator( element )?
        function createElement(el, config) {
            var i = 0
              , child
              , text
              , element = core.dom.create(el);

            if (config) {
                if (config.children && core.is_arr(config.children)) {
                    while (child = config.children[i]) {
                        element.appendChild(child);
                        i++;
                    }
                    delete config.children;
                }

                if (config.text) {
                    element.appendChild(document.createTextNode(config.text));
                    delete config.text;
                }

                core.dom.apply_attrs(element, config);
            }

            return new NodeDecorator([element]);  // TODO: Broken Window ( "[element]" ). Handle nodelists.
        }

        function extend() {
            return core.extend.apply(core, arguments);
        }

        function generateUUID() {
            return core.rfc4();
        }

        function throttle(callback, delay) {
            return core.throttle(callback, delay);
        }

        function debounce(callback, delay) {
            return core.debounce(callback, delay);
        }

        function cookie(options) {
            return core.cookie.apply(core, arguments);
        }

        function removeCookie() {
            return core.remove_cookie.apply(core, arguments);
        }

        function repeatTemplate(element, collection) {
            return core.template_repeat.call(core, element, collection);
        }

        // export
        this.createElement = createElement;
        this.extend = extend;
        this.generateUUID = generateUUID;
        this.throttle = throttle;
        this.debounce = debounce;
        this.cookie = cookie;
        this.removeCookie = removeCookie;
        this.repeat = repeatTemplate;

        return this;
    };

    var Adapter = function Adapter(core) {
        var CONTAINER = core.dom.query(element);  // Container of the module in the DOM
        var $CONTAINER = new NodeDecorator(CONTAINER);

        function arbiter() {
            return $CONTAINER.find.apply($CONTAINER, arguments);
        }

        // adapt precepts
        arbiter.context = $CONTAINER.context;
        DOMContextDecorator.call(arbiter, core);
        Notifications.call(arbiter, core);
        Utilities.call(arbiter, core);

        return arbiter;
    };
    Adapter.prototype = new Array();

    return new Adapter(core);
});
