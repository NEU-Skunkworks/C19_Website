/**
 * @file loginController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/31/2020
 */

//importing jwt token to assign to the user once authenticated
const jwt = require('jsonwebtoken')
//import constants file
const CONSTANTS = require('../CONSTANTS/constants')
//import mongoose queries
const mongooseQueries = require('../CONSTANTS/mongooseQueries')
//importing bcrypt to hash the user entered password for security.
const bcrypt = require('bcrypt')

//Authentication Function
const loginAuthentication = (
  schema,
  req,
  res,
  next,
  email,
  password,
  FILE_NAME,
  privateKEY,
  type
) => {
  try {
    //Check the type of user to be authenticated
    if (type === 'Volunteer') {
      var search = { vemail: email }
    } else if (type === 'Researcher') {
      var search = { remail: email }
    }
    schema.findOne(search, (err, result) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        )
      }
      //If the researcher does not exist.
      if (!result) {
        //Error
        CONSTANTS.createLogMessage(FILE_NAME, 'Invalid email/username', 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.LOGINERROR,
          next
        )
      } else if (result.loginAttempts === 3) {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          'Too many login attempts',
          'ERROR'
        )
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.BAD_REQUEST,
          CONSTANTS.ERROR_DESCRIPTION.ATTEMPTERROR,
          next
        )
      } else {
        //If the researcher exists then compare their password entered with the password in the database
        if (type === 'Volunteer') {
          var pwd = result.vpassword.toString()
        } else if (type === 'Researcher') {
          var pwd = result.rpassword.toString
        }
        bcrypt.compare(password, pwd.toString(), function (err, match) {
          if (err) {
            CONSTANTS.createLogMessage(FILE_NAME, 'Server Error', 'ERROR')
            CONSTANTS.createResponseWithoutNext(
              res,
              CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
              err.errmsg
            )
          }
          //If password same create the json web token.
          if (match == true) {
            if (type === 'Volunteer') {
              var searchCriteria = { vemail: req.body.vemail }
            } else if (type === 'Researcher') {
              var searchCriteria = { remail: req.body.remail }
            }

            var data = { $set: { loginAttempts: 0 } }
            mongooseQueries.updateOne(
              schema,
              req,
              res,
              next,
              FILE_NAME,
              searchCriteria,
              data
            )
            var payload = {
              id: result._id.toString()
            }
            var token = jwt.sign(payload, privateKEY, CONSTANTS.signOptions)
            //return the token
            CONSTANTS.createLogMessage(FILE_NAME, 'Token Generated', 'SUCCESS')
            var responsedata = {
              token: token,
              userid: result._id
            }
            CONSTANTS.createResponseWithoutNext(
              res,
              CONSTANTS.ERROR_CODE.SUCCESS,
              responsedata
            )
          } else {
            if (type === 'Volunteer') {
              var searchCriteria = { vemail: req.body.vemail }
            } else if (type === 'Researcher') {
              var searchCriteria = { remail: req.body.remail }
            }
            var data = { $inc: { loginAttempts: 1 } }
            mongooseQueries.updateOne(
              schema,
              req,
              res,
              next,
              FILE_NAME,
              searchCriteria,
              data
            )
            //error
            CONSTANTS.createLogMessage(
              FILE_NAME,
              'Invalid Email/Password',
              'ERROR'
            )
            CONSTANTS.createResponseWithoutNext(
              res,
              CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
              CONSTANTS.ERROR_DESCRIPTION.LOGINERROR
            )
          }
        })
      }
    })
  } catch (Exception) {}
}

module.exports = { loginAuthentication }
