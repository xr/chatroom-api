const request = require('supertest')
	, app = require('../../server').server
	, agent = request.agent(app)
	, co = require('co')
	, should = require('chai').should()
	, passportMock = require('../mocks/passport-mock')
	, UserModel = require('../../services/user/models/users').Model
	, RoomModel = require('../../services/room/models/rooms').Model
	, db = require('mongoose').connection;

let TEST = {
	users: [],
	rooms: [],
	agent: agent
};

exports = module.exports = TEST;

before(function (done) {
	console.log("Setting test data...");
	db.once('open', function callback () {
	  console.info('[DATABASE] Test Env Ready');
	  co(function *() {
			// generate random users
			for (var i = 0; i < 10; i++) {
				let user = yield UserModel.create({
					name: `liang${i+1}`,
					fbid: `${i+1}`
				});

				// create one room for each user
				let room = yield RoomModel.create({
					title: Math.random().toString(36).slice(2),
					desc: Math.random().toString(36).slice(2),
					owner: user._id
				});

				TEST.users.push(user);
				TEST.rooms.push(room);
			}

			// each one create one room

			// after adding user, pass the data to the passport mock
			passportMock({
				passAuthentication: true,
				userId: TEST.users[0]._id
			});
			done();
		});
	});
});

describe('Setup Authenticated User', function() {
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
});

after(function (done) {
	console.log("Clean Up test data...");
	co(function *() {
		yield UserModel.remove({});
		yield RoomModel.remove({});
		done();
	});
});