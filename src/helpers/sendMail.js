const nodemailer = require('nodemailer')

const { EMAIL_SERVER, EMAIL_PASS } = process.env

exports.sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    ignoreTLS: false,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL_SERVER, // generated ethereal user
      pass: EMAIL_PASS // generated ethereal password
    }
  })
  const options = {
    from: "'Baceo Talk' <kangojoltampan@gmail.com>",
    to: data.email,
    subject: data.subject,
    html: data.html
  }
  await transporter.sendMail(options, (err, info) => {
    if (err) console.log(err, info)
    console.log('Data sukses di kirim ke email tujuan')
  })
}
