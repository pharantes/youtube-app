const express = require('express'),
	router = express.Router(),
	User = require('../models/User'),
	Playlist = require('../models/Playlist');

router.get('/userData', (req, res) => {
	User.findOne({ _id: req.user.id })
		.populate('playLists')
		.then(user => {
			const userData = {
				accessToken: user.accessToken,
				tokenExpiration: user.tokenExpiration,
				playLists: user.playLists,
			};
			res.json(userData);
		});
});

router.put('/playListAdd', (req, res) => {
	const author = req.user.id,
		name = req.body.name,
		links = req.body.links;

	Playlist.create({
		name,
		links,
		author,
	})
		.then(playlist => {
			User.findOne({ _id: req.user.id }).then(user => {
				if (!user.playLists) user.playLists = [];
				user.playLists.push(playlist._id);
				user.save().catch(err => console.error('couldnt update', err));
			});
		})
		.catch(err => console.error(err));
});

router.patch('/playListUpdate', (req, res) => {
	const author = req.user.id,
		name = req.body.name,
		links = req.body.links;

	Playlist.findOneAndUpdate(
		{ _id: req.body._id },
		{
			name,
			links,
			author,
		}
	).catch(err => console.error(err));
});

router.post('/playListDelete', (req, res) => {
	Playlist.findOneAndDelete({ _id: req.body._id }).catch(err =>
		console.error(err)
	);
});

module.exports = router;
