(function(){

	console.log("hey")


	const template = function(data){
		return `
			<div class="media-player">
				<div class="song-title">${data.song.title}</div>
				<div class="album-title">${data.song.album}</div>
				<div class="artist">${data.song.artist}</div>
				<div class="album-art">
					<img src="${data.song.albumArt}" alt="${data.song.album}" />
				</div>
			</div>
		`

	}


	const render = (data) => {
		let root = document.getElementById("media-player-root")
		if (root != null) {
			let html = template(data);
			console.log("rendering", root)
			root.innerHTML = html;
		}
	}


	var socket = io();

	socket.on("update", (data) => {
		console.log("data:", data)
		window.requestAnimationFrame(() => render(data));
	})

})()