const request = require('supertest')
	, app = require('../../server')
	, co = require('co')
	, should = require('chai').should()
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
});

after(function () {
	console.log("test done, clean up data...");
	co(function *() {
		// remove the test user
		yield userAPI.remove({
			id: testuser._id
		});
	});
});