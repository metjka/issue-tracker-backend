import {Container} from 'inversify';
import {MongoConnection} from '../db/mongo.connection';
import {exportUserModel} from '../models/issue.model';
import {IssueService} from '../services/issue.service';
import TYPES from './types';

const config = require('../../config.local.json');

const container = new Container({defaultScope: 'Request'});

container.bind(TYPES.Config).toConstantValue(config);

container.bind(TYPES.MongoConnection).toConstantValue(new MongoConnection(config).getConnection());
container.bind(TYPES.IssueModel).toDynamicValue(exportUserModel).inSingletonScope();
container.bind(TYPES.IssueService).to(IssueService);

export default container;
