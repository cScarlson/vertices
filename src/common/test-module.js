
CORE.register('test', function Test($) {
    var thus = this;

    function init() {
        console.log('????', $);
        //$.context.innerHTML = 'Test';
    }

    function destroy() { }

    // export precepts
    this.init = init;
    this.destroy = destroy;

    return this;
});
