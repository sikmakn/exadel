const express = require('express');

const app = express();
const bodyParser = require('body-parser');

app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create passport
const passport = require('passport');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);

app.use(
  expressSession({
    secret: 'usersKey',
    saveUninitialized: true, // don't create session until something stored
    resave: false, // don't save session if unmodified
    store: new MongoStore({
      url: 'mongodb://localhost/myStore',
      touchAfter: 24 * 3600, // time period in seconds
    }),
  }));
app.use(passport.initialize());
app.use(passport.session());

const initPassport = require('./private/passportWork/initPassport.js');

initPassport(passport);
//
const httpRequests = require('./httpRequests');

httpRequests(app, passport);

app.listen(3000);
