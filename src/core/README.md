Vertices
===========================


Vertices embodies the main `core.js` file, along with its extensive modules: `app.js` & `sandbox.js`. This ReadMe documents all Interfaces & Utilities of the JavaScript Core and provides usage examples in tandem with guidelines to help get you started.

----------


### Table of contents

[TOC]



Architecture
-------------

Before you get started...

> **Note:**

> - The architecture's *archetype*, at its basis, is an EDA (Event-Driven Architecture) -- and there is no way of 'reaching' outside of your Sandbox without using the EDA interface.
> - A module's Sandbox is designed to save you from yourself.
> - The Sandbox's interface is [loosely] modeled after jQuery's.

#### <i class="icon-file"></i> Core

The Core takes care of managing & abstracting the *base-lib* and provides and additional class members, among other things.

#### <i class="icon-file"></i> Facade

The Facade encapsulates Core and exposes a *register* member while providing security for Root; this is the only global namespace in your environment.

#### <i class="icon-file"></i> Director

Director is an extension of Core; it lives inside of `app.js` and gets *registered* with `$APP` as its identifier. Its main use is to encapsulate the *Root Scope* (window) and listen for and fire events for application-wide mediation. In addition, Director provides a consistent interface through time and handles application-scale complexity and others for which is its primary concern.

#### <i class="icon-file"></i> Sandbox

Sandbox, denoted as `$` in your module's execution environment, is the sole source of utilities for *DOM-Modules*. See *Services* for more on *Non-DOM-Modules*.

#### <i class="icon-cog"></i> Extensions

The Core retains a few *Core Extensions* which facilitate Reuse. These include *`$backdrop`*, *`$alert`*, *`$modal`* and others.

> **Notice:** These extensions are currently **frozen** and are likely to expand in multitude.


----------


Getting Started
-------------------

Whence you've started a new project, include the appropriate files of the Core in their respective order:

> **Require:**

> - core.js
> - sandbox.js
> - app.js

#### Modules

There are two types of modules which Core recognizes:
> - Components
> - Services

The difference between the two is that *Components* are *DOM-Modules* whose Sandbox is a `NodeContextDecorator`, and *Services* are *Non-DOM-Modules* whose Sandbox is a *Utils* object encapsulating Core's *HTTP* Promise interface.

#### Components

The standard implementation of a Component looks similar to the following, at a minimum:

    CORE.register('my-component', function MyComponent($) {
      var thus = this;

      function initialize() {
        // setup

        $.addEvent(type, handler);

        $.listen({
          'ui>object.property:verb': onVerbHandler
        });

        $.triggerEvent(type, data);

        $.notify({
          type: 'ui>object.property:verb',
          data: {
            one: 'datum'
          }
        });
      }

      function destroy() {
        // teardown

        $.addEvent(type, handler);

        $.ignore({
          'ui>object.property:verb': onVerbHandler
        });
      }

      // export precepts
      this.init = initialize;
      this.destroy = destroy;

      return this;
    });

A Component must be "registered" by calling the Core's `register` method and providing an `id` & `constructor`. A Component's constructor receives its Sandbox, `$`, as its first and only argument. Components **will not start** if they lack a minmal interface:

`this.init`
`this.destroy`

A Component **must return an object containing this interface** -- which can either be the Constructor's instance or an Object Literal.

#### Services

Services are written similarly to Components, however, they lack an `id` and their Class's constructor receives a *Utilities* object rather than a `NodeContextDecorator` instance:

    CORE.register(function HTTP(utils) {
      var thus = this
        , http = utils.http;

      //console.log('HTTP', http);

      function initialize() {
        var promise = http.get('/advisors', { test: 'value' });
        promise.success(function s() {
        // handle success
        }).error(function e() {
          // handle error
        });
      }

      function destroy() {
      // teardown
     }

      // export precepts
      this.init = initialize;
      this.destroy = destroy;

      return this;
    });



----------


## <i class="icon-heart"></i> Conventions
**Before you begin**, please be sure to read through & understand the engineering culture behind our practices.

#### EDA Channel Schema
When programming to the EDA interface, use the [*SOV*](http://lingwiki.com/index.php?title=List_of_SVO_Languages) syntactical-schema to form your channel-names:

###### Basic
*subject>object:verb*
###### Extensive
*subject>object[.extensive1[.extensiveN]]:verb*


***Subject***
The subject describes the coherence to a *domain-problem* for which your *Message* aligns. Examples are: `ui`, `data`, `log`, `user`.

***Object***
The object should correspond to a *topic* and can be an extensive representation of a hierarchy:
`>advisor`
`>advisor.consultants`
`>advisor.consultants.name`
`>advisor.consultants.name.first`
Each of these are valid *extensive* denotations of nested properties.

***Verb***
The verb is the action to tie an *interaction-context* to the Objective & Subjective semantics of the channel. Examples are: `:found`, `changed`, `canceled`, `added`, `created`, etc.

##### Putting It All Together
`user>settings.profile.public.status:changed`

**Pointers**
Sometimes it is easy to catch yourself in a spiral of semantical oblivion after you've already implemented an EDA interface, so here are a few tips:

**Watch those 'Noun-Verb-Adjective' Channel Names**
`log`, `start`, `call`, `cause`, `set`, `process`,  and [others](http://www.enchantedlearning.com/wordlist/nounandverb.shtml) can make it confusing to the reader what exactly is of interest.

**Express State Only**
Channel-names should express a *state-change* or an *interest*, e.g:
`ui>pdf-reader:ready`
`ui>client.name:changed`
`data>clients:found`
`user>process:pending`

**Query / Command**
***Do not use Query + Command semantics***, e.g:
`ui>clients:get`
`ui>history:set`

**Listen Before You Speak**
You might miss something.


#### Modules

**Minimal Interface**
Publish the minimal amount of precepts that module should export to its interface:

**Don't**

    CORE.register("Don't", function DontDoThis($) {
      this.init = fn;
      this.eventHandler = fn;
      this.private = fn;
      this.destroy = fn;
    });

**Do**

   CORE.register('Do', function Safe($) {
      var thus = this
        , __private__ = private.bind(this)
        ;
      
      function private() {
         (this instanceOf Safe);  // >> true
      }
      
      function init() {
         __private__();
      }
      
      function eventHandler() {}
      
      function destroy() {}

      //export precepts
      this.init = init;
      this.destroy = destroy;

      return this;
   });

**Use Function.prototype[, bind, call, apply]**
...If you require a module's *context* within a function.

**Always Return An Object**
**Don't**
      
   CORE.register("Don't", function DontDoThis($) {
      ...

      this.init = init;
      this.destroy = destroy;    
   });

**Do**
      
   CORE.register('Do', function Safe($) {
      ...

      this.init = init;
      this.destroy = destroy;    

      return this;
   });



----------



Documentation
-------------

Described below are the Interfaces for interacting with each faculty of the Core.

----

## CORE
### Facade
#### .register()
> @ Parameters:
> String := `id` (optional)
> Function := `Constructor`

> @ Return:
> CORE

Usage:
> `CORE.register('my-component', function Comp() { ... })`
> `CORE.register(function Service() { ... })`

----

## Sandbox (`$`)
The Sandbox is an *Adapter* which conforms to the following Interfaces:

> - Notifications
> - Utilities
> - NodeContextDecorator

### Notifications

#### .notify()
> @ Parameters:
> Object := `event`

> @ Return:
> Sandbox

Usage:

    $.notify({
        type: 'ui>advisor.consultant:selected',
        data: anything
    }).notify(...);

#### .listen()
> @ Parameters:
> Object := `events`

> @ Return:
> Sandbox

Usage:

    $.listen({
        'ui>advisor.consultant:selected': handler,
        ...
    }).listen(...);

    function handler(data) { ... }

#### .ignore()
> @ Parameters:
> Object := `events`

> @ Return:
> Sandbox

Usage:

    $.ignore({
        'ui>advisor.consultant:selected': handler,
        ...
    }).ignore(...);

### Utilities

#### .createElement()
> @ Parameters:
> String := `[object HTMLElement]`
> Object := `elementConfiguration`

> @ Return:
> `NodeContextDecorator`

Usage:

    var $el = $.createElement('div', { ... });
    $el.html(...);


#### .getScreenSize()
> @ Parameters:
> VOID

> @ Return:
> Object := `[window.width, window.height]`

Usage:

    var screen = $.getScreenSize();
    screen.x;  // >> width
    screen.y; // >> height


#### .getPageSize()
> @ Parameters:
> VOID

> @ Return:
> Object := `[document.width, document.height]`

Usage:

    var page = $.getPageSize();
    page.x;  // >> width
    page.y; // >> height


#### .extend()
> @ Parameters:
> Object := `object`

> @ Return:
> Object

Usage:

    var o = $.extend({}, {}, ...);
    typeof o === 'object';  // true


#### .generateUUID()
> @ Parameters:
> VOID

> @ Return:
> String := *RFC-4 Compliant Universally Unique Identifier*

Usage:

    var uuid = $.generateUUID();
    >> 2cb58d75-b19c-4b31-b7f3-15493599a13e


#### .throttle()
> @ Parameters:
> Function := callback
> Number := `rate-limit` (miliseconds)

> @ Return:
> Throttler

Usage:

    var callback = $.throttle(fn, 1000);
    $.addEvent('resize', callback);


#### .debounce()
> @ Parameters:
> Function := callback
> Number := `timeout` (miliseconds)

> @ Return:
> Debouncer

Usage:

    var callback = $.debounce(fn, 1000);
    $.addEvent('keypress', callback);


#### .cookie()
> @ Parameters:
> TODO :=

> @ Return:
> TODO

Usage:

    $.cookie('name', 'value', options);


#### .removeCookie()
> @ Parameters:
> TODO :=

> @ Return:
> TODO

Usage:

    var $el = $.removeCookie('name', options);


### NodeContextDecorator

#### .context
> @ Value:
> Array := `NodeList`

Usage:

    var $root = $.context;


#### [N] (Index)
**Note:** Indices are omitted on the root scope (`$`) of Sandbox.
> @ Value:
> Object := `[object HTMLElement]`

Usage:

    var el = $.find('*')[0];
   !!$[0] === false;  // >> true


#### Methods
*All methods of NodeContextDecorators are modeled after jQuery's interface, with few exceptions. All exceptions will be provided below.*

#### .parent() | .parents()
**OMITTED**

#### .siblings()
**OMITTED**


#### .addEvent()
> @ Parameters:
> See jQuery.fn.bind

> @ Return:
> Object := `NodeContextDecorator`

Usage:

    $.addEvent('click', handler);


#### .removeEvent()
> @ Parameters:
> See jQuery.fn.unbind

> @ Return:
> Object := `NodeContextDecorator`

Usage:

    $.removeEvent('click', handler);


#### .triggerEvent()
> @ Parameters:
> See jQuery.fn.trigger

> @ Return:
> Object := `NodeContextDecorator`

Usage:

    $.triggerEvent('click', data);


#### .toString()
> @ Parameters:
> VOID

> @ Return:
> String := `outerHTML`

Usage:

    var content = $.toString();
   >> <div class="...">...</div>


#### .scrollTo()
> @ Parameters:
> TODO :=

> @ Return:
> TODO

Usage:

    TODO


----


### Footnotes

#### Architecture Authors

 - Cody S. Carlson
 - Genevieve Bulger

  [^footnote]: Here is the *text* of the **footnote**.