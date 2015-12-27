
; (function () {


    var EventHubAdapter = function EventHubAdapter(_eventHub) {
        var thus = this, eventHub = _eventHub;

        function register_events(events) {
            for (var type in events) {
                var handler = events[type];
                eventHub.$subscribe(type, handler);
            }

            return this;
        }

        function trigger_event(event) {
            var type = event.type, data = event.data;
            eventHub.$publish(type, data);

            return this;
        }

        function remove_events(events) {
            for (var type in events) {
                var handler = events[type];
                eventHub.$unsubscribe(type, handler);
            }

            return this;
        }

        function install_to(object) {
            var colleague = eventHub.$installTo(new function Colleague() { });
            var adapter = EventHubAdapter.apply(object, [colleague]);

            // deny install_to on context to ensure Sandbox integrity (keep shallow hierarchy)
            delete adapter.install_to;  // adapter === object >> true

            return adapter;
        }

        // export precepts
        this.register_events = register_events;
        this.trigger_event = trigger_event;
        this.remove_events = remove_events;
        this.install_to = install_to;

        return this;
    };

    this.EventHubAdapter = EventHubAdapter;
}).call(this);
