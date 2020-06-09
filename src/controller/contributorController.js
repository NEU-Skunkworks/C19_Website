/**
 * @file contributorController.js
 * @author Zihao Zheng
 * @version 1.0
 * createdDate: 05/28/2020
 */

//import mongoose
const mongoose = require('mongoose');
//Importing constants
const CONSTANTS = require('../CONSTANTS/constants');
//import contributor Schema
const ContributorSchema = require('../model/contributorModel');
//Create a variable of type mongoose schema for contributor
const Contributor = mongoose.model('ContributorSchema', ContributorSchema);
//public key path
const decodedkey=require('./common_controllers/keydecoder')
var publicKEY = decodedkey.decodedkey(process.env.RESEARCHER_PUBLIC_KEY.toString("utf8"));
//import post authentication controller
const postAuthentication = require('./common_controllers/postAuthenticationController');
//import mongoose queries
const mongooseMiddleware = require('../middleware/mongooseMiddleware');
//Declaring the file name
const FILE_NAME = 'contributorController.js';
//import login constants
const loginMiddleware = require('../middleware/loginMiddleware');
//import Schema
const UserSchema = require('../model/userModel');
//Create a variable of type mongoose schema for Researcher
const User = mongoose.model('UserSchema', UserSchema);

//This functionality adds a new contributor with all the required fields from the body.
const addNewContributor = (req, res, next) => {
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
          
          let newContributor = new Contributor({
          
            name: req.body.name,
            description: req.body.description,
            skill: req.body.skill,
            link: req.body.link,
           
          });
          postAuthentication.postAuthentication(
            req,
            res,
            next,
            publicKEY,
            FILE_NAME,
            req.params.userID,
            mongooseMiddleware.addNewData,
            newContributor,
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

//This function gets all the contributors currently in the database.
const getContributors = (req, res, next) => {
  mongooseMiddleware.findALL(Contributor, res, next, FILE_NAME);
};


//Updates the contributor information.
const updateContributor = (req, res, next) => {
  var searchcriteria = { _id: req.params.contributorID };
  loginMiddleware
    .checkifDataExists(Contributor, req, res, next, searchcriteria, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        
        let newContributor = new Contributor({
          name: req.body.name,
          description: req.body.description,
          skill: req.body.skill,
          link: req.body.link,
          
        });
        var upsertData = newContributor.toObject();
        delete upsertData._id;
        postAuthentication.postAuthentication(
          req,
          res,
          next,
          publicKEY,
          FILE_NAME,
          req.params.contributorID,
          mongooseMiddleware.updateData,
          Contributor,
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

//Delete the contributor
const deleteContributor = (req, res, next) => {
  var searchcriteria = { _id: req.params.contributorID };
  loginMiddleware
    .checkifDataExists(Contributor, req, res, next, searchcriteria, FILE_NAME)
    .then((result) => {
      if (result != undefined && result != null) {
        postAuthentication.postAuthentication(
          req,
          res,
          next,
          publicKEY,
          FILE_NAME,
          req.params.contributorID,
          mongooseMiddleware.deleteData,
          Contributor,
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

module.exports = {
  addNewContributor,
  getContributors,
  updateContributor,
  deleteContributor,
  
};
