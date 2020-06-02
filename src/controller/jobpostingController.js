/**
 * @file jobpostingController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

//import mongoose
const mongoose = require('mongoose');
//Importing constants
const CONSTANTS = require('../CONSTANTS/constants');
//import Job Posting Schema
const JobPostingSchema = require('../model/jobPostingModel');
//Create a variable of type mongoose schema for Job Posting
const JobPosting = mongoose.model('JobPostingSchema', JobPostingSchema);
const dotenv = require('dotenv');
dotenv.config();
const decodedkey = require('./common_controllers/keydecoder');
//public key path
var publicKEY = decodedkey.decodedkey(
  process.env.RESEARCHER_PUBLIC_KEY.toString('utf8')
);
//import post authentication controller
const postAuthentication = require('./common_controllers/postAuthenticationController');
//import mongoose queries
const mongooseMiddleware = require('../middleware/mongooseMiddleware');
//Declaring the file name
const FILE_NAME = 'jobPostingController.js';
//import login constants
const loginMiddleware = require('../middleware/loginMiddleware');
//import Schema
const UserSchema = require('../model/userModel');
//Create a variable of type mongoose schema for Researcher
const User = mongoose.model('UserSchema', UserSchema);

//This functionality adds a new job posting with all the required fields from the body.
const addNewJobPosting = (req, res, next) => {
  //Creating the variable to hold the data for fields
  var searchcriteria = { _id: req.params.userID };
  loginMiddleware
    .checkifDataExists(User, req, res, next, searchcriteria, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        if (result.type.toString() === 'Volunteer') {
          CONSTANTS.createLogMessage(
            FILE_NAME,
            CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
            'ERROR'
          );
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.UNAUTHORIZED,
            CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
            next
          );
        } else {
          if (req.body.skills.toString().includes(',')) {
            var skills = req.body.skills;
            var skillsArr = skills.split(',');
          } else {
            var skillsArr = req.body.vskills.toString();
          }
          let newJobPosting = new JobPosting({
            userID: req.params.userID,
            jobTitle: req.body.jobTitle,
            description: req.body.description,
            weeklycommitment: req.body.weeklycommitment,
            skills: skillsArr,
          });
          postAuthentication.postAuthentication(
            req,
            res,
            next,
            publicKEY,
            FILE_NAME,
            req.params.userID,
            mongooseMiddleware.addNewData,
            newJobPosting,
            null
          );
        }
      } else {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          'ERROR'
        );
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        );
      }
    });
};

//This function gets all the job postings currently in the database.
const getJobPostings = (req, res, next) => {
  mongooseMiddleware.findALL(JobPosting, res, next, FILE_NAME);
};

//This function will retrieve a job posting info based on it's ID which is auto generated in mongoDB.
const getjobpostingwithID = (req, res, next) => {
  if (req.params === undefined) {
    CONSTANTS.createLogMessage(FILE_NAME, 'Parameter not found', 'ERROR');
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.NOT_FOUND,
      'Parameter not found',
      next
    );
  } else {
    mongooseMiddleware.findbyID(
      JobPosting,
      res,
      next,
      FILE_NAME,
      req.params.jobID
    );
  }
};

//Updates the researchers information.
const updateJobPosting = (req, res, next) => {
  var searchcriteria = { _id: req.params.jobID };
  loginMiddleware
    .checkifDataExists(JobPosting, req, res, next, searchcriteria, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        if (req.body.skills.toString().includes(',')) {
          var skills = req.body.skills;
          var skillsArr = skills.split(',');
        } else {
          var skillsArr = req.body.vskills.toString();
        }
        let newJobPosting = new JobPosting({
          jobTitle: req.body.jobTitle,
          description: req.body.description,
          weeklycommitment: req.body.weeklycommitment,
          skills: skillsArr,
        });
        var upsertData = newJobPosting.toObject();
        delete upsertData._id;
        var parameterToPass = result.userID.toString() + ',' + req.params.jobID;
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
        );
      } else {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          'ERROR'
        );
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        );
      }
    });
};

//Delete the job posting
const deleteJobPosting = (req, res, next) => {
  var searchcriteria = { _id: req.params.jobID };
  loginMiddleware
    .checkifDataExists(JobPosting, req, res, next, searchcriteria, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        var parameterToPass = result.userID.toString() + ',' + req.params.jobID;
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
        );
      } else {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          'ERROR'
        );
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        );
      }
    });
};

//Search a job posting based on skills
const getJobPostingbySearch = (req, res, next) => {
  if (req.params.search.toString().includes(',')) {
    var search = req.params.search;
    var searchArr = search.split(',');
    var searchcriteria = { skills: { $in: searchArr } };
  } else if (!isNaN(req.params.search)) {
    var searchcriteria = {
      weeklycommitment: { $lte: req.params.search },
    };
  } else {
    var searchArr = [req.params.search.toString()];
    var searchcriteria = { skills: { $in: searchArr } };
  }

  // If search has pagination options, return paginated result
  if (req.query && req.query.page && req.query.limit && req.query.filter) {
    const { page, limit, filter } = req.query;

    mongooseMiddleware.paginatedFindAllBasedOnCriteria(
      JobPosting,
      res,
      next,
      FILE_NAME,
      searchcriteria,
      { page, limit, filter }
    );
  } else {
    mongooseMiddleware.findallbasedonCriteria(
      JobPosting,
      res,
      next,
      FILE_NAME,
      searchcriteria
    );
  }
};

//Search Job Postings based on Researcher ID
const getMyJobPostings = (req, res, next) => {
  var searchcriteria = { _id: req.params.userID };
  loginMiddleware
    .checkifDataExists(User, req, res, next, searchcriteria, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        if (result.type.toString() === 'Volunteer') {
          CONSTANTS.createLogMessage(
            FILE_NAME,
            CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
            'ERROR'
          );
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.UNAUTHORIZED,
            CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
            next
          );
        } else {
          postAuthentication.postAuthentication(
            req,
            res,
            next,
            publicKEY,
            FILE_NAME,
            req.params.userID.toString(),
            mongooseMiddleware.searchMultipleDatawithuserID,
            JobPosting,
            null
          );
        }
      } else {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          'ERROR'
        );
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        );
      }
    });
};
module.exports = {
  addNewJobPosting,
  getJobPostings,
  getjobpostingwithID,
  updateJobPosting,
  deleteJobPosting,
  getJobPostingbySearch,
  getMyJobPostings,
};
