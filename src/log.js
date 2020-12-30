export default function log() {
    var messages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        messages[_i] = arguments[_i];
    }
    for (var _a = 0, messages_1 = messages; _a < messages_1.length; _a++) {
        var msg = messages_1[_a];
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
