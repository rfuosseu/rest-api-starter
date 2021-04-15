import { NextFunction, Request, Response, Router } from 'express';
import Logger from './logger';

export default class Controller {
  public router: Router = Router();

  public requestId!: string;

  public basePath!: string;

  public middlewares: Array<(req: Request, res: Response, next: NextFunction) => any> = [];

  public routes: IRoute[] = [];

  public static logger: Logger;

  constructor(log: Logger) {
    Controller.logger = log;
  }

  /**
   * Inits routes
   */
  public initRoutes() {
    if (this.routes.length > 0) {
      this.routes.forEach((route: IRoute) => {
        const middlewares = [...this.middlewares, ...(route.middlewares || [])];
        this.router[route.method](route.path, ...middlewares, route.handler);
      });
    }
  }
}

export interface IRoute {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  handler: (req: Request, res: Response, next?: NextFunction) => any;
  path: string;
  middlewares?: Array<(req: Request, res: Response, next: NextFunction) => any>;
}
