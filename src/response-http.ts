import moment, { Moment } from 'moment';

export default class ResponseHttp {
  public requestId: string;

  public startedAt: Moment;

  constructor(reqDetails: IReqDetails) {
    this.requestId = reqDetails.headers['X-Request-Id'];
    this.startedAt = reqDetails.startAt;
  }

  /**
   * Builds response http
   * @returns
   */
  private _build() {
    const completedAt: Moment = moment();
    const timeTaken: string = `${completedAt.diff(this.startedAt, 'ms')}ms`;

    return {
      completedAt,
      timeTaken,
      requestId: this.requestId,
      startedAt: this.startedAt
    };
  }

  /**
   * Renders error
   * @param errorMessages
   * @param [statusCode]
   * @returns
   */
  public renderError(errorMessages: string[], statusCode: number = 500) {
    return {
      statusCode,
      errorMessages,
      error: true,
      ...this._build()
    };
  }

  /**
   * Renders response http
   * @param results
   * @param [statusCode]
   * @returns
   */
  public render(results: any, statusCode: number = 200) {
    return {
      statusCode,
      results,
      ...this._build()
    };
  }
}
