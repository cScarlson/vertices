/* ======================================================
   #SANDBOX
   ====================================================== */

/**
 * TODO: Sandbox should not be global. Define Sandbox inside of closure while making request to core to register sandbox
 */

CORE.register('$SANDBOX', function Sandbox(core, module_selector) {

    var NodeDecorator = function DOMContextDecorator(core, element) {
        var element = element;

        function find(selector) {
            var el = core.dom.query(selector, element);
            return new NodeDecorator(core, el);
        }

        function addEvent(type, fn) {
            core.dom.bind(element, type, fn);
            return this;
        }

        function removeEvent(type, fn) {
            core.dom.unbind(element, type, fn);
            return this;
        }

        function toggleClass(attrs) {
            core.dom.has_class(element, attrs) && core.dom.remove_class(element, attrs)
              || core.dom.add_class(element, attrs);

            return this;
        }

        // exports
        this.context = element;
        this.find = find;
        this.addEvent = addEvent;
        this.removeEvent = removeEvent;
        this.toggleClass = toggleClass;

        return this;
    };

    var Notifications = function Notifications(core) {

        function notify(evt) {
            if (core.is_obj(evt) && evt.type) {
                core.triggerEvent(evt);
            }
        }

        function listen(evts) {
            if (core.is_obj(evts)) {
                core.registerEvents(evts, module_selector);
            }
        }

        function ignore(evts) {
            if (core.is_arr(evts)) {
                core.removeEvents(evts, module_selector);
            }
        }

        // exports
        this.notify = notify;
        this.listen = listen;
        this.ignore = ignore;

        return this;
    };

    // TODO!
    var Utilities = function Utilities(core) {

        function createElement(element, config) {
            var i, child, text;
            element = core.dom.create(el);

            if (config) {
                if (config.children && core.is_arr(config.children)) {
                    while (child = config.children[i]) {
                        element.appendChild(child);
                        i++;
                    }
                    delete config.children;

                    if (config.text) {
                        element.appendChild(document.createTextNode(config.text));
                        delete config.text;
                    }
                    core.dom.apply_attrs(el, config);
                    return element;
                }
            }

            // suggestion: return new NodeDecorator( element ) on this line; also, core.dom.create(el) argument (el) is undefined
        }

        this.createElement = createElement;

        return this;
    };

    var Sandbox = function Adapter(core) {
        // Container of the module in the DOM
        var CONTAINER = core.dom.query("[data-behavior='" + module_selector + "']");
        var $arbiter = arbiter.bind(this);
        var $CONTAINER = NodeDecorator.apply($arbiter, [core, CONTAINER]);  // $CONTAINER === $arbiter >> true

        function arbiter(selector) {
            return $CONTAINER.find.apply($CONTAINER, arguments);
        }

        // adapt precepts
        Notifications.call($CONTAINER, core);
        Utilities.call($CONTAINER, core);

        return $CONTAINER;
    };

    return new Sandbox(core);
});