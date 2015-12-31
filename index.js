module.exports = (config) => {
    var log = require('./src/log')(config);
    var connpool = require('./src/connection-pool')(log);
    return {
        Logger: log,
        ConnectionPool: connpool,
        Repository: require('/src/repository')(config, connpool, log),
        Router: require('/src/router')(config, log)
    };
};
