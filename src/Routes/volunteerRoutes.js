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
router.get('/', function (req, res) {
  volunteerController.getVolunteers(req,res)
})

//Register a new Volunteer
router.post('/registration', function (req, res) {
  volunteerController.addNewVolunteer(req, res)
})

//Get a particular volunteer
router.get('/:volunteerID', function (req, res) {
  volunteerController.getVolunteerWithID(req, res)
})

//Update a volunteer
router.put('/:volunteerID', function (req, res) {
  volunteerController.updateVolunteer(req, res)
})

//Delete a volunteer
router.delete('/:volunteerID', function (req, res) {
  volunteerController.deleteVolunteer(req, res)
})

//Authenticate a volunteer
router.post('/login',function(req,res){
  volunteerController.getVolunteerLogin(req,res)
})
module.exports = router