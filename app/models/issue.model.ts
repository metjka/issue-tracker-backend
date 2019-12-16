import {interfaces} from 'inversify';
import {Connection, Document, Model, Schema} from 'mongoose';
import TYPES from '../container/types';

export enum IssueStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  CLOSED = 'CLOSED',
}

const issueSchema = new Schema({
  title: {type: String},
  description: {type: String},
  status: {type: String, required: true, default: IssueStatus.OPEN},
}, {
  timestamps: true,
});

export interface IIssue {
  _id: string;
  title: string;
  description: string;
  status: IssueStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type IIssueModel = Document & IIssue;

export function exportUserModel(context: interfaces.Context): Model<IIssueModel> {
  const mc: Connection = context.container.get(TYPES.MongoConnection);
  return mc.model<IIssueModel>('Issue', issueSchema);
}
