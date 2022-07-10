import Logger from "./Logger";

/**
 * Logs an arbitrary number of statements/values to the Max console. 
 * If a global logger variable is defined, this is used. The global
 * logger can be initialized to also log to an outlet of the JS Max
 * object, allowing us to log to a UI element of the M4L device.
 * 
 * @param messages Arbitrary number of message tokens to be logged
 */
export default function log(...messages: any[]) {
	const myLogger = Logger.getInstance() || new Logger();
	myLogger.log(messages);
}

