'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module');
chai.use(require('sinon-chai'));

describe('Interface', () => {
	var env = {};
	beforeEach(() => {
		env = {};
        env.config = {
            log: {
                server: {

                }
            },
            db: {
                
            }
        };

        env.interface = sandbox.require('../../index')(env.config);
    });

    it('should provide a logger', () => {
        expect(env.interface).to.have.property('Logger');
    });

    it('should provide a connection pool', () => {
        expect(env.interface).to.have.property('ConnectionPool');
    });

    it('should provide a repository', () => {
        expect(env.interface).to.have.property('Repository');
    });

    it('should provide a router', () => {
        expect(env.interface).to.have.property('Router');
    });
});
