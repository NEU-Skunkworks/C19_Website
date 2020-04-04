/**
 * @file Server.js
 * @author Mrunal Ghorpade
 * @version 1.0
 * createdDate: 03/27/2020
 */

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const path = require('path')

//Save the log details
const LOGGER = require(path.resolve('.') + '/src/Logger/logger.js')

//Port to expose
const port = 3000
require('dotenv').config()

//import the basic routes folder
const basicRoutes = require(path.resolve('.') + '/src/Routes/basicroutes.js')
//import the user routes
const userRoutes = require(path.resolve('.') + '/src/Routes/userRoutes.js')
const jobPostingRoutes = require(path.resolve('.') +
  '/src/Routes/jobPostingRoutes.js')
//import the job applications route
const jobApplicationsRoutes = require(path.resolve('.') +
  '/src/Routes/jobApplicationsRoutes.js')
//import the email routes
const emailRoutes = require(path.resolve('.') +
  '/src/Routes/emailRoutes.js')

//import the email routes
const passwordRoutes = require(path.resolve('.') +
  '/src/Routes/passwordRoutes.js')

//mongoose connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/CVD19DEV', {
  useNewUrlParser: 'true',
  useUnifiedTopology: 'true',
  useCreateIndex: true
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

//basic route
app.use('/', basicRoutes)
//Routes for users
app.use('/dev/user', userRoutes)
//Routes for job Postings
app.use('/dev/jobPosting', jobPostingRoutes)
//Routes for job Applications
app.use('/dev/jobApplication', jobApplicationsRoutes)
//Routes for email
app.use('/dev/email', emailRoutes)
//Routes for password reset
app.use('/dev/password',passwordRoutes)

app.listen(port, function () {
  LOGGER.debug('Express server listening on port %s.', port)
})
module.exports = app
