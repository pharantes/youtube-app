const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index');
});

router.get('/privacypolicy', (req, res) => {
	res.render('privacypolicy');
});

router.get('/home', (req, res) => {
	res.render('home');
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
