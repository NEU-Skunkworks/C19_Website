/**
 * @file volunteerController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/27/2020
 */

//import mongoose
const mongoose=require('mongoose');
//import Schema
const VolunteerSchema=require('../model/volunteerModel');

const Volunteer = mongoose.model('VolunteerSchema', VolunteerSchema)
//importing bcrypt to hash the user entered password for security.
const bcrypt = require('bcrypt')
//importing jwt token to assign to the user once authenticated
const jwt  = require('jsonwebtoken');
//importing file system to get the public and private key for creating public and private keys.
const fs   = require('fs');
//private key path
var privateKEY  = fs.readFileSync('./.env/private.key', 'utf8');
//public key path
var publicKEY  = fs.readFileSync('./.env/public.key', 'utf8');

//Defining the Sign in options. To be used in json web tokens
var signOptions = {
  expiresIn:  "12h",
  algorithm:  "RS256"
};

//This functionality adds a new volunteer with all the required fields from the body.
const addNewVolunteer = (req, res) => {
  //Encrypt the password
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    //Error
    if (err) {
      res.json({error:err})
    }
    //Parse the skills as string and split it based on ", " to create an array of skills for the user.
    var skills = req.body.skills
    var skillsArr = skills.split(', ')

    //Creating the variable to hold the data for fields
    let newVolunteer = new Volunteer({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
      phone: req.body.phone,
      age: req.body.age,
      skills: skillsArr,
      description: req.body.description,
      work_experience: req.body.work_experience,
      education: req.body.education
    })
    //Saving the data into the database.
    newVolunteer.save((err, volunteer) => {
      //Error
      if (err) {
        res.json({error:err})
      }
      //Return the volunteer data if successfully added.
      res.json({data:volunteer})
    })
  })
}

//This function gets all the volunteers currently in the database.
const getVolunteers = (req, res) => {
  Volunteer.find({}, (err, volunteer) => {
    if (err) {
      res.json({error:err})
    }
    res.json({data:volunteer})
  })
}

//This function will retrieve a volunteers info based on it's ID which is auto generated in mongoDB.
const getVolunteerWithID = (req, res) => {
  Volunteer.findById(req.params.volunteerID, (err, volunteer) => {
    if (err) {
      res.json({error:err})
    }
    res.json({data:volunteer})
  })
}

//Updates the volunteer information.
const updateVolunteer = (req, res) => {
  let hash = bcrypt.hash(req.body.password, 10)
  var skills = req.body.skills
  var skillsArr = skills.split(', ')
  let newVolunteer = new Volunteer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hash,
    phone: req.body.phone,
    age: req.body.age,
    skills: skillsArr,
    description: req.body.description,
    work_experience: req.body.work_experience,
    education: req.body.education
  })
  Volunteer.findOneAndUpdate(
    { _id: req.params.volunteerID },
    newVolunteer,
    { new: true, useFindAndModify: false },
    (err, volunteer) => {
      if (err) {
        res.json({error:err})
      }
      res.json({data:volunteer})
    }
  )
}

//Delete the volunteer information.
const deleteVolunteer = (req, res) => {
  Volunteer.deleteOne({ _id: req.params.volunteerID }, (err, volunteer) => {
    if (err) {
      res.json({error:err})
    }
    res.json({ message: 'Successfully deleted Volunteer' })
  })
}

//Authenticate the volunteer.
const getVolunteerLogin = (req, res) => {
  //Check of the volunteer exists using their email ID.
  Volunteer.findOne({ email: req.body.email }).then(volunteer => {
    //If the volunteer doesnot exist.
    if (!volunteer) {
      //Error
      res.json({ error: 'Invalid Email/Password' })
    } else {
      //If the volunteer exists then compare their password entered with the password in the database
      bcrypt.compare(
        req.body.password.toString(),
        volunteer.password.toString(),
        function (err, match) {
          //If password same create the json web token.
          if (match == true) {
            var payload = {
              email: volunteer.email.toString(),
             };
            var token = jwt.sign(payload, privateKEY, signOptions);
            //return the token
            res.json({ token: token})
          } else {
            //error
            res.json({ error: 'Invalid Email/Password' })
          }
        }
      )
    }
  })
}

module.exports={addNewVolunteer,getVolunteerLogin,getVolunteerWithID,deleteVolunteer,getVolunteers,updateVolunteer}