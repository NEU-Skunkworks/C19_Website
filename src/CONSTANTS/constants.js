/**
 * @file constants.js
 * @namespace constants
 * @author Mrunal
 * Created Date: 03/27/2020
 * @description constants
 */

const dotenv = require("dotenv");
dotenv.config();
//importing logger file
const LOGGER = require('../Logger/logger');
//Specifying the verifying options for json web token
var verifyOptions = {
  expiresIn: process.env.VERIFY_OPTIONS_EXPIRES_IN,
  algorithm: process.env.VERIFY_OPTIONS_ALGORITHM,
};
//Specifying the sign in options for creating the token
var signOptions = {
  expiresIn: process.env.VERIFY_OPTIONS_EXPIRES_IN,
  algorithm: process.env.VERIFY_OPTIONS_ALGORITHM,
};
var generator = require('generate-password');
var createTime = () => {
  //Declare a date variable
  let today = new Date();
  //Extract all the information needed from the above variable
  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    '-' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds();

  return date;
};
//Specifying the error codes
const ERROR_CODE = {
  NOT_FOUND: 409,
  UNAUTHORIZED: 401,
  NO_DATA_FOUND: 403,
  NOT_FOUND: 404,
  INVALID_MISSING_PARAMETER: 422,
  SUCCESS: 200,
  FAILED: 500,
  BAD_REQUEST: 400,
  NO_CONTENT: 204,
};

//Specifying the error descriptions
const ERROR_DESCRIPTION = {
  NOT_FOUND: 'Data not found',
  UNAUTHORIZED: 'User unauthorized to access this data',
  LOGINERROR: 'Invalid email/password',
  SERVERERROR: 'Server error',
  ATTEMPTERROR: 'Too many login attempts',
  TOKENEXPIRED: 'Your session has ended please login again',
};

//Specifying the success messages
const SUCCESS_DESCRIPTION = {
  SUCCESS: 'Added successfull',
  SUCCESS_UPDATE: 'Updated Successfully',
  SUCCESS_DELETE: 'Deleted Successfully',
};

/*
Function to create the log message and insert it in the log file. Takes the following input
1. FILE_NAME = The file name for which the log entry has to be made
2. message = Message to be logged
3. type = What type of message
*/
const createLogMessage = (FILE_NAME, message, type) => {
  //Log the data in the log into
  LOGGER.info(
    createTime() + ' ' + type + ' ' + FILE_NAME + ' message: ' + message
  );
};
/*
Function to create a response. Takes the following input
1. res = response
2. statuscode = the status code to be sent
3. data = data to be sent
4. next 
*/
const createResponses = (res, statuscode, data, next) => {
  res.status(statuscode);
  var responsedata = {
    message: data,
  };
  res.json(responsedata);
  next;
};

/*
Function to create a response without next. Takes the following input
1. res = response
2. statuscode = the status code to be sent
3. data = data to be sent
*/
const createResponseWithoutNext = (res, statuscode, data) => {
  res.status(statuscode);
  var responsedata = {
    message: data,
  };
  res.json(responsedata);
  return;
};

var temppassword = generator.generateMultiple(1, {
  length: process.env.TEMP_PASSWORD_LENGTH,
  uppercase: false,
});
//Export the modules
module.exports = {
  ERROR_CODE,
  ERROR_DESCRIPTION,
  SUCCESS_DESCRIPTION,
  createLogMessage,
  signOptions,
  verifyOptions,
  createResponses,
  createResponseWithoutNext,
  createTime,
  temppassword
};
