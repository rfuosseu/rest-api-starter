import moment from 'moment';
import requestDetails from '../../lib/esm/middleware';

describe('middleware', () => {
  it('should init request details and define X-Request-Id', () => {
    const next = jest.fn();
    const req: any = { headers: {} };
    requestDetails(<any>req, <any>{}, <any>next);
    expect(req.reqDetails).toBeDefined();
    expect(req.reqDetails).toEqual({
      headers: { 'X-Request-Id': expect.any(String) },
      startAt: expect.any(moment)
    });
  });
  it('should init request details and use defined X-Request-Id', () => {
    const next = jest.fn();
    const req: any = { headers: { 'x-request-id': 'aaa' } };
    requestDetails(<any>req, <any>{}, <any>next);
    expect(req.reqDetails).toBeDefined();
    expect(req.reqDetails).toEqual({
      headers: { 'X-Request-Id': 'aaa' },
      startAt: expect.any(moment)
    });
  });
});
