
; (function () {


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
    
    this.Debugger = Debugger;
}).call(this);
