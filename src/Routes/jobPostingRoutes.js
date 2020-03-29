/**
 * @file jobPostingRoutes.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

 //Importing the Job Posting Controller.
const jobPostingController = require('../controller/jobpostingController')
const express = require('express')
const router = express.Router()

//get all the job Postings
router.get('/', function (req, res) {
  jobPostingController.getJobPostings(req, res)
})
//Add a new Job Posting
router.post('/addJob', function (req, res) {
  jobPostingController.addNewJobPosting(req, res)
})

//Get a particular job posting
router.get('/:jobID', function (req, res) {
  jobPostingController.getjobpostingwithID(req, res)
})

//Update a job posting
router.put('/:jobID', function (req, res) {
  jobPostingController.updateJobPosting(req, res)
})

//Delete a job Posting
router.delete('/:jobID', function (req, res) {
  jobPostingController.deleteJobPosting(req, res)
})

//Get Job Posting based on skills
router.get('/searchjobsskills/:skills', function (req, res) {
  jobPostingController.getJobPostingonSkills(req, res)
})

//Get Job Posting based on years of work experience
router.get('/searchjobsyear/:years', function (req, res) {
  jobPostingController.getjobPostingbasedonWEYears(req, res)
})

//Get Job Posting based on researcher id
router.get('/myjobpostings/:researcherID', function (req, res) {
  jobPostingController.getMyJobPostings(req, res)
})

module.exports = router
