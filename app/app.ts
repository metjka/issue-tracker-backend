import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import {InversifyExpressServer} from 'inversify-express-utils';
import container from './container/container';
import TYPES from './container/types';
import './controllers/issues.controller';
import {IConfig} from './utils/interfaces';
import {errorHandler} from './utils/request.utils';

const server = new InversifyExpressServer(container, null, {rootPath: '/api'}, null);

const config: IConfig = container.get(TYPES.Config);
server.setConfig((appToConfig) => {
  appToConfig.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  appToConfig.use(bodyParser.urlencoded({extended: true}));
  appToConfig.use(bodyParser.json());
});
server.setErrorConfig(errorHandler);

const app = server.build();

const instance = app.listen(config.PORT, (err) => {
  if (err) {
    console.log(`Error occurred: ${err}`);
  }
  console.log(`Server started on port ${config.PORT} :)`);
});
export default app;
