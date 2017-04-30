const express = require('express');

const app = express();
const bodyParser = require('body-parser');

app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create passport
const passport = require('passport');
const expressSession = require('express-session');

app.use(expressSession({ secret: 'usersKey' }));
app.use(passport.initialize());
app.use(passport.session());

const initPassport = require('./private/passportWork/initPassport.js');

initPassport(passport);
//
const httpRequests = require('./httpRequests');

httpRequests(app, passport);

app.listen(3000);
