const passport = require('koa-passport'),
  co = require('co'),
  config = require('../../config'),
  UserAPI = require('../user/api');


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  co(function *(){
    try {
      let user = yield UserAPI.find({ id: id });
      done(null, user);
    } catch(err) {
      done(err);
    }
  });
});

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function(username, password, done) {
  co(function *(){
    try {
      const id = Math.floor(Math.random() * 10000) + 1;
      let user = yield UserAPI.findOrCreate({
        id: id,
        displayName: 'Guest' + id
      });
      user.id = user._id;
      done(null, {
        id: user._id
      });
    } catch(err) {
      done(err);
    }
  });
}
));

const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: config.oauth.fb.clientID,
    clientSecret: config.oauth.fb.clientSecret,
    callbackURL: `${config.server.extURL}/auth/facebook/callback`
  }, function(accessToken, refreshToken, profile, done) {
    co(function *(){
      try {
        let user = yield UserAPI.findOrCreate(profile);
        done(null, user);
      } catch(err) {
        done(err);
      }
    });
  }
));



exports.isAdmin = function (id) {
  return config.admins.indexOf(id.toString()) !== -1;
};