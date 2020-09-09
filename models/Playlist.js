const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
	name: String,
	links: Array,
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('Playlist', playlistSchema);