const express = require('express'),
	router = express.Router(),
	passport = require('passport');

router.get(
	'/google',
	passport.authenticate('google', {
		accessType: 'online',
		prompt: 'consent',
		scope: [
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/plus.me',
			'https://www.googleapis.com/auth/youtube.readonly',
		],
	})
);

router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: '/home',
		failureRedirect: '/error',
	})
);

module.exports = router;