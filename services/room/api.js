/**
 * 
 * Room sub-service API to external entities
 * @module Room:API
 * 
 */
'use strict';

exports.getRooms = function *(opts) {
	return [{
		'name': 'test1'
	}, {
		'name': 'test2'
	}];
}