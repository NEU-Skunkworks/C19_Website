/**
 * @file volunteerController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/27/2020
 */

//import mongoose
const mongoose = require('mongoose')
//import Schema
const VolunteerSchema = require('../model/volunteerModel')
//Create a variable of type mongoose schema for Volunteer
const Volunteer = mongoose.model('VolunteerSchema', VolunteerSchema)
//importing bcrypt to hash the user entered password for security.
const bcrypt = require('bcrypt')
//importing jwt token to assign to the user once authenticated
const jwt = require('jsonwebtoken')
//importing file system to get the public and private key for creating public and private keys.
const fs = require('fs')
//private key path
var privateKEY = fs.readFileSync('./.env/researcher_keys/private.key', 'utf8')
//public key path
var publicKEY = fs.readFileSync('./.env/researcher_keys/public.key', 'utf8')
//import constants file
const CONSTANTS = require('../CONSTANTS/constants')
//Declaring the file name
const FILE_NAME = 'volunteerController.js'

//This functionality adds a new volunteer with all the required fields from the body.
const addNewVolunteer = (req, res, next) => {
  //Encrypt the password
  bcrypt.hash(req.body.vpassword, 10, (err, hash) => {
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
    //Parse the skills as string and split it based on "," to create an array of skills for the user.
    var skills = req.body.vskills
    var skillsArr = skills.split(',')

    //Creating the variable to hold the data for fields
    let newVolunteer = new Volunteer({
      vfirstName: req.body.vfirstName,
      vlastName: req.body.vlastName,
      vemail: req.body.vemail,
      vpassword: hash,
      vphone: req.body.vphone,
      vage: req.body.vage,
      vskills: skillsArr,
      vworks_experience_years: req.body.vworks_experience_years
    })
    //Adding multiple values for work Experience.
    newVolunteer.vwork_experience = Object.values(req.body.vwork_experience)
    //Adding multiple values  for education.
    newVolunteer.veducation = Object.values(req.body.veducation)
    //Saving the data into the database.
    newVolunteer.save((err, volunteer) => {
      //Error
      if (err) {
        //Log in the error
        CONSTANTS.createLogMessage(FILE_NAME, err, 'Error')
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        )
      }
      //Return the success message if successfully added.
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully created user',
        'SUCCESS'
      )
      //Send the success reponse
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS,
        next
      )
    })
  })
}

//This function gets all the volunteers currently in the database. (Can be used for analytical purposes)
const getVolunteers = (req, res, next) => {
  //Mongoose function to find all the volunteers from the volunteer schema
  Volunteer.find({}, (err, volunteer) => {
    //error
    if (err) {
      //Log the error
      CONSTANTS.createLogMessage(FILE_NAME, 'ERROR', 'Error')
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_DESCRIPTION.FAILED,
        err.errmsg,
        next
      )
    }
    //Log success message
    CONSTANTS.createLogMessage(
      FILE_NAME,
      'Successfully searched all volunteers',
      'SUCCESS'
    )
    //Send back the response
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.SUCCESS,
      volunteer,
      next
    )
  })
}

/*This function will retrieve a volunteers info based on it's ID which is auto generated in mongoDB.
This requires token authentication*/
const getVolunteerWithID = (req, res, next) => {
  //Authhenticate user
  CONSTANTS.authenticateUser(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.volunteerID
  )
  Volunteer.findById(req.params.volunteerID, (err, volunteer) => {
    //Error
    if (err) {
      CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NOT_FOUND,
        err.errmsg,
        next
      )
    }
    if (volunteer === null) {
      CONSTANTS.createLogMessage(FILE_NAME, 'User not Found', 'NODATA')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NOT_FOUND,
        CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
        next
      )
    } else {
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully searched user',
        'SUCCESS'
      )
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        volunteer,
        next
      )
    }
  })
}

//Updates the volunteer information.
const updateVolunteer = (req, res, next) => {
  //Authenticate user
  CONSTANTS.authenticateUser(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.volunteerID
  )
  let hash = bcrypt.hash(req.body.vpassword, 10)
  var skills = req.body.vskills
  var skillsArr = skills.split(', ')
  let newVolunteer = new Volunteer({
    vfirstName: req.body.vfirstName,
    vlastName: req.body.vlastName,
    vemail: req.body.vemail,
    vpassword: hash,
    vphone: req.body.vphone,
    vage: req.body.vage,
    vskills: skillsArr,
    vworks_experience_years: req.body.vworks_experience_years
  })
  //Adding multiple values for work Experience.
  newVolunteer.vwork_experience = Object.values(req.body.vwork_experience)
  //Adding multiple values  for education.
  newVolunteer.veducation = Object.values(req.body.veducation)

  //Parse the new volunteer variable as a object
  var upsertData = newVolunteer.toObject()
  //delete the id parameter in it
  delete upsertData._id
  //Mongoose function to update a single volunteer
  Volunteer.updateOne(
    { _id: req.params.volunteerID },
    { $set: upsertData },
    { new: true, useFindAndModify: false },
    (err, volunteer) => {
      if (err) {
        //Create the log message
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        )
      }
      //Create the log message
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully updated user',
        'SUCCESS'
      )
      //Send back the volunteer data along with the success update message
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        volunteer,
        next
      )
    }
  )
}

//Delete the volunteer information.
const deleteVolunteer = (req, res, next) => {
  //Authenticate user
  CONSTANTS.authenticateUser(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.volunteerID
  )
  //mongoose function to delete one Volunteer
  Volunteer.findOneAndDelete(
    { _id: req.params.volunteerID },
    (err, volunteer) => {
      //Error
      if (err) {
        //Create log message
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
        //Create the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        )
      }
      //Create the log message
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'User successfully deleted',
        'SUCCESS'
      )
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS_DELETE,
        next
      )
    }
  )
}

//Authenticate the volunteer.
const getVolunteerLogin = (req, res, next) => {
  //Check of the volunteer exists using their email ID.
  Volunteer.findOne({ vemail: req.body.vemail }, (err, volunteer) => {
    if(err){
      CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.FAILED,
        err.errmsg,
        next
      )
    }
    //If the volunteer does not exist.
    if (!volunteer) {
      CONSTANTS.createLogMessage(FILE_NAME, 'Invalid email/username', 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
        CONSTANTS.ERROR_DESCRIPTION.LOGINERROR,
        next
      )
    } else {
      //If the volunteer exists then compare their password entered with the password in the database
      bcrypt.compare(
        req.body.vpassword.toString(),
        volunteer.vpassword.toString(),
        function (err, match) {
          //If password same create the json web token.
          if (err) {
            CONSTANTS.createLogMessage(FILE_NAME, 'Server Error', 'ERROR')
            CONSTANTS.createResponseWithoutNext(
              res,
              CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
              CONSTANTS.ERROR_DESCRIPTION.LOGINERROR
            )
          }
          if (match === true) {
            var payload = {
              id: volunteer._id.toString()
            }
            var token = jwt.sign(payload, privateKEY, CONSTANTS.signOptions)
            //return the token
            CONSTANTS.createLogMessage(FILE_NAME, 'Token Generated', 'SUCCESS')
            var responsedata = {
              token: token,
              userid: volunteer._id
            }
            CONSTANTS.createResponseWithoutNext(
              res,
              CONSTANTS.ERROR_CODE.SUCCESS,
              responsedata
            )
          } else {
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
        }
      )
    }
  })
}

/*This function will retrieve a volunteers info based on it's ID which is auto generated in mongoDB.
Does not require authentication of any kind. Can be used to share the profile and for a researcher to see 
a volunteer's profile*/
const getVolunteerInfoWithID = (req, res, next) => {
  Volunteer.findById(req.params.volunteerID, (err, volunteer) => {
    if (err) {
      CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NOT_FOUND,
        err.errmsg,
        next
      )
    }
    if (volunteer === null) {
      CONSTANTS.createLogMessage(FILE_NAME, 'User not found', 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NOT_FOUND,
        'User does not Exist',
        next
      )
    } else {
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'User found successfully',
        'SUCCESS'
      )
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        volunteer,
        next
      )
    }
  })
}
module.exports = {
  addNewVolunteer,
  getVolunteerLogin,
  getVolunteerWithID,
  deleteVolunteer,
  getVolunteers,
  updateVolunteer,
  getVolunteerInfoWithID
}
