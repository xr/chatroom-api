/**
 * 
 * Room sub-service API to external entities
 * @module Room:API
 * 
 */
'use strict';

const validator = require('validator')
	, Room = require('./models/rooms')
	, cError = require('../error')
	, Auth = require('../auth')
	, RoomModel = Room.Model;

/**
 * find Rooms or room if provide id
 * @param {object} opts
 * @return {collections} or {document}
 */
exports.find = function *(opts) {
	let rooms
		, query
		, params = {};

	let res = {
		page: opts.page,
		per_page: opts.per_page,
		rooms: []
	};

	if (!!opts.keyword) {
		params.title = {'$regex': validator.escape(validator.trim(opts.keyword)), '$options': 'i'};
	}

	query = RoomModel.find(params)
			.populate('owner')
			.sort('-created')
			.where('removed').equals(false)
			.skip((res.page - 1) * res.per_page)
			.limit(res.per_page);

	rooms = yield query.exec();
	res.rooms = rooms.map((r) => r.toObject({ virtuals: true, versionKey: false }));
	return res;
};

/**
 * create a new room or update one
 * @param {object} opts
 * @param {object} fields
 * @return {document}
 */
exports.upsert = function *(opts, fields) {
	let res
		, errMsg
		, room
		, data = {};

	if (fields.title) {
		data.title = validator.escape(validator.trim(fields.title));
		if (validator.isEmpty(data.title)) {
			errMsg = 'You must give a title';
		}
	}

	if (fields.desc) {
		data.desc = validator.escape(validator.trim(fields.desc));
	}

	if (errMsg) throw new cError.BadRequest({ message: errMsg });

	if (opts.id) {
		// update
		room = yield RoomModel.findOne({ _id: opts.id }).exec();

		if (!room) {
			throw new cError.NotFound({ message: 'room does not exist' })
		}

		if ((room.owner.toString() === opts.auth_user._id.toString()) || Auth.isAdmin(opts.auth_user.id)) {
			if (fields.title) {
				room.title = fields.title;
			}

			if (fields.desc) {
				room.desc = fields.desc;
			}

		} else {
			throw new cError.Forbidden();
		}
	} else {
		data.owner = opts.auth_user._id;
		room = new RoomModel(data);
	}

	try {
		res = yield room.save();
	} catch (e) {
		if (e.code === 11000) {
			throw new cError.Conflict({ message: 'room name already exists' });
		}
	}

	return res;
}
