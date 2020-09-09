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
		playListsDisplay = document.getElementById('playLists-display'),
		playerDisplay = document.getElementById('play-playlist'),
		backButtons = document.getElementsByClassName('back-btn');
	
	currentUser.initiate();
	setHomePlaylistDisplay();	

	for (let i = 0; i < backButtons.length; i++) {
		backButtons[i].onclick = () => {
			// TODO: add unsaved data warning where applicable
			event.currentTarget.parentNode.classList.add('d-none');
			UserHomeSection.classList.remove('d-none');
		};
	}	

	newPlayListBtn.onclick = (event) => setPlayListView(event);
	function setHomePlaylistDisplay() {
		console.log('fired');
		while(playListsDisplay.firstChild) {
			playListsDisplay.firstChild.remove();
		}
		for (let i = 0; i < currentUser.playLists.length; i++) {	
			let div = genEl('div', playListsDisplay, null, null, i);
			genEl('span', div, null,  currentUser.playLists[i].name);
			let playBtn = genEl('button', div, 'playlist-play-btn', 'Play'),
				editBtn = genEl('button', div, 'playlist-edit-btn', 'Edit');
				// delBtn = genEl('button', div, 'playlist-delete-btn', 'Delete');
			
			playBtn.onclick = () => setPlayerView(i);
			editBtn.onclick = () => setPlayListView(event, i);
			// delBtn.onclick = () => deletePlayList(i);
		}
	}

	function setPlayListView(event, listIdx) {
		UserHomeSection.classList.add('d-none');
		editPlayListDisplay.classList.remove('d-none');
		if (listIdx) {
			currentUser.editPlayList(listIdx);
		}
		youtube.dom.searchForm.onsubmit = (event) => {				
			event.preventDefault();	
			youtube.search(youtube.dom.searchInput.value);
		};
	}

	// function deletePlayList(i) {
	// 	currentUser.deletePlayList(i);
	// 	setHomePlaylistDisplay();
	// }

	function setPlayerView(i) {
		UserHomeSection.classList.add('d-none');
		playerDisplay.classList.remove('d-none');
		// TODO:
	}
};