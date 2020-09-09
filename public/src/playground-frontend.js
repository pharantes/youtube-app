<<<<<<< HEAD
/* eslint-disable no-undef */

var youtube, 
	currentUser;

axios.get('/api/userData')
	.then(userData => {
		console.log(userData);
		return currentUser = new User(userData.data);
	})
	.then(() => {
		console.log(currentUser.playLists);
		youtube = new APIHandler('https://www.googleapis.com/youtube/v3', currentUser.accessToken);
	})
	.catch(err => console.log(err));

window.onload = () => {
	let UserHomeSection = document.getElementById('user-home'),
		newPlayListBtn = document.getElementById('new-playlist-btn'),
		editPlayListDisplay = document.getElementById('edit-playlist'),
		editPlayListBkBtn = document.getElementById('back-btn-1'),
		playListsDisplay = document.getElementById('playlists-display'),
		playerDisplay = document.getElementById('play-playlist'),
		playerBkBtn = document.getElementById('back-btn-2'),
		chronometer = new Chronometer;
	
	currentUser.initiate();
	setHomePlaylistDisplay();	

	editPlayListBkBtn.onclick = () => {
		// TODO: add unsaved data warning where applicable
		editPlayListDisplay.classList.add('d-none');
		UserHomeSection.classList.remove('d-none');
	};
	
	playerBkBtn.onclick = () => {
		// TODO: add unsaved data warning where applicable
		playerDisplay.classList.add('d-none');
		UserHomeSection.classList.remove('d-none');
		chronometer.reset();
	};

	newPlayListBtn.onclick = (event) => setPlayListView(event);
	function setHomePlaylistDisplay() {
		while(playListsDisplay.firstChild) {
			playListsDisplay.firstChild.remove();
		}
		for (let i = 0; i < currentUser.playLists.length; i++) {	
			let div = genEl('div', playListsDisplay, null, null, i);
			genEl('span', div, null,  currentUser.playLists[i].name);
			let playBtn = genEl('button', div, 'playlist-play-btn btn btn-primary m-2', 'Play'),
				editBtn = genEl('button', div, 'playlist-edit-btn btn btn-success m-2', 'Edit');
			delBtn = genEl('button', div, 'playlist-delete-btn btn btn-danger m-2', 'Delete');
			
			playBtn.onclick = () => setPlayerView(i);
			editBtn.onclick = () => setPlayListView(i);
			delBtn.onclick = () => deletePlayList(i);
		}
	}

	function setPlayListView(i) {
		UserHomeSection.classList.add('d-none');
		editPlayListDisplay.classList.remove('d-none');
		if (i >= 0) {
			currentUser.editPlayList(i);
		}
		youtube.dom.searchForm.onsubmit = (event) => {				
			event.preventDefault();	
			youtube.search(youtube.dom.searchInput.value);
		};
	}

	function deletePlayList(i) {
		currentUser.deletePlayList(i);
		setHomePlaylistDisplay();
	}

	function setPlayerView(i) {
		UserHomeSection.classList.add('d-none');
		playerDisplay.classList.remove('d-none');
		let links = currentUser.playLists[i].links;
		player.playlist(links);
		player.pause();
		chronometer.initate();
	}
};
=======
/* eslint-disable no-undef */

var youtube, currentUser;

axios
	.get('/api/userData')
	.then(userData => {
		return (currentUser = new User(userData.data));
	})
	.then(() => {
		youtube = new APIHandler(
			'https://www.googleapis.com/youtube/v3',
			currentUser.accessToken
		);
	})
	.catch(err => console.error(err));

window.onload = () => {
	let UserHomeSection = document.getElementById('user-home'),
		newPlayListBtn = document.getElementById('new-playlist-btn'),
		editPlayListDisplay = document.getElementById('edit-playlist'),
		editPlayListBkBtn = document.getElementById('back-btn-1'),
		playListsDisplay = document.getElementById('playlists-display'),
		playerDisplay = document.getElementById('play-playlist'),
		playerBkBtn = document.getElementById('back-btn-2'),
		chronometer = new Chronometer();

	currentUser.initiate();
	setHomePlaylistDisplay();

	editPlayListBkBtn.onclick = () => {
		editPlayListDisplay.classList.add('d-none');
		UserHomeSection.classList.remove('d-none');
	};

	playerBkBtn.onclick = () => {
		playerDisplay.classList.add('d-none');
		UserHomeSection.classList.remove('d-none');
		chronometer.reset();
	};

	newPlayListBtn.onclick = event => setPlayListView(event);
	function setHomePlaylistDisplay() {
		while (playListsDisplay.firstChild) {
			playListsDisplay.firstChild.remove();
		}
		for (let i = 0; i < currentUser.playLists.length; i++) {
			let div = genEl('div', playListsDisplay, null, null, i);
			genEl('span', div, null, currentUser.playLists[i].name);
			let playBtn = genEl(
					'button',
					div,
					'playlist-play-btn btn btn-primary m-2',
					'Play'
				),
				editBtn = genEl(
					'button',
					div,
					'playlist-edit-btn btn btn-success m-2',
					'Edit'
				);
			delBtn = genEl(
				'button',
				div,
				'playlist-delete-btn btn btn-danger m-2',
				'Delete'
			);

			playBtn.onclick = () => setPlayerView(i);
			editBtn.onclick = () => setPlayListView(i);
			delBtn.onclick = () => deletePlayList(i);
		}
	}

	function setPlayListView(i) {
		UserHomeSection.classList.add('d-none');
		editPlayListDisplay.classList.remove('d-none');
		if (i >= 0) {
			currentUser.editPlayList(i);
		}
		youtube.dom.searchForm.onsubmit = event => {
			event.preventDefault();
			youtube.search(youtube.dom.searchInput.value);
		};
	}

	function deletePlayList(i) {
		currentUser.deletePlayList(i);
		setHomePlaylistDisplay();
	}

	function setPlayerView(i) {
		UserHomeSection.classList.add('d-none');
		playerDisplay.classList.remove('d-none');
		let links = currentUser.playLists[i].links;
		chronometer.initate();
		player.playlist(links);
		player.pause();
	}
};
>>>>>>> 1592cf368c2bccf91a5bdac8643287aff01f7e61
