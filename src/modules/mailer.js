const nodemailer = require('nodemailer');
const mailConfifg = require('../config/mail.json');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const transport = nodemailer.createTransport({
    host: mailConfifg.host,
    port: mailConfifg.port,
    auth: {
        user: mailConfifg.user,
        pass: mailConfifg.pass
    }
});

transport.use('compile', hbs({
    viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve('./src/resources/mail/')
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
}));

module.exports = transport;