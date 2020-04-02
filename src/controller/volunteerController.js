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
//Create a variable of type mongoose schema for Volunteer
const Volunteer = mongoose.model('VolunteerSchema', VolunteerSchema)
//importing bcrypt to hash the user entered password for security.
const bcrypt = require('bcrypt')
//importing file system to get the public and private key for creating public and private keys.
const fs = require('fs')
//private key path
var privateKEY = fs.readFileSync('./.env/researcher_keys/private.key', 'utf8')
//public key path
var publicKEY = fs.readFileSync('./.env/researcher_keys/public.key', 'utf8')
//import constants file
const CONSTANTS = require('../CONSTANTS/constants')
//Declaring the file name
const FILE_NAME = 'volunteerController.js'
//import mongoose queries
const mongooseMiddleware = require('../middleware/mongooseMiddleware')
//import login controller
const loginController = require('./common_controllers/loginController')
//import add user queries
const adduser = require('./common_controllers/addUserController')
//import post authentication controller
const postAuthentication = require('./common_controllers/postAuthenticationController')

//This functionality adds a new volunteer with all the required fields from the body.
const addNewVolunteer = (req, res, next) => {
  var searchcriteria = { vemail: req.body.vemail }
  if (req.body.vskills.toString().includes(',')) {
    var skills = req.body.vskills
    var skillsArr = skills.split(',')
  } else {
    var skillsArr = req.body.vskills.toString()
  }
  //Creating the variable to hold the data for fields
  let newVolunteer = new Volunteer({
    vfirstName: req.body.vfirstName,
    vlastName: req.body.vlastName,
    vemail: req.body.vemail,
    vage: req.body.vage,
    vskills: skillsArr,
    vgender: req.body.vgender,
    vworks_experience_years: req.body.vworks_experience_years
  })
  //Adding multiple values for work Experience.
  newVolunteer.vwork_experience = Object.values(req.body.vwork_experience)
  //Adding multiple values  for education.
  newVolunteer.veducation = Object.values(req.body.veducation)
  adduser.addnewUser(
    res,
    next,
    Volunteer,
    searchcriteria,
    FILE_NAME,
    req.body.vpassword,
    newVolunteer,
    'Volunteer'
  )
}

//This function gets all the volunteers currently in the database. (Can be used for analytical purposes)
const getVolunteers = (res, next) => {
  //Mongoose function to find all the volunteers from the volunteer schema
  mongooseMiddleware.findALL(Volunteer, res, next, FILE_NAME)
}

/*This function will retrieve a volunteers info based on it's ID which is auto generated in mongoDB.
This requires token authentication*/
const getVolunteerWithID = (req, res, next) => {
  //Authenticate user
  postAuthentication.postAuthentication(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.volunteerID,
    mongooseMiddleware.findbyID,
    Volunteer,
    null
  )
}

//Updates the volunteer information.
const updateVolunteer = (req, res, next) => {
  //Authenticate user
  let hash = bcrypt.hash(req.body.vpassword, 10)
  var skills = req.body.vskills
  var skillsArr = skills.split(', ')
  let newVolunteer = new Volunteer({
    vfirstName: req.body.vfirstName,
    vlastName: req.body.vlastName,
    vemail: req.body.vemail,
    vpassword: hash,
    vage: req.body.vage,
    vskills: skillsArr,
    vworks_experience_years: req.body.vworks_experience_years,
    vgender: req.body.vgender
  })
  //Adding multiple values for work Experience.
  newVolunteer.vwork_experience = Object.values(req.body.vwork_experience)
  //Adding multiple values  for education.
  newVolunteer.veducation = Object.values(req.body.veducation)
  //Parse the new volunteer variable as a object
  var upsertData = newVolunteer.toObject()
  //delete the id parameter in it
  delete upsertData._id
  postAuthentication.postAuthentication(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.volunteerID,
    mongooseMiddleware.updateData,
    Volunteer,
    upsertData
  )
}

//Delete the volunteer information.
const deleteVolunteer = (req, res, next) => {
  postAuthentication.postAuthentication(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.volunteerID,
    mongooseMiddleware.deleteData,
    Volunteer,
    null
  )
}

//Authenticate the volunteer.
const getVolunteerLogin = (req, res, next) => {
  //Check of the volunteer exists using their email ID.
  if (req.params === undefined) {
    CONSTANTS.createLogMessage(FILE_NAME, 'Parameter not found', 'ERROR')
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.NOT_FOUND,
      'Parameter not found',
      next
    )
  } else {
    loginController.loginAuthentication(
      Volunteer,
      req,
      res,
      next,
      req.body.vpassword,
      FILE_NAME,
      privateKEY,
      'Volunteer'
    )
  }
}

/*This function will retrieve a volunteers info based on it's ID which is auto generated in mongoDB.
Does not require authentication of any kind. Can be used to share the profile and for a researcher to see 
a volunteer's profile*/
const getVolunteerInfoWithID = (req, res, next) => {
  if (req.params === undefined) {
    CONSTANTS.createLogMessage(FILE_NAME, 'Parameter not found', 'ERROR')
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.NOT_FOUND,
      'Parameter not found',
      next
    )
  } else {
    mongooseMiddleware.findbyID(
      Volunteer,
      res,
      next,
      FILE_NAME,
      req.params.volunteerID
    )
  }
}

//Function to find user based on name or email
const findVolunteer = (req, res, next) => {
  if (req.params === undefined) {
    CONSTANTS.createLogMessage(FILE_NAME, 'Parameter not found', 'ERROR')
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.NOT_FOUND,
      'Parameter not found',
      next
    )
  } else {
    if (req.params.search.toString().includes(' ')) {
      var name = req.params.search.toString().split(' ')
      var searchcriteria = {
        vfirstName: name[0].toString(),
        vlastName: name[1].toString()
      }
    } else if (req.params.search.toString().includes('@')) {
      var searchcriteria = { vemail: req.params.search.toString() }
    } 
    else if(req.params.search.toString().includes(',')){
      var searchcriteria = {vskills: { $in: [req.params.search.toString().split(',')] }}
    }else {
      var searchcriteria = {
        $or: [
          { vfirstName: req.params.search.toString() },
          { vlastName: req.params.search.toString() },
          {vskills: { $in: [req.params.search.toString()] }}
        ]
      }
    }
    mongooseMiddleware.findOne(Volunteer, res, next, FILE_NAME, searchcriteria)
  }
}
module.exports = {
  addNewVolunteer,
  getVolunteerLogin,
  getVolunteerWithID,
  deleteVolunteer,
  getVolunteers,
  updateVolunteer,
  getVolunteerInfoWithID,
  findVolunteer
}
