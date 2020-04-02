/**
 * @file volunteerRoutes.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/27/2020
 */

 //Importing volunteer Controller
const volunteerController = require('../controller/volunteerController')
const express = require('express')
const router = express.Router()

//get all the volunteers
router.get('/', function (req, res,next) {
  volunteerController.getVolunteers(res,next);
})

//Register a new Volunteer
router.post('/registration', function (req, res,next) {
  volunteerController.addNewVolunteer(req, res,next)
})

//Get a particular volunteer
router.get('/:volunteerID', function (req, res,next) {
  volunteerController.getVolunteerWithID(req,res,next) 
})

//Update a volunteer
router.put('/update/:volunteerID/', function (req, res,next) {
  volunteerController.updateVolunteer(req, res,next)
})

//Delete a volunteer
router.delete('/delete/:volunteerID/', function (req, res,next) {
  volunteerController.deleteVolunteer(req, res,next)
})

//Authenticate a volunteer
router.post('/login',function(req,res,next){
  volunteerController.getVolunteerLogin(req,res)
})

//Get Volunteer Info
router.get('/volunteerinfo/:volunteerID',function(req,res,next){
  volunteerController.getVolunteerInfoWithID(req,res,next)
})

//Get Volunteer Info based on first name last name or emailid
router.get('/findvolunteer/:search',function(req,res,next){
  volunteerController.findVolunteer(req,res,next)
})

module.exports = router