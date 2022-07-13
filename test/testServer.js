const fs = require('fs');
const assert = require('assert');
const request = require('supertest');
const { createHandler } = require('server-using-http-module');

const { setRoutes } = require('../src/router/routes.js');
const Session = require('../src/session.js');

describe('App test', () => {
  const mockedConfig = {
    template: './src/resource/guestBook.html',
    dbFile: './src/resource/comments.json'
  };

  const router = setRoutes(mockedConfig);

  it('Should return 200 status code.', (done) => {
    request(createHandler(router))
      .get('/')
      .expect(200)
      .expect('content-type', /html/)
      .expect(fs.readFileSync('./public/index.html', 'utf-8'), done);
  });

  it('Should redirect to login page when tried visit /guestbook.', (done) => {
    request(createHandler(router))
      .get('/guestbook')
      .expect(302)
      .expect('location', /login/, done);
  });

  it('Should give 200 when tried visit /abelio.', (done) => {
    request(createHandler(router))
      .get('/abelio')
      .expect(200)
      .expect('content-type', /html/, done);
  });

  it('Should give 200 when tried visit /ageratum.', (done) => {
    request(createHandler(router))
      .get('/ageratum')
      .expect(200)
      .expect('content-type', /html/, done);
  });

  it('Should give 200 when tried visit /login.', (done) => {
    request(createHandler(router))
      .get('/login')
      .expect(200)
      .expect(new RegExp('<title>Login</title>'))
      .expect('content-type', /html/, done);
  });

  it('Should give 200 when tried visit /signup.', (done) => {
    request(createHandler(router))
      .get('/signup')
      .expect(200)
      .expect(new RegExp('<title>Sign up</title>'))
      .expect('content-type', /html/, done);
  });

  it('Should give the guestbook if valid cookie is sent.', (done) => {
    const router = setRoutes(mockedConfig);
    const session = new Session();

    const sessionId = session.addData('prafull', 'abc123');

    router.addMiddleware((req, res) => {
      req.session = session;
      req.user = req.session.getSession(sessionId);
    });

    request(createHandler(router))
      .get('/guestbook')
      .set('Cookie', `sessionId=${sessionId}`)
      .expect(200, done)
  });

  it('Should redirect to guestbook if user is already logged in when tried to login.', (done) => {
    const router = setRoutes(mockedConfig);
    const session = new Session();

    const sessionId = session.addData('prafull', 'abc123');

    router.addMiddleware((req, res) => {
      req.session = session;
      req.user = req.session.getSession(sessionId);
    });

    request(createHandler(router))
      .get('/login')
      .set('Cookie', `sessionId=${sessionId}`)
      .expect(302, done)
  });

  it(
    'Should redirect to guestbook if user is already logged in when tried to sign up.',
    (done) => {
      const router = setRoutes(mockedConfig);
      const session = new Session();

      const sessionId = session.addData('prafull', 'abc123');

      router.addMiddleware((req, res) => {
        req.session = session;
        req.user = req.session.getSession(sessionId);
      });

      request(createHandler(router))
        .get('/login')
        .set('Cookie', `sessionId=${sessionId}`)
        .expect(302, done)
    });

  it('Should redirect to guestbook if valid username and password is passed when tried to login',
    (done) => {
      request(createHandler(router))
        .post('/login')
        .send('username=root&password=root')
        .expect(302)
        .expect('Location', '/guestbook', done)
    });

  it('Should redirect to guestbook if valid username and password is passed when tried to signup',
    (done) => {
      request(createHandler(router))
        .post('/signup')
        .send('username=prafull&password=abc123')
        .expect(302)
        .expect('Location', '/guestbook', done)
    });
});