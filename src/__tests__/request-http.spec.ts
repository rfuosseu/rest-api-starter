import RequestHttp, { IApiConfig, IRequestConfig } from '../request-http';

const requestMock = jest.fn();

jest.mock('axios', () => ({
  create: jest.fn((x) => ({
    request: requestMock
  }))
}));

describe('RequestHttp', () => {
  const conf: IApiConfig = {
    name: 'TEST',
    baseURL: 'http://test',
    headers: {}
  };
  const req = new RequestHttp(conf);

  it('should init axios and the logger', () => {
    expect(req.http).toBeDefined();
  });

  it('should get Files', () => {
    const file: any = {
      data: 'data',
      name: 'name',
      mimetype: 'mime'
    };
    const res: any = {
      value: 'data',
      options: {
        filename: 'name',
        contentType: 'mime'
      }
    };
    expect(req.getFiles(file)).toEqual(res);
    expect(req.getFiles([file])).toEqual([res]);
  });

  describe('should execute a http request', () => {
    const reqConfig: IRequestConfig = {
      path: '/toto',
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
      params: { a: 1 },
      body: { b: 1 }
    };
    requestMock.mockResolvedValue({ data: 1 });

    it('should do a get', async () => {
      const arg = {
        baseURL: 'http://test',
        headers: { 'Content-Type': 'application/json' },
        method: 'get',
        params: { a: 1 },
        url: '/toto'
      };
      const data = await req.execute(reqConfig);
      expect(data).toBe(1);
      expect(requestMock.mock.calls[0][0]).toEqual(arg);
    });

    it('should do a post with body', async () => {
      requestMock.mockResolvedValue({ data: 1 });
      const arg = {
        baseURL: 'http://test',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        data: { b: 1 },
        url: '/toto'
      };
      const data = await req.execute({ ...reqConfig, method: 'post' });
      expect(data).toBe(1);
      expect(requestMock.mock.calls[1][0]).toEqual(arg);
    });

    it('should do a post with files', async () => {
      requestMock.mockResolvedValue({ data: 1 });
      const arg = {
        baseURL: 'http://test',
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'post',
        data: {
          ex: {
            value: 'data',
            options: {
              filename: 'name',
              contentType: 'mime'
            }
          }
        },
        url: '/toto'
      };
      const data = await req.execute({
        ...reqConfig,
        method: 'post',
        body: undefined,
        form: {},
        files: {
          ex: {
            data: 'data',
            name: 'name',
            mimetype: 'mime'
          }
        }
      } as any);
      expect(data).toBe(1);
      expect(requestMock.mock.calls[2][0]).toEqual(arg);
    });

    it('should do a post with form', async () => {
      requestMock.mockResolvedValue({ data: 1 });
      const arg = {
        baseURL: 'http://test',
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        data: {
          a: 1
        },
        url: '/toto'
      };
      const data = await req.execute({
        ...reqConfig,
        method: 'post',
        body: undefined,
        form: { a: 1 }
      } as any);
      expect(data).toBe(1);
      expect(requestMock.mock.calls[3][0]).toEqual(arg);
    });

    describe('shoudl catch error http', () => {
      it('should catch http error status', async () => {
        requestMock.mockRejectedValue({
          message: 'error',
          response: { statusCode: 401 }
        });
        try {
          await req.execute(reqConfig);
        } catch (error) {
          expect(error.name).toBe('ErrorHttp');
          expect(error.messages).toEqual(['error']);
          expect(error.status).toBe(401);
        }
      });

      it('should use default status', async () => {
        requestMock.mockRejectedValue({
          message: 'error'
        });
        try {
          await req.execute(reqConfig);
        } catch (error) {
          expect(error.name).toBe('ErrorHttp');
          expect(error.messages).toEqual(['error']);
          expect(error.status).toBe(500);
        }
      });
    });
  });
});
