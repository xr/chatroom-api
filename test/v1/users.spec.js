const request = require('supertest')
	, app = require('../../server').server
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

	it('should return 404 when user does not exist', function (done) {
		request(app)
			.get('/api/v1/users/5895ceb9bc62a4c4c18f0d4d')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(404, {
				status: 'error',
				message: 'user does not exist'
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

	it('should return 401 when update user without login', function (done) {
		request(app)
			.put(`/api/v1/users/${TEST.users[0]._id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(401, {
				status: 'error',
				message: 'unauthorized'
			}, done);
	});

	it('should return 401 when get user notifications without login', function (done) {
		request(app)
			.get(`/api/v1/notifications`)
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

	it('should return 200 when only update rid', function (done) {
		TEST.agent
			.put(`/api/v1/users/${TEST.users[TEST.users.length - 1]._id}`)
			.type('form')
			.send({
				rid: '5894d568d4f81c9d948aa20a'
			})
			.expect('Content-Type', /json/)
			.expect(200, done);
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

	it('should be able to update the user object (name, sign and rooms)', function (done) {
		TEST.agent
			.put(`/api/v1/users/${TEST.users[0]._id}`)
			.type('form')
			.send({
				name: 'name_changed',
				sign: 'sign_changed',
				rid: '5894d568d4f81c9d948aa20a'
			})
			.expect('Content-Type', /json/)
			.expect(function (res) {
				res.body.should.have.property('status', 'success');
				res.body.data.should.have.property('name', 'name_changed');
				res.body.data.should.have.property('sign', 'sign_changed');
				res.body.data.rooms.should.contain("5894d568d4f81c9d948aa20a");
			})
			.expect(200, done);
	});

	it('should return 400 when uid invalid', function (done) {
		TEST.agent
			.put(`/api/v1/users/123`)
			.expect('Content-Type', /json/)
			.expect(400, done);
	});

	it('should return 404 when user does exist', function (done) {
		TEST.agent
			.put(`/api/v1/users/5894d568d4f81c9d948aa20a`)
			.expect('Content-Type', /json/)
			.expect(404, done);
	});

	it('should return 200 when user get notifications', function (done) {
		TEST.agent
			.get(`/api/v1/notifications`)
			.expect('Content-Type', /json/)
			.expect(200, done);
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