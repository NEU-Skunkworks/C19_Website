/**
 * @file jobPostingRoutes.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

//Importing the Job Posting Controller.
const jobPostingController = require('../controller/jobpostingController');
const express = require('express');
const router = express.Router();

//get all the job Postings
router.get('/', function (req, res, next) {
  jobPostingController.getJobPostings(req, res, next);
});

//Add a new Job Posting
router.post('/addJob/:userID', function (req, res, next) {
  jobPostingController.addNewJobPosting(req, res);
});

//Get a particular job posting
router.get('/:jobID', function (req, res, next) {
  jobPostingController.getjobpostingwithID(req, res, next);
});

//Update a job posting
router.put('/update/:jobID', function (req, res, next) {
  jobPostingController.updateJobPosting(req, res, next);
});

//Delete a job Posting
router.delete('/delete/:jobID', function (req, res, next) {
  jobPostingController.deleteJobPosting(req, res, next);
});

//Get Job Posting based on search criteria like work experience and skills
router.get('/searchjobs/:search', function (req, res, next) {
  jobPostingController.getJobPostingbySearch(req, res, next);
});

//Get Job Posting based on researcher id
router.get('/myjobpostings/:userID', function (req, res, next) {
  jobPostingController.getMyJobPostings(req, res, next);
});

module.exports = router;
