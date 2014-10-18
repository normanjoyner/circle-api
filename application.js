var _ = require("lodash");
var Circle = require([__dirname, "circle"].join("/"));
var pkg = require([__dirname, "package"].join("/"));

exports = module.exports = function(config){
    var circle = new Circle(config);
    circle.version = pkg.version;
    return circle;
}
