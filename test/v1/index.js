const request = require('supertest')
	, app = require('../../server')
	, agent = request.agent(app)
	, co = require('co')
	, should = require('chai').should()
	, passportMock = require('../mocks/passport-mock')
	, userAPI = require('../../services/user/api');


let testuser;

before(function () {
	console.log("Setting test env...");
	co(function *() {
		// add one user
		testuser = yield userAPI.findOrCreate({
			id: '123456',
			displayName: 'liang guo'
		});

		// after adding user, pass the data to the passport mock
		passportMock({
			passAuthentication: true,
			userId: testuser._id
		});
	});
});

describe('Rooms endpoints', function() {
	it('should return 200', function(done) {
		request(app)
			.get('/api/v1/rooms')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});


describe('Users endpoints', function() {
	it('should return 200 when use valid uid', function(done) {
		request(app)
			.get(`/api/v1/users/${testuser._id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(function (res) {
				res.body.should.have.property('status', 'success');
				res.body.data.should.have.property('_id', testuser._id.toString());
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
			.delete(`/api/v1/users/${testuser._id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(401, {
				status: 'error',
				message: 'unauthorized'
			}, done);
	});
});


describe('Users endpoints (authentication required)', function() {
	it('should login via mock endpoint and set-cookies', function (done) {
		request(app)
			.get('/api/v1/mock/login')
			.expect(function (res) {
				should.exist(res.headers['set-cookie']);
			})
			.end(function (err, res) {
				if (!err) {
					agent.jar.setCookie(res.headers['set-cookie'][0]);
					agent.jar.setCookie(res.headers['set-cookie'][1]);
					done();
				} else {
					done(err);
				}
			});
	});

	it('should pass the auth part but invalid uid', function (done) {
		agent
			.delete(`/api/v1/users/123`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(400, {
				status: 'error',
				message: 'invalid user id'
			}, done);
	});

	it('should pass the auth part and valid uid but do not have right to remove user', function (done) {
		agent
			.delete(`/api/v1/users/${testuser._id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(403, {
				status: 'error',
				message: 'forbidden'
			}, done);
	});
});

// TODO: add admin required test suites

after(function () {
	console.log("test done, clean up data...");
	co(function *() {
		// remove the test user
		yield userAPI.remove({
			id: testuser._id
		});
	});
});