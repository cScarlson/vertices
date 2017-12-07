
;(function (undefined) {
    'use strict';
    if (undefined) return;
    var ENV = this;
    
    var EventHub = function EventHub() {
        var thus = this;
        var channels = {};
        
        function publish(channel) {
            if (!this.channels[channel]) this.channels[channel] = [];
            var args = Array.prototype.slice.call(arguments, 1);
            var subscriptions = this.channels[channel];
            var event = { type: channel };
            
            args.unshift(event);
            
            for (var i = 0, len = subscriptions.length; i < len; i++) {
                var subscription = subscriptions[i]
                  , context = subscription.context
                  , handler = subscription.handler
                  ;
                handler.apply(context, args);
            }
            
            return this;
        }
        
        function subscribe(channel, handler) {
            if (!this.channels[channel]) this.channels[channel] = [];
            var subscription = { context: this, channel: channel, handler: handler };
            this.channels[channel].push(subscription);
            
            return this;
        }
        
        function unsubscribe(channel, handler) {
            if (!this.channels[channel]) 'throw new Error';
            return this;
        }
        
        function installTo(object) {
            var o = EventHub.apply(object);
            o.channels = this.channels;
            return o;
        }
        
        // export precepts
        this.channels = channels;
        this.publish = publish;
        this.subscribe = subscribe;
        this.unsubscribe = unsubscribe;
        this.installTo = installTo;
        
        return this;
    };
    
    ENV['EventHub'] = EventHub;
    
}).call(this);
