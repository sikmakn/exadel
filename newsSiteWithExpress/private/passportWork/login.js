const LocalStrategy = require('passport-local').Strategy;
const usersDB = require('./usersDB.js').usersDB;
const UserInformation = require('./usersDB.js').UserInformation;

module.exports = function (passport) {
  passport.use(
    'login',
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        const user = usersDB.findOne({ login: username });
        if (user) {
          if (user.password === password) {
            req.session.user = user._id;
            return done(null, user, 'successfully_login');
          }
          return done(null, false, 'wrong_password');
        }
        usersDB.save(new UserInformation(username, password));
        req.session.user = user._id;
        return done(null, user, 'successfully_registered');
      }));
};
