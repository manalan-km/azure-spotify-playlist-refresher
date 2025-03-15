import { InvocationContext } from '@azure/functions';

export class Logger {
  private static LoggerInstance: Logger;
  private context: InvocationContext;

  private constructor() {}

  private setContext(context: InvocationContext) {
    this.context = context;
  }

  static initialiseLogger(context: InvocationContext) {
    if (!Logger.LoggerInstance) {
      Logger.LoggerInstance = new Logger();
    }

    Logger.LoggerInstance.setContext(context);
    return Logger.LoggerInstance;
  }

  private isContextSet() {
    return this.context !== undefined;
  }

  info(message: string) {
    if (!this.isContextSet()) {
      console.info(message);
      return;
    }
    this.context.info(message);
  }

  warn(message: string) {
    if (!this.isContextSet()) {
      console.warn(message);
      return;
    }
    this.context.warn(message);
  }

  error(message: string) {
    if (!this.isContextSet()) {
      console.error(message);
      return;
    }
    this.context.error(message);
  }

  debug(message: string) {
    if (!this.isContextSet()) {
      console.debug(message);
      return;
    }
    this.context.debug(message);
  }

  static getLoggerInstance() {
    if (!Logger.LoggerInstance) {
      throw new Error('Logger not initialized.');
    }
    return Logger.LoggerInstance;
  }
}
