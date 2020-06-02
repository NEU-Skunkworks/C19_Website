/**
 * @file Server.js
 * @author Mrunal Ghorpade
 * @version 1.0
 * createdDate: 03/27/2020
 */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDatabase } = require('./src/database');
//Save the log details
const LOGGER = require('./src/Logger/logger.js');
const FILE_NAME = 'server.js';
//Port to expose
const port = 3000;
//import the routes
const basicRoutes = require('./src/Routes/basicroutes.js');
const userRoutes = require('./src/Routes/userRoutes.js');
const jobPostingRoutes = require('./src/Routes/jobPostingRoutes.js');
const jobApplicationsRoutes = require('./src/Routes/jobApplicationsRoutes.js');
const emailRoutes = require('./src/Routes/emailRoutes.js');
const passwordRoutes = require('./src/Routes/passwordRoutes.js');
const contributorRoutes = require('./src/Routes/contributorRoutes.js');

const mount = async (app) => {
  // Open connection to DB
  await connectDatabase(FILE_NAME);
  // Init middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  // Wire up routes
  app.use('/', basicRoutes);
  app.use('/dev/user', userRoutes);
  app.use('/dev/jobPosting', jobPostingRoutes);
  app.use('/dev/jobApplication', jobApplicationsRoutes);
  app.use('/dev/email', emailRoutes);
  app.use('/dev/password', passwordRoutes);
  app.use('/dev/contributor', contributorRoutes)

  app.listen(port, function () {
    LOGGER.debug('Express server listening on port %s.', port);
  });
};

mount(express());
