import { FileArray, UploadedFile } from 'express-fileupload';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Logger from './logger';
import ErrorHttp from './error-http';

export default class RequestHttp {
  private _http: AxiosInstance;

  private _logger: Logger;

  get http(): AxiosInstance {
    return this._http;
  }

  constructor(public conf: IApiConfig, logger?: Logger) {
    this._http = axios.create({
      baseURL: conf.baseURL,
      headers: conf.headers || {}
    });

    this._logger = logger || new Logger(conf.name, true);
  }

  /**
   * Gets files
   * @param file
   * @returns files
   */
  public getFiles(file: UploadedFile | UploadedFile[]): any {
    if (Array.isArray(file)) {
      const formData: any[] = [];
      file.forEach((fich: UploadedFile) =>
        formData.push({ value: fich.data, options: { filename: fich.name, contentType: fich.mimetype } })
      );
      return formData;
    }
    return { value: file.data, options: { filename: file.name, contentType: file.mimetype } };
  }

  /**
   * Executes request http
   * @param opts
   * @returns
   */
  public async execute(opts: IRequestConfig) {
    const config: AxiosRequestConfig = {
      url: opts.path,
      headers: { ...this.conf.headers, ...opts.headers },
      baseURL: this.conf.baseURL,
      method: opts.method
    };

    if (opts.method === 'get') {
      config.params = opts.params;
    } else if (opts.body) {
      config.data = opts.body;
    } else if (opts.files) {
      config.headers = { ...config.headers, 'Content-Type': 'multipart/form-data' };
      config.data = opts.form || {};
      Object.entries(opts.files).forEach(([key, value]) => {
        config.data[key] = this.getFiles(value);
      });
    } else {
      config.data = opts.form;
    }

    return this._http
      .request(config)
      .then((res: AxiosResponse) => {
        // TODO: Remove files from config before logging.
        this._logger.debug(config);
        return res.data;
      })
      .catch((error) => {
        this._logger.apiError(config, error);
        throw new ErrorHttp(error.response?.statusCode, error.message);
      });
  }
}

export interface IApiConfig {
  name: string;
  baseURL: string;
  headers: { [key: string]: string };
}

export interface IRequestConfig {
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  headers?: any;
  params?: any;
  body?: any;
  form?: any;
  files?: FileArray;
}
