

V('doc', { data: 'for Doc()' })('docs', 'DOCUMENTS');


V('doc', function Doc($) {
    var thus = this;

    function init(config) {
        console.log('DOC', config);
    }

    function destroy() { }

    // export precepts
    this.init = init;
    this.destroy = destroy;

    return this;
}).register('docs', function Docs($) {
    var thus = this;

    function init(config) {
        console.log('DOCS', config);
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


V(function Service() {
    var thus = this;

    console.log('@Service #construct', this);

    function initialize() {
        console.log('@Service #init', this);
    }
    function destroy() { }

    return this;
});

