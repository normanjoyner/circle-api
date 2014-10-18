var _ = require("lodash");
var base32 = require("thirty-two");
var api = require([__dirname, "lib", "api"].join("/"));
var pkg = require([__dirname, "package"].join("/"));

function Circle(config){
    this.configure(config || {});
}

Circle.prototype.configure = function(config){
    this.version = pkg.version;
    this.api_version = config.api_version || "v2";
    this.auth = {
        mfa_secret: base32.decode(config.mfa_secret)
    }
}

_.each(api, function(method, name){
    Circle.prototype[name] = method;
});

module.exports = Circle;
