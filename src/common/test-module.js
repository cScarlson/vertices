

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


V(function Service(utils) {
    var thus = this
      , http = utils.http;

    console.log('@Service #construct', this, utils, http);

    function initialize() {
        console.log('@Service #init', this);
        this.$on('test', function (e, data) {
            console.log('@Service #test', data);
        });
        setTimeout(function () {
            thus.$trigger('test', { "|": "|" });
        }, (1000 * 2));
    }
    function destroy() { }

    // export
    this.init = initialize;
    this.destroy = destroy;

    return this;
});

