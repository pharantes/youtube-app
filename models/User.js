const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: String,
	accessToken: String,
	refresToken: String,
	tokenExpiration: Number,
	googleID: String,
	playLists: [
		{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }
	]
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('User', userSchema);