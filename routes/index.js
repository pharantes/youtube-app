<<<<<<< HEAD
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index');
});

router.get('/privacypolicy', (req, res) => {
	res.render('privacypolicy');
});

router.get('/home', (req,res)=>{
	res.render('home');
});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

module.exports = router;
=======
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
>>>>>>> 1592cf368c2bccf91a5bdac8643287aff01f7e61
