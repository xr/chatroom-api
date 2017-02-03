const validator = require('validator');


exports.isValidId = function (id) {
	return validator.isMongoId(id);
};