'use strict';

const config = {
	server: {
		port: process.env.API_SERVER_PORT || 9080,
		basePath: process.env.API_SERVER_BASEPATH  || '/api/'
	}
};

exports = module.exports = config;