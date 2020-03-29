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
var privateKEY = fs.readFileSync('./.env/private.key', 'utf8')
//public key path
var publicKEY = fs.readFileSync('./.env/public.key', 'utf8')

//Defining the Sign in options. To be used in json web tokens
var signOptions = {
  expiresIn: '12h',
  algorithm: 'RS256'
}

const FILE_NAME = 'researcherController.js'
const LOGGER = require('../Logger/logger')

//This functionality adds a new researcher with all the required fields from the body.
const addNewResearcher = (req, res) => {
  //Encrypt the password
  bcrypt.hash(req.body.rpassword, 10, function (err, hash) {
    //Error
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.SERVERERROR })
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
          Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
        )
        res.json({ error: CONSTANTS.ERROR_DESCRIPTION.SERVERERROR })
      }
      //Return the success mesage if successfully added.
      LOGGER.info(
        Date.now +
          ' Successfully created new user ' +
          FILE_NAME +
          ' user: ' +
          req.body.remail
      )
      res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
    })
  })
}

//This function gets all the researchers currently in the database.
const getResearchers = (req, res) => {
  Researcher.find({}, (err, researcher) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in ' + FILE_NAME + ' message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(
      Date.now +
        ' Successfully searched for all researchers ' +
        FILE_NAME +
        ' user: ' +
        req.body.remail
    )
    res.json({ data: researcher })
  })
}

//This function will retrieve a researchers info based on it's ID which is auto generated in mongoDB.
const getResearcherWithID = (req, res) => {
  Researcher.findById(req.params.researcherID, (err, researcher) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in' + FILE_NAME + 'message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(
      Date.now +
        ' Successfully searched for researcher ' +
        FILE_NAME +
        ' user: ' +
        req.body.remail
    )
    res.json({ data: researcher })
  })
}

//Updates the researchers information.
const updateResearcher = (req, res) => {
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
  Researcher.findOneAndUpdate(
    { _id: req.params.researcherID },
    newResearcher,
    { new: true, useFindAndModify: false },
    (err, researcher) => {
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
          req.body.remail
      )
      res.json({ data: researcher })
    }
  )
}

//Delete the researchers information.
const deleteResearcher = (req, res) => {
  Researcher.deleteOne({ _id: req.params.researcherID }, (err, researcher) => {
    if (err) {
      LOGGER.info(
        Date.now + ' Error occured in' + FILE_NAME + 'message: ' + err
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND })
    }
    LOGGER.info(
      Date.now +
        ' Successfully deleted user ' +
        FILE_NAME +
        ' user: ' +
        req.body.remail
    )
    res.json({ data: CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS })
  })
}

//Authenticate the researcher.
const getResearcherLogin = (req, res) => {
  //Check of the researcher exists using their email ID.
  Researcher.findOne({ remail: req.body.remail }).then(researcher => {
    //If the researcher doesnot exist.
    if (!researcher) {
      //Error
      LOGGER.info(
        Date.now +
          ' Invalid email/password ' +
          FILE_NAME +
          ' message: ' +
          req.body.remail
      )
      res.json({ error: CONSTANTS.ERROR_DESCRIPTION.LOGINERROR })
    } else {
      //If the researcher exists then compare their password entered with the password in the database
      bcrypt.compare(
        req.body.rpassword.toString(),
        researcher.rpassword.toString(),
        function (err, match) {
          //If password same create the json web token.
          if (match == true) {
            var payload = {
              email: researcher.remail.toString()
            }
            var token = jwt.sign(payload, privateKEY, signOptions)
            //return the token
            LOGGER.info(
              Date.now +
                'Successful Login' +
                FILE_NAME +
                ' user: ' +
                req.body.remail
            )
            res.json({ token: token })
          } else {
            //error
            LOGGER.info(
              Date.now +
                ' Invalid email/password ' +
                FILE_NAME +
                'user: ' +
                req.body.remail
            )
            res.json({ error: CONSTANTS.ERROR_DESCRIPTION.LOGINERROR })
          }
        }
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
  updateResearcher
}
