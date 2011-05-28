jadeify
=======

Browserify middleware for browser-side jade templates.

usage
=====

For some expresso/connect/etc application `app`:

````javascript
var browserify = require('browserify');
var bundle = browserify();
app.use(bundle);

var jadeify = require('jadeify');
bundle.use(jadeify(__dirname + '/views'));
````

Then in your browser-side javascript you can use `jadeify()`:

````javascript
var $ = require('jquery');
var jadeify = require('jadeify');

var msg = jadeify('msg.jade', {
    title : 'foo',
    body : 'bar baz quux'
}).appendTo($('#messages'));

````

[See here](https://github.com/substack/node-jadeify/tree/master/example/simple)
for a more complete example.

browser-side methods
====================

jadeify(templateFile, vars={})
------------------------------

Render `templateFile` with `vars` local variables.

Returns an HTML DOM element wrapped with jquery.

installation
============

With [npm](http://npmjs.org), do:

    npm install jadeify

license
=======

MIT/X11
