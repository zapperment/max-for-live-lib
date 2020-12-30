export {};

declare global {
    var autowatch: number;
    var inlets: number;
    var outlets: number;
    var outlet: Function;
    var arrayfromargs: Function;
    var messagename: string;
    var jsarguments: string[];
    class LiveAPI {
        id: number;
        constructor(path: string);
    };
    function post(message: string): void;
}
