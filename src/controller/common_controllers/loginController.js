/**
 * @file loginController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/31/2020
 */

//importing jwt token to assign to the user once authenticated
const jwt = require('jsonwebtoken')
//import constants file
const CONSTANTS = require('../../CONSTANTS/constants')
//importing bcrypt to hash the user entered password for security.
const bcrypt = require('bcrypt')
//import login constants
const loginMiddleware = require('../../middleware/loginMiddleware')

//Authentication Function
const loginAuthentication = (
  schema,
  req,
  res,
  next,
  password,
  FILE_NAME,
  privateKEY,
  type
) => {
  //Check the type of user to be authenticated
  var searchCriteria = { email: req.body.email }
  loginMiddleware
    .checkifDataExists(schema, req, res, next, searchCriteria, FILE_NAME)
    .then(result => {
      if (result === null) {
        //Error
        CONSTANTS.createLogMessage(FILE_NAME, 'Invalid email/username', 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.LOGINERROR,
          next
        )
      } else if (result !== null) {
        if (parseInt(result.loginAttempts) === 6) {
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
          var pwd = result.password.toString()
          bcrypt.compare(password, pwd.toString(), (err, match) => {
            if (err) {
              CONSTANTS.createLogMessage(FILE_NAME, 'Server Error', 'ERROR')
              CONSTANTS.createResponses(
                res,
                CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
                err.errmsg,
                next
              )
            }
            //If password same create the json web token.
            if (match === true) {
              var data = { $set: { loginAttempts: 0 } }
              loginMiddleware
                .updateDatainUser(schema, FILE_NAME, searchCriteria, data)
                .then(d => {
                  if (parseInt(d.n) === 1) {
                    var payload = {
                      id: result._id.toString()
                    }
                    var token = jwt.sign(
                      payload,
                      privateKEY,
                      CONSTANTS.signOptions
                    )
                    //return the token
                    CONSTANTS.createLogMessage(
                      FILE_NAME,
                      'Token Generated',
                      'SUCCESS'
                    )
                    var responsedata = {
                      token: token,
                      userid: result._id
                    }
                    CONSTANTS.createResponses(
                      res,
                      CONSTANTS.ERROR_CODE.SUCCESS,
                      responsedata,
                      next
                    )
                  } else {
                    CONSTANTS.createLogMessage(
                      FILE_NAME,
                      'Server Error',
                      'ERROR'
                    )
                    CONSTANTS.createResponses(
                      res,
                      CONSTANTS.ERROR_CODE.FAILED,
                      CONSTANTS.ERROR_DESCRIPTION.SERVERERROR,
                      next
                    )
                  }
                })
            } else {
              var data = { $inc: { loginAttempts: 1 } }
              loginMiddleware
                .updateDatainUser(schema, FILE_NAME, searchCriteria, data)
                .then(d => {
                  if (parseInt(d.n) === 1) {
                    CONSTANTS.createLogMessage(
                      FILE_NAME,
                      'Invalid email/password',
                      'ERROR'
                    )
                    CONSTANTS.createResponses(
                      res,
                      CONSTANTS.ERROR_CODE.SUCCESS,
                      CONSTANTS.ERROR_DESCRIPTION.LOGINERROR,
                      next
                    )
                  } else {
                    CONSTANTS.createLogMessage(
                      FILE_NAME,
                      'Server Error',
                      'ERROR'
                    )
                    CONSTANTS.createResponses(
                      res,
                      CONSTANTS.ERROR_CODE.FAILED,
                      CONSTANTS.ERROR_DESCRIPTION.SERVERERROR,
                      next
                    )
                  }
                })
            }
          })
        }
      }
    })
}

module.exports = { loginAuthentication }
