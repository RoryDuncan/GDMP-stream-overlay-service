const fs = require("fs")
const path = require("path");
const chokidar = require('chokidar');
const socketIO = require('socket.io');
const jsonfile = require('jsonfile')

// helper
const throttle = (ms, fn) => {

	let now = Date.now();
	let lastCalled = 0;
	return (...args) => {
		now = Date.now();
		if (lastCalled + ms < now) {
			lastCalled = now;
			fn.apply(fn, args);
		}
	}
}



// reference:
// https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/blob/master/docs/PlaybackAPI.md#playback-information-api
const filepath = ".config/Google Play Music Desktop Player/json_store/playback.json";
const file = path.resolve(require('os').homedir(), filepath);

var canAccess = true;
fs.access(file, fs.constants.R_OK | fs.constants.W_OK, (err) => {
  canAccess = !!err;
});

if (!canAccess) throw new Error("No read or write access to playback.json file!");




module.exports = (server) => {

	let connected = false;
	let io = socketIO(server);

	let watcher = chokidar.watch(file, {
		persistant: true,
	});

	watcher.on("change", throttle(2000, (path, stats) => {
		console.log(`${path} has changed.`);
		if (connected) {
			jsonfile.readFile(path, function(err, data) {
				if (err) {
					// console.error("Error parsing JSON:", err);
				}
				else {
		 			io.emit("update", data);
				}
			})
		}
		
	}));


	io.on('connection', (client) => {
		connected = true;
		console.log("client connected!")
		client.on("disconnect", () => {
			connected = false;
		})
	});
}