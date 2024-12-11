import ManagedApi from "./ManagedApi";

export default class ApiManager {
  private _apis: Record<string, ManagedApi> = {};

  make(id: string, callback: (...args: any[]) => void) {
    const tokens = id.split(" ");
    const property = tokens[tokens.length - 1];
    const path = tokens.slice(0, tokens.length - 1).join(" ");
    const api = new LiveAPI((message: [string, number]) => {
      const [type, value] = message;
      if (type === property) {
        callback(value);
        return;
      }
    }, path);
    const managedApi = new ManagedApi(id, api, this);
    this._apis[id] = managedApi;
    managedApi.property = property;
    return managedApi;
  }

  add(
    parent: ManagedApi | string,
    id: string,
    callback: (...args: any[]) => void,
  ) {
    let finalParent: ManagedApi;
    if (typeof parent === "string") {
      finalParent = this._apis[id];
      if (!finalParent) {
        return;
      }
    } else {
      finalParent = parent;
    }
    finalParent.add(id, callback);
    return finalParent;
  }

  kill(id: string) {
    const api = this._apis[id];
    if (!api) {
      return;
    }
    api.stop();
    delete this._apis[id];
  }

  start(id: string) {
    const api = this._apis[id];
    if (!api) {
      return;
    }
    api.start();
  }

  stop(id: string) {
    const api = this._apis[id];
    if (!api) {
      return;
    }
    api.stop();
  }
}
