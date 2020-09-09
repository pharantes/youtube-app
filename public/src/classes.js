/* eslint-disable no-undef */
class APIHandler {
	constructor(baseUrl, userToken) {
		this.path = axios.create({
			baseURL: baseUrl,
			headers: {
				'Authorization': `Bearer ${userToken}`
			}
		});
		this.channelParams = [
			['part', 'snippet'],
			['type', 'channel'],
			['safeSearch', 'moderate']
		];
		this.videoParams = [
			['part', 'snippet'],
			['type', 'video'],
			['safeSearch', 'strict']
		];
		this.dom = {
			searchForm: document.getElementById('playlist-search-form'),
			searchInput: document.getElementById('playlist-search-input'),
			resultsDisplay: document.getElementById('search-results')
		};
	}
	clearSearchForm () {
		while(this.dom.resultsDisplay.firstChild) {
			this.dom.resultsDisplay.firstChild.remove();
		}
	}
	search(val) {
		this.clearSearchForm();
		val = val.split(' ');
		val = (val.length > 1) ? val.join('+') : val.join('');
		let channelParams = this.channelParams.map(v => v.join('=')).join('&');
		return this.path.get(`search?q=${val}&` + channelParams).then(channels => {
			let channelArr = channels.data.items.filter(v => v.id.channelId);
			if (channelArr.length > 0) {
				let promises = [];
				for (let i = 0; i < channelArr.length; i++) {
					let videoParams = `${this.videoParams.map(v => v.join('=')).join('&')}&channelID=${channelArr[i]}`;
					promises.push(this.path.get(`search?q=${val}&` + videoParams));
				}
				return Promise.all(promises);
			}
		}).then(values => {
			let videolinks = values.map(v => v.data.items);
			let output = [];
			for (let i = 0; i < videolinks.length; i++) {
				for (let j = 0; j < videolinks[i].length; j++) {
					output.push({
						source: [{
							src: 'https://youtube.com/watch?v=' + videolinks[i][j].id.videoId,
							type: 'video/youtube'
						}],
						name: videolinks[i][j].snippet.title,
						poster: videolinks[i][j].snippet.thumbnails.medium.url
					});
				}
			}
			return output;
		}).then(results => {			
			if (results.length > 0) {
				for(let i = 0; i < results.length; i++){				
					let div = genEl('div', this.dom.resultsDisplay, 'search-content-box', null, i);
					genImg(div, results[i].poster);
					genEl('p', div, null, results[i].name);
					let btn = genEl('button', div, 'btn btn-primary add-to-playlist mb-4', 'Add to playlist');
					btn.onclick = (event) => currentUser.addToPlayList(event, results);
				}			
			}
			else {
				genEl('div', this.dom.resultsDisplay, null, 'No results for found for this search query');
			}
		}).catch(err => console.log(err));
	}
}
class User {
	constructor(userData) {
		this.accessToken = userData.accessToken;
		this.tokenExpiration = userData.tokenExpiration;
		this.playLists = userData.playLists;
		this.intervalID;
		this.newPlayList = {
			'name': '',
			'items': []			
		};
		this.dom = {
			playlistDiv: document.getElementById('playLists-display'),
			playListName: document.getElementById('playlist-name'),
			clearBtn: document.getElementById('clearBtn'),
			saveBtn: document.getElementById('saveBtn')
		};
	}
	initiate () {
		this.setRefreshTimer();	
		this.dom.clearBtn.onclick = () => this.clearList(); 
		this.dom.saveBtn.onclick = () => this.saveList();
	}
	setRefreshTimer() {
		this.intervalID = setInterval(() => {
			if (this.tokenExpiration < 600) {
				// TODO: this is where we request a refresh!
			}
			this.tokenExpiration--;
		}, 1000);
		this.intervalID;
	}
	clearList () {
		while (this.dom.playlistDiv.firstChild) {
			this.dom.playlistDiv.firstChild.remove();
		}
	}
	saveList () {
		let playList = {
			name: this.dom.playListName.value,
			items: this.newPlayList.items
		};
		console.log(playList);
		this.playLists.push(playList); 
		axios.put('/api/playListAdd', playList);
		this.newPlayList.items = [];
		this.clearList();
		youtube.clearSearchForm();
		document.getElementById('edit-playlist').classList.add('d-none');
		document.getElementById('user-home').classList.remove('d-none');
	}
	addToPlayList (event, links) {
		let i = parseInt(event.currentTarget.parentNode.dataset.index);
		this.newPlayList.items.push(links[i]);		
		this.updatePlayList(this.newPlayList.items);
	}
	* editPlayList (i) {
		let id = this.playLists[i]._id, links = this.playLists[i].links, name = this.playLists[i].name;
		yield () => {
			this.updatePlayList(links);
		};
		yield () => {
			let dataPackage = {
				id,
				name, 
				links,
			};
			axios.put('/api/playListUpdate', dataPackage).then(
				// TODO: implement update close screen add and remove d-none	
			);
		};
	}
	deletePlayList (i) {
		let id = this.playLists[i]._id;
		axios.delete('/api/playListDelete', { data: id }).then(
			// TODO: implement delete close screen
			setHomePlaylistDisplay() 
		);
	}
	updatePlayList(arr) {
		this.clearList();
		for (let i = 0; i < arr.length; i++) {
			let div = genEl('div', this.dom.playlistDiv, null, null, i);
			genImg(div, arr[i].poster);
			genEl('p', div, null, arr[i].name);
			let removeBtn = genEl('button', div, 'removeBtn btn btn-danger mb-2', 'Remove');
			removeBtn.onclick = () => {
				let i = event.currentTarget.parentNode.dataset.index;
				arr.splice(i, 1);
				this.updatePlayList(arr);
			};
		}
	}
}
class Chronometer {
	constructor() {
		this.timer = 0;
		this.counter = 0;
		this.intervalID;
		this.state = undefined;
		this.chronometerOutput = document.getElementsByClassName('chronometer');
		this.chronometerInput = document.getElementsByClassName('chronometer-time-input');
		this.switchButton = document.getElementById('chronometer-switch-button');
		this.resetButton = document.getElementById('chronometer-reset-button');
	}
	initate() {
		this.switchButton.onclick = this.clicked();
		this.resetButton.onclick = this.reset();
	}
	clicked() {
		if (this.state === undefined) {
			if (parseInt(this.chronometerInput[0].value > 0)) {
				this.timer = this.timer + (parseInt(chronometerInput[0].value > 0) * 60 * 60 * 1000);
			}
			if (parseInt(this.chronometerInput[1].value > 0)) {
				this.timer = this.timer + (parseInt(chronometerInput[1].value > 0) * 60 * 1000);
			}
			this.chronometerUpdate();
			this.state = false;
			this.switchButton.innerHTML = 'Start';
		} else if (this.state === false) {
			this.state = true;
			this.start();
			this.switchButton.innerHTML = 'PAUSE';
		} else {
			this.state = false;
			this.stop();
			this.switchButton.innerHTML = 'START';
		}
	}
	start() {
		this.intervalID = setInterval(() => {
			if (this.timer === 0) {
				this.stop();
			}
			this.timer--;
			this.counter--;
			if (this.counter === 6000) {
				this.timer = this.timer - 4000;
				this.counter = 0;
			}
			this.chronometerUpdate();
		}, 1);
		this.intervalID;
	}
	reset() {
		this.state = undefined;
		this.timer = 0;
		this.counter = 0;
		this.stop();
		this.switchButton.innerHTML = 'SET';
	}
	stop() {
		clearInterval(this.intervalID);
	}
	chronometerUpdate() {
		let timer = String(this.timer);
		while (timer.length < 6) {
			timer = '0' + timer;
		}
		for (let i = 0; i < timer.length; i++) {
			this.chronometerOutput[i].innerHTML = timer[i];
		}
	}
}

function genEl (type, appendTo, labels, txt, datasetVal) {
	let el = document.createElement(type);
	if (labels) {
		el.className = labels;
	}	
	if (txt) {
		el.textContent = txt;
	}
	if (datasetVal === 0 || datasetVal == true) {
		el.dataset.index = datasetVal;
	}
	return appendTo.appendChild(el);
}

function genImg (appendTo, srcVal, altTxt) {
	let el = document.createElement('img');
	el.setAttribute('src', srcVal);
	if (altTxt) {
		el.setAttribute('alt', altTxt);
	}	
	return appendTo.appendChild(el);
}