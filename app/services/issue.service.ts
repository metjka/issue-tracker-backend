import {inject, injectable} from 'inversify';
import {ObjectId} from 'bson';
import TYPES from '../container/types';
import {Model} from 'mongoose';
import {IIssue, IIssueModel, IssueStatus} from '../models/issue.model';
import {ClientError} from '../utils/request.utils';

@injectable()
export class IssueService {

  constructor(@inject(TYPES.IssueModel) private issueModel: Model<IIssueModel>) {
  }

  public async getIssues(): Promise<IIssueModel[]> {
    const models = await this.issueModel.find().exec();
    return models.map(it => it.toJSON());
  }

  public async getIssueById(issueId: ObjectId): Promise<IIssue> {
    const issueModel = await this.issueModel.findById(issueId).exec();
    if (!issueModel) {
      throw new ClientError(`Cant find issue with id ${issueId}`, 404);
    }
    return issueModel.toJSON();
  }

  public async updateIssue(issueId: ObjectId, changes: Partial<IIssue>): Promise<IIssue> {
    const model = await this.issueModel.findById(issueId).exec();
    if (!model) {
      throw new ClientError(`Cant find issue with id ${issueId}`, 404);
    }

    if (changes.status && model.status !== changes.status) {
      if (IssueService.isIssueStatusChangeAllowed(model, changes.status)) {
        model.status = changes.status;
      } else {
        throw new ClientError(`Can't change status of issue from ${model.status} -> ${changes.status}`, 409);
      }
    }
    delete changes.status;
    model.set(changes);
    const savedModel = await model.save();
    return savedModel.toJSON();
  }

  public async create(newIssue: Partial<IIssue>): Promise<IIssue> {
    const issueModel = new this.issueModel(newIssue);
    const savedIssueModel = await issueModel.save();
    return savedIssueModel.toJSON();
  }

  public async delete(issueId: ObjectId): Promise<void> {
    const deletedModel = await this.issueModel.findByIdAndDelete(issueId).exec();
    if (!deletedModel) {
      throw new ClientError(`Can't delete issue with id ${issueId}`, 404);
    }
  }

  private static isIssueStatusChangeAllowed(issue: IIssueModel, changedStatus: IssueStatus) {
    if (issue.status === changedStatus) {
      return true
    }
    switch (issue.status) {
      case IssueStatus.OPEN:
        return changedStatus === IssueStatus.PENDING;
      case IssueStatus.PENDING:
        return changedStatus === IssueStatus.CLOSED;
      case IssueStatus.CLOSED:
        return false;
      default:
        return false;
    }
  }
}
