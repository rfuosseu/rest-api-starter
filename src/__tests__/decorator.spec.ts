import { Request, Response } from 'express';
import moment from 'moment';
import { controller, request } from '../decorator';
import Controller from '../controller';
import Logger from '../logger';
import ErrorHttp from '../error-http';

describe('decorator', () => {
  class Ctrl extends Controller {
    static getTo(req: Request, res: Response) {
      return true;
    }

    static getErr(req: Request, res: Response) {
      throw new Error('test');
    }

    static getErrHttp(req: Request, res: Response) {
      throw new ErrorHttp(404, 'test');
    }

    static getErrMongo(req: Request, res: Response) {
      const err = new Error('test');
      err.name = 'MongoError';
      throw err;
    }
  }
  const logger = new Logger('Rest');
  const ctrlDecorator = controller({
    basePath: 'a',
    routes: [
      {
        path: '/b',
        method: 'get',
        handler: Ctrl.getTo
      }
    ]
  });

  it('should decorate the controller', () => {
    const DecorateClass = ctrlDecorator(Ctrl);
    DecorateClass.prototype.initRoutes = jest.fn();
    const obj = new DecorateClass(logger);
    expect(obj.basePath).toBe('a');
    expect(obj.middlewares.length).toBe(0);
    expect(obj.routes).toEqual([
      {
        path: '/b',
        method: 'get',
        handler: Ctrl.getTo
      }
    ]);
    expect((obj.initRoutes as jest.Mock).mock.calls.length).toBe(1);
  });

  describe('should decorate request', () => {
    const jsonSpy = jest.fn();
    const statusSpy = jest.fn((x) => ({ json: jsonSpy }));
    const res: any = { status: statusSpy };
    const reqDetails = {
      headers: { 'X-Request-Id': 'aaaa' },
      startAt: moment()
    };
    Ctrl.logger = logger;

    it('should handle response', async () => {
      request(Ctrl, 'getTo', Object.getOwnPropertyDescriptor(Ctrl, 'getTo') as any);
      await Ctrl.getTo({ reqDetails } as any, res);
      expect(statusSpy.mock.calls[0][0]).toBe(200);
      expect(jsonSpy.mock.calls[0][0]).toEqual({
        completedAt: expect.any(moment),
        timeTaken: expect.any(String),
        requestId: 'aaaa',
        startedAt: reqDetails.startAt,
        statusCode: 200,
        data: true
      });
    });

    it('should handle error response', async () => {
      request(Ctrl, 'getErr', Object.getOwnPropertyDescriptor(Ctrl, 'getErr') as any);
      await Ctrl.getErr({ reqDetails } as any, res);
      expect(statusSpy.mock.calls[1][0]).toBe(500);
      expect(jsonSpy.mock.calls[1][0]).toEqual({
        completedAt: expect.any(moment),
        timeTaken: expect.any(String),
        requestId: 'aaaa',
        startedAt: reqDetails.startAt,
        statusCode: 500,
        error: true,
        errorMessages: ['test']
      });
    });

    it('should handle errorHttp response', async () => {
      request(Ctrl, 'getErrHttp', Object.getOwnPropertyDescriptor(Ctrl, 'getErrHttp') as any);
      await Ctrl.getErrHttp({ reqDetails } as any, res);
      expect(statusSpy.mock.calls[2][0]).toBe(404);
      expect(jsonSpy.mock.calls[2][0]).toEqual({
        completedAt: expect.any(moment),
        timeTaken: expect.any(String),
        requestId: 'aaaa',
        startedAt: reqDetails.startAt,
        statusCode: 404,
        error: true,
        errorMessages: ['test']
      });
    });

    it('should handle error mongo response', async () => {
      request(Ctrl, 'getErrMongo', Object.getOwnPropertyDescriptor(Ctrl, 'getErrMongo') as any);
      await Ctrl.getErrMongo({ reqDetails } as any, res);
      expect(statusSpy.mock.calls[3][0]).toBe(400);
      expect(jsonSpy.mock.calls[3][0]).toEqual({
        completedAt: expect.any(moment),
        timeTaken: expect.any(String),
        requestId: 'aaaa',
        startedAt: reqDetails.startAt,
        statusCode: 400,
        error: true,
        errorMessages: ['test']
      });
    });
  });
});
