import { includes } from "core-js/actual/array";

import log from "./log";
import type ApiManager from "./ApiManager";

export default class ManagedApi {
  private _id: string;
  private _api: LiveAPI;
  private _apiMan: ApiManager;
  private _children: string[] = [];
  private _property: string = "";

  constructor(id: string, api: LiveAPI, apiMan: ApiManager) {
    this._id = id;
    this._api = api;
    this._apiMan = apiMan;
  }

  set property(value: string) {
    this._property = value;
  }

  start() {
    this._api.property = this._property;
    this.startChildren();
  }

  startChildren() {
    this._children.forEach((id) => this._apiMan.start(id));
  }

  stop() {
    this._api.property = "";
    this.stopChildren();
  }

  stopChildren() {
    this._children.forEach((id) => this._apiMan.stop(id));
  }

  kill() {
    this._apiMan.kill(this._id);
    this.killChildren();
  }

  killChildren() {
    this._children.forEach((id) => this._apiMan.kill(id));
    this._children = [];
  }

  add(id: string, callback: (...args: any[]) => void) {
    if (includes(this._children, id)) {
      return;
    }
    const managedApi = this._apiMan.make(id, callback);
    this._children.push(id);
    return managedApi;
  }
}
