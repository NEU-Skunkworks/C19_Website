/**
 * @file basicRoutes.js
 * @namespace routes
 * @author Mrunal
 * Created Date: 03/27/2020
 * @description user routes
 */
const express = require('express')
const router = express.Router()
const CONSTANTS = require('../CONSTANTS/constants')
const LOGGER = require('../Logger/logger')
// File name to be logged
const FILE_NAME = 'basicRoute.js'
//importing mongoose middleware
const mongooseMiddleware = require('../middleware/mongooseMiddleware')
//import mongoose
const mongoose = require('mongoose')
//import Job Posting Schema
const JobPostingSchema = require('../model/jobPostingModel')
//Create a variable of type mongoose schema for Job Posting
const JobPosting = mongoose.model('JobPostingSchema', JobPostingSchema)
//import Job Posting Schema
const UserSchema = require('../model/userModel')
//Create a variable of type mongoose schema for Job Posting
const User = mongoose.model('UserSchema', UserSchema)
const JobApplicationSchema = require('../model/jobApplicationModel')
const JobApplication = mongoose.model(
  'JobApplicationSchema',
  JobApplicationSchema
)

/*
 * Hello world Route
 * @memberof basicRoute.js
 * @function /helloWorld
 * @param {object} req Request
 * @param {object} res Response
 * @returns {object} responseObject
 */
router.get('/', function (req, res) {
  var volunteercriteria = { type: 'Volunteer' }
  mongooseMiddleware
    .getCount(User, FILE_NAME, volunteercriteria)
    .then(countofVolunteers => {
      var researcherCriteria = { type: 'Researcher' }
      mongooseMiddleware
        .getCount(User, FILE_NAME, researcherCriteria)
        .then(countofResearchers => {
          mongooseMiddleware
            .getCount(JobPosting, FILE_NAME, null)
            .then(countofJobPostings => {
              mongooseMiddleware
                .getCount(JobApplication, FILE_NAME, null)
                .then(countofjobApplications => {
                  res.status(CONSTANTS.ERROR_CODE.SUCCESS)
                  res.json({
                    message: {
                      countofVolunteers: countofVolunteers,
                      countofResearchers: countofResearchers,
                      countofJobPostings: countofJobPostings,
                      countofjobApplications: countofjobApplications
                    }
                  })
                  res.end()
                })
            })
        })
    })
})
router.get('/health', function (req, res) {
  let responseObj = {}
  LOGGER.info('Hello world ' + FILE_NAME)
  res.statusCode = CONSTANTS.ERROR_CODE.SUCCESS
  res.statusMessage = CONSTANTS.ERROR_DESCRIPTION.SUCCESS
  responseObj.result = 'API is still healthy'
  res.send(responseObj)
})

module.exports = router
