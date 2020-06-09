/**
 * @file emailMiddleware.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 04/03/2020
 */

//import constants file
const CONSTANTS = require('../CONSTANTS/constants')
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk')
// Set the region
AWS.config.update({ region: 'us-east-1' })
//Function to send the email
function sendEmail (from, to, subject, message, res, FILE_NAME) {
  // Create sendEmail params
  var eParams = {
    Destination: {
      /* required */
      ToAddresses: [
        to
        /* more items */
      ]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: createBody(message)
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: from /* required */
  }
  // Create the promise and SES service object
  var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' })
    .sendEmail(eParams)
    .promise()

  // Handle promise's fulfilled/rejected states
  sendPromise
    .then(function (data) {
      CONSTANTS.createLogMessage(FILE_NAME, data, 'SUCCESS')
      //Send the response
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({ message: 'Email Successfully sent' })
      res.end()
    })
    .catch(function (err) {
      CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
      //Send the response
      res.status(CONSTANTS.ERROR_CODE.FAILED)
      res.json({ message: 'Error in sending email' })
      res.end()
    })
}
// Create sendEmail params
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
