/**
 * @file jobPostingRoutes.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

//Importing the Job Posting Controller.
const jobApplicationController = require('../controller/jobApplicationController')
const express = require('express')
const router = express.Router()

//Add a new Job application
router.post('/submitapplication', function (req, res) {
  jobApplicationController.addNewJobApplication(req, res)
})

//Get a particular job application
router.get('/:applicationID', function (req, res) {
  jobApplicationController.getjobApplicationbyID(req, res)
})

//Update a job application
router.put('/:applicationID', function (req, res) {
  jobApplicationController.updateJobApplication(req, res)
})

//Delete a job application
router.delete('/:applicationID', function (req, res) {
  jobApplicationController.deleteJobApplication(req, res)
})

//Get Job Applications based on volunteer id
router.get('/myapplications/:volunteerID', function (req, res) {
  jobApplicationController.getmyJobApplications(req, res)
})

module.exports = router
