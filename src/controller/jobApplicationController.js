/**
 * @file jobpostingController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

//import mongoose
const mongoose = require('mongoose')
//import Schema
const JobApplicationSchema = require('../model/jobApplicationModel')

const JobApplication = mongoose.model(
  'JobApplicationSchema',
  JobApplicationSchema
)

const FILE_NAME = 'jobApplicationController.js'
//import constants file
const CONSTANTS = require('../CONSTANTS/constants')
//importing file system to get the public and private key for creating public and private keys.
const fs = require('fs')
//public key path
var publicKEY = fs.readFileSync('./.env/researcher_keys/public.key', 'utf8')
//import login constants
const loginMiddleware = require('../middleware/loginMiddleware')
//import post authentication controller
const postAuthentication = require('./common_controllers/postAuthenticationController')
//import mongoose queries
const mongooseMiddleware = require('../middleware/mongooseMiddleware')
//import Schema
const UserSchema = require('../model/userModel')
//Create a variable of type mongoose schema for Researcher
const User = mongoose.model('UserSchema', UserSchema)

//This functionality adds a new job application with all the required fields from the body.
const addNewJobApplication = (req, res, next) => {
  var searchcriteria = { _id: req.params.userID }
  loginMiddleware
    .checkifDataExists(User, searchcriteria, FILE_NAME)
    .then(result => {
      if (result != undefined && result != null) {
        if (result.type.toString() === 'Researcher') {
          CONSTANTS.createLogMessage(
            FILE_NAME,
            CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
            'ERROR'
          )
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.UNAUTHORIZED,
            CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
            next
          )
        } else {
          let newjobApplication = new JobApplication({
            jobID: req.body.jobID,
            volunteerID: req.param.volunteerID
          })
          postAuthentication.postAuthentication(
            req,
            res,
            next,
            publicKEY,
            FILE_NAME,
            req.params.volunteerID,
            mongooseMiddleware.addNewData,
            newjobApplication,
            null
          )
        }
      } else {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          'ERROR'
        )
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        )
      }
    })  
}

//This function will retrieve a job application info based on it's ID which is auto generated in mongoDB.
const getjobApplicationbyID = (req, res, next) => {
  if (req.params === undefined) {
    CONSTANTS.createLogMessage(FILE_NAME, 'Parameter not found', 'ERROR')
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.NOT_FOUND,
      'Parameter not found',
      next
    )
  } else {
    mongooseMiddleware.findbyID(
      JobApplication,
      res,
      next,
      FILE_NAME,
      req.params.applicationID
    )
  }
}

//Delete the application
const deleteJobApplication = (req, res, next) => {
  var searchcriteria = { _id: req.params.applicationID }
  loginMiddleware
    .checkifDataExists(JobApplication, searchcriteria, FILE_NAME)
    .then(result => {
      if (result != undefined && result != null) {
        var parameterToPass =
          result.userID.toString() + ',' + req.params.jobID.toString()
        postAuthentication.postAuthentication(
          req,
          res,
          next,
          publicKEY,
          FILE_NAME,
          parameterToPass,
          mongooseMiddleware.deleteData,
          JobApplication,
          null
        )
        
      } else {
        //Error
        CONSTANTS.createLogMessage(FILE_NAME, 'Data not Found', 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        )
      }
    })
}

//Search Job Postings based on Volunteer ID
const getmyJobApplications = (req, res, next) => {
  var searchcriteria = { _id: req.params.userID }
  loginMiddleware
    .checkifDataExists(User, searchcriteria, FILE_NAME)
    .then(result => {
      if (result != undefined && result != null) {
        if (result.type.toString() === 'Researcher') {
          CONSTANTS.createLogMessage(
            FILE_NAME,
            CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
            'ERROR'
          )
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.UNAUTHORIZED,
            CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
            next
          )
        } else {
          postAuthentication.postAuthentication(
            req,
            res,
            next,
            publicKEY,
            FILE_NAME,
            req.params.volunteerID.toString(),
            mongooseMiddleware.findALL,
            JobPosting,
            null
          )
        }
      } else {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          'ERROR'
        )
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        )
      }
    }) 
}
module.exports = {
  getmyJobApplications,
  addNewJobApplication,
  deleteJobApplication,
  getjobApplicationbyID
}
