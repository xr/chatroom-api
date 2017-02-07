const request = require('supertest')
	, app = require('../../server').server
	, should = require('chai').should()
	, TEST = require('./setup');


/*===================================
=            Guest Level            =
===================================*/

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
			.expect(401, {
				status: 'error',
				message: 'unauthorized'
			}, done);
	});
});


/*==================================
=            Auth Level            =
==================================*/

describe('Rooms endpoints (authentication required)', function() {
	let testRoom;
	it('should create new room', function (done) {
		TEST.agent
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
				res.body.data.should.have.property('owner', TEST.users[0]._id.toString());
				res.body.data.should.have.property('private', false);
				res.body.data.users.should.contain(TEST.users[0]._id.toString());
			})
			.expect(200, done);
	});
	it('should create a private room', function (done) {
		TEST.agent
			.post('/api/v1/rooms')
			.set('Accept', 'application/json')
			.type('form')
			.send({
				title: 'private',
				desc: 'private',
				private: true
			})
			.expect('Content-Type', /json/)
			.expect(function (res) {
				res.body.should.have.property('status', 'success');
				res.body.data.should.have.property('title', 'private');
				res.body.data.should.have.property('desc', 'private');
				res.body.data.should.have.property('owner', TEST.users[0]._id.toString());
				res.body.data.should.have.property('private', true);
				res.body.data.users.should.contain(TEST.users[0]._id.toString());
			})
			.expect(200, done);
	});
	it('should return 400 when update room with wrong id', function(done) {
		TEST.agent
			.put('/api/v1/rooms/123')
			.field('title', 'test')
			.field('desc', 'test')
			.expect('Content-Type', /json/)
			.expect(400, {
				status: 'error',
				message: 'invalid room id'
			}, done);
	});
	it('should return 404 if the room does not exist', function (done) {
		TEST.agent
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
		TEST.agent
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
		TEST.agent
			.put(`/api/v1/rooms/${testRoom._id}`)
			.set('Accept', 'application/json')
			.type('form')
			.send({
				title: 'test-changed',
				desc: 'test-changed',
				uid: '5894d568d4f81c9d948aa20a',
				logo: 'http://logo.com/logo.png'
			})
			.expect('Content-Type', /json/)
			.expect(function (res) {
				res.body.should.have.property('status', 'success');
				res.body.data.should.have.property('title', 'test-changed');
				res.body.data.should.have.property('desc', 'test-changed');
				res.body.data.should.have.property('logo', 'http://logo.com/logo.png');
				res.body.data.users.should.contain("5894d568d4f81c9d948aa20a");
			})
			.expect(200, done);
	});
	it('should not update others room', function (done) {
		TEST.agent
			.put(`/api/v1/rooms/${TEST.rooms[1]._id}`)
			.set('Accept', 'application/json')
			.type('form')
			.send({
				title: 'test-changed',
				desc: 'test-changed'
			})
			.expect('Content-Type', /json/)
			.expect(403, {
				'status': 'error',
				'message': 'you do not have right to modify this room'
			}, done);
	});
});