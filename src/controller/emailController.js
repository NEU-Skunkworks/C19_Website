/**
 * @file emailController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 04/03/2020
 */

//Declare the file name
const FILE_NAME = 'emailController.js'
//import constants file
const CONSTANTS = require('../CONSTANTS/constants')
//import mongoose
const mongoose = require('mongoose')
//import Schema
const UserSchema = require('../model/userModel')
//Create a variable of type mongoose schema for Researcher
const User = mongoose.model('UserSchema', UserSchema)
//import login constants
const loginMiddleware = require('../middleware/loginMiddleware')
//import mongoose queries
const mongooseMiddleware = require('../middleware/mongooseMiddleware')

//confirm email function
const confirmEmail = (req, res, next) => {
  var searchCriteria = { _id: req.params.userID }
  console.log(searchCriteria)
  loginMiddleware
    .checkifDataExists(User,req,res,next, searchCriteria, FILE_NAME)
    .then(result => {
      if (result != undefined && result != null) {
        let emailConfirmed = new User({
          emailAuthenticated: 'Yes'
        })
        var upsertData = emailConfirmed.toObject()
        delete upsertData._id
        mongooseMiddleware.updateData(
          User,
          res,
          next,
          FILE_NAME,
          req.params.userID,
          upsertData
        )
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

module.exports = { confirmEmail }
