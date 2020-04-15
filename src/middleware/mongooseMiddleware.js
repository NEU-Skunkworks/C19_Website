/**
 * @file mongooseMiddleware.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/31/2020
 */

//import constants file
const CONSTANTS = require('../CONSTANTS/constants');

//Function add new Data
const addNewData = (schema, res, next, FILE_NAME) => {
  //Saving the data into the database.
  try {
    schema.save((err, data) => {
      //Error
      if (err) {
        //Log in the error
        CONSTANTS.createLogMessage(FILE_NAME, err, 'Error');
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        );
      }
      //Return the success message if successfully added.
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully created user',
        'SUCCESS'
      );
      //Send the success reponse
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS,
        next
      );
    });
  } catch (Exception) {}
};

//Function to find all the data from the database
const findALL = (schema, res, next, FILE_NAME) => {
  try {
    schema.find({}, (err, data) => {
      //error
      if (err) {
        //Log the error
        CONSTANTS.createLogMessage(FILE_NAME, 'ERROR', 'Error');
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        );
      }
      if (data !== null) {
        //Log success message
        CONSTANTS.createLogMessage(
          FILE_NAME,
          'Successfully searched all data',
          'SUCCESS'
        );
        //Send back the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.SUCCESS,
          data,
          next
        );
      } else {
        //Log success message
        CONSTANTS.createLogMessage(FILE_NAME, 'No data Found', 'NODATA');
        //Send back the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          'No Data Found',
          next
        );
      }
    });
  } catch (Exception) {}
};

//Function to find by ID
const findbyID = (schema, res, next, FILE_NAME, params) => {
  try {
    schema.findById(params, (err, data) => {
      //Error
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR');
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          err.errmsg,
          next
        );
      }
      if (data === null || data === undefined) {
        CONSTANTS.createLogMessage(FILE_NAME, 'User not Found', 'NODATA');
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
          next
        );
      } else {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          'Successfully searched user',
          'SUCCESS'
        );
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.SUCCESS,
          data,
          next
        );
      }
    });
  } catch (Exception) {}
};

//Function to update data
const updateData = (schema, res, next, FILE_NAME, parameter, data) => {
  try {
    if (parameter === undefined || parameter === null) {
      CONSTANTS.createLogMessage(FILE_NAME, 'Parameter not found', 'ERROR');
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NOT_FOUND,
        'Parameter not found',
        next
      );
    }
    schema.updateOne(
      { _id: parameter },
      { $set: data },
      { new: true, useFindAndModify: false },
      (err, finalData) => {
        if (err) {
          //Create the log message
          CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR');
          //Send the response
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.FAILED,
            err.errmsg,
            next
          );
        }
        //Create the log message
        CONSTANTS.createLogMessage(
          FILE_NAME,
          'Successfully updated user',
          'SUCCESS'
        );
        //Send back the data along with the success update message
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.SUCCESS,
          finalData,
          next
        );
      }
    );
  } catch (Exception) {}
};

//Function to delete the data
const deleteData = (schema, res, next, FILE_NAME, param) => {
  try {
    schema.findOneAndDelete({ _id: param }, (err, data) => {
      //Error
      if (err) {
        //Create log message
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR');
        //Create the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        );
      }
      //Create the log message
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'User successfully deleted',
        'SUCCESS'
      );
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS_DELETE,
        next
      );
    });
  } catch (Exception) {}
};

//Function to find a specific data
const findOne = (schema, res, next, FILE_NAME, searchCriteria) => {
  try {
    schema.findOne(searchCriteria, (err, data) => {
      if (err) {
        //Create the log message
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR');
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        );
      }
      //Create the log message
      CONSTANTS.createLogMessage(FILE_NAME, 'Searched for data', 'SUCCESS');
      //Send the response
      CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.SUCCESS, data, next);
    });
  } catch (Exception) {}
};

//Function to find all the data from the database based on a criteria
const findallbasedonCriteria = (
  schema,
  res,
  next,
  FILE_NAME,
  searchCriteria
) => {
  try {
    return schema.find(searchCriteria, (err, data) => {
      //error
      if (err) {
        //Log the error
        CONSTANTS.createLogMessage(FILE_NAME, err.errmsg, 'ERROR');
      }
      if (data !== null && data.length > 0) {
        //Log success message
        CONSTANTS.createLogMessage(
          FILE_NAME,
          'Successfully searched all data',
          'SUCCESS'
        );
        //Send back the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.SUCCESS,
          data,
          next
        );
      } else {
        //Log success message
        CONSTANTS.createLogMessage(FILE_NAME, 'No data Found', 'NODATA');
        //Send back the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.NOT_FOUND,
          'No Data Found',
          next
        );
      }
    });
  } catch (Exception) {}
};

//Get count of the document
const getCount = (schema, FILE_NAME, criteria) => {
  try {
    if (criteria === null) {
      return schema.countDocuments({}, (err, data) => {
        //error
        if (err) {
          //Log the error
          CONSTANTS.createLogMessage(FILE_NAME, err.errmsg, 'ERROR');
        } else {
          CONSTANTS.createLogMessage(FILE_NAME, 'Get count', 'SUCCESS');
        }

        //Log success message
      });
    } else {
      return schema.countDocuments(criteria, (err, data) => {
        //error
        if (err) {
          //Log the error
          CONSTANTS.createLogMessage(FILE_NAME, err.errmsg, 'ERROR');
        } else {
          CONSTANTS.createLogMessage(FILE_NAME, 'Get count', 'SUCCESS');
        }

        //Log success message
      });
    }
  } catch (Exception) {}
};
//Function add new user
const addNewUser = (schema, FILE_NAME) => {
  //Saving the data into the database.
  return schema.save();
};
const searchMultipleDatawithuserID = (schema, res, next, FILE_NAME, param) => {
  try {
    var searchCriteria = { userID: param };
    schema.find(searchCriteria, (err, data) => {
      //error
      if (err) {
        //Log the error
        CONSTANTS.createLogMessage(FILE_NAME, err.errmsg, 'ERROR');
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        );
      } else {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          'Successfully searched all data',
          'SUCCESS'
        );
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.SUCCESS,
          data,
          next
        );
      }

      //Log success message
    });
  } catch (Exception) {}
};
//Export the modules
module.exports = {
  addNewData,
  findALL,
  findbyID,
  updateData,
  deleteData,
  findOne,
  findallbasedonCriteria,
  getCount,
  addNewUser,
  searchMultipleDatawithuserID,
};
