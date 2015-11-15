
V('doc', function DocAndStuff($) {
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
        this.$on('test', function (e, data) {
            console.log('@docs#test', $.context[0]);
        });
    }

    function destroy() { }

    // export precepts
    this.init = init;
    this.destroy = destroy;

    return this;
})('test', function Test($) {
    var thus = this;

    function init() {
        //console.log('????', $);
        //$.context.innerHTML = 'Test';
        this.$on('test', function (e, data) {
            console.log('#test', $.context[0]);
        });
        $.addEvent('click', function (e) {
            thus.$fire('test', { "": "" });
            //console.log('click', e);
        });
    }

    function destroy() { }

    // export precepts
    this.init = init;
    this.destroy = destroy;

    return this;
});
