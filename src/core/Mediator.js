
; (function () {


    var Mediator = function Mediator(parent) {
        var thus = this;
        var parent = parent || this
          , siblings = parent.$children || []
          , children = []
          , channels = {}
        ;

        var ChannelEvent = function ChannelEvent(options) {

            function stopPropagation() {
                this.prapagationStopped = true;
            }

            // export
            this.type = options.channel;
            this.prapagationStopped = false;
            this.stopPropagation = stopPropagation;

            return this;
        };

        function subscribe(channel, handler) {
            if (!this.$channels[channel]) this.$channels[channel] = [];
            var subscription = { context: this, handler: handler, channel: channel };
            this.$channels[channel].push(subscription);

            return this;
        }

        function publish(channel) {
            if (!this.$channels[channel]) this.$channels[channel] = [];
            var args = Array.prototype.slice.call(arguments, 1)
              , event = new ChannelEvent({ channel: channel });

            args.unshift(event);

            for (var i = 0, len = this.$channels[channel].length; i < len; i++) {
                var subscription = this.$channels[channel][i];
                subscription.handler.apply(subscription.context, args);
            }

            return this;
        }

        // TODO: Allow alternative params. Channels-to-Handlers is a many-to-many relationship. Also, allow empty args: repeal subscriptions for all with context.
        function unsubscribe(channel, handler) {
            var context = this;

            for (var i = this.$channels[channel].length; i--;) {
                var subscription = this.$channels[channel][i];

                if (subscription.context === context) {
                    if (handler) {

                        if (subscription.handler === handler) {
                            this.$channels[channel].splice(i, 1);
                        }

                    } else {
                        this.$channels[channel].splice(i, 1);
                    }

                }

            }

            return this;
        }


        function on() {
            return this.$subscribe.apply(this, arguments);
        }

        function trigger() {
            return this.$publish.apply(this, arguments);
        }

        function off() {
            return this.$unsubscribe.apply(this, arguments);
        }

        function post() {

            for (var i = 0, len = this.$siblings.length; i < len; i++) {
                var sibling = this.$siblings[i];
                if (sibling !== this) {
                    sibling.$publish.apply(sibling, arguments);
                }
            }

            return this;
        }

        function fire() {
            this.$trigger.apply(this, arguments).$emit.apply(this, arguments).$post.apply(this, arguments).$broadcast.apply(this, arguments);
            return this;
        }

        function emit() {

            if (parent !== this) {
                parent.$publish.apply(parent, arguments);
                parent.$emit.apply(parent, arguments);
            }

            return this;
        }

        function broadcast() {

            for (var i = 0, len = children.length; i < len; i++) {
                var child = children[i];
                child.$publish.apply(child, arguments);
                child.$broadcast.apply(child, arguments);
            }

            return this;
        }

        function anycast() {
            //this.what(?);
            return this;
        }

        function split(object) {
            object.$channels = channels;
            object.$subscribe = subscribe;
            object.$publish = publish;
            object.$on = on;
            object.$trigger = trigger;
            object.$split = split;

            return object;
        }

        function installTo(object) {
            object.$parent = parent;
            object.$children = children;
            object.$siblings = siblings;
            object.$channels = channels;
            object.$subscribe = subscribe;
            object.$publish = publish;
            object.$unsubscribe = unsubscribe;
            object.$on = on;
            object.$trigger = trigger;
            object.$off = off;
            object.$post = post;
            object.$fire = fire;
            object.$emit = emit;
            object.$broadcast = broadcast;
            object.$installTo = installTo;
            object.$spawn = spawn;

            return object;
        }

        function spawn(object) {
            var instance = Mediator.apply(object, [this]);
            this.$children.push(instance);
            return object;
        }

        // broadcast -> transfer message to all recipients symultaneously
        // anycast -> route datagrams from single sender to topolocically nearest node(s) in group of potential receivers
        // multicast -> 1-to-many or many-to-many; addressed to a group of nodes symultaneously
        // unicast -> sending of messages to single network destination
        // geocast -> specialized form of multicast; nodes are targeted by geographical context
        // we are bending, if not breaking, these definitions

        // export precepts
        this.$parent = parent;
        this.$children = children;
        this.$siblings = siblings;
        this.$channels = channels;
        this.$subscribe = subscribe;
        this.$publish = publish;
        this.$unsubscribe = unsubscribe;
        this.$on = on;
        this.$trigger = trigger;
        this.$off = off;
        this.$post = post;
        this.$fire = fire;
        this.$emit = emit;
        this.$broadcast = broadcast;
        this.$split = split;
        this.$installTo = installTo;
        this.$spawn = spawn;

        return this;
    };

    this.Mediator = Mediator;
}).call(this);
