'use strict'

var queue = [];
var playing = false;


// SC.initialize({
//     client_id: "1556b5c8fc4f23a396531290f8f639a3",
// });

// setTimeout(function () {
// SC.stream("/tracks/170740092", function(sound){
//   // sound.play();
// });    
// }, 1000);

// controls/* represents messages from the toolbar audio controls

self.port.on("controls/play", function () {
    // invert playing / paused

    playing = !playing;
    sendIsPlaying();
});

self.port.on("controls/prev", function () {
    console.log("prev!");
    sendPlayerStatus();
});

self.port.on("controls/next", function () {
    console.log("next!");
    sendPlayerStatus();
});

function sendIsPlaying() {
    self.port.emit("audioplayer/isPlaying", playing);
}

function sendPlayerStatus() {
    self.port.emit("audioplayer/playerStatus", {
        hasPrevTrack: false,
        hasNextTrack: false,
        trackDetails: {},
    });
}
