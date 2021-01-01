export {};

declare global {
  const outlet: Function;
  const arrayfromargs: Function;
  const messagename: string;
  const jsarguments: string[];
  const inlet: number;
  class LiveAPI {
    id: number;
    constructor(path: string);
  }
  function post(message: string): void;
}
