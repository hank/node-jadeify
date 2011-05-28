var fs = require('fs');
var path = require('path');
var Seq = require('seq');
var vm = require('vm');

var fileify = require('fileify');

var browserify = require('browserify');
var sources = {
    jadeify : browserify.wrap('jadeify').source,
    jquery : browserify.wrap('jquery-browserify', { name : 'jquery' }).source,
    jade : browserify.wrap('jade').source,
};

module.exports = function (opts) {
    if (!opts) opts = {};
    if (typeof opts === 'string') {
        opts = { views : opts };
    }
    
    var viewdirs = [ './views' ];
    
    if (opts.views) {
        viewdirs = Array.isArray(opts.views) ? opts.views : [ opts.views ];
    }
    else if (require.cache[__filename] && require.cache[__filename].parent) {
        // silly hack to use the __dirname of the requirer
        viewdirs.unshift(
            path.dirname(require.cache[__filename].parent.filename)
        );
    }
    
    var viewdir = null;
    for (var i = 0; i < viewdirs.length; i++) {
        if (path.existsSync(viewdirs[i])) {
            viewdir = viewdirs[i];
            break;
        }
    }
    if (!viewdir) throw new Error('No suitable views directory');
    
    return function (src, next) {
        fileify('views', viewdir)(src, function (fsrc, fnext) {
            // eval but don't run the entries which are behind a
            // process.nextTick() which calls setTimeout
            var c = { setTimeout : function () {} };
            vm.runInNewContext(fsrc, c);
            
            if (!c.require.modules.jadeify) {
                fsrc += sources.jadeify;
            }
            if (!c.require.modules.jquery) {
                fsrc += sources.jquery;
            }
            if (!c.require.modules.jade) {
                fsrc += sources.jade;
            }
            next(fsrc);
        });
    };
};
