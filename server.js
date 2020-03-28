/**
 * @file Server.js
 * @author Mrunal Ghorpade
 * @version 1.0
 * createdDate: 03/27/2020
 */

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
const app = express();
const cors = require("cors");
const path = require("path");

//Save the log details
const LOGGER = require(path.resolve(".") + "/src/Logger/logger.js");

//Port to expose
const port = 8080;
require('dotenv').config();

//import the routes
const basicRoutes = require(path.resolve(".") + "/src/Routes/basicroutes.js");
const volunteerRoutes=require(path.resolve(".") + "/src/Routes/volunteerRoutes.js");

//mongoose connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/Volunteers', {
  useNewUrlParser: 'true',
  useUnifiedTopology: 'true'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//Routes
app.use("/", basicRoutes);
app.use("/volunteer", volunteerRoutes);


app.listen(port, function () {
  LOGGER.debug("Express server listening on port %s.", port);
});
module.exports = app;
