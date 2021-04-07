import { Router } from 'express';

export default class Controller {
  public router: Router = Router();

  public requestId!: string;

  public basePath!: string;

  public routes: IRoute[] = [];

  constructor() {
    this._initRoutes();
  }

  /**
   * Inits routes
   */
  private _initRoutes() {
    if (this.routes.length > 0) {
      this.routes.forEach((route: IRoute) => {
        const middlewares = route.middlewares || [];
        this.router[route.method](route.path, ...middlewares, this[route.handler].bind());
      });
    }
  }
}

export interface IRoute {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  handler: string;
  path: string;
  middlewares?: any[];
}
