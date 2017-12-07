
;(function (undefined) {
    'use strict';
    if (undefined) return;
    var ENV = this || {};
    
    var Utilities = function Utilities() {
        var thus = this;
        
        function extend() {
            Object.assign.apply(Object, arguments);
            return this;
        }
        
        // export precepts
        this.noop = new Function();
        this.extend = extend;
        
        return this;
    };
    
    ENV['Utils'] = Utilities;
}).call(this);