/**
 * @file constants.js
 * @namespace constants
 * @author Mrunal
 * Created Date: 03/27/2020
 * @description constants
 */
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
const ERROR_DESCRIPTION = {
  NOT_FOUND: 'Data not found',
  UNAUTHORIZED: 'User unauthorized to access this data',
  LOGINERROR: 'Invalid email/password',
  SERVERERROR: 'Server error'
}
const SUCCESS_DESCRIPTION = {
  SUCCESS: 'Operation successfull',
  SUCCESS_UPDATE: 'Updated Successfully'
}
module.exports = {
  ERROR_CODE,
  ERROR_DESCRIPTION,
  SUCCESS_DESCRIPTION
}
