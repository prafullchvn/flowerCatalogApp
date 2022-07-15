const assert = require('assert');
const fs = require('fs');
const request = require('supertest');

const { createApp } = require('../src/createApp.js');
const Session = require('../src/session.js');

describe('/guestbook', () => {
  let mockedConfig;
  beforeEach(() => {
    mockedConfig = {
      template: './test/data/guestBook.html',
      dbFile: './test/data/comments.json'
    };
  })
  after(() => {

    const defaultData = JSON.stringify({ comments: [], id: 0 });
    fs.writeFileSync(mockedConfig.dbFile, defaultData, 'utf8');
  });

  it('Should give the guestbook if valid cookie is sent.', (done) => {
    const mockFs = {
      readFileSync: (file) => {
        assert.strictEqual(file, mockedConfig.dbFile);
        return JSON.stringify({ comments: [], latestId: 0 });
      },
      writeFileSync: () => { }
    }

    const session = new Session();
    const sessionId = session.addData({ username: 'root', password: 'root' });
    const app = createApp(mockedConfig, session, mockFs);


    request(app)
      .get('/guestbook')
      .set('Cookie', `userSessionId=${sessionId}`)
      .expect(200, done);
  });
});

describe('/signup', () => {
  let app, mockedConfig, mockFs;

  beforeEach(() => {
    mockedConfig = {
      template: './test/data/guestBook.html',
      dbFile: './test/data/comments.json'
    };

    mockFs = {
      readFileSync: (file) => {
        return JSON.stringify({ comments: [], latestId: 0 });
      },
      writeFileSync: () => { }
    }

    app = createApp(mockedConfig, new Session(), mockFs);
  });

  it('Should give 200 when tried visit /signup.', (done) => {
    request(app)
      .get('/signup')
      .expect(200)
      .expect(new RegExp('<title>Sign up</title>'))
      .expect('content-type', /html/, done);
  });

  it('Should redirect to guestbook if valid username and password is passed when tried to signup',
    (done) => {
      request(app)
        .post('/signup')
        .send('username=prafull&password=abc123')
        .expect(302)
        .expect('Location', '/guestbook', done)
    });

  it('Should redirect to signup if no password is sent.',
    (done) => {
      request(app)
        .post('/signup')
        .send('username=prafull')
        .expect(400)
        .expect(/enter valid credentials/, done)
    });


  it('Should redirect to guestbook if user is already logged in, when tried to sign up.',
    (done) => {
      const session = new Session();
      const sessionId = session.addData({ username: 'root', password: 'root' });
      const app = createApp(mockedConfig, session, mockFs);

      request(app)
        .get('/login')
        .set('Cookie', `userSessionId=${sessionId}`)
        .expect(302, done)
    });
});

describe('/login', () => {
  let app, mockedConfig, mockFs;

  beforeEach(() => {
    mockedConfig = {
      template: './test/data/guestBook.html',
      dbFile: './test/data/comments.json'
    };

    mockFs = {
      readFileSync: (file) => {
        return JSON.stringify({ comments: [], latestId: 0 });
      },
      writeFileSync: () => { }
    };

    app = createApp(mockedConfig, new Session(), mockFs);
  });

  it('Should redirect to guestbook if valid username and password is passed when tried to login',
    (done) => {
      request(app)
        .post('/login')
        .send('username=root&password=root')
        .expect(302)
        .expect('set-cookie', /userSessionId/)
        .expect('Location', '/guestbook', done)
    });

  it('Should go back to login if invalid username and password is passed when tried to login',
    (done) => {
      request(app)
        .post('/login')
        .send('username=root&password=root123')
        .expect(422)
        .expect('content-type', /html/)
        .expect(/invalid credentials/i, done)
    });


  it('Should give 200 when tried visit /login.', (done) => {
    request(app)
      .get('/login')
      .expect(200)
      .expect(new RegExp('<title>Login</title>'))
      .expect('content-type', /html/, done);
  });


  it('Should redirect to guestbook if user is already logged in, when tried to login.', (done) => {
    const session = new Session();
    const sessionId = session.addData({ username: 'root', password: 'root' });
    const app = createApp(mockedConfig, session, mockFs);

    request(app)
      .get('/login')
      .set('Cookie', `userSessionId=${sessionId}`)
      .expect(302, done)
  });
});

describe('guestbook api', () => {
  let mockFs, mockedConfig;

  beforeEach(() => {
    mockedConfig = {
      template: './test/data/guestBook.html',
      dbFile: './test/data/comments.json'
    };

    mockFs = {
      readFileSync: (file) => {
        console.log(file)
        assert.strictEqual(file, mockedConfig.dbFile);
        return JSON.stringify({ comments: [], latestId: 0 });
      },
      writeFileSync: (file) => {
        assert.strictEqual(file, mockedConfig.dbFile);
      }
    }
  });

  after(() => {
    const defaultData = JSON.stringify({ comments: [], id: 0 });
    fs.writeFileSync(mockedConfig.dbFile, defaultData, 'utf8');
  });

  it('Should add comment.', (done) => {
    const session = new Session();
    const sessionId = session.addData({ username: 'root', password: 'root' });
    const app = createApp(mockedConfig, session, mockFs);

    request(app)
      .post('/register-comment-api')
      .send('comment=newComment')
      .set('Cookie', `userSessionId=${sessionId}`)
      .expect(200, done);
  });

  it('Should not add empty comment.', (done) => {
    const session = new Session();
    const sessionId = session.addData({ username: 'root', password: 'root' });
    const app = createApp(mockedConfig, session, mockFs);

    request(app)
      .post('/register-comment-api')
      .send('comment=')
      .set('Cookie', `userSessionId=${sessionId}`)
      .expect(400, done);
  });
});

describe('/logout', () => {
  let mockedConfig, sessionId, app, mockFs;

  beforeEach(() => {
    mockedConfig = mockedConfig = {
      template: './test/data/guestBook.html',
      dbFile: './test/data/comments.json'
    };

    mockFs = {
      readFileSync: (file) => {
        return JSON.stringify({ comments: [], latestId: 0 });
      },
      writeFileSync: () => { }
    }

    const session = new Session();
    sessionId = session.addData({ username: 'root', password: 'root' });
    app = createApp(mockedConfig, session, mockFs);
  });

  it('Should return 302 response if user is logged in.', (done) => {
    request(app)
      .get('/logout')
      .set('Cookie', `userSessionId=${sessionId}`)
      .expect(302)
      .expect('Set-cookie', new RegExp('Expires=Thu, 01 Jan 1970 00:00:00 GMT'))
      .expect('location', '/login', done)
  });

  it('Should return 400 response if user is not logged in.', (done) => {
    const app = createApp(mockedConfig, new Session(), mockFs);

    request(app)
      .get('/logout')
      .expect(400)
      .expect('No user have logged in', done);
  });
});