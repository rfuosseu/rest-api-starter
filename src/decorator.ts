/* eslint-disable no-param-reassign */
import ErrorHttp from 'error-http';
import { Request, Response } from 'express';
import ResponseHttp, { IReqDetails } from 'response-http';
import Controller, { IRoute } from './controller';

export function controller(config: { basePath: string; routes: IRoute[] }) {
  /* eslint-disable no-param-reassign */
  return <T extends typeof Controller>(constructor: T) => {
    constructor.prototype.basePath = config.basePath;
    constructor.prototype.routes = config.routes;
  };
  /* eslint-enable no-param-reassign */
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

export function request(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
  const originalMethod = descriptor.value;
  return {
    value: async (...args: any[]) => {
      const req: Request = args[0];
      const res: Response = args[1];
      try {
        const results: any = await originalMethod.apply(target, args);
        return handleResponse(results, res, req.reqDetails);
      } catch (error) {
        // logger.error(error);
        return handleError(parseError(error), res, req.reqDetails);
      }
    }
  };
}
