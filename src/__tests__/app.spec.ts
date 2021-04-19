import express from 'express';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import App from '../app';
import Controller from '../controller';
import requestDetails from '../middleware';

const useSpy = jest.fn();
const setSpy = jest.fn();
const listenSpy = jest.fn();
const urlencodedMock = jest.fn();
const jsonMock = jest.fn();

jest.mock('express', () => () => ({
  listen: listenSpy,
  use: useSpy,
  set: setSpy
}));
express.json = jsonMock;
express.urlencoded = urlencodedMock;

describe('App', () => {
  const app = new App(8089, 'TEST', false);
  it('should init the app', () => {
    expect(app.app).toBeDefined();
    expect(app.logger).toBeDefined();
    expect(Controller.logger).toBeDefined();
    expect(jsonMock).toHaveBeenCalledWith({ limit: '50mb' });
    expect(urlencodedMock).toHaveBeenCalledWith({ limit: '50mb', extended: true });
    expect(useSpy.mock.calls[0][0].toString()).toEqual(helmet().toString());
    expect(useSpy.mock.calls[1][0].toString()).toEqual(fileUpload().toString());
    expect(useSpy.mock.calls[8][0]).toEqual(requestDetails);
  });

  it('should load routes', () => {
    const routerSpy = jest.fn();
    express.Router = routerSpy;
    app.loadRoutes(routerSpy());
    expect(useSpy.mock.calls[9][0]).toEqual(routerSpy());
  });

  it('should load middlewares', () => {
    const middleware = jest.fn();
    app.loadMiddleware([middleware]);
    expect(useSpy.mock.calls[10][0]).toEqual(middleware);
  });
});
