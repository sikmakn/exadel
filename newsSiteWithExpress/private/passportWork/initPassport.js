const login = require('./login.js');
const MongoClient = require('mongodb').MongoClient;

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    MongoClient.connect('mongodb://localhost/myStore')
      .then((db) => {
        const usersCollection = db.collection('users');
        usersCollection.find({ _id: id }).nextObject((err, user) => {
          if (err) throw new Error(err);
          if (user) {
            done(null, user);
            return;
          }
          done(new Error('User in deserializeUser not find'));
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  });

  login(passport);
};
