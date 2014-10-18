var _ = require("lodash");
var request = require("request");

exports.create = function(config, fn){
    var options = {
        uri: ["https://www.circle.com", config.uri].join("/"),
        method: config.method,
        qs: config.qs || {},
        headers: _.defaults(config.headers, {
            "Content-Type": "application/json",
            "User-Agent": ["circle-api", config.version].join(" ")
        })
    }

    if(!_.isUndefined(config.body))
        options.json = config.body;

    request(options, function(err, response){
        fn(err, response);
    });
}
