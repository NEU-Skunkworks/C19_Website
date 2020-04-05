/**
 * @file emailMiddleware.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 04/03/2020
 */

//importing file system to get the public and private key for creating public and private keys.
const fs = require('fs')
//importing the email constants
const emailConstants = require('../../.env/emailConstants/emailConstants')
//importing nodemailer
const nodemailer = require('nodemailer')
//import constants file
const CONSTANTS = require('../CONSTANTS/constants')

//Function to send the email
const sendEmail = (from, to, subject, message, res, FILE_NAME) => {
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      host:emailConstants.emailconstants.HOST,
      port:emailConstants.emailconstants.PORT,
      secure:emailConstants.emailconstants.SECURE,
      auth: {
        user: emailConstants.emailconstants.USER,
        pass: emailConstants.emailconstants.PASSWORD
      }
    })

    let mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: createBody(message)
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        CONSTANTS.createLogMessage(FILE_NAME, error, 'ERROR')
        //Send the response
        res.status(CONSTANTS.ERROR_CODE.FAILED)
        res.json({ message: 'Error in sending email' })
        res.end()
      } else {
        CONSTANTS.createLogMessage(FILE_NAME, info, 'SUCCESS')
        //Send the response
        res.status(CONSTANTS.ERROR_CODE.SUCCESS)
        res.json({ message: 'Email Successfully sent' })
        res.end()
      }
    })
  })
}

const createBody = message => {
  var htmlBody =
    `<!DOCTYPE html>
      <head>
      <style>
        input[type=submit]{
          font-weight: 400;
          color: #007bff;
          text-decoration: none;
          cursor: pointer;
          margin-top: .25rem;
          margin-bottom: .25rem;
          display: inline-block;
          background-color: transparent;
          border: 1px solid transparent;
          padding: .375rem .75rem;
          font-size: 1rem;
          line-height: 1.5;
          border-radius: .25rem;
        }
    </style>
    </head>
    <body>` +
         message +
    `</body>
    </html>`
  return htmlBody
}

const createEmailAuthenticationMail = link => {
  const createEmail =
    '<form action=' +
    link +
    " method='POST'>" +
    "<button type='submit'>Click Here to confirm your email</button" +
    '</form>'
  return createEmail
}

module.exports = { sendEmail, createEmailAuthenticationMail }
