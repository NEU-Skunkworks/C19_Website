/**
 * @file constants.js
 * @namespace constants
 * @author Mrunal
 * Created Date: 03/27/2020
 * @description constants
 */

//importing logger file
const LOGGER = require('../Logger/logger')
//importing json web token
const jwt = require('jsonwebtoken')
//Specifying the verifying options for json web token
var verifyOptions = {
  expiresIn: '12h',
  algorithm: ['RS256']
}
//Specifying the sign in options for creating the token
var signOptions = {
  expiresIn: '12h',
  algorithm: 'RS256'
}

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
  NO_CONTENT: 204
}

//Specifying the error descriptions
const ERROR_DESCRIPTION = {
  NOT_FOUND: 'Data not found',
  UNAUTHORIZED: 'User unauthorized to access this data',
  LOGINERROR: 'Invalid email/password',
  SERVERERROR: 'Server error'
}

//Specifying the success messages
const SUCCESS_DESCRIPTION = {
  SUCCESS: 'Added successfull',
  SUCCESS_UPDATE: 'Updated Successfully',
  SUCCESS_DELETE: 'Deleted Successfully'
}

//Function to create log messages function
const createLogMessage = (FILE_NAME, message, type) => {
  let today = new Date()
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
    today.getSeconds()
  LOGGER.info(date + ' ' + type + ' ' + FILE_NAME + ' message: ' + message)
}

//Function to authenticate the user
const authenticateUser = (req, res, next, publicKEY, FILE_NAME, id) => {
  //Get the token value from the header
  let token = req.headers['x-access-token'] || req.headers['authorization']
  //If token is undefined send back the unauthorized error.
  if (token === undefined) {
    CONSTANTS.createLogMessage(FILE_NAME, 'User not authorized', 'UNAUTHORIZED')
    res.status(CONSTANTS.ERROR_CODE.UNAUTHORIZED)
    res.json({ error: CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  //If token starts with Bearer then slice the token
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length)
  }
  //Decode the token value based on the public key value.
  var checkForAuthentication = jwt.verify(token, publicKEY, verifyOptions)
  //Check if the token returns null
  if (checkForAuthentication === null) {
    createLogMessage(FILE_NAME, 'User not authorized', 'UNAUTHORIZED')
    res.status(UNAUTHORIZED)
    res.json({ error: ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
  //If the checkauthentication variable does not have an id property then give unauthorized error.
  else if (checkForAuthentication.hasOwnProperty('id') === false) {
    createLogMessage(FILE_NAME, 'User not authorized', 'UNAUTHORIZED')
    res.status(ERROR_CODE.UNAUTHORIZED)
    res.json({ error: ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  } else if (checkForAuthentication.id != id) {
    /*Check if the user sending the request and the user the request id made for are equal or not. 
That was we maintain authentication that only the user who has logged in is viewing their data*/
    createLogMessage(FILE_NAME, 'User not authorized', 'UNAUTHORIZED')
    res.status(ERROR_CODE.UNAUTHORIZED)
    res.json({ error: ERROR_DESCRIPTION.UNAUTHORIZED })
    next()
  }
}

//Create responses
const createResponses=(res,statuscode,data,next)=>{
  res.status(statuscode)
  var responsedata={
    message:data
  }
  res.json(responsedata)
  next()
}

//create response without next
const createResponseWithoutNext=(res,statuscode,data)=>{
  res.status(statuscode)
  var responsedata={
    message:data
  }
  res.json(responsedata)
}

//Export the modules
module.exports = {
  ERROR_CODE,
  ERROR_DESCRIPTION,
  SUCCESS_DESCRIPTION,
  createLogMessage,
  authenticateUser,
  signOptions,
  createResponses,
  createResponseWithoutNext
}
