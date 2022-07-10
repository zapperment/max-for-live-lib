interface Options {
  numberOfRows?: number;
  logOutlet?: number;
}

let logger: null | Logger = null;

export default class Logger {
  private rows: string[] = [];
  private numberOfRows = 5;
  private logOutlet: null | number = null;

  constructor({ numberOfRows, logOutlet }: Options = {}) {
    if (numberOfRows) {
      this.numberOfRows = numberOfRows;
    }
    if (logOutlet) {
      this.logOutlet = logOutlet;
    }
  }

  log(...messages: any[]) {
    for (const message of messages) {
      this.sendLog(message);
    }
  }

  private sendLog(message: any) {
    if (message === undefined) {
      return;
    }
    let messageString;
    switch (true) {
      case message instanceof Date:
        messageString = message.toString();
        break;
      case typeof message === "object":
        messageString = JSON.stringify(message);
        break;
      case typeof message === "string":
        messageString = message;
        break;
      default:
        messageString = message.toString();
    }
    post(`${messageString}\n`);
    if (this.logOutlet !== null) {
      this.rows = this.rows
        .slice(0, this.numberOfRows - 1)
        .concat(messageString);
      outlet(this.logOutlet, this.rows.join("\n"));
    }
  }
  static createInstance(options: Options = {}) {
    logger = new Logger(options);
  }

  static getInstance() {
    return logger;
  }
}
