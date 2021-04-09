import express, { Application, NextFunction, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import morgan from 'morgan';
import requestDetails from './middleware';
import ErrorHttp from './error-http';
import ResponseHttp from './response-http';
import Logger from './logger';

export default class App {
  public app: Application;

  public trustedProxies: string[] = ['loopback'];

  private _logger: Logger;

  constructor(private readonly port: number, private readonly serverName: string, debug: boolean = true) {
    this._logger = new Logger(serverName, debug);
    this.app = express();
    this._config();
  }

  /**
   * Starts app
   */
  public start() {
    this.app.listen(this.port, () => {
      this._logger.info(`Server ${this.serverName} launched...`);
    });
  }

  /**
   * Configs app
   */
  private _config() {
    this.app.use(helmet());
    this.app.use(fileUpload());
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(
      morgan('tiny', {
        skip: (req: Request, res: Response) => res.statusCode < 400,
        stream: this._logger.streamError()
      })
    );
    this.app.use(
      morgan('tiny', {
        skip: (req: Request, res: Response) => res.statusCode >= 400,
        stream: this._logger.streamInfo()
      })
    );
    this.app.use(
      morgan('tiny', {
        immediate: true,
        stream: this._logger.streamInfo()
      })
    );
    this.app.use(this._setCors);
    this.app.set('trust proxy', this.trustedProxies);
  }

  /**
   * Sets CORS
   * @param req
   * @param res
   * @param next
   * @returns
   */
  private _setCors(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-Width, X-Request-Id, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
      return res.status(200).json({});
    }
    return next();
  }

  /**
   * Handles not found routes
   * @param req
   * @param res
   * @param next
   */
  private _handleNotFoundRoutes(req: Request, res: Response, next: NextFunction) {
    next(new ErrorHttp(404, 'Endpoint not found!'));
  }

  /**
   * Handles error
   * @param err
   * @param req
   * @param res
   * @param next
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _handleError(err: ErrorHttp, req: Request, res: Response, next: NextFunction) {
    const response: ResponseHttp = new ResponseHttp(req.reqDetails);
    res.status(err.status || 500).json(response.renderError(err.messages, err.status));
  }

  /**
   * Loads routes
   * @param router express app
   */
  public loadRoutes(router: Application) {
    this.app.use(requestDetails);
    this.app.use(router);
    this.app.use(this._handleNotFoundRoutes);
    this.app.use(this._handleError);
  }
}
