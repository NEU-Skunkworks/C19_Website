/**
 * @file researcherRoutes.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

 //import the research controller
const researchController = require('../controller/researcherController')
const express = require('express')
const router = express.Router()

//Get all the researchers
router.get('/', function (req, res) {
  researchController.getResearchers(req, res)
})
//Get a new Researcher
router.post('/registration', function (req, res) {
  researchController.addNewResearcher(req, res)
})
//Get a researcher with by id
router.get('/:researcherID', function (req, res) {
  researchController.getResearcherWithID(req, res)
})

//Update a researcher
router.put('/:researcherID', function (req, res) {
  researchController.updateResearcher(req, res)
})

//Delete a researcher
router.delete('/:researcherID', function (req, res) {
  researchController.deleteResearcher(req, res)
})

//Authenticate a researcher.
router.post('/login', function (req, res) {
  researchController.getResearcherLogin(req, res)
})
module.exports = router
