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
//import the volunteers route
const volunteerRoutes = require(path.resolve('.') +
  '/src/Routes/volunteerRoutes.js')
//import the researchers route
const researcherRoutes = require(path.resolve('.') +
  '/src/Routes/researcherRoutes.js')
//import the job postings route
const jobPostingRoutes = require(path.resolve('.') +
  '/src/Routes/jobPostingRoutes.js')
//import the job applications route
const jobApplicationsRoutes = require(path.resolve('.') +
  '/src/Routes/jobApplicationsRoutes.js')

//mongoose connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/CVD19', {
  useNewUrlParser: 'true',
  useUnifiedTopology: 'true',
  useCreateIndex: true
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

//basic route
app.use('/', basicRoutes)
//Routes for volunteers
app.use('/dev/volunteer', volunteerRoutes)
//Routes for Researchers
app.use('/dev/researcher', researcherRoutes)
//Routes for job Postings
app.use('/dev/jobPosting', jobPostingRoutes)
//Routes for job Applications
app.use('/dev/jobApplications', jobApplicationsRoutes)

app.listen(port, function () {
  LOGGER.debug('Express server listening on port %s.', port)
})
module.exports = app
