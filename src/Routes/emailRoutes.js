/**
 * @file emailRoutes.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 04/03/2020
 */

//Importing the Job Posting Controller.
const emailController = require('../controller/emailController')
const express = require('express')
const router = express.Router()

//Confirm Email
router.post('/confirmEmail/:userID', function (req, res, next) {
  emailController.confirmEmail(req, res, next)
})

module.exports = router
