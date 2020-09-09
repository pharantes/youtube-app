const express = require('express'),
	router = express.Router(),
	User = require('../models/User');
	
router.get('/api/userData', (req,res) => {
	User.findOne({_id: req.user.id}).then(data => {
		const userData = {
			accessToken: data.accessToken,
			tokenExpiration: data.tokenExpiration,
			playLists: data.playLists
		};
		res.json(userData);
	});	
});

router.put('/api/playListAdd', (req,res) => {   
	const name = req.body.name;
	const links = req.body.items;
	User.findOneAndUpdate({_id: req.user._id}, { 
		$push: { 
			playLists: { 
				name, 
				links,
			}
		}
	}).then(user => console.log(user));
});

// router.patch('/api/playListUpdate', (req,res) => {   
// 	PlayList.findOneAndUpdate({_id: req.body.id}, {
// 		name: req.body.name,
// 		links: req.body.links,
// 	});
// });

// router.delete('/api/playListDelete', (req,res) => {
// 	PlayList.findOneAndDelete({ _id: req.body });
// });

module.exports = router;