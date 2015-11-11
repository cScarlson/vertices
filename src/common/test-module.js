
V('test', function Test($) {
    var thus = this;

    function init() {
        //console.log('????', $);
        //$.context.innerHTML = 'Test';
    }

    function destroy() { }

    // export precepts
    this.init = init;
    this.destroy = destroy;

    return this;
})('doc', function DocAndStuff($) {
    var thus = this;

    function init() {
        //console.log('DocAndStuff', $);
    }

    function destroy() { }

    // export precepts
    this.init = init;
    this.destroy = destroy;

    return this;
}).register('docs', function DocAndStuff($) {
    var thus = this;

    function init() {
        //console.log('DocAndStuff', $);
    }

    function destroy() { }

    // export precepts
    this.init = init;
    this.destroy = destroy;

    return this;
});
