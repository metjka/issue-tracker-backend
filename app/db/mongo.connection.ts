import 'reflect-metadata';

import {connect, Connection, connection, Mongoose} from 'mongoose'
import {IConfig} from "../utils/interfaces";
import * as mongoose from "mongoose";
import TYPES from "../container/types";
import {inject, injectable} from "inversify";


@injectable()
export class MongoConnection {

  private client: Mongoose;
  private readonly connection: Connection;

  constructor(@inject(TYPES.Config) private config: IConfig) {
    // tslint:disable-next-line:max-line-length
    const uri = `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DB_NAME}?compressors=zlib`;
    this.client = mongoose;
    this.client.connect(uri, {useNewUrlParser: true, useCreateIndex: true});
    this.connection = this.client.connection;
    this.connection.on('error', (err) => {
      console.log('Error uncured!' + JSON.stringify(err));
      process.exit(1);
    });
    this.connection.once('open', () => console.info(`Connected to Mongo`));

  }

  public getConnection(): Connection {
    return this.connection;
  }
}

