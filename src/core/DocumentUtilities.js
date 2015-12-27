
; (function () {


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

        function getInnerWidth(element) {
            var $el = jQuery(element);
            return $el.innerWidth();
        }
        function getInnerHeight(element) {
            var $el = jQuery(element);
            return $el.innerHeight();
        }

        function getWidth(element) {
            return jQuery(element).width();
        }
        function setWidth(element, arg) {
            jQuery(element).width(arg);
            return this;
        }
        function getHeight(element) {
            return jQuery(element).height();
        }
        function setHeight(element, arg) {
            jQuery(element).height(arg);
            return this;
        }

        function getOuterWidth(element, includeMargin) {
            var $el = jQuery(element), args = Array.prototype.slice.call(arguments, 1);
            return $el.innerWidth.apply($el, args);
        }
        function getOuterHeight(element, includeMargin) {
            var $el = jQuery(element), args = Array.prototype.slice.call(arguments, 1);
            return $el.innerHeight.apply($el, args);
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
        this.get_inner_width = getInnerWidth;
        this.get_inner_height = getInnerHeight;
        this.get_width = getWidth;
        this.set_width = setWidth;
        this.get_height = getHeight;
        this.set_height = setHeight;
        this.get_outer_width = getOuterWidth;
        this.get_outer_height = getOuterHeight;
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
    
    this.DocumentUtilities = DocumentUtilities;
}).call(this);
