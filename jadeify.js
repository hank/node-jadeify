var views = require('./views');
var jade = require('jade');
var traverse = require('traverse');
var $ = require('jquery');

module.exports = function (file, vars, opts) {
    if (!opts) opts = {};
    opts.locals = traverse(vars || {}).map(function (node) {
        if (node instanceof $) {
            this.update(
                node.get().map(function (elem) {
                    return elem.outerHTML
                }).join('')
            );
        }
        else if (node instanceof HTMLElement) {
            this.update(node.outerHTML);
        }
    });
    
    return $(jade.render(views[file], opts));
};
