const User = require('./models/users')
	, validator = require('validator')
	, cError = require('../error')	
	, UserModel = User.Model;

/**
 * find user or create if not exist
 * @param {object} opts
 * @return {document} newly created or existed user entity
 */
exports.findOrCreate = function *(opts) {
	let user;

	let exists = yield UserModel.findOne({
		'fbid': validator.escape(opts.id)
	}).exec();

	if (exists) {
		return exists;
	} else {
		user = new UserModel();
		user.name = validator.trim(opts.displayName || opts.username);
		user.fbid = validator.escape(opts.id);
	}

	let res = yield user.save();
	return res[0];
};

/**
 * get user details
 * @param {object} opts
 * @return {document} existed user entity
 */
exports.find = function *(opts) {
	let user;

	if (opts.id) {
		user = yield UserModel.findOne({
			_id: validator.escape(opts.id)
		}).exec();
	} else {
		throw new cError.BadRequest({
			message: 'uid missing'
		});
	}

	return user;
}