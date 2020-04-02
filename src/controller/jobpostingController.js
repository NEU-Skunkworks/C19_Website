/**
 * @file jobpostingController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

//import mongoose
const mongoose = require('mongoose')
//Importing constants
const CONSTANTS = require('../CONSTANTS/constants')
//import Job Posting Schema
const JobPostingSchema = require('../model/jobPostingModel')
//Create a variable of type mongoose schema for Job Posting
const JobPosting = mongoose.model('JobPostingSchema', JobPostingSchema)
//import file systems
const fs = require('fs')
//public key path
var publicKEY = fs.readFileSync('./.env/researcher_keys/public.key', 'utf8')
//import post authentication controller
const postAuthentication = require('./common_controllers/postAuthenticationController')
//import mongoose queries
const mongooseMiddleware = require('../middleware/mongooseMiddleware')
//Declaring the file name
const FILE_NAME = 'jobPostingController.js'
//import login constants
const loginMiddleware = require('../middleware/loginMiddleware')

//This functionality adds a new job posting with all the required fields from the body.
const addNewJobPosting = (req, res, next) => {
  //Creating the variable to hold the data for fields
  if (req.body.skills.toString().includes(',')) {
    var skills = req.body.skills
    var skillsArr = skills.split(',')
  } else {
    var skillsArr = req.body.vskills.toString()
  }
  let newJobPosting = new JobPosting({
    researcherID: req.params.researcherID,
    jobTitle: req.body.jobTitle,
    description: req.body.description,
    requirements: req.body.requirements,
    skills: skillsArr,
    work_experience_required: req.body.work_experience_required
  })
  postAuthentication.postAuthentication(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.researcherID,
    mongooseMiddleware.addNewData,
    newJobPosting,
    null
  )
}

//This function gets all the job postings currently in the database.
const getJobPostings = (req, res, next) => {
  mongooseMiddleware.findALL(JobPosting, res, next, FILE_NAME)
}

//This function will retrieve a job posting info based on it's ID which is auto generated in mongoDB.
const getjobpostingwithID = (req, res, next) => {
  if (req.params === undefined) {
    CONSTANTS.createLogMessage(FILE_NAME, 'Parameter not found', 'ERROR')
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.NOT_FOUND,
      'Parameter not found',
      next
    )
  } else {
    mongooseMiddleware.findbyID(JobPosting, res, next, FILE_NAME, req.params.jobID)
  }
}

//Updates the researchers information.
const updateJobPosting = (req, res, next) => {
  var searchcriteria = { _id: req.params.jobID }
  loginMiddleware
    .checkifDataExists(JobPosting, searchcriteria, FILE_NAME)
    .then(result => {
      if (result === null) {
        //Error
        CONSTANTS.createLogMessage(FILE_NAME, 'Data not Found', 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        )
      } else if (result != null) {
        let newJobPosting = new JobPosting({
          jobTitle: req.body.jobTitle,
          description: req.body.description,
          requirements: req.body.requirements,
          skills: req.body.skills,
          work_experience_required: req.body.work_experience_required
        })
        var upsertData = newJobPosting.toObject()
        delete upsertData._id
        var parameterToPass =
          result.researcherID.toString() + ',' + req.params.jobID
        postAuthentication.postAuthentication(
          req,
          res,
          next,
          publicKEY,
          FILE_NAME,
          parameterToPass,
          mongooseMiddleware.updateData,
          JobPosting,
          upsertData
        )
      }
    })
}

//Delete the job posting
const deleteJobPosting = (req, res, next) => {
  var searchcriteria = { _id: req.params.jobID }
  loginMiddleware
    .checkifDataExists(JobPosting, searchcriteria, FILE_NAME)
    .then(result => {
      if (result === null) {
        //Error
        CONSTANTS.createLogMessage(FILE_NAME, 'Data not Found', 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        )
      } else if (result != null) {
        var parameterToPass = result.researcherID + ',' + req.params.jobID
        postAuthentication.postAuthentication(
          req,
          res,
          next,
          publicKEY,
          FILE_NAME,
          parameterToPass,
          mongooseMiddleware.deleteData,
          JobPosting,
          null
        )
      }
    })
}

//Search a job posting based on skills
const getJobPostingbySearch = (req, res, next) => {
  if (req.params.search.toString().includes(',')) {
    var search = req.params.search
    var searchArr = search.split(',')
    var searchcriteria = { skills: { $in: searchArr } }
  } else if (!isNaN(req.params.search)) {
    var searchcriteria = {
      work_experience_required: { $lte: req.params.search }
    }
  } else {
    var searchArr = [req.params.skills.toString()]
    var searchcriteria = { skills: { $in: searchArr } }
  }
  mongooseMiddleware
    .findallbasedonCriteria(JobPosting, res, next, FILE_NAME, searchcriteria)
    .then(result => {
      if (result != null || result != []) {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          'Data Found Successfully',
          'SUCCESS'
        )
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.SUCCESS,
          result,
          next
        )
      } else {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          'NODATA'
        )
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          'No Data',
          next
        )
      }
    })
}

//Search Job Postings based on Researcher ID
const getMyJobPostings = (req, res, next) => {
  postAuthentication.postAuthentication(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.researcherID.toString(),
    mongooseMiddleware.findALL,
    JobPosting,
    null
  )
}
module.exports = {
  addNewJobPosting,
  getJobPostings,
  getjobpostingwithID,
  updateJobPosting,
  deleteJobPosting,
  getJobPostingbySearch,
  getMyJobPostings
}
