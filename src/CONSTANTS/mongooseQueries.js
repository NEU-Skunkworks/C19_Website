//import constants file
const CONSTANTS = require('../CONSTANTS/constants')

//Function add new Data
const addNewData = (schema, req, res, next, FILE_NAME) => {
  //Saving the data into the database.
  schema.save((err, data) => {
    //Error
    if (err) {
      //Log in the error
      CONSTANTS.createLogMessage(FILE_NAME, err, 'Error')
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.FAILED,
        err.errmsg,
        next
      )
    }
    //Return the success message if successfully added.
    CONSTANTS.createLogMessage(
      FILE_NAME,
      'Successfully created user',
      'SUCCESS'
    )
    //Send the success reponse
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.SUCCESS,
      CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS,
      next
    )
  })
}
const findALL = (schema, req, res, next, FILE_NAME) => {
  schema.find({}, (err, data) => {
    //error
    if (err) {
      //Log the error
      CONSTANTS.createLogMessage(FILE_NAME, 'ERROR', 'Error')
      //Send the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_DESCRIPTION.FAILED,
        err.errmsg,
        next
      )
    }
    //Log success message
    CONSTANTS.createLogMessage(
      FILE_NAME,
      'Successfully searched all data',
      'SUCCESS'
    )
    //Send back the response
    CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.SUCCESS, data, next)
  })
}
const findbyID = (schema, req, res, next, FILE_NAME, params) => {
  if (params === undefined || params === null) {
    CONSTANTS.createLogMessage(FILE_NAME, 'Parameter not found', 'ERROR')
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.NOT_FOUND,
      'Parameter not found',
      next
    )
  }
  schema.findById(params, (err, data) => {
    //Error
    if (err) {
      CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NOT_FOUND,
        err.errmsg,
        next
      )
    }
    if (data === null) {
      CONSTANTS.createLogMessage(FILE_NAME, 'User not Found', 'NODATA')
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.NOT_FOUND,
        CONSTANTS.ERROR_DESCRIPTION.NOT_FOUND,
        next
      )
    } else {
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully searched user',
        'SUCCESS'
      )
      CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.SUCCESS, data, next)
    }
  })
}
const updateData = (schema, req, res, next, FILE_NAME, parameter, data) => {
  if (parameter === undefined || parameter === null) {
    CONSTANTS.createLogMessage(FILE_NAME, 'Parameter not found', 'ERROR')
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.NOT_FOUND,
      'Parameter not found',
      next
    )
  }
  schema.updateOne(
    { _id: parameter },
    { $set: data },
    { new: true, useFindAndModify: false },
    (err, finalData) => {
      if (err) {
        //Create the log message
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        )
      }
      //Create the log message
      CONSTANTS.createLogMessage(
        FILE_NAME,
        'Successfully updated user',
        'SUCCESS'
      )
      //Send back the data along with the success update message
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        finalData,
        next
      )
    }
  )
}
const deleteData = (schema, req, res, next, FILE_NAME, param) => {
  schema.findOneAndDelete({ _id: param }, (err, data) => {
    //Error
    if (err) {
      //Create log message
      CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
      //Create the response
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.FAILED,
        err.errmsg,
        next
      )
    }
    //Create the log message
    CONSTANTS.createLogMessage(
      FILE_NAME,
      'User successfully deleted',
      'SUCCESS'
    )
    //Send the response
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.SUCCESS,
      CONSTANTS.SUCCESS_DESCRIPTION.SUCCESS_DELETE,
      next
    )
  })
}

const updateOne = (schema, req, res, next, FILE_NAME, searchCriteria, data) => {
  schema.updateOne(
    searchCriteria,
    data,
    { new: true, useFindAndModify: false },
    (err, data) => {
      if (err) {
        //Create the log message
        CONSTANTS.createLogMessage(FILE_NAME, err, 'ERROR')
        //Send the response
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.FAILED,
          err.errmsg,
          next
        )
      }
    }
  )
}
module.exports = {
  addNewData,
  findALL,
  findbyID,
  updateData,
  deleteData,
  updateOne
}
