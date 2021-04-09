/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { controller, request } from '../decorator';
import Controller from '../controller';
import TestService from './test.service';

@controller({
  basePath: '/api',
  routes: [
    {
      path: '/users',
      method: 'get',
      handler: ApiController.getUsers
    }
  ]
})
export default class ApiController extends Controller {
  @request
  public static async getUsers(req: Request, res: Response) {
    return new TestService().getUsers();
  }
}
