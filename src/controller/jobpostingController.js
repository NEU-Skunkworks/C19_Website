/**
 * @file jobpostingController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

//import mongoose
const mongoose = require('mongoose')
//import Schema
const JobPostingSchema = require('../model/jobPostingModel')
const CONSTANTS = require('../CONSTANTS/constants')
const JobPosting = mongoose.model('JobPostingSchema', JobPostingSchema)
const fs = require('fs')
//public key path
var publicKEY = fs.readFileSync('./.env/researcher_keys/public.key', 'utf8')
const FILE_NAME = 'jobPostingController.js'
const LOGGER = require('../Logger/logger')

//Specifying the verifying options for json web token
var verifyOptions = {
  expiresIn: '12h',
  algorithm: ['RS256']
}
//importing jwt token to assign to the user once authenticated
const jwt = require('jsonwebtoken')
//This functionality adds a new job posting with all the required fields from the body.
const addNewJobPosting = (req, res, next) => {
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
  var checkForAuthentication = jwt.verify(token, publicKEY, verifyOptions)
  if (checkForAuthentication === null) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
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
      LOGGER.info(date + ' Error occured in ' + FILE_NAME + ' message: ' + err)
      res.status(CONSTANTS.ERROR_CODE.FAILED)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.SERVERERROR })
    }
    //Return the success mesage if successfully added.
    LOGGER.info(date + ' Successfully added job posting ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.SUCCESS)
    res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
    next()
  })
}

//This function gets all the job postings currently in the database.
const getJobPostings = (req, res, next) => {
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
  JobPosting.find({}, (err, jobposting) => {
    if (err) {
      LOGGER.info(date + ' Error occured in ' + FILE_NAME + ' message: ' + err)
      res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      next()
    }
    LOGGER.info(
      date + ' Successfully searched for all job postings ' + FILE_NAME
    )
    res.status(CONSTANTS.ERROR_CODE.SUCCESS)
    res.json({ data: jobposting })
    next()
  })
}

//This function will retrieve a job posting info based on it's ID which is auto generated in mongoDB.
const getjobpostingwithID = (req, res, next) => {
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
  JobPosting.findById(req.params.jobID, (err, jobposting) => {
    if (err) {
      LOGGER.info(date + ' Error occured in' + FILE_NAME + 'message: ' + err)
      res.status(CONSTANTS.ERROR_CODE.FAILED)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      next()
    }
    LOGGER.info(date + ' Successfully searched for job posting ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.SUCCESS)
    res.json({ data: jobposting })
    next()
  })
}

//Updates the researchers information.
const updateJobPosting = (req, res, next) => {
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
  var checkForAuthentication = jwt.verify(token, publicKEY, verifyOptions)
  if (checkForAuthentication === null) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  if (checkForAuthentication.hasOwnProperty('id') === false) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  } else if (checkForAuthentication.id != upsertData.researcherID) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  JobPosting.findOneAndUpdate(
    { _id: req.params.jobID },
    { $set: upsertData },
    { new: true, useFindAndModify: false },
    (err, jobposting) => {
      if (err) {
        LOGGER.info(
          date + ' Error occured in ' + FILE_NAME + ' message: ' + err
        )
        res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      }
      LOGGER.info(date + ' Successfully updated job posting ' + FILE_NAME)
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({ data: jobposting })
      next()
    }
  )
}

//Delete the job posting
const deleteJobPosting = (req, res, next) => {
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
  JobPosting.findById(req.params.jobID, (err, jobposting) => {
    if (err) {
      LOGGER.info(date + ' Error occured in' + FILE_NAME + 'message: ' + err)
      res.status(CONSTANTS.ERROR_CODE.FAILED)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      next()
    }
    var checkForAuthentication = jwt.verify(token, publicKEY, verifyOptions)
    if (checkForAuthentication === null) {
      LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
      res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
      next()
    } else if (checkForAuthentication.hasOwnProperty('id') === false) {
      LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
      res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
      next()
    } else if (checkForAuthentication.id != jobposting.researcherID) {
      LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
      res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
      next()
    }
    JobPosting.deleteOne({ _id: req.params.jobID }, (err, jobPosting) => {
      if (err) {
        LOGGER.info(date + ' Error occured in' + FILE_NAME + 'message: ' + err)
        res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
        next()
      }
      LOGGER.info(date + ' Successfully deleted job Posting ' + FILE_NAME)
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
      next()
    })
  })
}

//Search a job posting based on skills
const getJobPostingonSkills = (req, res, next) => {
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
  let skills = req.params.skills
  let skillsarr = skills.split(', ')
  JobPosting.find({ skills: { $in: skillsarr } }, (err, jobposting) => {
    if (err) {
      LOGGER.info(date + ' Error occured in' + FILE_NAME + 'message: ' + err)
      res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      next()
    }
    LOGGER.info(date + ' Successfully searched for job posting ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.SUCCESS)
    res.json({ data: jobposting })
    next()
  })
}

//Search a job posting based on years of Work Experience
const getjobPostingbasedonWEYears = (req, res, next) => {
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
  JobPosting.find(
    { work_experience_required: { $in: req.params.years } },
    (err, jobposting) => {
      if (err) {
        LOGGER.info(date + ' Error occured in' + FILE_NAME + 'message: ' + err)
        res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
        next()
      }
      LOGGER.info(date + ' Successfully searched for job posting ' + FILE_NAME)
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({ data: jobposting })
      next()
    }
  )
}

//Search Job Postings based on Researcher ID
const getMyJobPostings = (req, res, next) => {
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
  if (checkForAuthentication === null) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  } else if (checkForAuthentication.hasOwnProperty('id') === false) {
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

  JobPosting.find(
    { researcherID: { $in: req.params.researcherID } },
    (err, jobposting) => {
      if (err) {
        LOGGER.info(date + ' Error occured in' + FILE_NAME + 'message: ' + err)
        res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
        next()
      }
      LOGGER.info(date + ' Successfully searched for job posting ' + FILE_NAME)
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({ data: jobposting })
      next()
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
