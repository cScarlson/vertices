#EMCDJS
***Emergent Mediation through Compositive Decoration***
----

emcdJS is a framework designed -- by Application Architects for Application Architects. It allows you to create scalable, fractal architectures via *Mediation-Networks* & *Compositive Media* for *Event Driven Architectures*.

Dispatching & listening to events is as easy as:

    mediator.on('count', function countCommandHandler(miliseconds){
        setTimeout(function counter(){
            console.log('tick - tock!');
        }, miliseconds);
    }).fire('count', 1000);

##Instalation
###git:
`git clone ...`

###bower:
`bower install emcdjs`

###NPM:
`npm install emcdjs`

##Setup

###RequireJS:
**main.js:**

    requirejs.config({
        ...,
        paths: {
            ...,
            emcdjs: '/path/to/emcd.js',
            ...,
        },
        shim: {
            ...,
            emcdjs: {
                deps: ['NOTHING!'],
                exports: 'emcd'
            }
            ...,
        }
    });

**module.js:**

    define(['emcdjs'], function (emcd){
        var config = { ..., abstractChannels: true, ... }
          , mediator = new emcd.CompositeMediator(config);
    });

###Node:
    var emcd = require('emcdjs');

#Documentation

##Methods:

###emcd
**mixin():**

*Example:*
	
	var options = mixin({
		opt1: 'default',
		opt2: 'default'
	}, { opt1: 'custom' });

**interpolate():**

*Example:*
	
	var string = interpolate('The {mamal} wearing {attire} jumped over the {object}.', {
		mamal: 'fox',
		attire: 'socks',
		object: 'box'
	});

###CompositeMediator
	var rootMedium = new emcd.CompositeMediator(config);

**subscribe():**
	mediator.subscribe(channel, handler)

*Example:*
	
	...

**on():**
	mediator.on(channel, handler)

*Example:*
	
	...

**publish():**
	mediator.publish(channel, arguments)

*Example:*
	
	...

**fire():**
	mediator.fire(channel, arguments)

*Example:*
	
	...

**emit():**
	mediator.emit(channel, arguments)

*Example:*
	
	...

**broadcast():**
	mediator.broadcast(channel, arguments)

*Example:*
	
	...

**forward():**
	mediator.forward(channel, arguments)

*Example:*
	
	...

**echo():**
	mediator.echo(channel, arguments)

*Example:*
	
	...

**post():**
	mediator.post(channel, arguments)

*Example:*
	
	...

**installTo():**
	mediator.installTo({})

*Example:*
	
	...

**spawn():**
	mediator.spawn({})

*Example:*
	
	...

##Usage
###Simple
**director.js:**

    var director = new emcd.CompositeMediator();
    director.on('friendRequestAccepted', function friendRequestAcceptedHandler(event, id){
        var friendId = id  // 998
          , xhr = new XMLHttpRequest();
        ...
    });

**colleague.js:**

    var object = {};
    var colleague = director.installTo(object);  // colleague === object
    
    colleague.fire('friendRequestAccepted', 998);

###Advanced
**composite.js:**
    
    
    var director = new emcd.CompositeMediator({ abstractChannels: true });
    director.on('error://{module}/exception/:message', function errorHandler(event){
        var channelParams = event.channelParams;
        var modules = {
            'Payment': 'CRITICAL',
            'Settings': 'PASSIVE'
        };
        
        if(modules[channelParams.module] === 'CRITICAL'){
            var channel = emcd
                .interpolate('command://{module}/restart')({ module: channelParams.module });
            director.forward(channel);
        }
        
        director.broadcast(emcd.interpolate('user://{module}/alert/{message}')(channelParams));
        var protocol = event.protocol; // 'error'
        console.log(protocol, ':', channelParams.message);
    });

**leaf.js:**

    var Payment = {};
    var colleague = director.spawn(object);  // colleague === Payment
    var exceptionMessage = 'Your order has been sent to Goldman Sachs!';
    
    colleague
        .on('command://Payment/restart', restartModule)
        .on('user://Payment/alert/{message}', function userNoticeHangler(event){
            alert(emcd.interpolate('Attention: {message}')(event.channelParams));
        })
        .emit('error://Payment/exception/' + exceptionMessage);  // or use emcd.interpolate!

###Complex Mediation
For the given an application scaffolding:

    root_directory
        | - session
        |   | - director.js
        |   | - session.js
        |   | - session-controller.js
        |   | - session-model.js
        |
        | - list
        |   | - director.js
        |   | - list.js
        |   | - controllers
        |   |   | - todolist-controller.js
        |   |   | - todontlist-controller.js
        |   | - models
        |   |   | - abstractlist-model.js
        |   |   | - todolist-model.js
        |   |   | - todontlist-model.js
        |   | - views
        |   |   | - list.html
        |   | - item
        |   |   | - director.js
        |   |   | - item.js
        |   |   | - item-controller.js
        |   |   | - views
        |   |   |   | - item.html
        |   |   |   | - partials
        |   |   |   |   | - details.html 
        |
        | - app.js
        | - director.js
        | - main.js
        | - index.html

... Mediation might look something like the following. The key thing to note is the consistency between different hierarchies of modules -- this scales very well & creates opportunities for healthy abstractions. We use RequireJS here for explanatory purposes, though, any AMD methodology will work. Also, note the differences between pulling a module's director (`./director`) vs pulling a director's parent (`./../director`) along with the differences between `mediator.spawn(..)` & `director.installTo(..)`.

####The Application Director (/director.js):
    define(['emcdjs'], function (emcd){
        var rootMedium = new emcd.CompositeMediator({ abstractChannels: true });
        
        var applicationDirector = new (function ApplicationCore(mediator){
            var thus = this
              , director = mediator.spawn(this);  // director === thus === this
            
            function actionErrorHandler(event){
                // ... do stuff for action-error
            }
            
            function sessionStateHandler(event){
                // ... session expiration, etc.
            }
            
            function logHandler(event, additional){
                var params = event.channelParams;
                var info = {
                    module: params.module,
                    title: params.title,
                    message: params.message,
                    more: additional
                };
                var logMessage = '{title} (from {module}):\n{message}\n{more}';
                console.log(emcd.interpolate(logMessage)(info));
            }
            
            function getItemHandler(event, key, callback){
                var params = event.channelParams;
                var storeage = localStorage.getItem(key)  // parsed by the JSON fairy!
                  , item;
                if(!storage){
                    callback && callback(true);
                } else {
                    item = storage[params.id];
                    if(!item){
                        callback && callback(true);
                    } else {
                        callback && callback(null, item);
                        var channel = emcd.interpolate('data://Item/{key}/:id')({ key: key, id: params.id });
                        director.forward(channel, item);
                    }
                }
            }
            
            return this.use({
                'error://{module}/action/:message': actionErrorHandler,
                'notice://Session/:state/:timestamp': sessionStateHandler,
                'log://{module}/{title}/{message}/{{timestamp}}': logHandler,
                'core://getItem/:id': getItemHandler
            });
        })(rootMedium);
        
        return applicationDirector;
    });

####The Application Director (/app.js):
    define(['./director', './list/list'], function (director, list){
        
        var coreFacade = new (function ApplicationFacade(director){
            var thus = director.installTo(this);  // thus === this
            
            function getItemHandler(key, id, callback){
                var channel = emcd.interpolate('core://getItem/:id')({ id: id });
                thus.fire(channel, key, function(err, data){
                    if(!err){
                        callback && callback(null, data);
                    }
                });
            }
            
            return this.use({
                'getMyItem': getItemHandler.bind(this, 'My'),
                'getYourItem': getItemHandler.bind(this, 'Your'),
                'getListItem': getItemHandler.bind(this, 'list')
            }).fire('applicationReady');
        })(director);
        
        return coreFacade;
    });

####The List Director (/list/director.js):
    define(['./../director'], function (director){
        
        var listDirector = new (function ListDirector(mediator){
            var thus = this
              , director = mediator.spawn(this);
            
            function getItemHandler(event, callback){
                var id = event.channelParams.id;
                director.emit('getListItem', id, function(err, data){
                    if(!err){
                        callback && callback(null, data);
                    }
                });
            }
            
            return this.use({
                'list://getItem/:id': getItemHandler
            });
        })(director);
        
        return listDirector;
    });

####The List Module (/list/list.js):
    define(['./director'], function (director){
        
        var listFacade = new (function ListFacade(director){
            var thus = director.installTo(this);  // thus === this
            
            function initialize(){
                
                if(!this.items[998]){
                    thus.fire('list://getItem/998', function(err, item){
                        if(!err){
                            thus.items[998] = item;
                        }
                    });
                }
            }
            
            return this.use({
                'start://List': initialize
            }).fire('listReady');
        })(director);
        
        return listFacade;
    });

####The Item Director (/list/item/director.js):
    define(['./../director'], function (director){
        
        var itemDirector = new (function ItemDirector(mediator){
            var thus = this
              , director = mediator.spawn(this);  // director === thus === this
            
            ...
            
            return this.use({
                'protocol://some/channel/:name': itsHandler
            }).fire('itemReady');
        })(director);
        
        return itemDirector;
    });

####The Item Module (/list/item/director.js):
    define(['./director'], function (director){
        
        var itemFacade = new (function ItemFacade(mediator){
            var thus = this
              , director = mediator.installTo(this);  // director === thus === this
            
            ...
            
            return this.use({
                'protocol://some/channel/:name': itsHandler
            }).fire('itemReady');
        })(director);
        
        return itemFacade;
    });

Eventually, you get a *spine* of Mediators running behind all of your modules -- and the modules, themselves, act as a Facade to those Mediators. This makes Modules -- and even their Mediators -- very *liftable*. This *spine* is able to communicate up the *director-chain* all the way up to the head director -- the ApplicationCore. See the **Methods** section for more on communication.


