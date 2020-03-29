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

//This functionality adds a new job application with all the required fields from the body.
const addNewJobApplication = (req, res) => {
  //Creating the variable to hold the data for fields
  let newjobApplication = new JobApplication({
    jobID: req.body.jobID,
    volunteerID: req.body.volunteerID
  })
  //Saving the data into the database.
  newjobApplication.save((err, jobApplication) => {
    //Error
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.SERVERERROR })
    }
    //Return the success mesage if successfully added.
    LOGGER.info(
      Date.now + ' Successfully submitted job application ' + FILE_NAME
    )
    res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
  })
}

//This function will retrieve a job application info based on it's ID which is auto generated in mongoDB.
const getjobApplicationbyID = (req, res) => {
  JobApplication.findById(req.params.jobID, (err, jobApplication) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in' + FILE_NAME + 'message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(
      Date.now + ' Successfully searched for job posting ' + FILE_NAME
    )
    res.json({ data: jobApplication })
  })
}

//Updates the job application
const updateJobApplication = (req, res) => {
  let newjobApplication = new JobApplication({
    jobID: req.body.jobID,
    volunteerID: req.body.volunteerID
  })
  JobApplication.findOneAndUpdate(
    { _id: req.params.applicationID },
    newjobApplication,
    { new: true, useFindAndModify: false },
    (err, jobApplication) => {
      if (err) {
        LOGGER.info(
          Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
        )
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      }
      LOGGER.info(
        Date.now + ' Successfully updated job application ' + FILE_NAME
      )
      res.json({ data: jobApplication })
    }
  )
}

//Delete the application
const deleteJobApplication = (req, res) => {
  JobApplication.deleteOne(
    { _id: req.params.applicationID },
    (err, jobApplication) => {
      if (err) {
        LOGGER.info(
          Date.now + ' Error occured in' + FILE_NAME + 'message: ' + err
        )
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      }
      LOGGER.info(
        Date.now + ' Successfully deleted job application ' + FILE_NAME
      )
      res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
    }
  )
}

//Search Job Postings based on Volunteer ID
const getmyJobApplications = (req, res) => {
  JobApplication.find(
    { volunteerID: { $in: req.params.volunteerID } },
    (err, jobApplication) => {
      if (err) {
        LOGGER.info(
          Date.now + ' Error occured in' + FILE_NAME + 'message: ' + err
        )
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      }
      LOGGER.info(
        Date.now + ' Successfully searched for job applications ' + FILE_NAME
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
