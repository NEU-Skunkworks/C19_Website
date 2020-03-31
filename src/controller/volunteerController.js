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
const mongooseQueries = require('../CONSTANTS/mongooseQueries')
//import login controller
const loginController = require('./loginController')


//This functionality adds a new volunteer with all the required fields from the body.
const addNewVolunteer = (req, res, next) => {
  //Encrypt the password
  bcrypt.hash(req.body.vpassword, 10, (err, hash) => {
    //Error
    if (err) {
      //Add data to the logger file
      CONSTANTS.createLogMessage(FILE_NAME, err, 'Error')
      //send back the json response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.FAILED,
        err.errmsg,
        next
      )
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
      vgender: req.body.vgender,
      vworks_experience_years: req.body.vworks_experience_years
    })
    //Adding multiple values for work Experience.
    newVolunteer.vwork_experience = Object.values(req.body.vwork_experience)
    //Adding multiple values  for education.
    newVolunteer.veducation = Object.values(req.body.veducation)
    //Save the data
    mongooseQueries.addNewData(newVolunteer, req, res, next, FILE_NAME)
  })
}

//This function gets all the volunteers currently in the database. (Can be used for analytical purposes)
const getVolunteers = (req, res, next) => {
  //Mongoose function to find all the volunteers from the volunteer schema
  mongooseQueries.findALL(Volunteer, req, res, next, FILE_NAME)
}

/*This function will retrieve a volunteers info based on it's ID which is auto generated in mongoDB.
This requires token authentication*/
const getVolunteerWithID = (req, res, next) => {
  //Authhenticate user
  CONSTANTS.authenticateUser(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.volunteerID
  )
  mongooseQueries.findbyID(
    Volunteer,
    req,
    res,
    next,
    FILE_NAME,
    req.params.volunteerID
  )
}

//Updates the volunteer information.
const updateVolunteer = (req, res, next) => {
  //Authenticate user
  CONSTANTS.authenticateUser(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.volunteerID
  )
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
  //Mongoose function to update a single volunteer
  mongooseQueries.updateData(
    Volunteer,
    req,
    res,
    next,
    FILE_NAME,
    req.params.volunteerID,
    upsertData
  )
}

//Delete the volunteer information.
const deleteVolunteer = (req, res, next) => {
  //Authenticate user
  CONSTANTS.authenticateUser(
    req,
    res,
    next,
    publicKEY,
    FILE_NAME,
    req.params.volunteerID
  )
  //mongoose function to delete one Volunteer
  mongooseQueries.deleteData(
    Volunteer,
    req,
    res,
    next,
    FILE_NAME,
    req.params.volunteerID
  )
}

//Authenticate the volunteer.
const getVolunteerLogin = (req, res, next) => {
  //Check of the volunteer exists using their email ID.
  loginController.loginAuthentication(
    Volunteer,
    req,
    res,
    next,
    req.body.vemail,
    req.body.vpassword,
    FILE_NAME,
    privateKEY,
    'Volunteer'
  )
}

/*This function will retrieve a volunteers info based on it's ID which is auto generated in mongoDB.
Does not require authentication of any kind. Can be used to share the profile and for a researcher to see 
a volunteer's profile*/
const getVolunteerInfoWithID = (req, res, next) => {
  mongooseQueries.findbyID(
    Volunteer,
    req,
    res,
    next,
    FILE_NAME,
    req.params.volunteerID
  )
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
