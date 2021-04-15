import { Request, Response } from 'express';
import Controller from '../controller';
import Logger from '../logger';

describe('Controller', () => {
  class Ctrl extends Controller {
    static getTo(req: Request, res: Response) {
      res.send('test');
    }
  }
  const logger = new Logger('Rest');
  const ctrl = new Ctrl(logger);

  ctrl.routes = [
    {
      path: '/b',
      method: 'get',
      handler: Ctrl.getTo
    }
  ];

  it('should set the logger', () => {
    expect(Ctrl.logger).toBeDefined();
  });

  it('should set express router', () => {
    const spyRouter = jest.spyOn(ctrl.router, 'get');
    ctrl.initRoutes();
    expect(spyRouter).toHaveBeenCalledTimes(1);
    expect(spyRouter).toHaveBeenCalledWith('/b', Ctrl.getTo);
  });
});
