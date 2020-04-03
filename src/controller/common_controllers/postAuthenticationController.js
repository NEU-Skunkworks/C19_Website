/**
 * @file postAuthenticationController.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 04/01/2020
 */

//import constants file
const CONSTANTS = require('../../CONSTANTS/constants')
//import authenticate user constants
const authenticationMiddleware = require('../../middleware/authenticationMiddleware')

const postAuthentication = (
  req,
  res,
  next,
  publicKEY,
  FILE_NAME,
  paramterID,
  methodtoCall,
  schema,
  data
) => {
  if (paramterID.toString().includes(',')) {
    var parameterSplit = paramterID.toString().split(',')
    var parameterToCompareToken = parameterSplit[0].toString()
    var parameterToPassToMethod = parameterSplit[1].toString()
  } else {
    var parameterToCompareToken = paramterID.toString()
    var parameterToPassToMethod = paramterID.toString()
  }
  var result = authenticationMiddleware.authenticateUser(
    req,
    publicKEY,
    FILE_NAME
  )
  if (result === 'Token not present') {
    //Create the log message
    CONSTANTS.createLogMessage(FILE_NAME, 'Token invalid', 'UNAUTHORIZED')
    //Send the response
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.BAD_REQUEST,
      CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
      next
    )
  }
  if (result.message !== undefined && result.message !== null) {
    if (result.message === 'invalid signature') {
      //Create the log message
      CONSTANTS.createLogMessage(FILE_NAME, 'Token invalid', 'UNAUTHORIZED')
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.BAD_REQUEST,
        CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
        next
      )
    }
    else if (result.message === 'invalid token') {
      //Create the log message
      CONSTANTS.createLogMessage(FILE_NAME, 'Token invalid', 'UNAUTHORIZED')
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.BAD_REQUEST,
        CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
        next
      )
    } else if (result.message === 'jwt expired') {
      CONSTANTS.createLogMessage(FILE_NAME, 'Token expired', 'UNAUTHORIZED')
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.FAILED,
        CONSTANTS.ERROR_DESCRIPTION.TOKENEXPIRED,
        next
      )
    }
  } else {
    if (result === null) {
      //Create the log message
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'User not authorized',
        'UNAUTHORIZED'
      )
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.UNAUTHORIZED,
        CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
        next
      )
    }
    //If the checkauthentication variable does not have an id property then give unauthorized error.
    else if (result.hasOwnProperty('id') === false) {
      //Create the log messages
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'User not authorized',
        'UNAUTHORIZED'
      )
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.UNAUTHORIZED,
        CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
        next
      )
    } else if (result.id.toString() != parameterToCompareToken) {
      /*Check if the user sending the request and the user the request id made for are equal or not. 
                  That was we maintain authentication that only the user who has logged in is viewing their data*/
      //Create the log message
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'User not authorized',
        'UNAUTHORIZED'
      )
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.UNAUTHORIZED,
        CONSTANTS.ERROR_DESCRIPTION.UNAUTHORIZED,
        next
      )
    } else if (result !== null) {
      if (data !== null || data !== undefined) {
        methodtoCall(
          schema,
          res,
          next,
          FILE_NAME,
          parameterToPassToMethod,
          data
        )
      } else {
        methodtoCall(schema, res, next, FILE_NAME, parameterToPassToMethod)
      }
    }
  }
}

module.exports = { postAuthentication }
