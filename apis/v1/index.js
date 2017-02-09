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
	, UserAPI = require('../../services/user/api')
	, MessageAPI = require('../../services/message/api');

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
 *					},
 *					"messages": {
 *						"href": "api/v1/messages?rid=5895cd21bc62a4c4c18f0d4c"
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
 * @api {get} /api/v1/rooms/:id getRoom
 * @apiGroup Room
 * @apiPermission authenticated
 * @apiParam {String} id room id
 * @apiDescription get details of one room.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"status": "success"
 * 	"data": {
 * 		...
 * 	}
 * }
 * 
 */
API.get('/rooms/:id', function *() {
	console.log(`[GET /rooms/${this.params.id} handler start]`);

	this.body = {
		'status': 'success',
		'data': yield RoomAPI.find({ auth_user: this.req.user, id: this.params.id })
	};
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
 * @apiParam {String} [title] The room title
 * @apiParam {String} [logo] The room's logo
 * @apiParam {String} [desc] The room description
 * @apiParam {String} [uid] User id who joined the room
 * @apiDescription update the room information.
 * @apiError Unauthorized Login required
 * @apiError BadRequest Invalid room/user id
 * @apiError NotFound Room/uid does not exist
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
 * @api {put} /api/v1/users/:id updateUser
 * @apiGroup User
 * @apiPermission authenticated/admin
 * @apiParam {String} id The user id
 * @apiParam {String} [signature] The user signature
 * * @apiParam {String} [rid] The room id if user join a room
 * @apiDescription update the user details
 * @apiError Unauthorized Login required
 * @apiError BadRequest Invalid user id
 * @apiError NotFound User does not exist
 * @apiError Forbidden You do not have right to modify this user
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
API.put('/users/:id', function *() {
	console.log(`[PUT /users/${this.params.id} handler start]`);

	this.body = {
		'status': 'success',
		'data': yield UserAPI.update({ id: this.params.id, auth_user: this.req.user }, this.request.body)
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

/**
 * @api {post} /api/v1/messages createMessage
 * @apiGroup Message
 * @apiPermission authenticated
 * @apiParam {String} rid The room id where the message will send to
 * @apiParam {String} content The message content
 * @apiDescription send a message to one room
 * @apiError Unauthorized Login required
 * @apiError BadRequest Missing rid or content field
 * @apiError NotFound The room where send message to does not exist
 * @apiError Forbidden You do not have the right to post to the room
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"status": "success",
 * 	"data": {
 * 		content: 'message content',
 * 		from: '589a372779bf5d17cd9b9480',
 * 		rid: '5894d568d4f81c9d948aa20a',
 * 		_id: '589a372879bf5d17cd9b9497',
 * 		created: '2017-02-07T21:07:52.034Z'
 * 	}
 * }
 */
API.post('/messages', function *() {
	console.log(`[POST /messages handler start]`);

	this.body = {
		'status': 'success',
		'data': yield MessageAPI.upsert({ auth_user: this.req.user }, this.request.body)
	};

});

/**
 * @api {put} /api/v1/messages/:id updateMessage
 * @apiGroup Message
 * @apiPermission authenticated
 * @apiParam {String} id The message id
 * @apiDescription update the message. Note: currently only support update message read status, empty payload required.
 * @apiError Unauthorized Login required
 * @apiError BadRequest Invalid message id. Note: empty payload will mark message as read(1)
 * @apiError NotFound The message id not found
 * @apiError Forbidden You do not have the right to update the message
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"status": "success",
 * 	"data": {
 * 		"_id": "589cd34f6e2da106678105ae",
 * 		"content": "hello",
 * 		"from": "589b78d0126f4d5825056055",
 * 		"rid": "589b7a3187525658bc826301",
 * 		"to": "589b78d0126f4d5825056055",
 * 		"__v": 0,
 * 		"created": "2017-02-09T20:38:39.678Z",
 * 		"updated": "2017-02-09T20:38:39.678Z",
 * 		"read": 1
 * 	}
 * }
 */
API.put('/messages/:id', function *() {
	console.log(`[PUT /messages/${this.params.id} handler start]`);

	this.body = {
		'status': 'success',
		'data': yield MessageAPI.upsert({ auth_user: this.req.user, id: this.params.id })
	};

});

/**
 * @api {get} /api/v1/messages getMessages
 * @apiGroup Message
 * @apiPermission authenticated
 * @apiParam {Number} [page=1]
 * @apiParam {Number} [per_page=10]
 * @apiParam {String} [rid] room id
 * @apiDescription get a list of messages based on conditions.
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"status": "success"
 * 	"data": {
 * 		"page": 1,
 * 		"per_page": 10,
 *		"messages": [
 *			...
 *		]
 * 	}
 * }
 * 
 */
API.get('/messages', function *() {
	console.log('[GET /messages handler start]');

	this.body = {
		'status': 'success',
		'data': yield MessageAPI.find({
			page: Number(this.request.query.page) || 1,
			per_page: Number(this.request.query.per_page) || 10,
			auth_user: this.req.user,
			rid: this.request.query.rid || null
		})
	}
});

/**
 * @api {get} /api/v1/notifications getNotifications
 * @apiGroup Notification
 * @apiPermission authenticated
 * @apiDescription get a list of notifications for the user.
 * @apiError Unauthorized Login required
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	"status": "success"
 * 	"data": [
 * 		"messages": [
 * 			{
 * 				"_id": "589cc29bc3f3de032a1293eb",
 * 				"content": "content",
 * 				"from": {
 * 					...
 * 				},
 * 				...
 * 				"to": "xxx",
 * 				...
 * 				"read": 0
 * 			}
 * 		],
 * 		"room": {
 * 			...
 * 		}
 * 	]
 * }
 * 
 */
API.get('/notifications', function *() {
	console.log('[GET /notifications handler start]');

	this.body = {
		'status': 'success',
		'data': yield UserAPI.getNotifications({
			auth_user: this.req.user
		})
	};
});