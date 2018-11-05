
//var setKey = Environment.SetEnvironmentVariable("SENDGRID_API_KEY", "Obvzd3k1RMC9BAWoXuz5BQ.4gtEIn1QPMe2zGhJKwOflGBJgFuttGQpBbi4lzzFR_Y");
//var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
const sgMail = require('@sendgrid/mail');
//setx SENDGRID_API_KEY "Obvzd3k1RMC9BAWoXuz5BQ.4gtEIn1QPMe2zGhJKwOflGBJgFuttGQpBbi4lzzFR_Y"
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'erlan.neo@gmail.com',
  from: 'erlan.neo@gmail.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);
//Obvzd3k1RMC9BAWoXuz5BQ.4gtEIn1QPMe2zGhJKwOflGBJgFuttGQpBbi4lzzFR_Y
//echo "export SENDGRID_API_KEY='Obvzd3k1RMC9BAWoXuz5BQ.4gtEIn1QPMe2zGhJKwOflGBJgFuttGQpBbi4lzzFR_Y'" > sendgrid.env
//echo "sendgrid.env" >> .gitignore
//source ./sendgrid.env