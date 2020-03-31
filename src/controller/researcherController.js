/**
 * @file researchController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

//import mongoose
const mongoose = require('mongoose')
//import Schema
const ResearcherSchema = require('../model/researcherModel')
//Create a variable of type mongoose schema for Researcher
const Researcher = mongoose.model('ResearcherSchema', ResearcherSchema)
//importing bcrypt to hash the user entered password for security.
const bcrypt = require('bcrypt')
//importing jwt token to assign to the user once authenticated
const jwt = require('jsonwebtoken')
//importing file system to get the public and private key for creating public and private keys.
const fs = require('fs')
//private key path
var privateKEY = fs.readFileSync('./.env/researcher_keys/private.key', 'utf8')
//public key path
var publicKEY = fs.readFileSync('./.env/researcher_keys/public.key', 'utf8')
//Declare the file name
const FILE_NAME = 'researcherController.js'
//import constants file
const CONSTANTS = require('../CONSTANTS/constants')
//import mongoose queries
const mongooseQueries = require('../CONSTANTS/mongooseQueries')

//This functionality adds a new researcher with all the required fields from the body.
const addNewResearcher = (req, res, next) => {
  //Encrypt the password
  bcrypt.hash(req.body.rpassword, 10, (err, hash) => {
    //Error
    if (err) {
      CONSTANTS.createLogMessage(FILE_NAME, err, 'Error')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.FAILED,
        err.errmsg,
        next
      )
    }
    //Creating the variable to hold the data for fields
    let newResearcher = new Researcher({
      rfirstName: req.body.rfirstName,
      rlastName: req.body.rlastName,
      remail: req.body.remail,
      rpassword: hash,

      rphone: req.body.rphone,
      rage: req.body.rage,
      rinstitute: req.body.rinstitute
    })
    //Saving the data into the database.
    mongooseQueries.addNewData(newResearcher, req, res, next, FILE_NAME)
  })
}

//This function gets all the researchers currently in the database.
const getResearchers = (req, res, next) => {
  mongooseQueries.findALL(Researcher, req, res, next, FILE_NAME)
}

//This function will retrieve a researchers info based on it's ID which is auto generated in mongoDB.
const getResearcherWithID = (req, res, next) => {
  CONSTANTS.authenticateUser(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.researcherID
  )
  mongooseQueries.findbyID(
    Researcher,
    req,
    res,
    next,
    FILE_NAME,
    req.params.researcherID
  )
}

//Updates the researchers information.
const updateResearcher = (req, res, next) => {
  CONSTANTS.authenticateUser(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.researcherID
  )
  let hash = bcrypt.hash(req.body.rpassword, 10)
  let newResearcher = new Researcher({
    rfirstName: req.body.rfirstName,
    rlastName: req.body.rlastName,
    remail: req.body.remail,
    rpassword: hash,
    rphone: req.body.rphone,
    rage: req.body.rage,
    rinstitute: req.body.rinstitute
  })
  var upsertData = newResearcher.toObject()
  delete upsertData._id
  mongooseQueries.updateData(
    Researcher,
    req,
    res,
    next,
    FILE_NAME,
    req.params.researcherID,
    upsertData
  )
}

//Delete the researchers information.
const deleteResearcher = (req, res, next) => {
  CONSTANTS.authenticateUser(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.researcherID
  )

  mongooseQueries.deleteData(
    Researcher,
    req,
    res,
    next,
    FILE_NAME,
    req.params.researcher
  )
}

//Authenticate the researcher.
const getResearcherLogin = (req, res, next) => {
  //Check of the researcher exists using their email ID.
  Researcher.findOne({ remail: req.body.remail }, (err, researcher) => {
    if (err) {
      CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.FAILED,
        err.errmsg,
        next
      )
    }
    //If the researcher doesnot exist.
    if (!researcher) {
      //Error
      CONSTANTS.createLogMessage(FILE_NAME, 'Invalid email/username', 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
        CONSTANTS.ERROR_DESCRIPTION.LOGINERROR,
        next
      )
    } else if (researcher.loginAttempts === 3) {
      CONSTANTS.createLogMessage(FILE_NAME, 'Too many login attempts', 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.BAD_REQUEST,
        CONSTANTS.ERROR_DESCRIPTION.ATTEMPTERROR,
        next
      )
    } else {
      //If the researcher exists then compare their password entered with the password in the database
      bcrypt.compare(
        req.body.rpassword.toString(),
        researcher.rpassword.toString(),
        function (err, match) {
          if (err) {
            CONSTANTS.createLogMessage(FILE_NAME, 'Server Error', 'ERROR')
            CONSTANTS.createResponseWithoutNext(
              res,
              CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
              err.errmsg
            )
          }
          //If password same create the json web token.
          if (match == true) {
            var searchCriteria = { vemail: req.body.remail }
            var data = { $set: { loginAttempts: 0 } }
            mongooseQueries.updateOne(
              Researcher,
              req,
              res,
              next,
              FILE_NAME,
              searchCriteria,
              data
            )
            var payload = {
              id: researcher._id.toString()
            }
            var token = jwt.sign(payload, privateKEY, CONSTANTS.signOptions)
            //return the token
            CONSTANTS.createLogMessage(FILE_NAME, 'Token Generated', 'SUCCESS')
            var responsedata = {
              token: token,
              userid: researcher._id
            }
            CONSTANTS.createResponseWithoutNext(
              res,
              CONSTANTS.ERROR_CODE.SUCCESS,
              responsedata
            )
          } else {
            var searchCriteria = { vemail: req.body.remail }
            var data = { $inc: { loginAttempts: 1 } }
            mongooseQueries.updateOne(
              Researcher,
              req,
              res,
              next,
              FILE_NAME,
              searchCriteria,
              data
            )
            //error
            CONSTANTS.createLogMessage(
              FILE_NAME,
              'Invalid Email/Password',
              'ERROR'
            )
            CONSTANTS.createResponseWithoutNext(
              res,
              CONSTANTS.ERROR_CODE.NO_DATA_FOUND,
              CONSTANTS.ERROR_DESCRIPTION.LOGINERROR
            )
          }
        }
      )
    }
  })
}

//This can be used if a volunteer wants to pull up a Researcher info before applying for the job.
const getResearcherInfoWithID = (req, res, next) => {
  Researcher.findById(req.params.researcherID, (err, researcher) => {
    if (err) {
      CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NOT_FOUND,
        err.errmsg,
        next
      )
    }
    if (researcher === null) {
      CONSTANTS.createLogMessage(FILE_NAME, 'User not found', 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NOT_FOUND,
        'User does not Exist',
        next
      )
    } else {
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'User found successfully',
        'SUCCESS'
      )
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        researcher,
        next
      )
    }
  })
}

module.exports = {
  addNewResearcher,
  getResearcherLogin,
  getResearcherWithID,
  deleteResearcher,
  getResearchers,
  updateResearcher,
  getResearcherInfoWithID
}
