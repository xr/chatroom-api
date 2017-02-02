'use strict';

const config = {
	server: {
		port: process.env.API_SERVER_PORT || 9080,
		basePath: process.env.API_SERVER_BASEPATH  || '/api/',
		secrets: [process.env.API_SERVER_SECRET || 'whatever'],
	},
	mongo: {
		url: process.env.API_SERVER_MONGODB_URL || 'mongodb://localhost:27017/chat'
	}
};

exports = module.exports = config;