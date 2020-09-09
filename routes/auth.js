const express = require('express'),
	router = express.Router(),
	passport = require('passport');	

router.get('/login', (req, res) => {
	res.render('auth/login');
});
router.get('/auth/google',
	passport.authenticate('google', { 
		accessType: 'offline',
		prompt: 'consent',
		scope: [ 
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/userinfo.profile',  
			'https://www.googleapis.com/auth/plus.me', 
			// 'https://www.googleapis.com/auth/youtube.upload', 
			'https://www.googleapis.com/auth/youtube.readonly', 
			// 'https://www.googleapis.com/auth/youtubepartner', 
			// 'https://www.googleapis.com/auth/youtubepartner-channel-audit'
		]
	}
	));

router.get( '/auth/google/callback', 
	passport.authenticate( 'google', { 
		successRedirect: '/home',
		failureRedirect: '/error'
	}));

module.exports = router;