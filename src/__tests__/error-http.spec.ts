import ErrorHttp from '../error-http';

describe('ErrorHttp', () => {
  test('should check property name', () => expect(new ErrorHttp(200, '').name).toEqual('ErrorHttp'));
  test('should use status define', () => expect(new ErrorHttp(200, '').status).toEqual(200));
  test('should cast string error to array', () => expect(new ErrorHttp(500, 'error').messages).toEqual(['error']));
  test('should set array msg', () =>
    expect(new ErrorHttp(500, ['error2', 'error1']).messages).toEqual(['error2', 'error1']));
  test('should set message', () => expect(new ErrorHttp(500, ['error2', 'error1']).message).toEqual('error2,error1'));
});
