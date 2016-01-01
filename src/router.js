'use strict'
var path = require('path'),
    file = require('file');

var methods = ['post', 'get', 'put', 'del', 'delete'];

module.exports = (config, log) => {
    log = log || require('./log')(config);

    return (auth) => {
        auth = auth || () => {return (req,res,next) => { next && next();}}

        function findFiles(folder) {
            log.debug('load routes from ' + folder);
            return new Promise((resolve, reject) => {
                file.walk(folder, (err, start, dirs, files) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(files || []);
                });
            });
        }

        function registerRoutes(file, server, auth) {
            log.trace('Loading routes from ' + file);
            let routes = require(path.resolve(file)) || [];
            if (typeof routes === 'function') {
                routes = routes(server);
            }
            routes.forEach((route) => {
                log.debug('Register route ' + JSON.stringify(route));
                //if (route.method == 'delete') { route.method = 'del'; }
                if (methods.indexOf(route.method) < 0) {
                    throw new Error(route.method + ' is not a valid HTTP method');
                }
                server[route.method](route.uri, auth(route.protected), route.handler);
            });
        }

        return {
            register(server) {
                log.debug('Register routes');
                return new Promise((resolve, reject) => {
                    findFiles(config.paths.routes)
                    .then((files) => {
                        files.forEach((file) => {
                            registerRoutes(file, server, auth);
                        });
                        resolve();
                    })
                    .catch((err) => {
                        reject(err);
                    });
                });
            }
        };
    };
};
