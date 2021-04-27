/**
 * 
 * Message sub-service API to external entities
 * @module Room:API
 * 
 */
'use strict';

const validator = require('validator')
	, Message = require('./models/messages')
	, cError = require('../error')
	, utils = require('../utils')
	, MessageModel = Message.Model
	, RoomAPI = require('../room/api');


exports.find = function *(opts) {
	if (!opts.auth_user) {
		throw new cError.Unauthorized();
	}
	let query
		, res
		, params = {};

	// get collections
	res = {
		page: opts.page,
		per_page: opts.per_page,
		messages: []
	};

	if (!!opts.rid) {
		params.rid = validator.escape(validator.trim(opts.rid));
	}

	query = MessageModel.find(params)
			.populate('from', 'fbid name avatar created')
			.sort('-created')
			.skip((res.page - 1) * res.per_page)
			.limit(res.per_page);

	res.messages = yield query.exec();
	return res;
};

exports.upsert = function *(opts, fields) {
	// authentication check
	if (!opts.auth_user) {
		throw new cError.Unauthorized();
	}

	let message
		, res
		,data = {};

	if (opts.id) {
		if (!utils.isValidId(opts.id)) {
			throw new cError.BadRequest({ message: 'invalid message id.' });
		}
		let message = yield MessageModel.findOne({
			_id: opts.id
		}).exec();

		if (!message) {
			throw new cError.NotFound({ message: 'message id not exists.' })
		}

		if (message.from.toString() !== opts.auth_user.id) {
			throw new cError.Forbidden({ message: 'you do not have the right to update this message.' });
		}

		res = yield message.save();
		
	} else {
		// create
		if (!fields.rid || validator.isEmpty(fields.content)) {
			throw new cError.BadRequest({ message: 'missing fields: rid or content.' });
		}

		if (!utils.isValidId(fields.rid)) {
			throw new cError.BadRequest({ message: 'rid field incorrect format.' });
		}

		let room = yield RoomAPI.find({ id: fields.rid, auth_user: opts.auth_user });

		if (!room) {
			throw new cError.NotFound({ message: 'the room does not exist' })
		}

		let found = room.users.find((user) => {
			return user._id.toString() === opts.auth_user.id;
		});

		if (!found) {
			throw new cError.Forbidden({ message: 'you do not have the right to post to this room' });
		}

		data.content = validator.escape(validator.trim(fields.content));
		data.from = opts.auth_user._id;
		data.rid = fields.rid;
		message = new MessageModel(data);
		res = yield message.save();
	}

	return res;
}
