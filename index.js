const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const path = require("path")
const fs = require("fs")
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


const chokidar = require('chokidar');
// https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/blob/master/docs/PlaybackAPI.md#playback-information-api
const filepath = ".config/Google Play Music Desktop Player/json_store/playback.json";
const file = path.resolve(require('os').homedir(), filepath);

console.log(file);

var canAccess = true;
fs.access(file, fs.constants.R_OK | fs.constants.W_OK, (err) => {
  canAccess = !!err;
});

if (!canAccess) throw new Error("Cannot access file!");

const watcher = chokidar.watch(file, {
	persistant: true,
});

watcher.on("change", throttle(1000, (path, stats) => {
	console.log(`${path} was changed.`)
}));

io.on('connection', () => {

});

server.listen(3000);