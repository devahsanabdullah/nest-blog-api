export default {
  db: {
    user: null,
    pass: null,
    host: 'localhost',
    port: '27017',
    database: 'testdb',
    authSource: null,
  },
  host: {
    url: 'http://localhost',
    port: '3000',
  },
  jwt: {
    secretOrKey: 'secret',
    expiresIn: 36000000,
  },
  mail: {
    host: 'sandbox.smtp.mailtrap.io',
    port: '2525',
    secure: false,
    user: '56b326f87c1be9',
    pass: 'a4721981aada6c',
  },
};

//   MAIL_MAILER=smtp
//   MAIL_HOST=sandbox.smtp.mailtrap.io
//   MAIL_PORT=2525
//   MAIL_USERNAME=56b326f87c1be9
//   MAIL_PASSWORD=a4721981aada6c
