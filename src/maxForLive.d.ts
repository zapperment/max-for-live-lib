export {};

declare global {
  const autowatch: number;
  const inlets: number;
  const outlets: number;
  const outlet: Function;
  const arrayfromargs: Function;
  const messagename: string;
  const jsarguments: string[];
  class LiveAPI {
    id: number;
    constructor(path: string);
  }
  function post(message: string): void;
}
