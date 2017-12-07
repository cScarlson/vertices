/**
 * Application Director
 * @ Intent: Extends Core for proprietary, Dependency-Inversive control for dynamic runtime logic, encapsulation of Root-Scope logic,
 * *         and management low-level MLC/security along with any other complexity of its suprastructure.
 */
;Vertices.config({
    rootSettings: true,
    myValue: 'yes',
    Service: {
        conventionOverConfiguration: true,
        endpoints: {
            search: '/my-server/search'
        }
    }
}).director(function ApplicationDirector($) {
    var thus = this;
    var channels = {
        core: {
            '$core://created/module': moduleCreatedHandler,
            '$core://stopped/module': moduleStoppedHandler
        },
        app: {
            hashchange: {
                'core>window.location.hash:change': hashChangeHandler
            }
        }
    };

    function init() {
        this.register_events(channels.core);

        $.addEvent('hashchange', onHashChange).listen(channels.app.hashchange);
        this.$on('test', function (e, data) {
            console.log('@APP#test', this, $.context[0]);
        });

    }

    function moduleCreatedHandler(mod) {
        // this.log(mod); -- OR -- Rather, $.notify({ type: 'log://[my-log-level]', data: mod.id });
    }

    function moduleStoppedHandler(mod) {
        // this.log(mod); -- OR -- Rather, $.notify({ type: 'log://[my-log-level]', data: mod.id });
    }

    function onHashChange(e) {
        var originalEvent = e.originalEvent
          , oldURL = originalEvent.oldURL
          , newURL = originalEvent.newURL
          , oldComponents = thus.parse_uri(oldURL)
          , newComponents = thus.parse_uri(newURL);

        $.notify({ type: 'core>window.location.hash:change', data: { oldURL: oldComponents, newURL: newComponents } });
    }

    function hashChangeHandler(data) {
        // data.oldURL.hash, data.newURL.href, ...
    }

    function destroy() {
        // this.stop_all();
        this.remove_events(channels.core);
    }

    // export precepts
    this.doInit = init;
    this.destroy = destroy;

    return this;
});


/********************************/
//        NEW API DESIGN 
/********************************/

// Microcontrollers
var arduinoModules = [ { id: 'arduino-wifi' }, { id: 'arduino-bluetooth' } ];
function mapArduinoModules(modules) {  }
var ArduinoComponentSandbox = function ArduinoComponentDecorator($) {
    function handleSensoryInput() {
        $.scan();
    }
    this.senseStuff = handleSensoryInput;
};
V('arduino-wifi', function ArduinoWifi($) {
    $.senseStuff();
});

// DOM
var domComponents = document;
function mapDOMNodes(doc) { mapDOMNodes(doc.children) }
var DOMComponentSandbox = jQuery;
V('radio-button', function RadioButton($) {
    
    function handleChange() {
        $.publish('channel', this);
        $.attr('checked', false);
        return this;
    }
    this.onChange = handleChange;
    // ||
    this.toJSON = handleChange;
    
});

// Services
var ServiceSandbox = function ServiceDecorator(http, director) {
    function GET(url) {
        http.get(url).then(director.publish.bind(director));
        return this;
    }
    this.get = GET; 
};
V(function Service($) {
    $.get('http://...');
})(function Service() {});

var configuration = {
    target: arduinoModules || domComponents,
    mapper: mapArduinoModules || mapDOMNodes,
    decorators: {
        services: ServiceSandbox,
        components: DOMComponentSandbox || ArduinoComponentSandbox,
        director: DirectorSandbox,
    }
};

var DirectorSandbox = function DirectorSandboxDecorator(services) {
    
    function initAll(sandbox) {
        for (var key in services) {
            var Service = services[key];
            var service = new Service(sandbox);
        }
    }
    
    this.HTTP = services.HTTP;
    this.initAll = initAll;
    
};

var V = new V(configuration) || V.configure(configuration);

V.director(function Director(services) {
    
    function init() {
        this.http = new services.HTTP();
        services.initAll(this.http);
        Director.prototype.init();  // kicks off [[core]].bootstrap(); for components/modules
    }
    
    this.http;
    this.init = init;
    
});






/*
var mod = new V(function DisparateDirector($) {
    var thus = this;

    function initialize() {
        console.log('@DisparateDirector', $);
        DisparateDirector.prototype.init('body');  // ALERT! Override .init and manually start prototype to customize selector!
    }

    this.init = initialize;

    return this;
});

mod('test', function Test($) {
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

mod.director(function Dir() {

    this.do_init = function () { };
    this.destroy = this.do_init;

});
*/


//V.data({  // equivalent: V['data' | null]('$APP', { ... })
//    app: 'configs'
//});

//V('person', {
//    name: 'Name not found',
//    height: '6`2'
//});
