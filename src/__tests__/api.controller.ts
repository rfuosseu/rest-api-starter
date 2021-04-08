/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { controller, request } from '../decorator';
import Controller from '../controller';

@controller({
  basePath: '/api',
  routes: [
    {
      path: '/version',
      method: 'get',
      handler: ApiController.geto
    }
  ]
})
export default class ApiController extends Controller {
  @request
  public static async geto(req: Request, res: Response) {
    return true;
  }
}
