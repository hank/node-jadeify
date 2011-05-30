var jadeify = require('jadeify');
var $ = require('jquery');

var msg = jadeify('msg.jade', {
    title : 'title text',
    body : 'body text',
});

assert.ok(msg instanceof $);

window.close();
