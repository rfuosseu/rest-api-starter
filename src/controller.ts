import { Router } from 'express';

export default class Controller {
  public router: Router = Router();

  public requestId!: string;

  public basePath!: string;

  public routes: IRoute[] = [];

  /**
   * Inits routes
   */
  protected _initRoutes() {
    if (this.routes.length > 0) {
      this.routes.forEach((route: IRoute) => {
        const middlewares = route.middlewares || [];
        this.router[route.method](route.path, ...middlewares, route.handler);
      });
    }
  }
}

export interface IRoute {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  handler: (...args: any[]) => {};
  path: string;
  middlewares?: any[];
}
