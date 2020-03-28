/**
 * @file Server.js
 * @author Mrunal Ghorpade
 * @version 1.0
 * createdDate: 03/27/2020
 */
'use strict';
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const path = require("path");
const LOGGER = require(path.resolve(".") + "/src/Logger/logger.js");
const port = 8080;
require('dotenv').config();
const basicRoutes = require(path.resolve(".") + "/src/Routes/basicroutes.js");

app.use(bodyParser.json());
app.use(cors());
//Routes
app.use("/", basicRoutes);


app.listen(port, function () {
  LOGGER.debug("Express server listening on port %s.", port);
});
module.exports = app;
