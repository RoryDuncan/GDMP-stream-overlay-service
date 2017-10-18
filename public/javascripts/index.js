(function(){

	const template = function(data){
		return `
			<div class="media-player">
				<div class="album-art">
					<img src="${data.song.albumArt}" />
				</div>
				<div class="song">
					<div class="song-title ${data.songClasses.title}">
						${data.song.title}
					</div>
					<div class="album-title ${data.songClasses.album}">
						${data.song.album}
					</div>
					<div class="artist ${data.songClasses.artist}">
						${data.song.artist}
					</div>
				</div>
			</div>
		`
	}


	const render = (data) => {
		let root = document.getElementById("media-player-root")
		if (root != null) {


			data.songClasses = {};

			let limits = {
				"title": 35,
				"album": 50,
				"artist": 50,
			};


			["album", "title", "artist"].forEach((key, i) => {
				let prop = data.song[key];
				data.songClasses[key] = (prop != null && prop.length > limits[key]) ? "fs-sm" : "";
			})

			console.log("data:", data)
			let html = template(data);
			root.innerHTML = html;
		}
	}


	var socket = io();

	socket.on("update", (data) => {
		window.requestAnimationFrame(() => render(data));
	})

})()