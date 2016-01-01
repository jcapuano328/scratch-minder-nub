'use strict'

module.exports = (config) => {
    return (databasename) => {
        databasename = databasename || config.db.name;
        let connstr = 'mongodb://';
        if (config.db.username) {
            connstr += config.db.username + ':' + config.db.password + '@';
        }
        connstr += config.db.server + ':' + config.db.port + '/' + databasename;
        return connstr;
    }
}
