(function(){

	const root = document.getElementById("media-player-root");
	let canvas = null;
	let context = null;
	let listeners = {};

	const on = (channel, fn) => {
		listeners[channel] = fn;
	}


	const template = function(song, player) {

		return `
			<div class="media-player" style="width: ${player.width}px">
				<div class="song-details">
					<div class="album-art">
						<img src="${song.albumArt}" />
					</div>
					<div class="song">
						<div class="song-title">
							${song.title}
						</div>
						<div class="album-title">
							${song.album}
						</div>
						<div class="artist">
							${song.artist}
						</div>
					</div>
				</div>
				<canvas id="track" width="${player.trackWidth}px" height=${player.trackHeight}px></canvas>
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

	const render = {

		progress: function(time) {

			if (canvas == null) return;

			let w = canvas.width;
			let h = canvas.height;


			let size = h;
			let incrementCount = w / (h * 2);

			let timeRatio = (time.current / time.total)
			console.log(time, timeRatio.toFixed(2))
			let threshold = ~~(timeRatio * 100);

			context.fillStyle = "#222";
			context.clearRect(0, 0, w, h)
			context.fillStyle = "#0cc";

			for (let i = 0, ii = incrementCount; i < ii; i++) {
				
				if ((i * 100) <= threshold) {
					context.fillStyle = "#0cc";					
				}
				else {
					context.fillStyle = "#aaa"
				}

				let x = i * size*2
				context.fillRect(x, 0, size, size)
			}
		},

		player: function(data) {

			console.log("new song!", data)
			
			let width = determinePlayerWidth(data); 
			let player = {
				width,
				trackWidth: width - (20),
				trackHeight: 2,
			}
			
			let html = template(data, player);
			root.innerHTML = html;

			canvas = document.getElementById("track");
			context = canvas.getContext("2d");
		},

	}


	const url = "ws://localhost:5672";
	const ws = new WebSocket(url)

	on("track", data => render.player(data))
	on("time", data => render.progress(data))
	
	console.log(ws)

	ws.onopen = () => {
		console.log(`Connected to ${url}`)
	};



	ws.onmessage = function (event) {
		let data = JSON.parse(event.data);
		let name = data.channel;

		let listener = listeners[name];		

		if (listener) {
			console.log(`Triggering ${name}`)
			listener(data.payload)
		}
	}

})()