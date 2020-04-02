/**
 * @file jobpostingController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

//import mongoose
const mongoose = require('mongoose')
//import Job Posting Schema
const JobPostingSchema = require('../model/jobPostingModel')
//Importing constants
const CONSTANTS = require('../CONSTANTS/constants')
//Create a variable of type mongoose schema for Job Posting 
const JobPosting = mongoose.model('JobPostingSchema', JobPostingSchema)
//import file systems
const fs = require('fs')
//public key path
var publicKEY = fs.readFileSync('./.env/researcher_keys/public.key', 'utf8')
//Declaring the file name
const FILE_NAME = 'jobPostingController.js'


//This functionality adds a new job posting with all the required fields from the body.
const addNewJobPosting = (req, res, next) => {
  CONSTANTS.authenticateUser(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.researcherID
  )
  //Creating the variable to hold the data for fields
  let newJobPosting = new JobPosting({
    researcherID: req.params.researcherID,
    jobTitle: req.body.jobTitle,
    description: req.body.description,
    requirements: requirements,
    skills: req.body.skills,
    work_experience_required: req.body.work_experience_required
  })
  //Saving the data into the database.
  newJobPosting.save((err, jobposting) => {
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
    CONSTANTS.createLogMessage(FILE_NAME, 'Successfully added job posting', 'SUCCESS')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS,
        next
      )
  })
}

//This function gets all the job postings currently in the database.
const getJobPostings = (req, res, next) => {
  JobPosting.find({}, (err, jobposting) => {
    if (err) {
     //Log the error
     CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
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
      'Successfully searched for all job postings',
      'SUCCESS'
    )
    //Send back the response
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.SUCCESS,
      jobposting,
      next
    )
  })
}

//This function will retrieve a job posting info based on it's ID which is auto generated in mongoDB.
const getjobpostingwithID = (req, res, next) => {
  JobPosting.findById(req.params.jobID, (err, jobposting) => {
    if (err) {
      CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
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
    'Successfully searched for job posting',
    'SUCCESS'
  )
  //Send back the response
  CONSTANTS.createResponses(
    res,
    CONSTANTS.ERROR_CODE.SUCCESS,
    jobposting,
    next
  )
  })
}

//Updates the researchers information.
const updateJobPosting = (req, res, next) => {
  let newJobPosting = new JobPosting({
    researcherID: req.body.researcherID,
    jobTitle: req.body.jobTitle,
    description: req.body.description,
    requirements: requirements,
    skills: req.body.skills,
    work_experience_required: req.body.work_experience_required
  })
  var upsertData = newJobPosting.toObject()
  delete upsertData._id
  CONSTANTS.authenticateUser(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.body.researcherID
  )
  JobPosting.findOneAndUpdate(
    { _id: req.params.jobID },
    { $set: upsertData },
    { new: true, useFindAndModify: false },
    (err, jobposting) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        )
      }
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully updated job posting',
        'SUCCESS'
      )
      //Send back the volunteer data along with the success update message
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        jobposting,
        next
      )
    }
  )
}

//Delete the job posting
const deleteJobPosting = (req, res, next) => {
  JobPosting.findById(req.params.jobID, (err, job) => {
    if (err) {
      CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.FAILED,
        err.errmsg,
        next
      )
    }
    CONSTANTS.authenticateUser(
      req,
      res,
      next,
      publicKEY,
      FILE_NAME,
      job.researcherID
    )
    JobPosting.deleteOne({ _id: req.params.jobID }, (err, jobPosting) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        )
      }
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully deleted job Posting',
        'SUCCESS'
      )
      //Send back the volunteer data along with the success update message
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS_DELETE,
        next
      )
    })
  })
}

//Search a job posting based on skills
const getJobPostingonSkills = (req, res, next) => {
  let skills = req.params.skills
  let skillsarr = skills.split(', ')
  JobPosting.find({ skills: { $in: skillsarr } }, (err, jobposting) => {
    if (err) {
      CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        )
    }
    CONSTANTS.createLogMessage(
      FILE_NAME,
      'Successfully searched for job posting',
      'SUCCESS'
    )
    //Send back the volunteer data along with the success update message
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.SUCCESS,
      jobposting,
      next
    )
  })
}

//Search a job posting based on years of Work Experience
const getjobPostingbasedonWEYears = (req, res, next) => {
  JobPosting.find(
    { work_experience_required: { $in: req.params.years } },
    (err, jobposting) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        )
      }
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully searched for job posting',
        'SUCCESS'
      )
      //Send back the volunteer data along with the success update message
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        jobposting,
        next
      )
    }
  )
}

//Search Job Postings based on Researcher ID
const getMyJobPostings = (req, res, next) => {
  CONSTANTS.authenticateUser(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.researcherID
  )

  JobPosting.find(
    { researcherID: { $in: req.params.researcherID } },
    (err, jobposting) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        )
      }
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully searched for job posting',
        'SUCCESS'
      )
      //Send back the volunteer data along with the success update message
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        jobposting,
        next
      )
    }
  )
}
module.exports = {
  addNewJobPosting,
  getJobPostings,
  getjobpostingwithID,
  updateJobPosting,
  deleteJobPosting,
  getJobPostingonSkills,
  getjobPostingbasedonWEYears,
  getMyJobPostings
}
