
; (function (jQuery) {


    var TemplateRepeat = function TemplateRepeat(_template, collection, interpolate, uuid) {
        var $template = jQuery(_template)
          , tmpl = __template($template)
          , uuid = uuid || $template.data('uuid') || (+Date())
          , selector = interpolate('[data-uuid="{uuid}"]')({ uuid: uuid })
        ;

        function __template($node) {
            return ($node && $node[0]) && $node[0].outerHTML;
        }

        function __compileNode(object) {
            var html = interpolate(tmpl)(object);
            $template.before(jQuery(html).attr('data-uuid', uuid).show());
        }

        function clear() {
            $template.siblings(selector).remove();
            return this;
        }

        function append(collection) {
            return new TemplateRepeat(_template, collection, interpolate, uuid);
        }

        function update(collection) {
            return this.clear().append(collection);
        }

        function show() {
            var $siblings = $template.siblings(selector);
            $siblings.show.apply($siblings, arguments);
            return this;
        }

        function hide() {
            var $siblings = $template.siblings(selector);
            $siblings.hide.apply($siblings, arguments);
            return this;
        }

        collection.forEach(__compileNode);

        // export precepts
        this.clear = clear;
        this.append = append;
        this.update = update;
        this.show = show;
        this.hide = hide;

        return this;
    };
    
    this.TemplateRepeat = TemplateRepeat;
}).call(this, $);
