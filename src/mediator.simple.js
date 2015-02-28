
/***/
define(function(){

	var mediator = (new (function Mediator(){
		var thus = this;
		
		/***/
		function subscribe(channel, fn){
			if(!this.channels[channel]){ this.channels[channel] = []; }
			var subscription = { context: this, callback: fn, };
			this.channels[channel].push(subscription);
			
			return this;
		}
		
		/***/
		function publish(channel){
			if(!this.channels[channel]){ return false; }
			var args = Array.prototype.slice.call(arguments, 1);
			for(var i = 0, len = this.channels[channel].length; i < len; i++){
				var subscription = this.channels[channel][i];
				subscription.callback.apply(subscription.context, args);
			}
			
			return this;
		}
		
		/***/
		function installTo(object){
			object.channels = this.channels;
			object.subscribe = this.subscribe;
			object.publish = this.publish;
			object.on = this.on;
			object.fire = this.fire;
			object.installTo = this.installTo;
			object.spawn = this.spawn;
			
			return object;
		}
		
		/***/
		function spawn(object){
			return Mediator.apply(object);
		}
		
		/***/
		function on(){
			return subscribe.apply(this, arguments);
		}
		
		/***/
		function fire(){
			return publish.apply(this, arguments);
		}
		
		this.channels = new function ChannelMedium(){};
		this.subscribe = subscribe;
		this.publish = publish;
		this.installTo = installTo;
		this.on = on;
		this.fire = fire;
		this.spawn = spawn;
		
		return this;
	})());
	
	/*
	var mediatorBasic = (function Mediator(){
		
		function subscribe(channel, fn){
			if(!mediator.channels[channel]){ mediator.channels[channel] = []; }
			mediator.channels[channel].push({ context: this, callback: fn });
			return this;
		}
		
		function publish(channel){
			if(!mediator.channels[channel]){ return false; }
			var args = Array.prototype.slice.call(arguments, 1);
			for(var i = 0, len = mediator.channels[channel].length; i < len; i++){
				var subscription = mediator.channels[channel][i];
				subscription.callback.apply(subscription.context, args);
			}
			return this;
		}
		
		return {
			constructor: Mediator,
			channels: {},
			subscribe: subscribe,
			publish: publish,
			installTo: function(object){
				object.subscribe = subscribe;
				object.publish = publish;
			}
		};
	}());
	*/

	return mediator;
});