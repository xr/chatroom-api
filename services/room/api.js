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
	, utils = require('../utils')
	, RoomModel = Room.Model;

/**
 * find Rooms or room if provide id
 * @param {Object} opts
 * @return {collections} or {document}
 */
exports.find = function *(opts) {
	let query
		, res
		, params = {};

	if (opts.id) {
		if (!opts.auth_user) {
			throw new cError.Unauthorized();
		}
		if (!utils.isValidId(opts.id)) {
			throw new cError.BadRequest({
				message: 'invalid room id'
			});	
		}
		params._id = validator.escape(validator.trim(opts.id));
		query = RoomModel.findOne(params);

		return yield query.exec();
	} else {
		// get collections
		res = {
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

		let rooms = yield query.exec();
		res.rooms = rooms.map((r) => r.toObject({ virtuals: true, versionKey: false }));
	}

	return res;
};

/**
 * create a new room or update one
 * @param {Object} opts
 * @param {Object} fields
 * @return {document}
 */
exports.upsert = function *(opts, fields) {
	// authentication check
	if (!opts.auth_user) {
		throw new cError.Unauthorized();
	}

	let res
		, room
		, data = {};

	if (opts.id || fields.uid) {
		// update
		let id = opts.id || fields.uid;
		if (!utils.isValidId(id)) {
			throw new cError.BadRequest({
				message: 'invalid room id'
			});	
		}
		
		room = yield RoomModel.findOne({ _id: opts.id }).exec();

		if (!room) {
			throw new cError.NotFound({ message: 'room does not exist' })
		}

		if (fields.title || fields.desc || fields.logo) {
			if ((room.owner.toString() === opts.auth_user._id.toString()) || Auth.isAdmin(opts.auth_user.id)) {
				if (fields.title) {
					room.title = fields.title;
				}
				if (fields.desc) {
					room.desc = fields.desc;
				}
				if (fields.logo) {
					room.logo = fields.logo;
				}
			} else {
				throw new cError.Forbidden({ message: 'you do not have right to modify this room' });
			}
		}

		if (fields.uid) {
			room.users.push(fields.uid);
		}
	} else {
		// create
		if (fields.title) {
			data.title = validator.escape(validator.trim(fields.title));
			if (validator.isEmpty(data.title)) {
				throw new cError.BadRequest({ message: 'You must give a title' });
			}
		}

		if (fields.desc) {
			data.desc = validator.escape(validator.trim(fields.desc));
		}

		if (fields.private) {
			data.private = true;
		}

		data.owner = opts.auth_user._id;
		data.users = [opts.auth_user._id];
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
