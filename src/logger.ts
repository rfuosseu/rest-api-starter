import { createLogger, format, Logger as log, transports } from 'winston';

export default class Logger {
  public logger: log;

  constructor(private _appName: string, private _debug: boolean = true) {
    this.logger = createLogger(this._initLogger());
  }

  /**
   * Infos logger
   * @param args
   */
  public info(...args: any[]) {
    args.forEach((msg: any) => this.logger.info(JSON.stringify(msg)));
  }

  /**
   * Debugs logger
   * @param args
   */
  public debug(...args: any[]) {
    args.forEach((msg: any) => this.logger.debug(JSON.stringify(msg)));
  }

  /**
   * Warns logger
   * @param args
   */
  public warn(...args: any[]) {
    args.forEach((msg: any) => this.logger.warning(JSON.stringify(msg)));
  }

  /**
   * Errors logger
   * @param args
   */
  public error(...args: any[]) {
    args.forEach((msg: any) => this.logger.error(JSON.stringify(msg)));
  }

  /**
   * Apis error
   * @param args
   */
  public apiError(options: any, error: any) {
    this.logger.error(
      `\n  __API Request__ : ${JSON.stringify(options)} \n  __API Response__ : ${error.response?.statusCode}  / ${
        error.message
      }`
    );
  }

  /**
   * Streams error
   * @returns
   */
  public streamError() {
    return { write: (msg: string) => this.logger.error(msg.trim()) };
  }

  /**
   * Streams info
   * @returns
   */
  public streamInfo() {
    return { write: (msg: string) => this.logger.info(msg.trim()) };
  }

  /**
   * Inits logger
   * @returns
   */
  private _initLogger() {
    return {
      level: this._debug ? 'debug' : 'error',
      format: format.combine(
        format.timestamp({ format: 'HH:mm:ss' }),
        format.colorize(),
        format.printf((info) => `${this._appName}: ${info.timestamp} \n  [${info.level}]: ${info.message}\n`)
      ),
      transports: [new transports.Console()]
    };
  }
}
