import ErrorHttp from '../error-http';

describe('ErrorHttp', () => {
  it('should check property name', () => expect(new ErrorHttp(200, '').name).toEqual('ErrorHttp'));
  it('should use status define', () => expect(new ErrorHttp(200, '').status).toEqual(200));
  it('should cast string error to array', () => expect(new ErrorHttp(500, 'error').messages).toEqual(['error']));
  it('should set array msg', () =>
    expect(new ErrorHttp(500, ['error2', 'error1']).messages).toEqual(['error2', 'error1']));
  it('should set message', () => expect(new ErrorHttp(500, ['error2', 'error1']).message).toEqual('error2,error1'));
});
