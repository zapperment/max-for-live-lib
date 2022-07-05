export {};

declare global {
  const outlet: Function;
  const arrayfromargs: Function;
  const messagename: string;
  const jsarguments: string[];
  const inlet: number;
  class LiveAPI {
    id: number;
    path: string;
    unquotedpath: string;
    children: LiveAPI[];
    mode: number;
    type: string;
    info: string;
    property: string;
    get: Function;
    constructor(callback: function, path?: string);
  }
  function post(message: string): void;
}
