
/**
 * @name: iMediator
 * @description: ...
 * @use: new function(iMediator){ this.precepts = ...; iMediator.apply(this); // after precept-definitions (data/behavior) }(iMediator);
 */
define(function(){
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
	
	return iMediator;
});
