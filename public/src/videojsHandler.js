const player = videojs(document.querySelector('.video-js'), {
	controls: true,
	autoplay: false,
	preload: 'auto',
	height: '620px',
	width: '880px',
});

// Initialize the playlist-ui plugin with no option (i.e. the defaults).
player.playlistUi();
player.playlist.autoadvance(0);
