var assert = require('assert');
var vm = require('vm');
var fs = require('fs');

var browserify = require('browserify');
var jadeify = require('jadeify');

var jade = require('jade');
var jsdom = require('jsdom');

exports.simple = function () {
    var bundle = browserify({
        entry : __dirname + '/simple/main.js',
        require : [
            'deck',
            { jquery : 'jquery-browserify' }
        ],
        watch : false,
    });
    bundle.use(jadeify(__dirname + '/simple', 'jade'));
    
    var to = setTimeout(function () {
        assert.fail('never finished');
    }, 5000);
    
    bundle.on('ready', function (src) {
        fs.readFile(__dirname + '/simple/index.jade', function (err, file) {
            var html = jade.render(file);
            
            jsdom.env(html, function (err, window) {
                clearTimeout(to);
                
                if (err) assert.fail(err);
                
                var c = {
                    setTimeout : process.nextTick,
                    assert : assert,
                    window : window,
                };
                vm.runInNewContext(src, c);
                
                assert.ok(c.require.modules.jadeify);
                assert.ok(c.require('jadeify/views')['index.jade']);
                
                assert.equal(
                    html,
                    c.require('jade').render(
                        c.require('jadeify/views')['index.jade']
                    )
                );
                
                var $ = c.require('jquery');
                c.require('jadeify')('msg.jade', {
                    title : 'oh hello',
                    body : 'nice night for a test',
                }).appendTo($('#messages'));
                
                assert.equal(
                    $('#messages .msg .title').text(),
                    'oh hello'
                );
                
                assert.equal(
                    $('#messages .msg .body').text(),
                    'nice night for a test'
                );
                
                window.close();
            });
        });
    });
};
