import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

/**
 * Inits request details
 * @param req
 * @param res
 * @param next
 */
export default function requestDetails(req: Request, res: Response, next: NextFunction) {
  req.reqDetails = {
    headers: { 'X-Request-Id': req.headers['x-request-id'] },
    startAt: moment()
  };
  next();
}
