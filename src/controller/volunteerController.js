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

const CONSTANTS = require('../CONSTANTS/constants')
const LOGGER = require('../Logger/logger')
const Volunteer = mongoose.model('VolunteerSchema', VolunteerSchema)
//importing bcrypt to hash the user entered password for security.
const bcrypt = require('bcrypt')
//importing jwt token to assign to the user once authenticated
const jwt = require('jsonwebtoken')
//importing file system to get the public and private key for creating public and private keys.
const fs = require('fs')
//private key path
var privateKEY = fs.readFileSync('./.env/private.key', 'utf8')
//public key path
var publicKEY = fs.readFileSync('./.env/public.key', 'utf8')

//Defining the Sign in options. To be used in json web tokens
var signOptions = {
  expiresIn: '12h',
  algorithm: 'RS256'
}

const FILE_NAME = 'volunteerController.js'
//This functionality adds a new volunteer with all the required fields from the body.
const addNewVolunteer = (req, res) => {
  //Encrypt the password
  bcrypt.hash(req.body.vpassword, 10, function (err, hash) {
    //Error
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.SERVERERROR })
    }
    //Parse the skills as string and split it based on ", " to create an array of skills for the user.
    var skills = req.body.vskills
    var skillsArr = skills.split(', ')

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
        LOGGER.info(
          Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
        )
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.SERVERERROR })
      }
      //Return the success message if successfully added.
      LOGGER.info(
        Date.now +
          ' Successfully created user ' +
          FILE_NAME +
          ' user: ' +
          req.body.vemail
      )
      res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
    })
  })
}

//This function gets all the volunteers currently in the database.
const getVolunteers = (req, res) => {
  Volunteer.find({}, (err, volunteer) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(
      Date.now +
        ' Successfully searched all volunteers ' +
        FILE_NAME +
        ' user: ' +
        req.body.vemail
    )
    res.json({ data: volunteer })
  })
}

//This function will retrieve a volunteers info based on it's ID which is auto generated in mongoDB.
const getVolunteerWithID = (req, res) => {
  Volunteer.findById(req.params.volunteerID, (err, volunteer) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(
      Date.now +
        ' Successfully searched for a volunteer ' +
        FILE_NAME +
        ' user: ' +
        req.body.vemail
    )
    res.json({ data: volunteer })
  })
}

//Updates the volunteer information.
const updateVolunteer = (req, res) => {
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
    vwork_experience: req.body.vwork_experience,
    vworks_experience_years: req.body.vworks_experience_years,
    veducation: req.body.veducation
  })
  Volunteer.findOneAndUpdate(
    { _id: req.params.volunteerID },
    newVolunteer,
    { new: true, useFindAndModify: false },
    (err, volunteer) => {
      if (err) {
        LOGGER.info(
          Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
        )
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
      }
      LOGGER.info(
        Date.now +
          ' Successfully updated user ' +
          FILE_NAME +
          ' user: ' +
          req.body.vemail
      )
      res.json({ data: volunteer })
    }
  )
}

//Delete the volunteer information.
const deleteVolunteer = (req, res) => {
  Volunteer.deleteOne({ _id: req.params.volunteerID }, (err, volunteer) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(
      Date.now +
        ' Successfully deleted user ' +
        FILE_NAME +
        ' user: ' +
        req.body.vemail
    )
    res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
  })
}

//Authenticate the volunteer.
const getVolunteerLogin = (req, res) => {
  //Check of the volunteer exists using their email ID.
  Volunteer.findOne({ vemail: req.body.vemail }).then(volunteer => {
    //If the volunteer does not exist.
    if (!volunteer) {
      //Error
      LOGGER.info(
        Date.now +
          ' Invalid email/password ' +
          FILE_NAME +
          ' user: ' +
          req.body.vemail
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.LOGINERROR })
    } else {
      //If the volunteer exists then compare their password entered with the password in the database
      bcrypt.compare(
        req.body.vpassword.toString(),
        volunteer.vpassword.toString(),
        function (err, match) {
          //If password same create the json web token.
          if (match == true) {
            var payload = {
              email: volunteer.vemail.toString()
            }
            var token = jwt.sign(payload, privateKEY, signOptions)
            //return the token
            LOGGER.info(
              Date.now +
                ' Successful Login ' +
                FILE_NAME +
                ' user: ' +
                req.body.vemail
            )
            res.json({ token: token })
          } else {
            //error
            LOGGER.info(
              Date.now +
                ' Invalid email/password ' +
                FILE_NAME +
                ' user: ' +
                req.body.vemail
            )
            res.json({ error: CONSTANTS.ERROR_DESCRIPTION.LOGINERROR })
          }
        }
      )
    }
  })
}

module.exports = {
  addNewVolunteer,
  getVolunteerLogin,
  getVolunteerWithID,
  deleteVolunteer,
  getVolunteers,
  updateVolunteer
}
