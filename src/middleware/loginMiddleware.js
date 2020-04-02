/**
 * @file loginMiddleware.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 04/01/2020
 */


//import constants file
const CONSTANTS = require('../CONSTANTS/constants')

//Function to update one data entry in database
const updateLoginAttempts = (schema, FILE_NAME, searchCriteria, data) => {
    try {
      return schema.updateOne(
        searchCriteria,
        data,
        { new: true, useFindAndModify: false },
        (err, data) => {
          if (err) {
            //Create the log message
            CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
          }
          else {
            //Create the log message
            CONSTANTS.createLogMessage(
              FILE_NAME,
              'Successfully searched for data when updating login attempts',
              'SUCCESS'
            )
          }
        }
      )
    } catch (Exception) {}
  }

  //Function to find a specific data
const checkifDataExists = (schema, searchCriteria,FILE_NAME) => {
    try {
      return schema.findOne(searchCriteria, (err, data) => {
        if (err) {
          //Create the log message
          //Create the log message
          CONSTANTS.createLogMessage(
            FILE_NAME,
            'ERROR in searching for user for adding new data',
            'ERROR'
          )
        } else {
          //Create the log message
          CONSTANTS.createLogMessage(
            FILE_NAME,
            'Successfully searched for user',
            'SUCCESS'
          )
        }
      })
    } catch (Exception) {}
  }

  //Export the modules
module.exports = {
    updateLoginAttempts,
    checkifDataExists
  }
  