const request = require('supertest')
	, app = require('../../server')
	, config = require('../../config')
	, should = require('chai').should()
	, TEST = require('./setup');

/*===================================
=            Guest level            =
===================================*/

describe('Users endpoints', function() {
	it('should return 200 when use valid uid', function(done) {
		request(app)
			.get(`/api/v1/users/${TEST.users[0]._id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(function (res) {
				res.body.should.have.property('status', 'success');
				res.body.data.should.have.property('_id', TEST.users[0]._id.toString());
				should.exist(res.body.data.name);
				should.exist(res.body.data.updated);
				should.exist(res.body.data.created);
				should.exist(res.body.data.blocked);
			})
			.expect(200, done);
	});

	it('should return 400 when use invalid uid', function(done) {
		request(app)
			.get('/api/v1/users/123')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(400, {
				status: 'error',
				message: 'invalid user id'
			}, done);
	});

	it('should return 401 when try to remove a user when unauth', function(done) {
		request(app)
			.delete(`/api/v1/users/${TEST.users[0]._id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(401, {
				status: 'error',
				message: 'unauthorized'
			}, done);
	});
});

/*=====================================
=            Authenticated            =
=====================================*/

describe('Users endpoints (authentication required)', function() {
	it('should pass the auth part but invalid uid', function (done) {
		TEST.agent
			.delete(`/api/v1/users/123`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(400, {
				status: 'error',
				message: 'invalid user id'
			}, done);
	});

	it('should pass the auth part and valid uid but do not have right to remove user', function (done) {
		TEST.agent
			.delete(`/api/v1/users/${TEST.users[0]._id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(403, {
				status: 'error',
				message: 'forbidden'
			}, function (err, res) {
				if (!err) {
					// add the testuser to admin list
					config.admins = [TEST.users[0]._id.toString()];
					done();
				} else {
					done(err);
				}
			});
	});
});

/*===================================
=            Admin Level            =
===================================*/

describe('Users endpoints (admin required)', function() {
	it('should remove user', function (done) {
		TEST.agent
			.delete(`/api/v1/users/${TEST.users[TEST.users.length - 1]._id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});