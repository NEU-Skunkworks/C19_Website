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
var verifyOptions = {
  expiresIn: '12h',
  algorithm: ['RS256']
}

const FILE_NAME = 'researcherController.js'
const LOGGER = require('../Logger/logger')
//import constants file
const CONSTANTS = require('../CONSTANTS/constants')
//This functionality adds a new researcher with all the required fields from the body.
const addNewResearcher = (req, res, next) => {
  let today = new Date()
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds()
  //Encrypt the password
  bcrypt.hash(req.body.rpassword, 10, (err, hash) => {
    //Error
    if (err) {
      LOGGER.info(date + ' Error occured in ' + FILE_NAME + ' message: ' + err)
      res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      res.end()
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
        LOGGER.info(
          date + ' Error occured in ' + FILE_NAME + ' message: ' + err
        )
        res.status(CONSTANTS.ERROR_CODE.FAILED)
        res.json({ error: err.errmsg })
        res.end()
      }
      //Return the success mesage if successfully added.
      LOGGER.info(
        date +
          ' Successfully created new user ' +
          FILE_NAME +
          ' user: ' +
          req.body.remail
      )
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
      res.end()
    })
  })
}

//This function gets all the researchers currently in the database.
const getResearchers = (req, res, next) => {
  let today = new Date()
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds()
  Researcher.find({}, (err, researcher) => {
    if (err) {
      LOGGER.info(date + ' Error occured in ' + FILE_NAME + ' message: ' + err)
      res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      next()
    }
    LOGGER.info(
      date +
        ' Successfully searched for all researchers ' +
        FILE_NAME +
        ' user: ' +
        req.body.remail
    )
    res.status(CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS)
    res.json({ data: researcher })
    next()
  })
}

//This function will retrieve a researchers info based on it's ID which is auto generated in mongoDB.
const getResearcherWithID = (req, res, next) => {
  let today = new Date()
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds()
  //Get the token value from the header
  let token = req.headers['x-access-token'] || req.headers['authorization']
  //If token is undefined send back the unauthorized error.
  if (token === undefined) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  //If token starts with Bearer then slice the token
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length)
  }
  //Decode the token value based on the public key value.
  var checkForAuthentication = jwt.verify(token, publicKEY, verifyOptions)
  if (checkForAuthentication === null) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  //If the checkauthentication variable does not have an id property then give unauthorized error.
  if (checkForAuthentication.hasOwnProperty('id') === false) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  } else if (checkForAuthentication.id != req.params.researcherID) {
    /*Check if the user sending the request and the user the request id made for are equal or not. 
  That was we maintain authentication that only the user who has logged in is viewing their data*/
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  Researcher.findById(req.params.researcherID, (err, researcher) => {
    if (err) {
      LOGGER.info(date + ' Error occured in' + FILE_NAME + 'message: ' + err)
      res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      next()
    }
    if (researcher === null) {
      LOGGER.info(date + ' User not found ' + FILE_NAME)
      res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      next()
    } else {
      LOGGER.info(
        date +
          ' Successfully searched for a researcher ' +
          FILE_NAME +
          researcher.remail
      )
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({ data: researcher })
      next()
    }
  })
}

//Updates the researchers information.
const updateResearcher = (req, res, next) => {
  let today = new Date()
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds()

  let token = req.headers['x-access-token'] || req.headers['authorization']
  if (token === undefined) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }
  var checkForAuthentication = jwt.verify(token, publicKEY, verifyOptions)
  if (checkForAuthentication === null) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  } else if (checkForAuthentication.hasOwnProperty('id') === false) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  } else if (checkForAuthentication.id != req.params.researcherID) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
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
        LOGGER.info(
          date + ' Error occured in ' + FILE_NAME + ' message: ' + err
        )
        res.status(CONSTANTS.ERROR_CODE.BAD_REQUEST)
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.SERVERERROR })
        next()
      }
      LOGGER.info(
        date +
          ' Successfully updated user ' +
          FILE_NAME +
          ' user: ' +
          req.body.remail
      )
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({
        data: researcher,
        message: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS_UPDATE
      })
      next()
    }
  )
}

//Delete the researchers information.
const deleteResearcher = (req, res, next) => {
  let today = new Date()
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds()
  let token = req.headers['x-access-token'] || req.headers['authorization']
  if (token === undefined) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }
  var checkForAuthentication = jwt.verify(token, publicKEY, verifyOptions)
  if (checkForAuthentication === null) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  } else if (checkForAuthentication.hasOwnProperty('id') === false) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  } else if (checkForAuthentication.id != req.params.researcherID) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }

  Researcher.findOneAndDelete(
    { _id: req.params.researcherID },
    (err, researcher) => {
      if (err) {
        LOGGER.info(date + ' Error occured in' + FILE_NAME + 'message: ' + err)
        res.status(CONSTANTS.ERROR_CODE.BAD_REQUEST)
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.BAD_REQUEST })
        next()
      }
      LOGGER.info(
        date +
          ' Successfully deleted user ' +
          FILE_NAME +
          ' user: ' +
          req.body.remail
      )
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
      next()
    }
  )
}

//Authenticate the researcher.
const getResearcherLogin = (req, res, next) => {
  let today = new Date()
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds()
  //Check of the researcher exists using their email ID.
  Researcher.findOne({ remail: req.body.remail }).then(researcher => {
    //If the researcher doesnot exist.
    if (!researcher) {
      //Error
      LOGGER.info(
        date +
          ' Invalid email/password ' +
          FILE_NAME +
          ' message: ' +
          req.body.remail
      )
      res.status(CONSTANTS.ERROR_CODE.NO_DATA_FOUND)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.LOGINERROR })
      next()
    } else {
      //If the researcher exists then compare their password entered with the password in the database
      bcrypt.compare(
        req.body.rpassword.toString(),
        researcher.rpassword.toString(),
        function (err, match) {
          //If password same create the json web token.
          if (match == true) {
            var payload = {
              id: researcher._id.toString()
            }
            var token = jwt.sign(payload, privateKEY, signOptions)
            //return the token
            LOGGER.info(
              date +
                'Successful Login' +
                FILE_NAME +
                ' user: ' +
                req.body.remail
            )
            res.status(CONSTANTS.ERROR_CODE.SUCCESS)
            res.json({ token: token, userid: researcher._id })
          } else {
            //error
            LOGGER.info(
              date +
                ' Invalid email/password ' +
                FILE_NAME +
                'user: ' +
                req.body.remail
            )
            res.status(CONSTANTS.ERROR_CODE.NO_DATA_FOUND)
            res.json({ error: CONSTANTS.ERROR_DESCRIPTION.LOGINERROR })
          }
        }
      )
    }
  })
}

//This can be used if a volunteer wants to pull up a Researcher info before applying for the job.
const getResearcherInfoWithID = (req, res, next) => {
  let today = new Date()
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds()
  Researcher.findById(req.params.researcherID, (err, researcher) => {
    if (err) {
      LOGGER.info(date + ' Error occured in' + FILE_NAME + 'message: ' + err)
      res.status(CONSTANTS.ERROR_CODE.BAD_REQUEST)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.SERVERERROR })
      next()
    }
    if (researcher === null) {
      LOGGER.info(date + ' UnAuthorized access ' + FILE_NAME)
      res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      next()
    } else {
      LOGGER.info(
        date +
          ' Successfully searched for a researcher ' +
          FILE_NAME +
          researcher.remail
      )
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({ data: researcher })
      next()
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
