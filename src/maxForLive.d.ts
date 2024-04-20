import type { Id } from "./types";
export {};

declare global {
  const inlet: number;
  let autowatch: number;
  const outlet: Function;
  const setinletassist: Function;
  const setoutletassist: Function;
  let inlets: number;
  let outlets: number;
  const arrayfromargs: Function;
  const messagename: string;
  const jsarguments: string[];
  const max: {
    preempt: Function;
  };
  class LiveAPI {
    id: number;
    path: string;
    unquotedpath: string;
    children: LiveAPI[];
    mode: number;
    type: string;
    info: string;
    property: string;
    call: Function;
    get: Function;
    getcount: Function;
    getstring: Function;
    goto: Function;
    set: Function;
    constructor(callback?: Function, pathOrId: string | Id);
    constructor(pathOrId?: string | Id);
  }
  function post(message: string): void;
}
