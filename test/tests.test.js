/* eslint-disable no-underscore-dangle */
import chaihttp from 'chai-http';
import chai, { expect } from 'chai';
import { CREATED, OK } from 'http-status';

import app from '../src/index';
import dummyData from './data.dummy';
import userHelper from '../src/helpers/userHelper';
import sessionHelper from '../src/helpers/sessionHelper';

let data;
let createdUsersession;

chai.use(chaihttp);
const router = () => chai.request(app);

describe('TEST REGISTER USER API', async () => {
  it('User should be able to create his/her account', (done) => {
    router()
      .post('/api/auth/register-user')
      .send(dummyData[0])
      .end((error, response) => {
        data = response.body.data;
        expect(response).to.have.status(CREATED);
        expect(response.body.message).to.be.a('string');
        expect(response.body.data).to.be.a('object');
        done(error);
      });
  });
});

describe('TEST RESEND LINK API', async () => {
  it('User should be able to request a verification link', (done) => {
    router()
      .post(`/api/auth/resend-verification-link`)
      .send({ email: dummyData[0].email })
      .end((error, response) => {
        expect(response).to.have.status(OK);
        expect(response.body).to.be.a('object');
        expect(response.body.message).to.be.a('string');
        done(error);
      });
  });
});

describe('TEST VERIFY USER API', async () => {
  before(async () => { createdUsersession = await sessionHelper.generateSession(data._id, data.email, false); });

  it('User should be able to verify his/her account', (done) => {
    router()
      .get(`/api/auth/verify-user-account/${createdUsersession}`)
      .end((error, response) => {
        expect(response).to.have.status(OK);
        expect(response.body.message).to.be.a('string');
        done(error);
      });
  });
});

describe('TEST LOGIN USER API', async () => {
  it('User should be able to login into his/her account', (done) => {
    router()
      .post('/api/auth/login-user')
      .send({ email: data.email, password: dummyData[0].password })
      .end((error, response) => {
        data = response.body.data;
        expect(response).to.have.status(OK);
        expect(response.body.message).to.be.a('string');
        done(error);
      });
  });
});

describe('UPLOAD IMAGE API', async () => {
  it('LoggedIn user should be able to upload image', (done) => {
    router()
      .patch(`/api/auth/upload-image`)
      .set('session', data.session)
      .attach('image', `${__dirname}/./files/image.png`)
      .end((error, response) => {
        expect(response).to.have.status(OK);
        expect(response.body.message).to.be.a('string');
        expect(response.body.data).to.be.a('object');
        done(error);
      });
  });
});

describe('TEST LOGOUT USER API', async () => {
  after(async () => { await userHelper.removeUser(data._id); });

  it('Logged-in user should be able to loggout from his/her account', (done) => {
    router()
      .get('/api/auth/logout-user')
      .set('session', data.session)
      .end((error, response) => {
        expect(response).to.have.status(OK);
        expect(response.body.message).to.be.a('string');
        done(error);
      });
  });
});
