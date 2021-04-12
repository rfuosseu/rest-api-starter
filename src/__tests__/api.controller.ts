import { NextFunction, Request, Response } from 'express';

import { controller, request } from '../decorator';
import Controller from '../controller';
import TestService from './test.service';

function middleware(req: Request, res: Response, next: NextFunction) {
  next();
}

@controller({
  basePath: '/api',
  routes: [
    {
      path: '/users',
      method: 'get',
      handler: ApiController.getUsers,
      middlewares: [middleware]
    }
  ]
})
export default class ApiController extends Controller {
  @request
  public static async getUsers(req: Request, res: Response) {
    return new TestService().getUsers();
  }
}
