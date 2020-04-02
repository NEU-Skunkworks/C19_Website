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
//import login constants
const loginMiddleware=require('../../middleware/loginMiddleware')

const addnewUser = (
  res,
  next,
  schema,
  searchcriteria,
  FILE_NAME,
  password,
  data,
  type
) => {
  loginMiddleware
    .checkifDataExists(schema, searchcriteria, FILE_NAME)
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
          if (type === 'Volunteer') {
            data.vpassword = hash
          } else if (type === 'Researcher') {
            data.rpassword = hash
          }
          //Save the data
          mongooseMiddleware.addNewData(data, res, next, FILE_NAME)
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
