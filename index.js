const PORT = 3484;									//Đặt địa chỉ Port được mở ra để tạo ra chương trình mạng Socket Server
 
var http = require('http')
//var express = require('express');
//var socketio = require('socket.io')				//#include thư viện socketio
var socketio = require('socket.io')	
var ip = require('ip');
//var app = express();					//#Khởi tạo một chương trình mạng (app)
//var server = http.Server(app)
//var io = socketio(server);    //#Phải khởi tạo io sau khi tạo app!
var app = http.createServer();					//#Khởi tạo một chương trình mạng (app)
var io = socketio(app);	

var webApp_nsp = io.of('./webapp');
var esp8266_nsp = io.of('/esp8266');

// var middleware = require('socket.io-wildcard') ();

// esp8266.use(middleware);
// webApp.use(middleware);

app.listen(PORT);										// Cho socket server (chương trình mạng) lắng nghe ở port 3484
console.log("Server nodejs chay tai dia chi: " + ip.address() + ":" + PORT)


//Khi có mệt kết nối được tạo giữa Socket Client và Socket Server
esp8266_nsp.on('connection', function(socket) {	
	console.log('ESP connected');
	var led = [true, false];
	var interval1 = setInterval(function() {
		for (var i = 0; i < led.length; i++) {
			led[i] = !led[i];
		}
		var json = {
			"led": led
		}
		socket.emit('LED', json);
	}, 2000);

	socket.on('FArdunio', function(data) {
		//console.log("dayladata", data.title);
	});
	
	socket.on('disconnect', function() {
		console.log('disconnect');
		clearInterval(interval1);
	});

	// socket.on("*", function(packet) {
	// 	console.log("esp8266 rev and send to webapp packet: ", packet.data) //in ra để debug
	// 	var eventName = packet.data[0]
	// 	var eventJson = packet.data[1] || {} //nếu gửi thêm json thì lấy json từ lệnh gửi, không thì gửi chuỗi json rỗng, {}
	// 	webapp_nsp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json đến webapp
	// })
});

webApp_nsp.on('connection', function(socket) {
	console.log('App connected');

	// socket.on('*', function(packet) {
	// 	console.log("webapp rev and send to esp8266 packet: ", packet.data) //in ra để debug
	// 	var eventName = packet.data[0]
	// 	var eventJson = packet.data[1] || {} //nếu gửi thêm json thì lấy json từ lệnh gửi, không thì gửi chuỗi json rỗng, {}
	// 	esp8266_nsp.emit(eventName, eventJson) //gửi toàn bộ lệnh + json đến esp8266
	// });
});