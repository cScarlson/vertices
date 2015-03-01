
!(function IIF(){
	var environment = this;
	
	var Mediator = new (function Mediator(){
		var STATIC = this;
		
		var President = new (function President(){
			var STATIC = this;
			
			function MONAD(){
				return function unit(value){
					var monad = {};
					monad.bind = function(fn){
						return fn(value);
					};
					
					return monad;
				};
			}
			
			function currierFn(fn){
				return function(splat){
					fn.apply(null, arguments);
				};
			}
			
			function Deferrable(){
				function defer(){
					var deferred = { };
					var promise = new President(function exe(resolve, reject){
						deferred.resolve = resolve;
						deferred.reject = reject;
					});
					deferred.promise = promise;
					return deferred;
				}
				
				this.defer = defer;
			}
			
			Deferrable.apply(President);
			
			function President(initializer){
				if(!initializer){ throw new Error('Type Error: undefined is not a promise.'); }
				var self = this;
				var value
				  , fulfillmentHandler = function moot(r){ return r; }  // Promise A+ 2.2.1
				  , rejectionHandler = function moot(r){ return r; }  // Promise A+ 2.2.1
				  , catchHandler = function(){}
				;
				
				var states = {
					pending: true,
					fulfilled: false,
					rejected: false
				};
				
				function _getState(state){
					return states[state];
				}
				
				function _getStatus(){
					for(var key in states){
						if(states[key] === true){ return key; }
					}
					throw new Error('Status Error: Not state was found.');
				}
				
				function _setState(state){
					if('pending|fulfilled|rejected'.indexOf(state) < 0){ throw new Error('State-Set Error: Invalid state "' + state + '"'); }
					for(var key in states){ states[key] = false; }
					states[state] = true;
					self['[[PromiseStatus]]'] = state;
					self['[[PromiseValue]]'] = value;  // TODO: this is low coherence to "setting state"!
				}
				
				function _fulfill(onFulfilled, value, deferred) {
					var deferred = deferred
					  , promise2 = deferred.promise
					  , fulfillmentResult;

					try {
						fulfillmentResult = onFulfilled && onFulfilled.call && onFulfilled(value);
					} catch (err) {  // Promise A+ 2.2.7.2
						deferred.reject(err);
					}

					// Promise A+ 2.2.7
					if (!!fulfillmentResult) {  // Promise A+ 2.2.7.1
						deferred.resolve(fulfillmentResult);
					} else if (!(onFulfilled && onFulfilled.call)) {  // Promise A+ 2.2.7.3
						deferred.resolve(value);
					} else {  // Promise A+ specification?
						deferred.resolve(fulfillmentResult);
					}
				}

				function resolve(val){
					
					if(states.pending){
						value = val;
						_setState('fulfilled');
						fulfillmentHandler(value);
					}
					
				}
				
				function reject(reason){
					
					if(states.pending){
						value = reason;
						_setState('rejected');
						rejectionHandler(value);
					}
					
				}
				
				function then(onFulfilled, onRejected) {
					var deferred = President.defer()
					  , promise2 = deferred.promise;

					var fulHandler = fulfillmentHandler
					  , rejHandler = rejectionHandler
					  , ctchHandler = catchHandler;
					
					if(states.pending){
						
						rejectionHandler = currierFn(function (reason) {

							try {
								rejHandler && rejHandler(reason);
							} catch (err) {
								// catch?
							}

							try {
								rejectionResult = onRejected && onRejected.call && onRejected(value);
							} catch (err) {  // Promise A+ 2.2.7.2
								deferred.reject(err);
							}

							// Promise A+ 2.2.7.1
							if (!!rejectionResult) {
								deferred.reject(rejectionResult);
							} else if (!(onRejected && onRejected.call)) {  // Promise A+ 2.2.7.4
								deferred.reject(value);
							} else {
								deferred.reject(rejectionResult);
							}

						});
						
						fulfillmentHandler = currierFn(function (value) {
							fulHandler && fulHandler(value);
							_fulfill(onFulfilled, value, deferred);
						});
						
					} else if (!states.rejected) {
						_fulfill(onFulfilled, value, deferred);
					} else if (!states.fulfilled) {

						try {
							rejectionResult = onRejected && onRejected.call && onRejected(value);
						} catch (err) {  // Promise A+ 2.2.7.2
							deferred.reject(err);
						}

						// Promise A+ 2.2.7.1
						if (!!rejectionResult) {
							deferred.reject(rejectionResult);
						} else if (!(onRejected && onRejected.call)) {  // Promise A+ 2.2.7.4
							deferred.reject(value);
						} else {
							deferred.reject(rejectionResult);
						}

					}
					

					
					return promise2;
				}
				
				function catchException(err){
					
					if(states.pending){
						
					}
					
				}
				
				// export precepts
				this['[[PromiseStatus]]'] = 'pending';
				this['[[PromiseValue]]'] = null;
				this.then = then;
				this['catch'] = catchException;
				
				initializer(resolve, reject);
				return this;
			}
			
			return President;
		})();
		
		/**
		 * @name: mixin
		 * @description: recursive mixin
		 */
		function mixin(){
			if(arguments.length > 1){
				var receiver = Array.prototype.shift.call(arguments)
				  , sender = Array.prototype.shift.call(arguments);
				for(var key in sender){ receiver[key] = sender[key]; }
				Array.prototype.unshift.call(arguments, receiver);
				return mixin.apply(this, arguments);
			}
			
			return arguments[0];
		}
		
		/**
		 * @name: interpolate
		 * @desc: [curried] creates a new string-interpolation function
		 * @params: String -- e.g. 'the {speed} brown {mammal} jumped over the lazy {mammel2}.'
		 * @return Function [interpolator]
		 */
		var interpolate = (function(){
			var rc = {
				'\n': '\\n',
				'\"': '\\\"',
				'\u2028': '\\u2028',
				'\i2029': '\\u2029'
			};
			return function interpolate(string){
				
				/**
				 * @name: (anonymous)
				 * @desc: interpolates value into string from a mathematical-map
				 * @params: o === Object -- e.g. { speed: 'quick', mammel: 'fox', mammel2: 'dog' }
				 * @return String [interpolated]
				 */
				return new Function('o', [
					'return "', (
						string
							.replace(/[\n\r\u2028\u2029]/g, function($0){ return rc[$0]; })
							.replace(/\{{1,2}([\s\S]+?)\}{1,2}/g, '" + o["$1"] + "')
					), '";'
				].join(''));
			};
		})();
		
		/**
		 * @name: ChannelPattern
		 * @intention: Defines a data-structure containing character-patterns & behavior for a given "abstract-channel".
		 * 		* creates a pattern for a provided abstract-channel-URI to match -- based upon a provided special-URI-structure (event)
		 * @params: channel -- e.g. notice://{module}/data/:id
		 * @return: [[this]]
		 */
		var ChannelPattern = function ChannelPattern(channel){
			var paramExp = /:[^\s/]+|{+[^\s/]+}+/g
			  , channel = channel
			  , channelMatcher = new RegExp(channel.replace(paramExp, '([\\w-]+)'))
			  , proteus = channel.match(/^\w+[^://]+/g)[0];

			function match(uri){
				if(!uri.match(channelMatcher) || uri.match(channelMatcher)[0] !== uri){ return false; }
					
				return new (function ChannelMatchResult(){
					var result = uri.match(channelMatcher);
					var keys = channel.match(paramExp);
					var values = result.slice(1);
					var map = new (function ChannelMap(){})();
					
					if(keys && values){
						for(var i = 0, len = keys.length; i < len; i++){ map[ keys[i].replace(/[:{}]+/g, '') ] = values[i]; }
					}
					
					this.uri = uri;
					this.channel = channel;
					this.proteus = proteus;
					this.result = result;
					this.keys = keys;
					this.values = values;
					this.map = map;
				})();
			};
			
			this.channel = channel;
			this.proteus = proteus;
			this.match = match;
			
			return this;
		};
		
		/**
		 * @name: Subscription
		 * @intention: ...
		 * @params: options === {}
		 * @return: [[this]]
		 */
		var Subscription = function Subscription(options){
			if(!options || !options.context || !options.channel || !options.callback){ throw new Error('Channel Error: Context, channel or callback missing.'); }
			
			var options = mixin({
				context: new function NullContext(){}(),
				channel: 'NO CHANNEL SUPPLIED!',
				callback: function(){ console.error('Channel Error: No callback supplied.'); }
			}, options);
			var channelPattern = new ChannelPattern(options.channel);
			
			function matches(uri){
				var match = channelPattern.match(uri);
				if(!match){ return false; }
				
				this.uri = match.uri;
				this.channelParams = match.map;
				
				return match;
			}
			
			this.channel = options.channel;
			this.proteus = channelPattern.proteus;
			this.context = options.context;
			this.callback = options.callback;
			this.channelPattern = channelPattern;
			this.uri = channelPattern.uri;
			this.channelParams = channelPattern.map;
			this.acknowledged = false;
			this.matches = matches;
			
			return this;
		};
		
		/**
		 * @name: ChannelEvent
		 * @intention: ...
		 * @params: options === {}
		 * @return: [[this]]
		 */
		var ChannelEvent = function ChannelEvent(options){
			var options = options || {};
			
			this.subscription = options.subscription;
			this.channel = options.subscription.channel;
			this.type = options.subscription.uri;
			this.proteus = options.subscription.proteus;
			this.params = options.subscription.channelParams;
			this.target = options.subscription.context;
			
			return this;
		};
		
		/**
		 * @name: WSMedium
		 * @desc: creates a WebSocket-Medium as a Singleton
		 */
		var WSMedium = new (function WSMedium(url, name){
			var INSTANCE = this;
			
			return function WSMedium(){};
		})();
		
		/**
		 * @name: RTCMedium
		 * @desc: creates a WebRTC-Medium as a Singleton
		 */
		var RTCMedium = function RTCMedium(url, name){
			var INSTANCE = this;
			
			return function RTCMedium(){};
		};

		/**
		 * @name: SWMedium
		 * @desc: creates a SharedWorker-Medium as a Singleton
		 */
		var SWMedium = function SWMedium(url, name){
			var INSTANCE = this;
			
			return function SWMedium(){};
		};
		
		return function Mediator(config){
			var thus = this;
			
			var config = mixin({
				parent: this,
				children: [],
				channels: {}
			}, this, config || {});
			var parent = config.parent
			  , children = config.children
			  , channels = config.channels;
			
			function subscribe(channel, fn){
				if(!this.channels[channel]){ this.channels[channel] = []; }
				var subscription = new Subscription({ context: this, channel: channel, callback: fn });
				this.channels[channel].push(subscription);
				
				return this;
			}
			
			function publish(channel){
				//if(!this.channels[channel]){ return false; }
				var args = Array.prototype.slice.call(arguments, 1);
				
				// for(var i = 0, len = this.channels[channel].length; i < len; i++){
					// var subscription = this.channels[channel][i];
					// args.unshift(subscription.event);
					// subscription.callback.apply(subscription.context, args);
				// }
				
				for(var queued in this.channels){
					for(var i = 0, len = this.channels[queued].length; i < len; i++){
						var subscription = this.channels[queued][i];
						var concurrence = subscription.matches(channel);
						if(!!concurrence || queued === channel){
							var channelEvent = new ChannelEvent({ subscription: subscription });
							args.unshift(channelEvent);
							subscription.callback.apply(subscription.context, args);
						}
					}
				}
				
				return this;
			}
			
			function installTo(object){
				var sanitized = Mediator.apply(this);
				mixin(object, sanitized);
				// object.parent = parent;
				// object.children = children;
				// object.channels = channels;
				// object.subscribe = subscribe;
				// object.publish = publish;
				// object.installTo = installTo;
				// object.on = on;
				// object.fire = fire;
				// object.emit = emit;
				// object.broadcast = broadcast;
				// object.spawn = spawn;
				
				return this;
			}
			
			function emit(channel){
				this.publish.apply(this, arguments);
				parent.publish.apply(parent, arguments);
				return this;
			}
			
			function broadcast(channel){
				this.publish.apply(this, arguments);
				for(var i = 0, len = this.children.length; i < len; i++){
					var child = this.children[i];
					child.publish.apply(child, arguments);
				}
				
				return this;
			}
			
			var on = (function on(channel, fn){
				return subscribe;
			})();
			
			var fire = (function fire(channel, fn){
				return publish;
			})();
			
			function dispatch(channel){
				this.broadcast.apply(this, arguments);
				parent.publish.apply(parent, arguments);
				this.publish.apply(this, arguments);
				
				return this;
			}
			
			function spawn(object, config){
				var config = config || { parent: this };
				this.children.push(object);
				return Mediator.apply(object, [config]);
			}
			
			function use(api){
				var api = api || {};
				for(var channel in api){
					var handler = api[channel];
					!!(channel && handler) && subscribe.call(this, channel, api[channel]);
				}
				
				return this;
			}
			
			// export precepts
			this.parent = parent;
			this.children = children;
			this.channels = channels;
			this.subscribe = subscribe;
			this.publish = publish;
			this.installTo = installTo;
			this.on = on;
			this.fire = fire;
			this.emit = emit;
			this.broadcast = broadcast;
			this.spawn = spawn;
			this.use = use;
			this.extend = mixin;
			this.terp = interpolate;
			this.ChannelPattern = ChannelPattern;
			this.President = President;
			
			return this;
		};
	})();
	
	// export precepts
	environment.v = new (function Vertices(){
		var thus = this;
		
		// export precepts
		this.Mediator = Mediator;
		
		return this;
	})();
	environment.vertices = environment.v;
	
}).apply(this);
