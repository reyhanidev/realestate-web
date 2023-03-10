const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

module.exports = {
	name: 'bimeh_session',
	secret: process.env.SESSION_SECRET_KEY,
	resave: true,
	saveUninitialized: true,
	cookie: { expires: new Date(Date.now() + 1000 * 60 * 60 * 4) },
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
};
