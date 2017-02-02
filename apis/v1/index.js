/**
 *
 * REST API handler
 * @module RESTAPI:API-v1
 *
 */
'use strict';

// needed API libraries
const Router = require('koa-router')
	, passport = require('koa-passport');

// load API config & related services
const Auth = require('../../services/auth')
	, config = require('../../config')
	, utils = require('../../services/utils')
	, cError = require('../../services/error');


// initialize
const API = new Router();

exports = module.exports = API;

// register services
const RoomAPI = require('../../services/room/api')
	, UserAPI = require('../../services/user/api');

/*===========================================
=            Authentication Part            =
===========================================*/

API.get('/auth/:mode', function *() {
	yield passport.authenticate(this.params.mode);
});

API.get('/auth/:mode/callback', function *() {
	yield passport.authenticate(this.params.mode, {
		successRedirect: config.app.url,
		failureRedirect: `${config.app.url}/login?error=1`
	});
});



/*=======================================
=            Rooms Endpoints            =
=======================================*/

/**
 * GET /rooms
 * Return a list of rooms.
 * @return {JSON string} [rooms as JSON collections]
 */
API.get('/rooms', function *() {
	console.log('[GET /rooms handler start]');
	this.body = yield RoomAPI.get();
});

/**
 * POST /rooms
 * Create a new room
 * @return {JSON string} [newly created room]
 */
API.post('/rooms', function *() {
	let content = this.request.body;
	this.body = yield RoomAPI.upsert({}, content);
});

/*=======================================
=            Users Endpoints            =
=======================================*/

/**
 * GET users details
 * @param {String} uid
 * @return {JSON string} [user entity]
 */
API.get('/users/:id', function *() {
	console.log(`[GET /users/${this.params.id} handler start]`);

	if (!utils.isValidId(this.params.id)) {
		throw new cError.BadRequest({
			message: 'invalid user id'
		});	
	}

	this.body = {
		'status': 'success',
		'data': yield UserAPI.find({ id: this.params.id })
	}
});

API.delete('/users/:id', function *() {
	console.log(`[DELETE /users/${this.params.id} handler start]`);

	if (!this.isAuthenticated()) {
		throw new cError.Unauthorized();
	}

	if (!utils.isValidId(this.params.id)) {
		throw new cError.BadRequest({
			message: 'invalid user id'
		});	
	}

	if (!Auth.isAdmin(this.req.user.id)) {
		throw new cError.Forbidden();
	}

	this.body = {
		'status': 'success',
		'data': yield UserAPI.remove({ id: this.params.id })
	}

});

