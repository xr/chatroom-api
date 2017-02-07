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
});


/*==================================
=            Auth Level            =
==================================*/

describe('Messages endpoints (authentication required)', function() {
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
	it('should create new message', function (done) {
		TEST.agent
			.post('/api/v1/messages')
			.set('Accept', 'application/json')
			.type('form')
			.send({
				content: 'message content',
				rid: '5894d568d4f81c9d948aa20a'
			})
			.expect('Content-Type', /json/)
			.expect(function (res) {
				res.body.should.have.property('status', 'success');
				res.body.data.should.have.property('content', 'message content');
				res.body.data.should.have.property('rid', '5894d568d4f81c9d948aa20a');
			})
			.expect(200, done);
	});
});