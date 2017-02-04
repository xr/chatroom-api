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

/**
 * @api {get} /api/v1/auth/:name signIn
 * @apiGroup Auth
 * @apiPermission none
 * @apiParam {String} name The provider name, i.e. facebook
 * @apiDescription signIn via different platforms.
 * 
 */
API.get('/auth/:mode', function *() {
	yield passport.authenticate(this.params.mode);
});

API.get('/auth/:mode/callback', function *() {
	yield passport.authenticate(this.params.mode, {
		successRedirect: config.app.url,
		failureRedirect: `${config.app.url}/login?error=1`
	});
});


/**
 * @api {get} /api/v1/rooms getRooms
 * @apiGroup Room
 * @apiPermission none
 * @apiParam {Number} [page=1]
 * @apiParam {Number} [per_page=10]
 * @apiParam {String} [keywords] filter rooms that title contains keywords
 * @apiDescription get a list of rooms.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"status": "success"
 * 	"data": {
 * 		"page": 1,
 * 		"per_page": 10,
 *		"rooms": [
 *			{
 *				"_id": "5895cd21bc62a4c4c18f0d4c",
 *				"title": "room title",
 *				"desc": "room description",
 *				"owner": {
 *					...
 *				},
 *				"updated": "2017-02-04T12:46:25.194Z",
 *				"created": "2017-02-04T12:46:25.194Z",
 *				"removed": false,
 *				"_links": {
 *					"self": {
 *						"href": "api/v1/rooms/5895cd21bc62a4c4c18f0d4c"
 *					}
 *				},
 *				"id": "5895cd21bc62a4c4c18f0d4c"
 *				}
 *		]
 * 	}
 * }
 * 
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
 * @api {post} /api/v1/rooms createRoom
 * @apiGroup Room
 * @apiPermission authenticated
 * @apiParam {String} title The room title
 * @apiParam {String} [desc] The room description
 * @apiDescription create a new room.
 * @apiError Unauthorized Login required
 * @apiError BadRequest You must give a title
 * @apiError Conflict Room name already exists
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"status": "success",
 * 	"data": {
 * 		"title": "title",
 * 		"desc": "desc",
 * 		"owner": "userid",
 * 		...
 * 	}
 * }
 * 
 */
API.post('/rooms', function *() {
	console.log('[POST /rooms handler start]');

	this.body = {
		'status': 'success',
		'data': yield RoomAPI.upsert({ auth_user: this.req.user }, this.request.body)
	};
});

/**
 * @api {put} /api/v1/rooms/:id updateRoom
 * @apiGroup Room
 * @apiPermission authenticated/admin
 * @apiParam {String} id The room id
 * @apiDescription update the room information.
 * @apiError Unauthorized Login required
 * @apiError BadRequest Invalid room id
 * @apiError NotFound Room does not exist
 * @apiError Forbidden You do not have right to modify this room
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"status": "success",
 * 	"data": {
 * 		"title": "title",
 * 		"desc": "desc",
 * 		"owner": "userid",
 * 		...
 * 	}
 * }
 * 
 */
API.put('/rooms/:id', function *() {
	console.log(`[PUT /rooms/${this.params.id} handler start]`);

	this.body = {
		'status': 'success',
		'data': yield RoomAPI.upsert({ auth_user: this.req.user, id: this.params.id }, this.request.body)
	};
});

/**
 * @api {get} /api/v1/users/:id getUser
 * @apiGroup User
 * @apiPermission none
 * @apiParam {String} id The user id
 * @apiDescription get the user details
 * @apiError BadRequest Invalid user id
 * @apiError NotFound User does not exist
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"status": "success",
 * 	"data": {
 * 		"_id": "5895abc7b9556ac3aada3d4f",
 * 		"fbid": "facebook id",
 * 		"name": "name",
 * 		...
 * 	}
 * }
 * 
 */
API.get('/users/:id', function *() {
	console.log(`[GET /users/${this.params.id} handler start]`);

	this.body = {
		'status': 'success',
		'data': yield UserAPI.find({ id: this.params.id })
	};
});

/**
 * @api {delete} /api/v1/users/:id deleteUser
 * @apiGroup User
 * @apiPermission admin
 * @apiParam {String} id The user id
 * @apiDescription delete one user
 * @apiError Unauthorized Login required
 * @apiError BadRequest Invalid user id
 * @apiError Forbidden You do not have right to delete the user
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"status": "success",
 * 	"data": {
 * 		...
 * 	}
 * }
 * 
 */
API.delete('/users/:id', function *() {
	console.log(`[DELETE /users/${this.params.id} handler start]`);

	this.body = {
		'status': 'success',
		'data': yield UserAPI.remove({ auth_user: this.req.user, id: this.params.id })
	};

});

