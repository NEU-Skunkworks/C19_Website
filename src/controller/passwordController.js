/**
 * @file passwordController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 04/04/2020
 */

const FILE_NAME = 'passwordController.js'
//import constants file
const CONSTANTS = require('../CONSTANTS/constants')
//import mongoose
const mongoose = require('mongoose')
//import Schema
const UserSchema = require('../model/userModel')
//Create a variable of type mongoose schema for Researcher
const User = mongoose.model('UserSchema', UserSchema)
//importing bcrypt to hash the user entered password for security.
const bcrypt = require('bcrypt')

//import login constants
const loginMiddleware = require('../middleware/loginMiddleware')
//import email middleware
const emailMiddleware = require('../middleware/emailMiddleware')

const requestresetPassword = (req, res, next) => {
  var searchcriteria = { email: req.body.email }
  loginMiddleware
    .checkifDataExists(User, req, res, next, searchcriteria, FILE_NAME)
    .then(result => {
      if (result != undefined && result != null) {
        var data = {
          $set: { temporaryPassword: CONSTANTS.temppassword[0].toString() }
        }
        loginMiddleware
          .updateDatainUser(User, FILE_NAME, searchcriteria, data)
          .then(anotherResult => {
            if (parseInt(anotherResult.n) === 1) {
              var message =
                '<p>You have requested a reset password. Please find below your temporary password<br><br>' +
                'Temporary Password: ' +
                CONSTANTS.temppassword[0].toString()
              emailMiddleware.sendEmail(
                'admin@skunkworks.com',
                result.email,
                'Welcome to NEU SKUNKWORKS',
                message,
                res,
                FILE_NAME
              )
            } else {
              //Create the log message
              CONSTANTS.createLogMessage(
                FILE_NAME,
                'Server Error',
                'SERVERERROR'
              )
              //Send the response
              CONSTANTS.createResponses(
                res,
                CONSTANTS.ERROR_CODE.BAD_REQUEST,
                CONSTANTS.ERROR_DESCRIPTION.SERVERERROR,
                next
              )
            }
          })
      } else {
        //Create the log message
        CONSTANTS.createLogMessage(FILE_NAME, 'No data Found', 'NODATA')
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        )
      }
    })
}

const resetPassword = (req, res, next) => {
  var searchcriteria = { email: req.body.email }
  bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
    if (err) {
      //Add data to the logger file
      CONSTANTS.createLogMessage(FILE_NAME, err.errmsg, 'Error')
    } else {
      var tempPwd = req.body.temporaryPassword
      var newPassword = hash
      loginMiddleware
        .checkifDataExists(User, req, res, next, searchcriteria, FILE_NAME)
        .then(result => {
          if (result != undefined && result != null) {
            if (tempPwd === result.temporaryPassword) {
              let newUser = new User({
                temporaryPassword: null,
                password: newPassword
              })
              var upsertData = newUser.toObject()
              delete upsertData._id
              loginMiddleware
                .updateDatainUser(User, FILE_NAME, searchcriteria, upsertData)
                .then(anotherResult => {
                  if (parseInt(anotherResult.n) === 1) {
                    CONSTANTS.createLogMessage(
                      FILE_NAME,
                      'Password Reset Successful',
                      'SUCCESS'
                    )
                    //Send the response
                    CONSTANTS.createResponses(
                      res,
                      CONSTANTS.ERROR_CODE.SUCCESS,
                      'Password Reset Successfully',
                      next
                    )
                  } else {
                    //Create the log message
                    CONSTANTS.createLogMessage(
                      FILE_NAME,
                      'Server Error',
                      'SERVERERROR'
                    )
                    //Send the response
                    CONSTANTS.createResponses(
                      res,
                      CONSTANTS.ERROR_CODE.BAD_REQUEST,
                      CONSTANTS.ERROR_DESCRIPTION.SERVERERROR,
                      next
                    )
                  }
                })
            } else {
              //Create the log message
              CONSTANTS.createLogMessage(
                FILE_NAME,
                'Wrong temporary password entered',
                'TEMPPASSWORDERROR'
              )
              //Send the response
              CONSTANTS.createResponses(
                res,
                CONSTANTS.ERROR_CODE.BAD_REQUEST,
                'Wrong temporary password entered',
                next
              )
            }
          } else {
            //Create the log message
            CONSTANTS.createLogMessage(FILE_NAME, 'No data Found', 'NODATA')
            //Send the response
            CONSTANTS.createResponses(
              res,
              CONSTANTS.ERROR_CODE.NOT_FOUND,
              CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
              next
            )
          }
        })
    }
  })
}
module.exports = { requestresetPassword, resetPassword }
