autowatch = 1;
inlets = 1;
outlets = 2;

var CHANNEL_1_CC = 176;

function log() {
    for (var i = 0; i < arguments.length; i++) {
        var msg = arguments[i];
        if (msg === undefined) {
            continue;
        }
        else if (msg instanceof Date) {
            post(msg.toString());
        }
        else if (typeof msg === "object") {
            post(JSON.stringify(msg));
        }
        else if (typeof msg === "string") {
            post(msg);
        }
        else {
            post(msg.toString());
        }
    }
    post("\n");
}

function anything() {
    var msg = arrayfromargs(messagename, arguments);
    var statusByte = msg[0];
    var controllerNumber = msg[1];
    var value = msg[2];
    if (statusByte == CHANNEL_1_CC && controllerNumber == jsarguments[1]) {
        var thisDeviceTrack = new LiveAPI("this_device canonical_parent");
        var selectedTrack = new LiveAPI("live_set view selected_track");
        if (thisDeviceTrack.id === selectedTrack.id) {
            outlet(0, value);
            return;
        }
    }
    // pass the MIDI message on for chaining
    outlet(1, msg);
}
