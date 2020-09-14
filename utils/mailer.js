const nodemailer = require("nodemailer");
const _ = require("lodash");

// const config = {

// };

// const transporter = nodemailer.createTransport(config);

// const defaultMail = {
//   from: "no-reply@task-tracker.com",
//   text: "default text",
// };

// module.exports = function (mail) {
//   transporter.sendMail(mail, (error, info) => {
//     //use default settings
//     mail = _.merge({}, defaultMail, mail);
//     if (error) return console.log(error);
//     console.log("mail sent: ", info.response);
//   });
// };
const mailer = async () => {
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

module.exports = mailer;
