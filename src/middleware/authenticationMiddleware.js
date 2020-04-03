/**
 * @file authenticationConstants.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 04/01/2020
 */

//import constants file
const CONSTANTS = require('../CONSTANTS/constants')
//importing jwt token to assign to the user once authenticated
const jwt = require('jsonwebtoken')
/*
Function to authenticate the user. Takes the following input
1. req = request
2. res = response
3. publicKEY = the public key required to decode the token
4. FILE_NAME = The file name for which the log entry has to be made
*/
const authenticateUser = (req, publicKEY, FILE_NAME) => {
  
  //Get the token value from the header
  let token = req.headers['x-access-token'] || req.headers['authorization']
  //If token is undefined send back the unauthorized error.
  if (token === undefined) {
    //Create the log message
    CONSTANTS.createLogMessage(FILE_NAME, 'User not authorized', 'UNAUTHORIZED')
    return 'Token not present'
  }
  //If token starts with Bearer then slice the token
  else if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length)
    return jwt.decode(token, publicKEY, CONSTANTS.verifyOptions, (err, decode) => {
      if(err!==null){
        return err
      }
      else{
        return decode
      }
    })
  }
}

module.exports = { authenticateUser }
