VerticesJS <small>for Event-Driven Architectures</small>
===================


Emergent Mediation for Compositive Architectures.

----------

### Table of contents

[TOC]



Documentation
-------------

VerticesJS organizes complex dependencies and object-communication into manageable, comprehensible modules. If you are either Initializing or Refactoring your project, there's no better way to develop a clean and *scalable* application architecture.

> **Benefits:**

> - Mitigate *System-Entropy*.
> - Virtually eradicate *Coupling*.
> - Organize your module-network's *Link-Degree* (Fan-In | Fan-Out).
> - Increase *Scalability* and make your modules truly *Liftable*.
> - Ensure *Application-Security & Module-Authorization*
> - Enforce *engineering-conventions* at the Application-Level
> - Easily scale to & from *Vertical, Horizontal, and Fractal Architectures*
> - **The only tool for achieving *Absolute Scalability***.

#### <i class="icon-check"></i>  Vertical & Horizontal Scaling
#### <i class="icon-check"></i>  Recursive & Fractal Scaling
#### <i class="icon-check"></i>  Channel Schema
#### <i class="icon-check"></i>  Discrete Media
#### <i class="icon-check"></i>  [Abstract Channels](#abstractChannels)
#### <i class="icon-check"></i>  [Disclosures](#disclosures)
#### <i class="icon-check"></i>  Sandboxes & Facades
#### <i class="icon-check"></i>  Utilities
#### <i class="icon-check"></i>  Mixins
#### <i class="icon-check"></i>  Interpolation
#### <i class="icon-check"></i>  Promises
#### <i class="icon-check"></i>  EventHub
#### <i class="icon-check-empty"></i>  WebSocket
#### <i class="icon-check-empty"></i>  SharedWorkers
#### <i class="icon-check-empty"></i>  WebRTC
#### <i class="icon-check-empty"></i>  Node

> **Coming Soon!** We're trying our best-est to get these in!


----------


Usage
-------------------
*/facade.js*
```
define(['vertices'], function(v){
	
	var facade = new (function(v){
		var rootMedium = new v.Mediator(config)
		  , thus = rootMedium.spawn(this);
		
		function registerCtrlHandler(event, name, fn){
			if(isModuleAuthorized){
				this.fire('core:registerController', name, fn);	
			}
		}
		
		// export precepts
		this.on('registration:Ctrl', registerCtrlHandler);
		
		return this;
	})(v);
	
	return facade;
});
```
*/app.js*
```
define(['lib1', 'facade', 'index'], function($1, facade, index){
	
	var core = new (function ApplicationCore(facade){
		var thus = facade.installTo(this);
		
		function ctrlRegistrationHandler(event, name, fn){
			this.controllers[name] = fn;
		}
		
		// export precepts
		return this.use({
			'...': ...,
			'core:registerController': ctrlRegistrationHandler,
			'...': ...
		});
	})(facade);
	
	return core;
});
```
*/controllers/index-controller.js*
```
define(['facade'], function(facade){
	
	var indexCtrl = new (function IndexCtrl(facade){
		var thus = facade.installTo(this);
		
		function controller(){ ... }
		
		function initialize(){ ... }
		
		// export precepts
		return this.use({
			'indexCtrl://start': initialize
		}).fire('registration:Ctrl', 'indexCtrl', controller);
	})(facade);
	
	return indexCtrl;
});
```

----------

Initialization
-------------

#### <i class="icon-cog"></i> Mediator: new v.Mediator(config)
###### Type: Constructor
Creates the first *Discrete Medium*.
*e.g:*
```
var rootMedium = new v.Mediator(config);
```

Composition
-------------
#### <i class="icon-cog"></i> InstallTo: medium.installTo(installee)
Adds the *installee* object to the discrete medium as a *Colleague*.
*e.g:*
```
applicationCore.installTo(applicationFacade);
```

#### <i class="icon-cog"></i> Spawn: parent.spawn(child)
Adds a *Child-Colleague* to the discrete medium -- pushing the child to its `children` collection -- for later communication via [emissions](#emit) & [broadcasts](#broadcast). This is how *Compositive Architectures* can be created.
*e.g:*
```
applicationFacade.spawn(calendarFacade);
```


Methods
-------------

Once you've created your first instance of a Mediator, you can begin using its methods -- which include each, **Mediation-Methods**, **Composition-Methods**, and **Utility-Methods**. These methods are only available to a *Colleague* once the colleague has either *installed-to* a *Discrete Medium* or has *spawned* from it.

### Mediation

#### <i class="icon-cog"></i> Subscribe: object.subscribe()
Adds a *Subscription* object to a channel's collection, for a given medium. *Publishers* may signal *Subscribers* who are listening for events on a specific channel.
###### Return: this
*e.g:*
```
function handler(event, arg1, arg2){ ... }
this.subscribe('core:ready', handler);
```

#### <i class="icon-cog"></i> Publish: object.publish()
Dispatches a *Signal* for a channel on a given medium, creating and event which *Subscribers* are listening for.
###### Return: this
*e.g:*
```
this.publish('core:ready', datum1, datum2);
```
#### <i class="icon-cog"></i> On: object.on()
Shorthand for `subscribe`. [See [Subscribe](#subscribe)]
###### Return: this

#### <i class="icon-cog"></i> Fire: object.fire()
Shorthand for `publish`. [See [Publish](#publish)]
###### Return: this

#### <i class="icon-cog"></i> Emit: child.emit()
Dispatches a signal *Up-Scope* through the Composite-Chain, stopping at its first parent *and* fires on the medium which invoked this method.  This medium must *spawn* from the target medium. **Multiple parents are not supported**.
###### Return: this
*e.g:*
*/facade.js*
```
this.on('calendar:todoAdded', todoAddedHandler);
// parent
```
*/calendar/core.js*
```
this.fire('calendar:todoAdded', item);
// child
```

#### <i class="icon-cog"></i> Broadcast: parent.broadcast()
Dispatches a signal to **all children** to a given medium *and* the medium which invoked this method. Any media which have *spawned* from this medium will be signaled -- and -- those objects which have *installed-to* this medium. **Multiple children are supported**.
###### Return: this
*e.g:*
*/facade.js*
```
this.on('application:serverSentEvent', sse);
// parent
```
*/{any|all}/facade.js*
```
this.fire('application:serverSentEvent', handler);
// any given child
```

#### <i class="icon-cog"></i> Use: object.use(API)
Takes a Hash of *channel-handler* pairs and registers a new Subscription on a given medium for each channel -- assigning its handler to the subscription. This is a convenience method intended to augment Pure OOD for comprehension sake.
###### Return: this
*e.g:*
```
var myModule = new (function MyConstructorName(){
	var thus = medium[installToOrSpawn](this);
	
	return this.use({
		appReady: appReadyHandler,
		'something:changed': somethingChangedHandler,
		'use some spaces -- or -- dashed': thatHandler
	});
})();
```

### Utilities

#### <i class="icon-cog"></i> Interpolate: medium.terp(str)(obj)
###### Type: Curry
###### Return: String
Interpolates Hash-Parameters into a String.
*e.g:*
```
this.terp('The {speed} brown {species1} jumped over the lazy {species2}!')({
	speed: 'quick',
	species1: 'fox',
	species2: 'dog'
});
```

#### <i class="icon-cog"></i> Extend: medium.extend(obj1, obj2, objN)
###### Type: Mixin (recursive, TCO)
Merges Hash-Values from mulitple objects into a single object. **Deep is not supported**.
*e.g:*
```
var step1 = { step1: 'Toast Pastry in oven.' };
var step2 = { step2: "Go ahead, toast 'em..." };
var step3 = { step3: 'Hey, are you still reading this!...?' };
var briansInstructions = this.extend(step1, step2, step3);
```

### Constructors

#### <i class="icon-cog"></i> President: new medium.President()
###### Type: Constructor
Creates a new Promise object. Presidents follow the **Promise A+ Specification**. **Deferred is supported**; **.catch() is not supported**.
*e.g:*
```
var promise = new this.President(function (resolve, reject){
	if(something){ resolve(data); } else { reject }
});

promise.then(function onFulfilled(data){
	return { meta: data };
}, function onRejected(reason){
	return { overview: reason };
}).then(function onFulfilledChained(metadata){
	...
}, onRejectedChained(reasoning){
	...
}).then(...);
```
*Deferred:*
```
var deferred = this.President.defer();
```
*(returns { promise: [President], resolve: [Method], reject: [Method] })*
*See ECMA 6 Promises*

#### <i class="icon-cog"></i> ChannelPattern: new medium.ChannelPattern()
###### Return: *Pattern-Matching* object
Calling this constructor returns a pattern-matching API which can be used for *[Abstract Channels](#abstractChannels)*.
###### Return: API with `.match` method
*e.g:*
```
var channelPattern = new this
	.ChannelPattern('geo://{interest}/{topic}/{attr}/:msg');
var resultMatches =
	channelPattern.match('geo://error/User/location/oops!');

if(resultMatches !== false){  // !!resultMatches
	...
} else {  // !resultMatches
	/* it matches! */
}

/*
resultMatches === {
	uri: 'geo://error/User/location/oops!',
	channel: 'geo://{interest}/{topic}/{attr}/:msg',
	proteus: 'geo',
	keys: ['interest', 'topic', 'attr', 'msg'],
	values: ['error', 'User', 'location', 'oops!'],
	map: {
		interest: 'error',
		topic: 'User',
		attr: 'location',
		msg: 'oops!'
	}
}
*/
```

----------

### Cheat Sheet

**Installing & Spawning** has a special convention for media:

Type           | Installs To  | Spawns From
-------------- | ------------ | -------------
Core           | Facade       | N/A
Facade         | N/A          | ParentFacade
Modules        | Facade       | N/A

**Faculties & Efficacies** talk to a medium using specific methods:

Type           | Parent       | This          | Children
-------------- | ------------ | ------------- | ------------- 
Core           | emit         | fire          | broadcast
Facade         | No           | via Core      | No
Modules        | No           | via Facade    | broadcast


________

### Module Network

Facades are the 'conduits' for module-to-module communication:

```sequence
ParentFacade->Facade: parentFacade.spawn(this)
```
```sequence
Core->Facade: facade.installTo(this)
Service->Facade: facade.installTo(this)
Controller->Facade: facade.installTo(this)
etc->Facade: facade.installTo(this)
```

### Channel Networks

An event loop cycles through a Discrete Medium's module-network as:

```flow
fire=>start: fire(channel)
disclose=>end: on(channel)
module=>subroutine: 'service://request'
facade=>inputoutput: Facade
auth=>condition: Authorized
core=>inputoutput: Core
deps=>condition: Fulfilled?
noOutput=>operation: No Output

fire->facade(right)->auth
auth(yes)->core
auth(no)->noOutput
core->deps
deps(yes)->disclose
deps(no)->module(right)->facade
```


> **TODO's:** Next ambitions include:

> - Unit-Tests using KarmaJS,
> - Packaging,
> - More Configuration Options and Control
> - AEB (Automatic Event-Binding) & Registrational Utilities,
> - More RegExp on AbstractChannels (eg: *://...),
> - this.sandbox === discreteMedium.utils && plugins,
> - Mixin(DEEP),
> - WebSockets & Node,
> - Node Workers & SharedWorkers,
> - WebRTC,
> - Promise.catch().

### Supported by [StackEdit](https://stackedit.io/)

[![](https://cdn.monetizejs.com/resources/button-32.png)](https://monetizejs.com/authorize?client_id=ESTHdCYOi18iLhhO&summary=true)

  [^stackedit]: [StackEdit](https://stackedit.io/) is a full-featured, open-source Markdown editor based on PageDown, the Markdown library used by Stack Overflow and the other Stack Exchange sites.


  [1]: http://math.stackexchange.com/
  [2]: http://daringfireball.net/projects/markdown/syntax "Markdown"
  [3]: https://github.com/jmcmanus/pagedown-extra "Pagedown Extra"
  [4]: http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference
  [5]: https://code.google.com/p/google-code-prettify/
  [6]: http://highlightjs.org/
  [7]: http://bramp.github.io/js-sequence-diagrams/
  [8]: http://adrai.github.io/flowchart.js/
