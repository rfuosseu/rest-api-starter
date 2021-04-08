interface IReqDetails {
  loggedUser?: any;
  headers: any;
  token?: any;
  startAt: import('moment').Moment;
}

declare namespace Express {
  export interface Request {
    reqDetails: IReqDetails;
    ipInfo: any;
  }
}
