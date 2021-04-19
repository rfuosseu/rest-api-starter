import path from 'path';
import App from '../app';

const port = 3000;

const server: App = new App(port, 'SERVER_TEST');
server.registerControllers('api', path.dirname(__dirname)).then(() => server.start());
