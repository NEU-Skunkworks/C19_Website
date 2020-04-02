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
router.get('/', function (req, res,next) {
  researchController.getResearchers(res,next)
})
//Get a new Researcher
router.post('/registration', function (req, res,next) {
  researchController.addNewResearcher(req, res,next)
})
//Get a researcher with by id
router.get('/:researcherID', function (req, res,next) {
  researchController.getResearcherWithID(req, res,next)
})

//Update a researcher
router.put('/update/:researcherID', function (req, res,next) {
  researchController.updateResearcher(req, res,next)
})

//Delete a researcher
router.delete('/delete/:researcherID', function (req, res,next) {
  researchController.deleteResearcher(req, res,next)
})

//Authenticate a researcher.
router.post('/login', function (req, res,next) {
  researchController.getResearcherLogin(req, res,next)
})

//Get a researcher with by id without authentication
router.get('/researcherinfo/:researcherID', function (req, res,next) {
  researchController.getResearcherInfoWithID(req, res,next)
})

//Get Researcher Info based on first name last name or emailid
router.get('/findresearcher/:search',function(req,res,next){
  researchController.findResearcher(req,res,next)
})
module.exports = router
