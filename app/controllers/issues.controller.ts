import {controller, httpGet, httpPost, httpPut, requestBody, requestParam, response} from 'inversify-express-utils';
import {inject} from 'inversify';
import TYPES from '../container/types';
import {IssueService} from '../services/issue.service';
import {Response} from 'express';
import {parseObjectId, validate} from '../utils/request.utils';
import {IIssue} from '../models/issue.model';
import {body} from 'express-validator';

@controller('/issues')
export class IssuesController {

  constructor(@inject(TYPES.IssueService) private issueService: IssueService) {
  }

  @httpGet('/')
  public async getAll(@response() res: Response) {
    const issues = await this.issueService.getIssues();
    return res.send(issues);
  }

  @httpGet('/:id([0-9a-f]{24})')
  public async getById(@response() res: Response,
                       @requestParam('id') rawIssueId: string) {
    const issueId = parseObjectId(rawIssueId);
    const issue = await this.issueService.getIssueById(issueId);
    return res.send(issue);
  }

  @httpPost('/', validate([
    body('title').exists({checkNull: true, checkFalsy: true}).isString().isLength({max: 1000}),
    body('description').exists({checkNull: true, checkFalsy: true}).isString().isLength({max: 1000}),
  ]))
  public async create(@response() res: Response,
                      @requestBody() newIssue: Partial<IIssue>) {
    const issue = await this.issueService.create(newIssue);
    return res.status(201).send(issue);
  }

  @httpPut('/:id([0-9a-f]{24})')
  public async update(@response() res: Response,
                      @requestParam('id') rawIssueId: string,
                      @requestBody() changes: Partial<IIssue>) {
    const issueId = parseObjectId(rawIssueId);
    const issue = await this.issueService.updateIssue(issueId, changes);
    return res.send(issue);
  }

  @httpPut('/:id([0-9a-f]{24})')
  public async delete(@response() res: Response,
                      @requestParam('id') rawIssueId: string) {
    const issueId = parseObjectId(rawIssueId);
    await this.issueService.delete(issueId);
    return res.status(200).send();
  }
}
