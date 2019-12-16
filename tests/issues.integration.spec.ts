import 'mocha';
import {expect} from 'chai';
import app from "../app/app";
import {agent, SuperTest, Test} from 'supertest';
import {IIssue, IssueStatus} from "../app/models/issue.model";

describe('Issue integration test', () => {
  let api: SuperTest<Test>;
  before(() => {
    api = agent(app);
  });

  it('should create new issue', async () => {
    const response = await api.post('/api/issues')
        .send({description: 'desc', title: 'title'} as IIssue);
    expect(response.status).to.be.eq(201);
    expect(response.body.title).to.be.eq('title');
    expect(response.body.description).to.be.eq('desc');
    expect(response.body.status).to.be.eq(IssueStatus.OPEN);
  });

  it('should fail to create new issue without a title', async () => {
    const response = await api.post('/api/issues')
        .send({description: 'desc'} as IIssue);
    expect(response.status).to.be.eq(400);
  });

  it('should fail to create new issue without a description', async () => {
    const response = await api.post('/api/issues')
        .send({description: 'desc'} as IIssue);
    expect(response.status).to.be.eq(400);
  });

  it('should get all issues', async () => {
    const response = await api.get('/api/issues').send();
    expect(response.status).to.be.eq(200);
    expect(response.body).to.be.an.instanceof(Array);
  });

  it('should update issue', async () => {
    const response = await api.post('/api/issues')
        .send({description: 'desc2', title: 'title2'} as IIssue);
    expect(response.status).to.be.eq(201);

    const updatedIssue = await api.put(`/api/issues/${response.body._id}`)
        .send({title: 'new title', description: 'new description'});
    expect(updatedIssue.status).to.be.eq(200);
    expect(updatedIssue.body.title).to.be.eq('new title');
    expect(updatedIssue.body.description).to.be.eq('new description');
  });

  it('should change status', async () => {
    const response = await api.post('/api/issues')
        .send({description: 'desc2', title: 'title2'} as IIssue);
    expect(response.status).to.be.eq(201);

    const updatedIssue = await api.put(`/api/issues/${response.body._id}`)
        .send({status: IssueStatus.PENDING});
    expect(updatedIssue.status).to.be.eq(200);
    expect(updatedIssue.body.status).to.be.eq(IssueStatus.PENDING);
  });

  it(`should fail to change status from ${IssueStatus.OPEN} to ${IssueStatus.CLOSED}`, async () => {
    const response = await api.post('/api/issues')
        .send({description: 'desc2', title: 'title2'} as IIssue);
    expect(response.status).to.be.eq(201);

    const updatedIssue = await api.put(`/api/issues/${response.body._id}`)
        .send({status: IssueStatus.CLOSED});
    expect(updatedIssue.status).to.be.eq(409);
  });
});
