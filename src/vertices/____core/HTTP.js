
; (function () {


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
    
    this.HTTP = HTTP;
}).call(this);
