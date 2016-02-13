'use strict';
var mongo = require('mongodb');


module.exports = (config, connectionpool, log) => {
    log = log || require('./log')(config);
    connectionpool = connectionpool || require('./connection-pool')(log);
    var connectionStringBuilder = require('./connection-string-builder')(config);

    return (collectionname, databasename) => {
        return {
            connect() {
                var connstr = connectionStringBuilder(databasename);
                log.trace('Connecting to ' + connstr);
                return connectionpool.connect(connstr);
            },
            disconnect() {
                log.trace('Disconnecting');
                return connectionpool.disconnect();
            },
            select(query, options) {
                query = query || {};
                options = options || {};
                return this.connect()
                .then((db) => {
                    log.trace('Select ' + JSON.stringify(query) + ' from ' + collectionname + ' ' + JSON.stringify(options));
                    var collection = db.collection(collectionname);
                    return new Promise((resolve,reject) => {
                        collection.find(query, options, (err, cursor) => {
                            if (err) {
                                return reject(err);
                            }
                            if (!cursor) {
                                return reject('no cursor');
                            }
                            cursor.toArray((err, data) => {
                                if (err) {
                                    return reject(err);
                                }
                                //if (!data) {
                                //    return reject('no data');
                                //}
                                return resolve(data);
                            });
                        });
                    });
                });
            },
            selectTop(count, query, options) {
                return this.select(query, options)
                .then((data) => {
                    data = data || [];
                    return data.slice(0,count);
                });
            },
            selectStream(query, options) {
                query = query || {};
                options = options || {};
                return this.connect()
                .then((db) => {
                    log.trace('Select ' + JSON.stringify(query) + ' from ' + collectionname + ' ' + JSON.stringify(options));
                    var collection = db.collection(collectionname);
                    return new Promise((resolve,reject) => {
                        let stream = collection.find(query, options).stream();
                        return resolve({collection: collection, stream: stream});
                    });
                });
            },
            insert(data, options) {
                data = data || {};
                options = options || {};
                return this.connect()
                .then((db) => {
                    log.trace('Insert ' + JSON.stringify(data));
                    var collection = db.collection(collectionname);
                    return new Promise((resolve,reject) => {
                        collection.insert(data, options, (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(result);
                        });
                    });
                });
            },
            update(query, fields, options) {
                query = query || {};
                options = options || {};
                return this.connect()
                .then((db) => {
                    log.trace('Update ' + JSON.stringify(query) + ' with ' + JSON.stringify(fields));
                    var collection = db.collection(collectionname);
                    return new Promise((resolve,reject) => {
                        collection.update(query, fields, options, (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(result);
                        });
                    });
                });
            },
            remove(query, options) {
                query = query || {};
                options = options || {};
                return this.connect()
                .then((db) => {
                    log.trace('Remove ' + JSON.stringify(query));
                    var collection = db.collection(collectionname);
                    return new Promise((resolve,reject) => {
                        collection.find(query, options, (err, cursor) => {
                            if (err) {
                                return reject(err);
                            }
                            cursor.toArray((e1, data) => {
                                data = data || [{}];
                                if (e1) {
                                    return reject(e1);
                                }
                                collection.remove(query, options, (e2, r) => {
                                    if (e2) {
                                        return reject(e2);
                                    }
                                    return resolve(data[0]);
                                });
                            });
                        });
                    });
                });
            },
            save(data, options) {
                options = options || {};
                return this.connect()
                .then((db) => {
                    log.trace('Save ' + JSON.stringify(data));
                    var collection = db.collection(collectionname);
                    return new Promise((resolve,reject) => {
                        collection.save(data, options, (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(result);
                        });
                    });
                });
            }
        };
    }
};
