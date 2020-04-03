/**
 * @file userRoutes.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 02/04/2020
 */

 //Importing volunteer Controller
 const userController = require('../controller/userController')
 const express = require('express')
 const router = express.Router()
 
 //get all the volunteers
 router.get('/', function (req, res,next) {
    userController.getAllUsers(res,next);
 })
 
 //Register a new Volunteer
 router.post('/registration', function (req, res,next) {
    userController.addNewUser(req, res,next)
 })
 
 //Get a particular volunteer
 router.get('/:userID', function (req, res,next) {
    userController.getUserWithID(req,res,next) 
 })
 
 //Update a volunteer
 router.put('/update/:userID', function (req, res,next) {
    userController.updateUser(req, res,next)
 })
 
 //Delete a volunteer
 router.delete('/delete/:userID', function (req, res,next) {
    userController.deleteUser(req, res,next)
 })
 
 //Authenticate a volunteer
 router.post('/login',function(req,res,next){
    userController.getUserLogin(req,res)
 })
 
 //Get Volunteer Info
 router.get('/userinfo/:userID',function(req,res,next){
    userController.getUserinfoWithID(req,res,next)
 })
 
 //Get Volunteer Info based on first name last name or emailid
 router.get('/finduser/:search',function(req,res,next){
    userController.findUser(req,res,next)
 })
 
 module.exports = router