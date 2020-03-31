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

//Defining the Sign in options. To be used in json web tokens
var signOptions = {
  expiresIn: '12h',
  algorithm: 'RS256'
}
const FILE_NAME = 'researcherController.js'
//import constants file
const CONSTANTS = require('../CONSTANTS/constants')

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
        CONSTANTS.ERROR_DESCRIPTION.SERVERERROR,
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
    newResearcher.save((err, researcher) => {
      //Error
      if (err) {
        //Log in the error
        CONSTANTS.createLogMessage(FILE_NAME, err, 'Error')
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        )
      }
      //Return the success mesage if successfully added.
      //Return the success message if successfully added.
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully created user',
        'SUCCESS'
      )
      //Send the success reponse
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS,
        next
      )
    })
  })
}

//This function gets all the researchers currently in the database.
const getResearchers = (req, res, next) => {
  Researcher.find({}, (err, researcher) => {
    if (err) {
      //Log the error
      CONSTANTS.createLogMessage(FILE_NAME, 'ERROR', 'Error')
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_DESCRIPTION.FAILED,
        CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
        next
      )
    }
    //Log success message
    CONSTANTS.createLogMessage(
      FILE_NAME,
      'Successfully searched all volunteers',
      'SUCCESS'
    )
    //Send back the response
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.SUCCESS,
      researcher,
      next
    )
  })
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
  Researcher.findById(req.params.researcherID, (err, researcher) => {
    if (err) {
      CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NOT_FOUND,
        CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
        next
      )
    }
    if (researcher === null) {
      CONSTANTS.createLogMessage(FILE_NAME, 'User not Found', 'NODATA')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NOT_FOUND,
        CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
        next
      )
    } else {
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully searched user',
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
  Researcher.findOneAndUpdate(
    { _id: req.params.researcherID },
    { $set: upsertData },
    { new: true, useFindAndModify: false },
    (err, researcher) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          CONSTANTS.ERROR_DESCRIPTION.SERVERERROR,
          next
        )
      }
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully updated user',
        'SUCCESS'
      )
      //Send back the volunteer data along with the success update message
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        researcher,
        next
      )
    }
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

  Researcher.findOneAndDelete(
    { _id: req.params.researcherID },
    (err, researcher) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          CONSTANTS.ERROR_DESCRIPTION.SERVERERROR,
          next
        )
      }
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'User successfully deleted',
        'SUCCESS'
      )
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS_DELETE,
        next
      )
    }
  )
}

//Authenticate the researcher.
const getResearcherLogin = (req, res, next) => {
  //Check of the researcher exists using their email ID.
  Researcher.findOne({ remail: req.body.remail }).then(researcher => {
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
              CONSTANTS.ERROR_DESCRIPTION.LOGINERROR
            )
          }
          //If password same create the json web token.
          if (match == true) {
            var payload = {
              id: researcher._id.toString()
            }
            var token = jwt.sign(payload, privateKEY, signOptions)
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
        CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
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
