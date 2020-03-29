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

const JobPosting = mongoose.model('JobPostingSchema', JobPostingSchema)

const FILE_NAME = 'jobPostingController.js'
const LOGGER = require('../Logger/logger')

//This functionality adds a new job posting with all the required fields from the body.
const addNewJobPosting = (req, res) => {
  //Creating the variable to hold the data for fields
  let newJobPosting = new JobPosting({
    researcherID: req.body.researcherID,
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
      LOGGER.info(
        Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.SERVERERROR })
    }
    //Return the success mesage if successfully added.
    LOGGER.info(Date.now + ' Successfully added job posting ' + FILE_NAME)
    res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
  })
}

//This function gets all the job postings currently in the database.
const getJobPostings = (req, res) => {
  JobPosting.find({}, (err, jobposting) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(
      Date.now + ' Successfully searched for all job postings ' + FILE_NAME
    )
    res.json({ data: jobposting })
  })
}

//This function will retrieve a job posting info based on it's ID which is auto generated in mongoDB.
const getjobpostingwithID = (req, res) => {
  JobPosting.findById(req.params.jobID, (err, jobposting) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in' + FILE_NAME + 'message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(
      Date.now + ' Successfully searched for job posting ' + FILE_NAME
    )
    res.json({ data: jobposting })
  })
}

//Updates the researchers information.
const updateJobPosting = (req, res) => {
  let newJobPosting = new JobPosting({
    researcherID: req.body.researcherID,
    jobTitle: req.body.jobTitle,
    description: req.body.description,
    requirements: requirements,
    skills: req.body.skills,
    work_experience_required: req.body.work_experience_required
  })
  JobPosting.findOneAndUpdate(
    { _id: req.params.jobID },
    newJobPosting,
    { new: true, useFindAndModify: false },
    (err, jobposting) => {
      if (err) {
        LOGGER.info(
          Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
        )
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      }
      LOGGER.info(Date.now + ' Successfully updated job posting ' + FILE_NAME)
      res.json({ data: jobposting })
    }
  )
}

//Delete the job posting
const deleteJobPosting = (req, res) => {
  JobPosting.deleteOne({ _id: req.params.jobID }, (err, jobPosting) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in' + FILE_NAME + 'message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(Date.now + ' Successfully deleted job Posting ' + FILE_NAME)
    res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
  })
}

//Search a job posting based on skills
const getJobPostingonSkills = (req, res) => {
  let skills = req.params.skills
  let skillsarr = skills.split(', ')
  JobPosting.find({ skills: { $in: skillsarr } }, (err, jobposting) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in' + FILE_NAME + 'message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(
      Date.now + ' Successfully searched for job posting ' + FILE_NAME
    )
    res.json({ data: jobposting })
  })
}

//Search a job posting based on years of Work Experience
const getjobPostingbasedonWEYears = (req, res) => {
  JobPosting.find({ work_experience_required: { $in: req.params.years } }, (err, jobposting) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in' + FILE_NAME + 'message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(
      Date.now + ' Successfully searched for job posting ' + FILE_NAME
    )
    res.json({ data: jobposting })
  })
}

//Search Job Postings based on Researcher ID
const getMyJobPostings = (req, res) => {
  JobPosting.find({ researcherID: { $in: req.params.researcherID } }, (err, jobposting) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in' + FILE_NAME + 'message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(
      Date.now + ' Successfully searched for job posting ' + FILE_NAME
    )
    res.json({ data: jobposting })
  })
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
