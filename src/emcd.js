
/***/
;(function(){
	
	var emcd = new (function EMCD(_ENVIRONMENT){
		
		/**
		 * * * * * * * * * * * * * *
		 * 			 T  |		   *
		 * 			 O  ||		   *
		 * 			 D  ||||	   *
		 * 			 O  |||||||| * *
		 * 			 : 	Event object as first parameter, ChannelParams object as last paremeter, Subscription object as Event property OR 2nd to last parameter
		 * 			 *	clean up ChannelPattern Class
		 * 			 *	clean up Subscription Class
		 * 			 *	clean up Publish Method
		 * 			 *	clean up methodology for relationship(s)/composition (if any) between Event, Subscription, & ChannelParams
		 * 			 *	clean up methodology for Configuration & Permissions thereof
		 * 			 *	clean up namespacing for mixin, interpolate, SharedWorker, WebSocket, WebRTC, & framework at large.
		 * * * * * * *	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
		 */
		
		/**
		 * @name: iMediator
		 * @desc: ...
		 */
		var iMediator = (function iMediator(){
			
			function preceptNotImplemented(name){
				var warning = 'Warning: {{precept}} not implemented!'.replace(/\{+\w+\}+/, name);
				console.error(warning);
				return warning;
			}
			
			return function iMediator(){
				
				this.channels = this.channels || preceptNotImplemented('channels');
				this.subscribe = this.subscribe || preceptNotImplemented;
				this.publish = this.publish || preceptNotImplemented;
				this.installTo = this.installTo || preceptNotImplemented;
				
			};
		})();
		
		/**
		 * @TODO: Ensure Promise A+ conformancy
		 * @TODO: Acknowledgement of onFulfilled & onRejected returns
		 * @TODO: Add chainable .then calls
		 * @TODO: Add catch method
		 * @name: President
		 * @desc: creates a new promise which adhere's to the Promise A+ specification
		 */
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
		 * @name: CompositeMediator
		 * @desc: ...
		 * @patterns: [ Composite, Mediator, Singleton - (with Constructor-Hijacking), Decorator - (via Constructor-Hijacking) ]
		 * @params: 
		 * @return: [[this]]
		 */
		var CompositeMediator = new (function CompositeMediator(){
			var self = this
			  , INSTANCE;
			
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
				  , protocol = channel.match(/^\w+[^://]+/g)[0];

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
						this.protocol = protocol;
						this.result = result;
						this.keys = keys;
						this.values = values;
						this.map = map;
					})();
				};
				
				this.channel = channel;
				this.protocol = protocol;
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
				this.protocol = channelPattern.protocol;
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
				this.protocol = options.subscription.protocol;
				this.params = options.subscription.channelParams;
				this.target = options.subscription.context;
				
				return this;
			};
			
			/***/
			var CompositeMediator = function CompositeMediator(config){
				var thus = this;
				
				var config = config || {};
				var config = mixin({
					parent: config.parent || this,
					abstractChannels: (config.parent && config.parent.abstractChannels || config.abstractChannels) || true,
					shiftPromises: config.shiftPromises || true
				}, config);
				
				var _abstractChannels = config.abstractChannels
				  , _parent = config.parent
				  , _children = [];
				
			    /**
                 * @name: applySignal,
                 * @desc: applies a Signal-Promise (Event) to a Channel-Subscription
                 * @params: [signal, subscription, channelEvent]
                 * @return: [[void]]
                 */
				function applySignal(signal, subscription, channelEvent) {
				    if (!signal) throw new Error('Signal Error: Signal is absent.');
				    signal.then(function (splat) {
				        return [channelEvent].concat(splat);
				    }).then(function (modded) {
				        subscription.callback.apply(subscription.context, modded);
				        return modded;
				    });
				}
				
				/**
				 * @name: subscribe,
				 * @description: subscribes to event on current-instance's channels
				 */
				function subscribe(channel, fn){
					var subscription = new Subscription({ context: this, channel: channel, callback: fn });
					
					this.channels[channel] = this.channels[channel] || [];
					this.streams[channel] = this.streams[channel] || [];
					this.channels[channel].push(subscription);
					
					for (var queued in this.streams) {
						var channelMatchResult = subscription.matches(queued);
						for (var i = 0, len = this.streams[queued].length; i < len; i++) {
							if (channel === queued || (channelMatchResult && this.abstractChannels)) {
								var signal = this.streams[queued][i];
								var channelEvent = new ChannelEvent({ subscription: subscription });
								applySignal(signal, subscription, channelEvent);

							}
						}
					}
					
					return this;
				}
				
				/** TODO: make this function more understandable (this is pure dogsh!t)
				 * @name: publish,
				 * @description: publishes event on current-instance's channels
				 */
				function publish(channel){
				    var args = Array.prototype.slice.call(arguments, 1)
					  , queued = ''
					  , i = 0, len = 0
					  , subscription = {}
					  , channelMatchResult
					  , channelEvent;
					
					this.streams[channel] = this.streams[channel] || [];
					this.channels[channel] = this.channels[channel] || [];
					
					var signal = new emcd.President(function ex(resolve, reject){
					    resolve.apply(this, args);
					});
					//var deferred = Promise.defer();
					//signal = deferred.promise;
					//deferred.resolve(args);
					
					this.streams[channel].push(signal);
					
					for(queued in this.channels){
						for(i = 0, len = this.channels[queued].length; i < len; i++){
							subscription = this.channels[queued][i];
							channelMatchResult = subscription.matches(channel);
							if(channel === queued || (channelMatchResult && this.abstractChannels)){
							    channelEvent = new ChannelEvent({ subscription: subscription });
							    applySignal(signal, subscription, channelEvent);
							}
						}
					}
					
					return this;
				}
				
				/**
				 * @name: on,
				 * @description: shorthand of subscribe
				 */
				function on(){
					return subscribe.apply(this, arguments);
				}
				
				/**
				 * @name: fire,
				 * @description: shorthand of publish
				 */
				function fire(){
					return publish.apply(this, arguments);
				}
				
				/**
				 * @name: emit
				 * @description: publishes event through channel on parent's medium & requests parent to emit to its parent
				 * @receivers: 
				 */
				function emit(){
					if(_parent !== this){
						_parent.publish.apply(_parent, arguments);
						_parent.emit.apply(_parent, arguments);
					}
					return this;
				}
				
				/**
				 * @name: broadcast,
				 * @description: forwards event through channel on parent's medium -- telling parent to publish & forward on all children
				 * @receivers: 
				 */
				function broadcast(){
					_parent.forward.apply(_parent, arguments);
					return this;
				}
				
				/**
				 * @name: forward,
				 * @description: publishes event through channel on each child medium & requests child to forward request to its children
				 * @receivers: 
				 */
				function forward(){
					var i, len, child;
					for(i = 0, len = this.children.length; i < len; i++){
						child = this.children[i];
						child.publish.apply(child, arguments);
						child.forward.apply(child, arguments);
					}
					
					return this;
				}
				
				/**
				 * @name: echo
				 * @description: publishes on all relative mediums (including vicarious) (especially used for EventHubs)
				 */
				function echo(){
					this.forward.apply(this, arguments);
					this.publish.apply(this, arguments);
					this.emit.apply(this, arguments);
					
					return this;
				}
				
				/**
				 * @name: post
				 * @description: issues a publishment on one specific node
				 */
				function post(node){
					var args = Array.prototype.slice.call(arguments, 1);
					
					console.log('@post', node, args, arguments);
					node.publish.apply(node, args);
					
					return this;
				}
				
				/**
				 * @name: installTo,
				 * @description: ...
				 */
				function installTo(object, abstractChannels){
					// TODO: use mixin for this!
					// parent === this's _parent
					mixin(object, this);
					object.children = [];  // installs should not share children with parent, otherwise they are their own child -- propones a loop.
					object.abstractChannels = abstractChannels === false ? false : this.abstractChannels;
					// object.channels = this.channels;
					// object.subscribe = this.subscribe;
					// object.publish = this.publish;
					// object.on = this.on;
					// object.fire = this.fire;
					// object.emit = this.emit;
					// object.broadcast = this.broadcast;
					// object.forward = this.forward;
					// object.echo = this.echo;
					// object.post = this.post;
					// object.installTo = this.installTo;
					// object.spawn = this.spawn;
					// object.use = createSubscriptions;
					// object.EventHub = this.EventHub;
					// object.mixin = this.mixin;
					// object.interpolate = this.interpolate;
					
					return object;
				}
				
				/**
				 * @name: spawn,
				 * @description: applies data & behavior to target-object as if were new instance & creates parent-child linkage
				 */
				function spawn(object, config){
					var config = mixin({
						parent: this,
						abstractChannels: _parent.abstractChannels
					}, config);
					// parent === this
					// children === new instance's scope var this.children
					this.children.push(object);  // add child to callee-object's this.children
					return CompositeMediator.apply(object, [config]);  // add this as parent
				}
				
				/**
				 * @name: createSubscriptions
				 * @description: creates subscriptions from an object using its methods & respective method's key-names
				 */
				function createSubscriptions(api){
					var api = api || {}
					  , methodName
					  , method;
					
					for(methodName in api){
						method = api[methodName];
						if(!!method.call){  // is a function
							this.subscribe(methodName, method);
						}
					}
					
					return this;
				}
				
				// Precepts
				this.children = _children;
				this.abstractChannels = _abstractChannels;
				this.channels = new function ChannelMedium(){};
				this.streams = new function ChannelStreamMedium(){};
				this.subscribe = subscribe;
				this.publish = publish;
				this.on = on;
				this.fire = fire;
				this.emit = emit;
				this.broadcast = broadcast;
				this.forward = forward;
				this.echo = echo;
				this.post = post;
				this.installTo = installTo;
				this.spawn = spawn;
				this.use = createSubscriptions;
				this.mixin = mixin;
				this.interpolate = interpolate;
				
				return this;
			};
			
			/**
			 * @name: getInstance
			 * @desc: ensure only one(1) rootMedium can exist, while allowing CompositeMediator's .spawn() & .installTo() methods to produce new instance contexts
			 */
			return function getInstance(parent, options){
				INSTANCE = INSTANCE || new CompositeMediator(parent, options);
				return INSTANCE;
			};
		})();
		
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
		
		this.mixin = mixin;
		this.interpolate = interpolate;
		this.President = President;
		this.CompositeMediator = CompositeMediator;
		
		_ENVIRONMENT.emcd = this;
		
		return this;
	})(window || self || this);
	
}).apply(this);