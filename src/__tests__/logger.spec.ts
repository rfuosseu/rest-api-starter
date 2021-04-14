import winston from 'winston';
import Logger from '../logger';

jest.mock('winston');

describe('Logger', () => {
  const logger = new Logger('REST');

  beforeEach(() => {
    logger.logger.info = jest.fn();
    logger.logger.debug = jest.fn();
    logger.logger.warning = jest.fn();
    logger.logger.error = jest.fn();
    winston.createLogger = jest.fn();
    winston.format.timestamp = jest.fn();
  });

  afterEach(() => {
    (logger.logger.info as jest.Mock).mockRestore();
    (logger.logger.debug as jest.Mock).mockRestore();
    (logger.logger.warning as jest.Mock).mockRestore();
    (logger.logger.error as jest.Mock).mockRestore();
    (winston.createLogger as jest.Mock).mockRestore();
  });

  it('should init the logger', () => {
    expect((winston.createLogger as jest.Mock).mock.calls[0][0]).toEqual({
      level: 'debug',
      format: expect.any(Object),
      transports: [new winston.transports.Console()]
    });
  });

  it('should log info messages', () => {
    logger.info('c', 'a', 2);
    expect((logger.logger.info as jest.Mock).mock.calls.length).toBe(3);
    logger.info(23);
    expect((logger.logger.info as jest.Mock).mock.calls[3][0]).toBe('23');
  });

  it('should log debug messages', () => {
    logger.debug('c', 'a', 2);
    expect((logger.logger.debug as jest.Mock).mock.calls.length).toBe(3);
    logger.debug(23);
    expect((logger.logger.debug as jest.Mock).mock.calls[3][0]).toBe('23');
  });

  it('should log warning messages', () => {
    logger.warn('c', 'a', 2);
    expect((logger.logger.warning as jest.Mock).mock.calls.length).toBe(3);
    logger.warn(23);
    expect((logger.logger.warning as jest.Mock).mock.calls[3][0]).toBe('23');
  });

  it('should log error messages', () => {
    logger.error('c', 'a', 2);
    expect((logger.logger.error as jest.Mock).mock.calls.length).toBe(3);
    logger.error(23);
    expect((logger.logger.error as jest.Mock).mock.calls[3][0]).toBe('23');
  });

  it('should log api error messages', () => {
    logger.apiError({ a: 1 }, { response: { statusCode: 400 }, message: 'error' });
    const expected = `\n  __API Request__ : {"a":1} \n  __API Response__ : 400  / error`;
    expect((logger.logger.error as jest.Mock).mock.calls.length).toBe(1);
    expect((logger.logger.error as jest.Mock).mock.calls[0][0]).toBe(expected);
  });

  it('should return error stream', () => {
    logger.streamError().write('0');
    expect((logger.logger.error as jest.Mock).mock.calls[0][0]).toBe('0');
  });

  it('should return info stream', () => {
    logger.streamInfo().write('0');
    expect((logger.logger.info as jest.Mock).mock.calls[0][0]).toBe('0');
  });
});
