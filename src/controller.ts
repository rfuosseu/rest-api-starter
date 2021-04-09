import { NextFunction, Request, Response, Router } from 'express';
import Logger from './logger';

export default class Controller {
  public router: Router = Router();

  public requestId!: string;

  public basePath!: string;

  public routes: IRoute[] = [];

  public static logger: Logger = new Logger('REST_API', true);

  /**
   * Inits routes
   */
  public initRoutes() {
    if (this.routes.length > 0) {
      this.routes.forEach((route: IRoute) => {
        const middlewares = route.middlewares || [];
        this.router[route.method](route.path, ...middlewares, route.handler);
      });
    }
  }

  /**
   * Sets logger
   * @param [logger]
   */
  public setLogger(logger?: Logger) {
    Controller.logger = logger || Controller.logger;
  }
}

export interface IRoute {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  handler: (req: Request, res: Response, next?: NextFunction) => {};
  path: string;
  middlewares?: Array<(req: Request, res: Response, next?: NextFunction) => {}>;
}
