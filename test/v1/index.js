const request = require('supertest')
	, app = require('../../server')
	, agent = request.agent(app)
	, co = require('co')
	, config = require('../../config')
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

		// TODO: add two rooms

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
			.expect(function (res) {
				should.exist(res.body.data.page);
				should.exist(res.body.data.per_page);
				should.exist(res.body.data.rooms);
			})
			.expect(200, done);
	});
	it('should return correct pagination data', function(done) {
		request(app)
			.get('/api/v1/rooms?page=2&per_page=1')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(function (res) {
				res.body.data.page.should.equal(2);
				res.body.data.per_page.should.equal(1);
			})
			.expect(200, done);
	});
	it('should return 401 when create room without auth', function(done) {
		request(app)
			.post('/api/v1/rooms')
			.field('title', 'test')
			.field('desc', 'test')
			.expect('Content-Type', /json/)
			.expect(401, {
				status: 'error',
				message: 'unauthorized'
			}, done);
	});
	it('should return 400 when update room with wrong id', function(done) {
		request(app)
			.put('/api/v1/rooms/123')
			.field('title', 'test')
			.field('desc', 'test')
			.expect('Content-Type', /json/)
			.expect(400, {
				status: 'error',
				message: 'invalid room id'
			}, done);
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
			}, function (err, res) {
				if (!err) {
					// add the testuser to admin list
					config.admins = [testuser._id.toString()];
					done();
				} else {
					done(err);
				}
			});
	});
});

describe('Rooms endpoints (authentication required)', function() {
	let testRoom;
	it('should create new room', function (done) {
		agent
			.post('/api/v1/rooms')
			.set('Accept', 'application/json')
			.type('form')
			.send({
				title: 'test',
				desc: 'test'
			})
			.expect('Content-Type', /json/)
			.expect(function (res) {
				testRoom = res.body.data;
				res.body.should.have.property('status', 'success');
				res.body.data.should.have.property('title', 'test');
				res.body.data.should.have.property('desc', 'test');
				res.body.data.should.have.property('owner', testuser._id.toString());
			})
			.expect(200, done);
	});
	it('should return 404 if the room does not exist', function (done) {
		agent
			.put('/api/v1/rooms/5894d568d4f81c9d948aa20a')
			.set('Accept', 'application/json')
			.type('form')
			.send({
				title: 'test-changed',
				desc: 'test-changed'
			})
			.expect('Content-Type', /json/)
			.expect(404, {
				'status': 'error',
				'message': 'room does not exist'
			}, done);
	});
	it('should return 409 Conflict if create another room', function (done) {
		agent
			.post('/api/v1/rooms')
			.set('Accept', 'application/json')
			.type('form')
			.send({
				title: 'test',
				desc: 'test'
			})
			.expect('Content-Type', /json/)
			.expect(409, {
				'status': 'error',
				'message': 'room name already exists'
			}, done);
	});
	it('should update the room', function (done) {
		agent
			.put(`/api/v1/rooms/${testRoom._id}`)
			.set('Accept', 'application/json')
			.type('form')
			.send({
				title: 'test-changed',
				desc: 'test-changed'
			})
			.expect('Content-Type', /json/)
			.expect(function (res) {
				res.body.should.have.property('status', 'success');
				res.body.data.should.have.property('title', 'test-changed');
				res.body.data.should.have.property('desc', 'test-changed');
			})
			.expect(200, done);
	});
});


describe('Users endpoints (admin required)', function() {
	it('should remove user', function (done) {
		agent
			.delete(`/api/v1/users/${testuser._id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});