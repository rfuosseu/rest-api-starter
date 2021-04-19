import ApiService from '../api-service';
import RequestHttp, { IApiConfig } from '../request-http';

// const reqMock = jest.fn();

jest.mock('../request-http');

describe('ApiService', () => {
  const conf: IApiConfig = {
    name: 'TEST',
    baseURL: 'http://test',
    headers: {}
  };
  const reqMock = jest.spyOn(RequestHttp.prototype, 'execute');
  const sev: ApiService = new ApiService(conf);

  it('should init axios and the logger', () => {
    expect(sev.logger).toBeDefined();
  });

  describe('Apiservice.httpMethod', () => {
    const path = '/path';
    const params = {};
    const headers = {};
    const body = {};
    const form = {};

    it('should call get', async () => {
      await sev.get({ path, params, headers });
      expect(reqMock).toHaveBeenCalledWith({
        path,
        params,
        headers,
        method: 'get'
      });
    });

    it('should call post', async () => {
      await sev.post({ path, params, body, headers });
      expect(reqMock).toHaveBeenNthCalledWith(2, {
        path,
        body,
        headers,
        form: undefined,
        files: undefined,
        method: 'post'
      });

      await sev.post({ path, form, headers, body });
      expect(reqMock).toHaveBeenNthCalledWith(3, {
        path,
        form,
        headers,
        body,
        files: undefined,
        method: 'post'
      });
    });

    it('should call delete', async () => {
      await sev.delete({ path, form, headers });
      expect(reqMock).toHaveBeenNthCalledWith(4, {
        headers: {},
        method: 'delete',
        params: undefined,
        path: '/path'
      });
    });

    it('should call put', async () => {
      await sev.put({ path, form, headers, body });
      expect(reqMock).toHaveBeenNthCalledWith(5, {
        path,
        form,
        headers,
        body,
        files: undefined,
        method: 'put'
      });
    });

    it('should call patch', async () => {
      await sev.patch({ path, form, headers, body });
      expect(reqMock).toHaveBeenNthCalledWith(6, {
        path,
        form,
        headers,
        body,
        files: undefined,
        method: 'patch'
      });
    });
  });
});
