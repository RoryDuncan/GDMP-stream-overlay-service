(function(){

	const root = document.getElementById("media-player-root");
	let currentSong = null;


	const trackTemplate = (track) => `<div style="left: ${track.position}" class="cursor"></div>`

	const template = function(data, player, track){

		return `
			<div class="media-player" style="width: ${player.width}px">
				<div class="song-details">
					<div class="album-art">
						<img src="${data.song.albumArt}" />
					</div>
					<div class="song">
						<div class="song-title">
							${data.song.title}
						</div>
						<div class="album-title">
							${data.song.album}
						</div>
						<div class="artist">
							${data.song.artist}
						</div>
					</div>
				</div>
				<div class="track">${trackTemplate(track)}</div>
			</div>
		`
	}


	const determinePlayerWidth = (song) => {
		
		let em = 14;
		let width = 34; // base size

		// use the longest string as the base
		let max  = Math.max(song.title.length, song.album.length, song.artist.length);

		// the font sizes between song and other fields are different
		if (song.title.length < Math.max(song.album.length, song.artist.length)) {
			em = 10;
		}

		// always be at least 32rem
		width = Math.max(width, max) * em;

		return width;
	}


	const render = (data) => {
		

		let track = {
			position: 0,
		};


		// only update the track position
		if (currentSong == data.song.title) {
			console.log("Updating track")
			let trackNode = document.querySelector(".track");
			trackNode.innerHTML = trackTemplate(track);

		}
		// update the full media-player
		else {
			console.log("new song")
			console.log(data)
			currentSong = data.song.title;
			
			let player = {
				width: determinePlayerWidth(data.song),
			}
			
			let html = template(data, player, track);
			root.innerHTML = html;
		}
	}


	var socket = io();

	if (root != null) {
		socket.on("update", (data) => {
			window.requestAnimationFrame(() => render(data));
		})
	}

})()