const request = require('supertest')
	, app = require('../../server');


describe('test/v1/index.js', function() {
	it('should return 200', function(done) {
		request(app)
			.get('/api/v1/rooms')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});