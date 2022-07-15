const fs = require('fs');
const request = require('supertest');
const { createApp } = require('../src/createApp.js');
const Session = require('../src/session.js');

describe('Static end points', () => {
  let mockedConfig, app;

  beforeEach(() => {
    mockedConfig = {
      template: './test/data/guestBook.html',
      dbFile: './test/data/comments.json'
    };

    app = createApp(mockedConfig, new Session());
  })

  it('Should return 200 status code when tried visit /.', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('content-type', /html/)
      .expect(fs.readFileSync('./public/index.html', 'utf-8'), done);
  });

  it('Should redirect to login page when tried visit /guestbook.', (done) => {
    request(app)
      .get('/guestbook')
      .expect(302)
      .expect('location', /login/, done);
  });

  it('Should give 200 when tried visit /abelio.', (done) => {
    request(app)
      .get('/abelio')
      .expect(200)
      .expect('content-type', /html/, done);
  });

  it('Should give 200 when tried visit /ageratum.', (done) => {
    request(app)
      .get('/ageratum')
      .expect(200)
      .expect('content-type', /html/, done);
  });

  it('Should give 404 when tried visit /unknown.', (done) => {
    request(app)
      .get('/unknown')
      .expect(404)
      .expect('content-type', /html/, done);
  });
});