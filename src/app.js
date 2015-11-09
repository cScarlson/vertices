
CORE.register('$APP', function Mediator($) {
    var thus = this;

    function init() { }
    function destroy() { }

    // export
    this.init = init;
    this.destroy = destroy;

    return this;
});
