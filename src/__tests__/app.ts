import express from 'express';
import ApiController from './api.controller';
import requestDetails from '../middleware';
import App from '../app';

const app = express();
const port = 3000;

const api = new ApiController();
app.use(requestDetails);
app.get('/', (req, res) => res.send('Hello World!'));
app.use(api.basePath, api.router);

// app.use((req, res, next) => {
//   next(new Error('merde'));
// });
// app.use((_err: any, _req: any, _res: any) => {
//   _res.status(500).send('Something broke!');
// });
// app.listen(port, () => console.log(`Example app listening on port port!`));

const server: App = new App(port, 'SERVER_TEST');
server.loadRoutes(app);
server.start();
