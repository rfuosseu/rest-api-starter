import { NextFunction, Request, Response } from 'express';
import { controller, request } from '../decorator';
import Controller from '../controller';
import TestService from './test.service';
// import ErrorHttp from '../error-http';

function middleware(req: Request, res: Response, next: NextFunction) {
  next();
}

@controller({
  basePath: 'test',
  routes: [
    {
      path: '/users',
      method: 'get',
      handler: TestController.getUsers,
      middlewares: [middleware]
    }
  ]
})
export default class TestController extends Controller {
  @request
  public static async getUsers(req: Request, res: Response) {
    return new TestService().getUsers();
    // throw new ErrorHttp(400, 'test');
  }
}
