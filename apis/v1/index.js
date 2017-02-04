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
const config = require('../../config');


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
 * @param {string} [page]
 * @param {string} [pre_page]
 * @param {string} [keyword]
 * Return a list of rooms.
 * @return {JSON string} [rooms as JSON collections]
 */
API.get('/rooms', function *() {
	console.log('[GET /rooms handler start]');

	this.body = {
		'status': 'success',
		'data': yield RoomAPI.find({
			page: Number(this.request.query.page) || 1,
			per_page: Number(this.request.query.per_page) || 10,
			keyword: this.request.query.keyword || null
		})
	}
});

/**
 * POST /rooms
 * Create a new room
 * @return {JSON string} [newly created room]
 */
API.post('/rooms', function *() {
	console.log('[POST /rooms handler start]');

	this.body = {
		'status': 'success',
		'data': yield RoomAPI.upsert({ auth_user: this.req.user }, this.request.body)
	};
});

/**
 * PUT /rooms/:id
 * update a room
 * @return {JSON string} [updated room]
 */
API.put('/rooms/:id', function *() {
	console.log(`[PUT /rooms/${this.params.id} handler start]`);

	this.body = {
		'status': 'success',
		'data': yield RoomAPI.upsert({ auth_user: this.req.user, id: this.params.id }, this.request.body)
	};
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

	this.body = {
		'status': 'success',
		'data': yield UserAPI.find({ id: this.params.id })
	};
});

/**
 * Delete one user
 * @param {String} uid
 * @return {[JSON string]}
 */
API.delete('/users/:id', function *() {
	console.log(`[DELETE /users/${this.params.id} handler start]`);

	this.body = {
		'status': 'success',
		'data': yield UserAPI.remove({ auth_user: this.req.user, id: this.params.id })
	};

});

