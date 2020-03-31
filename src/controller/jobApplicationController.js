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
const LOGGER = require('../Logger/logger')
//Specifying the verifying options for json web token
var verifyOptions = {
  expiresIn: '12h',
  algorithm: ['RS256']
}
//import constants file
const CONSTANTS = require('../CONSTANTS/constants')
//importing jwt token to assign to the user once authenticated
const jwt = require('jsonwebtoken')
//importing file system to get the public and private key for creating public and private keys.
const fs = require('fs')
//public key path
var publicKEY = fs.readFileSync('./.env/researcher_keys/public.key', 'utf8')
var publicKEYR = fs.readFileSync('./.env/researcher_keys/public.key', 'utf8')

//This functionality adds a new job application with all the required fields from the body.
const addNewJobApplication = (req, res,next) => {
  let today = new Date()
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds()
    //Get the token value from the header
  let token = req.headers['x-access-token'] || req.headers['authorization']
  //If token is undefined send back the unauthorized error.
  if (token === undefined) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next();
  }
  //If token starts with Bearer then slice the token
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length)
  }
  //Decode the token value based on the public key value.
  var checkForAuthentication = jwt.verify(token, publicKEY, verifyOptions)
  if (checkForAuthentication === null) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  //If the checkauthentication variable does not have an id property then give unauthorized error.
  else if (checkForAuthentication.hasOwnProperty('id') === false) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next();
  } 
  else if (checkForAuthentication.id != req.params.volunteerID) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  } 
  //Creating the variable to hold the data for fields
  let newjobApplication = new JobApplication({
    jobID: req.body.jobID,
    volunteerID: req.param.volunteerID
  })
  //Saving the data into the database.
  newjobApplication.save((err, jobApplication) => {
    //Error
    if (err) {
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next();
    }
    //Return the success mesage if successfully added.
    LOGGER.info(date + ' Successfully submitted job application ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.SUCCESS)
    res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
    next();
  })
}

//This function will retrieve a job application info based on it's ID which is auto generated in mongoDB.
const getjobApplicationbyID = (req, res,next) => {
  let today = new Date()
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds()
    let token = req.headers['x-access-token'] || req.headers['authorization']
  if (token === undefined) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }
  var checkForAuthentication = jwt.verify(token, publicKEY, verifyOptions)
  if (checkForAuthentication.hasOwnProperty('id') === false) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  } else if (checkForAuthentication.id != req.params.researcherID) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  var checkForAuthentication = jwt.verify(token, publicKEYR, verifyOptions)
  if (checkForAuthentication === null) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  JobApplication.findById(req.params.jobID, (err, jobApplication) => {
    if (err) {
      LOGGER.info(date + ' Error occured in' + FILE_NAME + 'message: ' + err)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(date + ' Successfully searched for job posting ' + FILE_NAME)
    res.json({ data: jobApplication })
  })
}

//Updates the job application
const updateJobApplication = (req, res,next) => {
  let today = new Date()
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds()
  let newjobApplication = new JobApplication({
    jobID: req.body.jobID,
    volunteerID: req.body.volunteerID
  })
  var upsertData = newjobApplication.toObject()
  delete upsertData._id
  JobApplication.findOneAndUpdate(
    { _id: req.params.applicationID },
    {$set:upsertData},
    { new: true, useFindAndModify: false },
    (err, jobApplication) => {
      if (err) {
        LOGGER.info(
          date + ' Error occured in ' + FILE_NAME + ' message: ' + err
        )
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      }
      LOGGER.info(date + ' Successfully updated job application ' + FILE_NAME)
      res.json({ data: jobApplication })
    }
  )
}

//Delete the application
const deleteJobApplication = (req, res,next) => {
  let today = new Date()
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds()
  JobApplication.deleteOne(
    { _id: req.params.applicationID },
    (err, jobApplication) => {
      if (err) {
        LOGGER.info(date + ' Error occured in' + FILE_NAME + 'message: ' + err)
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      }
      LOGGER.info(date + ' Successfully deleted job application ' + FILE_NAME)
      res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
    }
  )
}

//Search Job Postings based on Volunteer ID
const getmyJobApplications = (req, res,next) => {
  let today = new Date()
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds()
    let token = req.headers['x-access-token'] || req.headers['authorization']
  //If token is undefined send back the unauthorized error.
  if (token === undefined) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next();
  }
  //If token starts with Bearer then slice the token
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length)
  }
  //Decode the token value based on the public key value.
  var checkForAuthentication = jwt.verify(token, publicKEY, verifyOptions)
  if (checkForAuthentication === null) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  //If the checkauthentication variable does not have an id property then give unauthorized error.
  else if (checkForAuthentication.hasOwnProperty('id') === false) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next();
  } 
  JobApplication.find(
    { volunteerID: { $in: req.params.volunteerID } },
    (err, jobApplication) => {
      if (err) {
        LOGGER.info(date + ' Error occured in' + FILE_NAME + 'message: ' + err)
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      }
      LOGGER.info(
        date + ' Successfully searched for job applications ' + FILE_NAME
      )
      res.json({ data: jobApplication })
    }
  )
}
module.exports = {
  getmyJobApplications,
  addNewJobApplication,
  deleteJobApplication,
  updateJobApplication,
  getjobApplicationbyID
}
