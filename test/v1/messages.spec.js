const request = require('supertest')
	, app = require('../../server').server
	, should = require('chai').should()
	, TEST = require('./setup');


/*===================================
=            Guest Level            =
===================================*/

describe('Messages endpoints', function() {
	it('should return 401 when create message without auth', function(done) {
		request(app)
			.post('/api/v1/messages')
			.type('form')
			.send({
				content: 'test',
				rid: '5894d568d4f81c9d948aa20a'
			})
			.expect('Content-Type', /json/)
			.expect(401, {
				status: 'error',
				message: 'unauthorized'
			}, done);
	});
	it('should return 401 when get message without auth', function(done) {
		request(app)
			.get('/api/v1/messages')
			.expect('Content-Type', /json/)
			.expect(401, {
				status: 'error',
				message: 'unauthorized'
			}, done);
	});
	it('should return 401 when update message without auth', function(done) {
		request(app)
			.put('/api/v1/messages/5894d568d4f81c9d948aa20a')
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

describe('Messages endpoints (authentication required)', function() {
	let testMessage;
	it('should return 400 when create message with wrong id', function(done) {
		TEST.agent
			.post('/api/v1/messages')
			.type('form')
			.send({
				content: 'test',
				rid: '123'
			})
			.expect('Content-Type', /json/)
			.expect(400, {
				status: 'error',
				message: 'rid field incorrect format.'
			}, done);
	});
	it('should return 400 when update message with wrong id', function(done) {
		TEST.agent
			.put('/api/v1/messages/123')
			.expect('Content-Type', /json/)
			.expect(400, {
				status: 'error',
				message: 'invalid message id.'
			}, done);
	});
	it('should return 404 when update message with none exists id', function(done) {
		TEST.agent
			.put('/api/v1/messages/5894d568d4f81c9d948aa20a')
			.expect('Content-Type', /json/)
			.expect(404, {
				status: 'error',
				message: 'message id not exists.'
			}, done);
	});
	it('should return 403 when update others message', function(done) {
		TEST.agent
			.put(`/api/v1/messages/${TEST.messages[TEST.messages.length - 1]._id.toString()}`)
			.expect('Content-Type', /json/)
			.expect(403, {
				status: 'error',
				message: 'you do not have the right to update this message.'
			}, done);
	});
	it('should return 400 when create message without content', function(done) {
		TEST.agent
			.post('/api/v1/messages')
			.type('form')
			.send({
				content: '',
				rid: '5894d568d4f81c9d948aa20a'
			})
			.expect('Content-Type', /json/)
			.expect(400, {
				status: 'error',
				message: 'missing fields: rid or content.'
			}, done);
	});
	it('should return 404 when room not exists', function(done) {
		TEST.agent
			.post('/api/v1/messages')
			.type('form')
			.send({
				content: 'sdfsdf',
				rid: '5894d568d4f81c9d948aa20a'
			})
			.expect('Content-Type', /json/)
			.expect(404, {
				status: 'error',
				message: 'the room does not exist'
			}, done);
	});
	it('should return 403 when room not contain the user', function(done) {
		TEST.agent
			.post('/api/v1/messages')
			.type('form')
			.send({
				content: 'sdfsdf',
				rid: TEST.rooms[TEST.rooms.length - 1]._id.toString()
			})
			.expect('Content-Type', /json/)
			.expect(403, {
				status: 'error',
				message: 'you do not have the right to post to this room'
			}, done);
	});
	it('should create new message', function (done) {
		TEST.agent
			.post('/api/v1/messages')
			.set('Accept', 'application/json')
			.type('form')
			.send({
				content: 'message content',
				rid: TEST.rooms[0]._id.toString()
			})
			.expect('Content-Type', /json/)
			.expect(function (res) {
				testMessage = res.body.data;
				res.body.should.have.property('status', 'success');
				res.body.data.should.have.property('content', 'message content');
				res.body.data.should.have.property('rid', TEST.rooms[0]._id.toString());
			})
			.expect(200, done);
	});
	it('should return 200 when update message', function (done) {
		TEST.agent
			.put(`/api/v1/messages/${testMessage._id}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
	it('should get the messages based on room id', function (done) {
		TEST.agent
			.get(`/api/v1/messages?rid=${TEST.rooms[0]._id.toString()}`)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(function (res) {
				res.body.should.have.property('status', 'success');
				should.exist(res.body.data.page);
				should.exist(res.body.data.per_page);
				should.exist(res.body.data.messages);
				res.body.data.messages.should.have.length.above(0);
			})
			.expect(200, done);
	});
});