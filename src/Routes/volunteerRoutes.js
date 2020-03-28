/**
 * @file volunteerRoutes.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/27/2020
 */

const volunteerController = require('../controller/volunteerController')
const express = require('express')
const router = express.Router()
router.get('/', function (req, res) {
  volunteerController.getVounteers
})
router.post('/', function (req, res) {
  volunteerController.addNewVolunteer(req, res)
})
router.get('/:volunteerID', function (req, res) {
  volunteerController.getVolunteerWithID(req, res)
})
router.put('/:volunteerID', function (req, res) {
  volunteerController.updateVolunteer(req, res)
})
router.delete('/:volunteerID', function (req, res) {
  volunteerController.deleteVolunteer(req, res)
})
router.post('/login',function(req,res){
  volunteerController.getVolunteerLogin(req,res)
})
module.exports = router