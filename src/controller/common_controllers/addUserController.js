/**
 * @file addUserController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 04/01/2020
 */

//importing bcrypt to hash the user entered password for security.
const bcrypt = require('bcrypt')
//import constants file
const CONSTANTS = require('../../CONSTANTS/constants')
//import mongoose queries
const mongooseMiddleware = require('../../middleware/mongooseMiddleware')
//import login middleware
const loginMiddleware = require('../../middleware/loginMiddleware')
//import email middleware
const emailMiddleware = require('../../middleware/emailMiddleware')

const addnewUser = (
  req,
  res,
  next,
  schema,
  searchcriteria,
  FILE_NAME,
  password,
  data
) => {
  loginMiddleware
    .checkifDataExists(schema, req, res, next, searchcriteria, FILE_NAME)
    .then(result => {
      if (result === null) {
        //Encrypt the password
        bcrypt.hash(password, 10, (err, hash) => {
          //Error
          if (err) {
            //Add data to the logger file
            CONSTANTS.createLogMessage(FILE_NAME, err, 'Error')
            //send back the json response
            CONSTANTS.createResponses(
              res,
              CONSTANTS.ERROR_CODE.FAILED,
              err.errmsg,
              next
            )
          }
          data.password = hash
          //Save the data
          mongooseMiddleware.addNewUser(data, FILE_NAME).then(result => {
            if (result != undefined && result != null) {             
              var link =
                '"http://' +
                req.hostname +
                ':3000/dev/email/confirmEmail/' +
                result._id +
                '"'
              var message =
                '<p>You have successfully registered to our website as a ' +
                result.type +
                '. Please click the link below to confirm your email<p><br><br>' +
                emailMiddleware.createEmailAuthenticationMail(link)
              emailMiddleware.sendEmail(
                'admin@skunks.ai',
                result.email,
                'Welcome to NEU SKUNKWORKS',
                message,
                res,
                FILE_NAME
              )
            }
          })
        })
      } else {
        //Create the log message
        CONSTANTS.createLogMessage(FILE_NAME, 'User already exists', 'ERROR')
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.BAD_REQUEST,
          'User already exists',
          next
        )
      }
    })
}
module.exports = { addnewUser }
