const passport = require('passport')
	, API = require("../../apis/v1/index")
	, StrategyMock = require('./strategy-mock');

module.exports = function(options) {
	passport.use(new StrategyMock(options, verifyFunction));

	API.get('/mock/login', passport.authenticate('mock'));
};

function verifyFunction (user, done) {
    const mock = {
       id: user.id,
       name: 'liang guo'
    };
    done(null, mock);
}