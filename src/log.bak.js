"use strict";
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
