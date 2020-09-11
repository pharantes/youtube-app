const express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	flash = require('connect-flash'),
	GoogleStrategy = require('passport-google-oauth20').Strategy,
	User = require('./models/User'),
	MongoStore = require('connect-mongo')(session);


require('hbs');
require('connect-mongo')(session);

//mongoose setup
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true
	})
	.then(confirm => console.log(`Connected to Mongo! Database name: "${confirm.connections[0].name}"`))
	.catch(err => console.error('Error connecting to mongo', err));

// app setup
const app_name = require('./package.json').name;
require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(
	require('node-sass-middleware')({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		sourceMap: true
	})
);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));

// //passport setup
app.use(
	session({
		secret: 'our-passport-local-strategy-app',
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({
			mongooseConnection: mongoose.connection
		})
	})
);
passport.serializeUser((user, cb) => {
	cb(null, user._id);
});
passport.deserializeUser((id, cb) => {
	User.findById(id, (err, user) => {
		if (err) {
			return cb(err);
		}
		cb(null, user);
	});
});

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_APP_ID,
	clientSecret: process.env.GOOGLE_APP_SECRET,
	callbackURL: `${process.env.GOOGLE_CBURI}`,
	passReqToCallback: true
}, (request, accessToken, refreshToken, params, profile, done) => {
	User.findOne({
		googleID: profile.id
	}, function (err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			User.create({
				name: profile.displayName,
				accessToken: accessToken,
				refreshToken: refreshToken,
				tokenExpiration: params.expires_in,
				googleID: profile.id,
				playLists: []
			}).then(userCreated => {
				return done(null, userCreated);
			});
		} else {
			User.findOneAndUpdate({
				googleID: profile.id
			}, {
				accessToken: accessToken,
				refreshToken: refreshToken,
				tokenExpiration: params.expires_in
			}).then(user => {
				user.populate('playLists');
				return done(err, user);
			});
		}
	});
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//global variables
app.use((req, res, next) => {
	res.locals.isUser = !!req.user;
	next();
});

//router setup
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

module.exports = app;