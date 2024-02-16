var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

let lastKnownLocation = null;
let route = [];

app.get('/', function(req, res){
   res.sendFile('/Users/nisargmehta/Documents/assignment/index.html');
});

console.log('trying to connect');
const parsedGpsData = require('./parsed_gps_data.json');
const emitInterval = 1000;
var shouldEmitPackets = true; // Add a flag to control packet emission

io.on('connection', function(socket){
    console.log("Socket connected.");

    // Listen for play and pause commands from the client
    socket.on('play', function() {
        shouldEmitPackets = true;
        emitNextPacket(); // Resume emitting packets
    });

    socket.on('pause', function() {
        shouldEmitPackets = false; // Stop emitting packets
    });

    let packetIndex = lastKnownLocation ? route.length : 0; // Start from the last known location index
    // Modify the emitNextPacket function
    const emitNextPacket = () => {
        if (packetIndex < parsedGpsData.length && shouldEmitPackets) {
            const packet = parsedGpsData[packetIndex];
            lastKnownLocation = packet;
            route.push([packet.longitude, packet.latitude]);
            packetIndex++;
            console.log(packet.longitude, packet.latitude);
            socket.emit('gps_packet', packet);
            setTimeout(emitNextPacket, emitInterval);
        } else if (!shouldEmitPackets) {
            console.log('Packet emission paused.');
        } else {
            console.log('All GPS packets emitted.');
        }
    };
});

http.listen(4001, function(){
   console.log('Server listening on port 4001');
});
console.log('done');