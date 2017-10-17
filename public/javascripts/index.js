(function(){

	console.log("hey")

	var socket = io();

	socket.on("update", (data) => {
		console.log("data:", data)
	})

})()