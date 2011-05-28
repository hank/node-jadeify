var express = require('express');
var app = express.createServer();

app.use(express.static(__dirname + '/static'));
app.listen(8080);
console.log('Listening on 8080');

app.get('/', function (req, res) {
    res.render('index.jade', { layout : false });
});

var browserify = require('browserify');
var bundle = browserify({
    entry : __dirname + '/static/main.js',
    require : [
        'deck',
        { jquery : 'jquery-browserify' }
    ]
});
app.use(bundle);

var jadeify = require('jadeify');
bundle.use(jadeify(__dirname + '/views'));
