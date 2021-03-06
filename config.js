'use strict';

const config = {
	server: {
		port: process.env.PORT || 9080,
		basePath: process.env.API_SERVER_BASEPATH  || '/api/',
		secrets: [process.env.API_SERVER_SECRET || 'whatever'],
		extURL: process.env.API_SERVER_EXTURL || 'http://chat.loveyoung.me/api/v1'
	},
	mongo: {
		url: process.env.API_SERVER_MONGODB_URL || 'mongodb://localhost:27017/chat'
	},
	app: {
		url: process.env.APP_URL || 'http://chat.loveyoung.me'
	},
	oauth: {
		fb: {
			clientID: process.env.OAUTH_FB_CLIENTID || 'please enter yours',
			clientSecret: process.env.OAUTH_FB_SECRET || 'please enter yours',
		}
	},
	// the users who have these ids will have admin right.
	admins: process.env.API_ADMIN_IDS || '',
	env: process.env.ENV || 'production'
};

if (config.admins !== '') {
	config.admins = config.admins.split(',');
}

exports = module.exports = config;