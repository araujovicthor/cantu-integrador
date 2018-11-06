const sgMail = require('@sendgrid/mail');
SENDGRID_API_KEY="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";
sgMail.setApiKey(SENDGRID_API_KEY);
const msg = {
  to: 'erlan.neo@gmail.com',
  from: 'test@example.com',
  subject: '22Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);
