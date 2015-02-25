
// APP
var rootMedium = new emcd.CompositeMediator({ useURIs: true });
var rootMedium2 = new emcd.CompositeMediator({ useURIs: true });
var core = new (function Core(mediator){
	var thus = this
	  , director = mediator.spawn(this);
	
	function testHandler(event, data){
		console.log('@core #testHandler', arguments);
	}
	
	function abstractHandler(event, data){
		console.log('@core #abstractHandler', arguments);
	}
	
	return this.use({
		'test': testHandler
		, 'test://all/modules/:id/{uuid}/x': abstractHandler
	});
})(rootMedium);

var app = new (function App(director){
	var thus = director.installTo(this);
	
	function testHandler(event, data){
		console.log('@app #testHandler', arguments);
	}
	
	function abstractHandler(event, data){
		console.log('@app #abstractHandler', arguments);
	}
	
	setTimeout(function(){
		thus.on('promise-me!', function promiseMeHandler(){
			console.log('WAS I PROMISED...', arguments, '...?');
		});
		thus.on('test://all/modules/:id/{uuid}/x', function absMeHandler(){
		    console.log('WAS I PROMISED...', arguments, '...?');
		});
	}, 1000 * 2);
	
	return this.use({
		'test': testHandler
		, 'test://all/modules/:id/{uuid}/x': abstractHandler
	});
})(core);


console.log('@ALL', rootMedium === rootMedium2, rootMedium.constructor.name, rootMedium2.constructor.name, core.constructor.name, app.constructor.name);

core.fire('test', 'test! now')
    .fire('test', 'test! now')
	.fire('promise-me!', 'promise-me now')
	//.fire('promise-me!', 'datum2')
	//.fire('test://all/modules/:id/{uuid}/x', 'CORE')
	.fire('test://all/modules/998/1024/x', 'ABSTRACT now');

setTimeout(function () { 
    core.fire('promise-me!', 'promise-me later');
}, 1000 * 4);

//

var theDatum = { the: 'datum' };
var deferred = emcd.President.defer();
var p = deferred.promise;

//var p = new emcd.President(function (resolve, reject) {
//    reject('Utter laziness...');
//    resolve(theDatum);
//});

p.then(function other1(value) {
    //console.log('#other#1', value);
}, function other1Error(reason) {
    //console.log('#other#1#error', reason);
});
p.then(function other2(value) {
    //console.log('#other#2', value);
}, function other2Error(reason) {
    //console.log('#other#2#error', reason);
});

p
    .then(function $1(value) {
        //console.log('#chainable#A#1', value);
        return { value: value };
    }, function $1R(reason) {
        //console.log('#ERROR#chainable#A#1', reason);
        return { reason: reason };
    })

    .then(function $2(value) {
        //console.log('#chainable#A#2', value);
        throw new Error('That Darn Error!');
        return { data: value };
    }, function $2R(reason) {
        //console.log('#ERROR#chainable#A#2', reason);
        return { error: reason };
    })

    .then(function $3(value) {
        //console.log('#chainable#A#3', value);
    }, function $3R(reason) {
        //console.log('#ERROR#chainable#A#3', reason);
    });

p.then(function next1(value) {
    //console.log('#next#1', value);
}, function next1Error(reason) {
    //console.log('#next#1#error', reason);
});
p.then(function next2(value) {
    //console.log('#next#2', value);
}, function next2Error(reason) {
    //console.log('#next#2#error', reason);
});

deferred.resolve(theDatum);
deferred.reject('Utter laziness...');