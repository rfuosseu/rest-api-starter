import moment from 'moment';
import ResponseHttp from '../response-http';

describe('ResponseHttp', () => {
  const reqDetails = {
    headers: { 'X-Request-Id': 'aaaa' },
    startAt: moment()
  };

  test('should init response', () => {
    const res = new ResponseHttp(reqDetails);
    expect(res.requestId).toBe('aaaa');
    expect(res.startedAt).toBe(reqDetails.startAt);
  });

  test('should render a success 200 response by default', () => {
    const res = new ResponseHttp(reqDetails);
    expect(res.render(true)).toEqual({
      completedAt: expect.any(moment),
      timeTaken: expect.any(String),
      requestId: 'aaaa',
      startedAt: reqDetails.startAt,
      statusCode: 200,
      data: true
    });
  });

  test('should render a success response with the right status', () => {
    const res = new ResponseHttp(reqDetails);
    expect(res.render(true, 201)).toEqual({
      completedAt: expect.any(moment),
      timeTaken: expect.any(String),
      requestId: 'aaaa',
      startedAt: reqDetails.startAt,
      statusCode: 201,
      data: true
    });
  });

  test('should render an error 500 response by default', () => {
    const res = new ResponseHttp(reqDetails);
    expect(res.renderError(['ERROR'])).toEqual({
      completedAt: expect.any(moment),
      timeTaken: expect.any(String),
      requestId: 'aaaa',
      startedAt: reqDetails.startAt,
      statusCode: 500,
      error: true,
      errorMessages: ['ERROR']
    });
  });

  test('should render an error response with the right status', () => {
    const res = new ResponseHttp(reqDetails);
    expect(res.renderError(['ERROR'], 400)).toEqual({
      completedAt: expect.any(moment),
      timeTaken: expect.any(String),
      requestId: 'aaaa',
      startedAt: reqDetails.startAt,
      statusCode: 400,
      error: true,
      errorMessages: ['ERROR']
    });
  });
});
