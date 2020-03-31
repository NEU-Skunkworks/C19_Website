/**
 * @file volunteerController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/27/2020
 */

//import mongoose
const mongoose = require('mongoose')
//import Schema
const VolunteerSchema = require('../model/volunteerModel')
//import constants file
const CONSTANTS = require('../CONSTANTS/constants')
//import logger file
const LOGGER = require('../Logger/logger')
//Create a variable of type mongoose schema for Volunteer
const Volunteer = mongoose.model('VolunteerSchema', VolunteerSchema)
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
//Specifying the verifying options for json web token
var verifyOptions = {
  expiresIn: '12h',
  algorithm: ['RS256']
}

//Declaring the file name
const FILE_NAME = 'volunteerController.js'

//This functionality adds a new volunteer with all the required fields from the body.
const addNewVolunteer = (req, res, next) => {
  //Declaring date to add to logger file
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
  bcrypt.hash(req.body.vpassword, 10 ,(err, hash) => {
    //Error
    if (err) {
      //Add data to the logger file
      LOGGER.info(date + ' Error occured in ' + FILE_NAME + ' message: ' + err)
      //send back the json response
      res.status(CONSTANTS.ERROR_CODE.FAILED)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.SERVERERROR })
      next()
    }
    //Parse the skills as string and split it based on "," to create an array of skills for the user.
    var skills = req.body.vskills
    var skillsArr = skills.split(',')

    //Creating the variable to hold the data for fields
    let newVolunteer = new Volunteer({
      vfirstName: req.body.vfirstName,
      vlastName: req.body.vlastName,
      vemail: req.body.vemail,
      vpassword: hash,
      vphone: req.body.vphone,
      vage: req.body.vage,
      vskills: skillsArr,
      vworks_experience_years: req.body.vworks_experience_years
    })
    //Adding multiple values for work Experience.
    newVolunteer.vwork_experience = Object.values(req.body.vwork_experience)
    //Adding multiple values  for education.
    newVolunteer.veducation = Object.values(req.body.veducation)
    //Saving the data into the database.
    newVolunteer.save((err, volunteer) => {
      //Error
      if (err) {
        //Log in the error
        LOGGER.info(
          date + ' Error occured in ' + FILE_NAME + ' message: ' + err
        )
        //Send the response
        res.status(CONSTANTS.ERROR_CODE.FAILED)
        res.json({ error: err.errmsg })
        next()
      }
      //Return the success message if successfully added.
      LOGGER.info(
        date +
          ' Successfully created user ' +
          FILE_NAME +
          ' user: ' +
          req.body.vemail
      )
      //Send the success reponse
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
      next()
    })
  })
}

//This function gets all the volunteers currently in the database. (Can be used for analytical purposes)
const getVolunteers = (req, res, next) => {
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
  //Mongoose function to find all the volunteers from the volunteer schema
  Volunteer.find({}, (err, volunteer) => {
    //error
    if (err) {
      //Log the error
      LOGGER.info(date + ' Error occured in ' + FILE_NAME + ' message: ' + err)
      //Send the response
      res.status({ error: CONSTANTS.ERROR_DESCRIPTION.FAILED })
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      next()
    }
    //Log success message
    LOGGER.info(
      date +
        ' Successfully searched all volunteers ' +
        FILE_NAME +
        ' user: ' +
        req.body.vemail
    )
    //Send back the response
    res.status(CONSTANTS.ERROR_CODE.SUCCESS)
    res.json({ data: volunteer })
    next()
  })
}

//This function will retrieve a volunteers info based on it's ID which is auto generated in mongoDB.
const getVolunteerWithID = (req, res, next) => {
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
  else if (checkForAuthentication.hasOwnProperty('id') === false) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  } else if (checkForAuthentication.id != req.params.volunteerID) {
  /*Check if the user sending the request and the user the request id made for are equal or not. 
  That was we maintain authentication that only the user who has logged in is viewing their data*/
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  //Mongoose function to find by ID
  Volunteer.findById(req.params.volunteerID, (err, volunteer) => {
    //Error
    if (err) {
      LOGGER.info(date + ' Error occured in ' + FILE_NAME + ' message: ' + err)
      res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
      next()
    }
    if (volunteer === null) {
      LOGGER.info(date + ' User not found ' + FILE_NAME)
      res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
      next()
      //res.end()
    } else {
      LOGGER.info(
        date +
          ' Successfully searched for a volunteer ' +
          FILE_NAME +
          volunteer.vemail
      )
      //Send back the Volunteer data for the volunteer id sent in the request parameter
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({ data: volunteer })
      next()
    }
  })
}

//Updates the volunteer information.
const updateVolunteer = (req, res, next) => {
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
  } else if (checkForAuthentication.id != req.params.volunteerID) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  let hash = bcrypt.hash(req.body.vpassword, 10)
  var skills = req.body.vskills
  var skillsArr = skills.split(', ')
  let newVolunteer = new Volunteer({
    vfirstName: req.body.vfirstName,
    vlastName: req.body.vlastName,
    vemail: req.body.vemail,
    vpassword: hash,
    vphone: req.body.vphone,
    vage: req.body.vage,
    vskills: skillsArr,
    vworks_experience_years: req.body.vworks_experience_years
  })
  //Adding multiple values for work Experience.
  newVolunteer.vwork_experience = Object.values(req.body.vwork_experience)
  //Adding multiple values  for education.
  newVolunteer.veducation = Object.values(req.body.veducation)

  //Parse the new volunteer variable as a object
  var upsertData = newVolunteer.toObject()
  //delete the id parameter in it
  delete upsertData._id
  //Mongoose function to update a single volunteer
  Volunteer.updateOne(
    { _id: req.params.volunteerID },
    { $set: upsertData },
    { upsert: true },
    (err, volunteer) => {
      if (err) {
        LOGGER.info(date + ' Error occured in ' + FILE_NAME + ' error: ' + err)
        res.status(CONSTANTS.ERROR_CODE.BAD_REQUEST)
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
        next()
      }
      LOGGER.info(date + ' Successfully updated user ' + FILE_NAME + ' user: ')
      //Send back the volunteer data along with the success update message
      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({
        data: volunteer,
        message: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS_UPDATE
      })
      next()
    }
  )
}

//Delete the volunteer information.
const deleteVolunteer = (req, res, next) => {
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
  } else if (checkForAuthentication.id != req.params.volunteerID) {
    LOGGER.info(date + ' User not authorized  ' + FILE_NAME)
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }

  //mongoose function to delete one Volunteer
  Volunteer.findOneAndDelete({ _id: req.params.volunteerID }, (err, volunteer) => {
    //Error
    if (err) {
      LOGGER.info(date + ' Error occured in ' + FILE_NAME + ' message: ' + err)
      res.status(CONSTANTS.ERROR_CODE.BAD_REQUEST)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.BAD_REQUEST })
      next()
    }
    LOGGER.info(
      date +
        ' Successfully deleted user ' +
        FILE_NAME +
        ' user: ' +
        req.body.vemail
    )
    res.status(CONSTANTS.ERROR_CODE.SUCCESS)
    res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
    next()
  })
}

//Authenticate the volunteer.
const getVolunteerLogin = (req, res, next) => {
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
  //Check of the volunteer exists using their email ID.
  Volunteer.findOne({ vemail: req.body.vemail },(err,volunteer)=> {
    //If the volunteer does not exist.
    if (!volunteer) {
      //Error
      LOGGER.info(
        date +
          ' Invalid email/password ' +
          FILE_NAME +
          ' user: ' +
          req.body.vemail
      )
      res.status(CONSTANTS.ERROR_CODE.NO_DATA_FOUND)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.LOGINERROR })
      next()
    } else {
      //If the volunteer exists then compare their password entered with the password in the database
      bcrypt.compare(
        req.body.vpassword.toString(),
        volunteer.vpassword.toString(),
        function (err, match) {
          //If password same create the json web token.
          if (match === true) {
            var payload = {
              id: volunteer._id.toString()
            }
            var token = jwt.sign(payload, privateKEY, signOptions)
            //return the token
            LOGGER.info(
              date +
                'Successful Login' +
                FILE_NAME +
                ' user: ' +
                req.body.vemail
            )
            res.status(CONSTANTS.ERROR_CODE.SUCCESS)
            res.json({ token: token, userid: volunteer._id })
          } else {
            //error
            LOGGER.info(
              date +
                ' Invalid email/password ' +
                FILE_NAME +
                ' user: ' +
                req.body.vemail
            )
            res.status(CONSTANTS.ERROR_CODE.NO_DATA_FOUND)
            res.json({ error: CONSTANTS.ERROR_DESCRIPTION.LOGINERROR })
          }
        }
      )
    }
  })
}

/*This function will retrieve a volunteers info based on it's ID which is auto generated in mongoDB.
Does not require authentication of any kind. Can be used to share the profile and for a researcher to see 
a volunteer's profile*/
const getVolunteerInfoWithID = (req, res, next) => {
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
  Volunteer.findById(req.params.volunteerID, (err, volunteer) => {
    if (err) {
      LOGGER.info(date + ' Error occured in ' + FILE_NAME + ' message: ' + err)
      res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      next()
    }
    if (volunteer === null) {
      LOGGER.info(date + ' User not found ' + FILE_NAME)
      res.status(CONSTANTS.ERROR_CODE.NOT_FOUND)
      res.json({ data: 'User does not Exist' })
      next()
    } else {
      LOGGER.info(
        date +
          ' Successfully searched for a volunteer ' +
          FILE_NAME +
          volunteer.vemail
      )

      res.status(CONSTANTS.ERROR_CODE.SUCCESS)
      res.json({ data: volunteer })
      next()
    }
  })
}
module.exports = {
  addNewVolunteer,
  getVolunteerLogin,
  getVolunteerWithID,
  deleteVolunteer,
  getVolunteers,
  updateVolunteer,
  getVolunteerInfoWithID
}
