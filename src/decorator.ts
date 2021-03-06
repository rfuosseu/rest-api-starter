import { Request, Response, NextFunction } from 'express';
import ErrorHttp from './error-http';
import ResponseHttp from './response-http';
import Controller, { IRoute } from './controller';

/**
 * Configure API router
 * @param config { basePath: string; routes: IRoute[]; middlewares?: Array<(req: Request, res: Response, next: NextFunction) => any>; }
 * @returns
 */
export function controller(config: IControllerConfig) {
  type Constructor<T = Controller> = new (...args: any[]) => T;
  return <TBase extends Constructor>(Base: TBase) =>
    class extends Base {
      constructor(...args: any[]) {
        super(args);
        this.basePath = config.basePath;
        this.routes = config.routes;
        this.middlewares = config.middlewares || [];

        this.initRoutes();
      }
    };
}

/**
 * Handles error
 * @param error
 * @param res
 * @param reqDetails
 * @returns
 */
function handleError(error: ErrorHttp, res: Response, reqDetails: IReqDetails) {
  const response = new ResponseHttp(reqDetails);
  return res.status(error.status).json(response.renderError(error.messages, error.status));
}

/**
 * Handles response
 * @param results
 * @param res
 * @param reqDetails
 * @returns
 */
function handleResponse(results: any, res: Response, reqDetails: IReqDetails) {
  const response = new ResponseHttp(reqDetails);
  return res.status(200).json(response.render(results));
}

/**
 * Parses error
 * @param err
 * @returns error
 */
function parseError(err: any): ErrorHttp {
  let error: ErrorHttp;
  switch (err.name) {
    case 'Error':
      error = new ErrorHttp(err.statusCode || 500, err.message || err.msg);
      break;
    case 'MongoError':
      error = new ErrorHttp(400, err.message);
      break;
    default:
      error = new ErrorHttp(err.status || 500, err.messages || err.message);
  }

  return error;
}

/**
 * Format API Response and handle errors
 * @param target
 * @param propertyKey
 * @param descriptor
 */
export function request(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const { logger } = target;
  return Object.defineProperty(target, propertyKey, {
    ...descriptor,
    value: async (...args: any[]) => {
      const req: Request = args[0];
      const res: Response = args[1];
      try {
        const results: any = await originalMethod.apply(target, args);
        return handleResponse(results, res, req.reqDetails);
      } catch (error) {
        logger.error(error);
        return handleError(parseError(error), res, req.reqDetails);
      }
    }
  });
}

export interface IControllerConfig {
  basePath: string;
  routes: IRoute[];
  middlewares?: Array<(req: Request, res: Response, next: NextFunction) => any>;
}
