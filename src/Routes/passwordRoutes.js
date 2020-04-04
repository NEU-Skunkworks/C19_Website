/**
 * @file passwordRoutes.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 04/04/2020
 */

//Importing the Job Posting Controller.
const passwordController = require('../controller/passwordController')
const express = require('express')
const router = express.Router()

//Confirm Email
router.post('/passwordreset', function (req, res, next) {
  passwordController.requestresetPassword(req, res, next)
})
//Confirm Email
router.post('/confirmresetpassword', function (req, res, next) {
    passwordController.resetPassword(req, res, next)
  })

module.exports = router
