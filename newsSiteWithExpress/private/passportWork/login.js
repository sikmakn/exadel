const LocalStrategy = require('passport-local').Strategy;
const MongoClient = require('mongodb').MongoClient;

function signIn(user, password, done, req) {
  if (user.password === password) {
    req.session.user = user.username;
    done(null, user, 'successfully_login');
  } else {
    done(null, false, 'wrong_password');
  }
}

function signUp(usersCollection, userForSaved, req) {
  usersCollection
    .insert(userForSaved)
    .then((userSaved) => {
      req.session.user = userSaved.ops[0].username;
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
}

module.exports = function (passport) {
  passport.use(
    'login',
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        MongoClient.connect('mongodb://localhost/myStore')
          .then((db) => {
            const usersCollection = db.collection('users');
            usersCollection.find({ username }).nextObject((err, user) => {
              if (err) throw new Error(err);
              if (user) {
                db.close();
                signIn(user, password, done, req);
                return;
              }
              signUp(usersCollection, { username, password }, req, user);
              db.close();
              done(null, user, 'successfully_registered');
            });
          })
          .catch((err) => {
            console.log(err);
            throw new Error(err);
          });
      }));
};

