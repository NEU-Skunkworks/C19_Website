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
const sendEmail = (from, to, subject, body, res,FILE_NAME) => {
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      host: emailConstants.emailconstants.HOST,
      port: emailConstants.emailconstants.PORT,
      secure: emailConstants.emailconstants.SECURE,
      auth: {
        user: emailConstants.emailconstants.USER,
        pass: emailConstants.emailconstants.PASSWORD
      }
    })

    let mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: body
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        CONSTANTS.createLogMessage(FILE_NAME, 'Error in Sending Email', 'ERROR')
        //Send the response
        res.status(CONSTANTS.ERROR_CODE.FAILED)
        res.json({ message: 'Error in sending email' })
        res.end()
      } else {
        CONSTANTS.createLogMessage(FILE_NAME, 'Email Sent successfully', 'SUCCESS')
        //Send the response
        res.status(CONSTANTS.ERROR_CODE.SUCCESS)
        res.json({ message: 'Email Successfully sent' })
        res.end()
      }
    })
  })
}

module.exports = { sendEmail }
