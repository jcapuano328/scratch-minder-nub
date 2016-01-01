'use strict';
var chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sandbox = require('sandboxed-module');
chai.use(require('sinon-chai'));

describe('Connection String', () => {
	var env = {};
	beforeEach(() => {
		env = {};
		env.config = {
            db: {
                server: 'dbserver',
                port: 12345,
                name: 'scratchminder',
                options: {
                    server: {
                        maxPoolSize: 10
                    },
                    db: {
                        journal: true,
                        safe: true
                    }
                }
            }
        };

        env.cs = sandbox.require('../../src/connection-string-builder')(env.config);
    });

	describe('default database', () => {
		beforeEach(() => {
			env.connstr = env.cs();
		});
		it('should create the the connection string to the default database', () => {
			expect(env.connstr).to.equal('mongodb://dbserver:12345/scratchminder');
		});
	});

	describe('target database', () => {
		beforeEach(() => {
			env.connstr = env.cs('bars');
		});
		it('should create the the connection string to the target database', () => {
			expect(env.connstr).to.equal('mongodb://dbserver:12345/bars');
		});
	});
});
