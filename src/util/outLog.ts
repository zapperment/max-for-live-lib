/**
 * Logs a statement to the Max console and also sends the log message
 * to a specified device outlog
 * @param outletIndex The index of the outlet
 * @param message The message string
 */
export default function log(outletIndex: number, message: string) {
  post(message);
  post("\n");
  outlet(outletIndex, message)
}
