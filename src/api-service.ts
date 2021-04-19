import { AxiosInstance } from 'axios';
import RequestHttp, { IRequestConfig, IApiConfig } from './request-http';
import Logger from './logger';

type IRequest = Pick<IRequestConfig, 'path' | 'headers' | 'body' | 'form' | 'params' | 'files'>;

export default class ApiService {
  private _requestHttp: RequestHttp;

  constructor(conf: IApiConfig, public logger?: Logger) {
    this.logger = this.logger || new Logger(conf.name, true);
    this._requestHttp = new RequestHttp(conf, this.logger);
  }

  /**
   * Gets http
   */
  public get http(): AxiosInstance {
    return this._requestHttp.http;
  }

  /**
   * Gets dataservice
   * @param path
   * @param params
   * @param headers
   * @returns
   */
  public async get({ path, params, headers }: IRequest) {
    const method = 'get';
    return this._requestHttp.execute({ path, method, params, headers });
  }

  /**
   * Posts dataservice
   * @param {path, body, form, files, headers}
   * @returns
   */
  public async post({ path, body, form, files, headers }: IRequest) {
    const method = 'post';
    return this._requestHttp.execute({ path, method, body, form, files, headers });
  }

  /**
   * Puts dataservice
   * @param {path, body, form, files, headers}
   * @returns
   */
  public async put({ path, body, form, files, headers }: IRequest) {
    const method = 'put';
    return this._requestHttp.execute({ path, method, body, form, files, headers });
  }

  /**
   * Deletes data service
   * @param {path, body, form, files, headers}
   * @returns
   */
  public async delete({ path, params, headers }: IRequest) {
    const method = 'delete';
    return this._requestHttp.execute({ path, method, params, headers });
  }

  /**
   * Patch dataservice
   * @param {path, body, form, files, headers}
   * @returns
   */
  public async patch({ path, body, form, files, headers }: IRequest) {
    const method = 'patch';
    return this._requestHttp.execute({ path, method, body, form, files, headers });
  }
}
