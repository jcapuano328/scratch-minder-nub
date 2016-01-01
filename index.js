module.exports = (config) => {
    var log = require('./src/log')(config);
    var connpool = require('./src/connection-pool')(log);
    return {
        Logger: log,
        ConnectionStringBuilder: require('./src/connection-string-builder')(config),
        ConnectionPool: connpool,
        Repository: require('./src/repository')(config, connpool, log),
        Router: require('./src/router')(config, log)
    };
};
