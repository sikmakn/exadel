const usersDB = require('./usersDB').usersDB;
const login = require('./login.js');

module.exports = (passport) => {

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    const user = usersDB.findOne({ _id: id });
    if (user) return done(null, user);
    return done(new Error('User in deserializeUser not find'));
  });

  login(passport);
};
