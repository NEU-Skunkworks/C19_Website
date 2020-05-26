/**
 * @file volunteerModel.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/27/2020
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CONSTANTS = require('../CONSTANTS/constants')
//This model defines the data fields we will be storing in the database.
module.exports = UserSchema = new Schema({
  firstName: {
    type: String,
    required: 'First name is required'
  },
  lastName: {
    type: String,
    required: 'Last name is required'
  },
  email: {
    type: String,
    required: 'Email ID is required'
  },
  password: {
    type: String
  },
  gender: {
    type: String
  },
  created_date: {
    type: String,
    default: CONSTANTS.createTime()
  },
  dateofBirth: {
    type: String
  },
  skills: {
    type: Schema.Types.Mixed
  },
  education: {
    type: String
  },
  portfolioLink: {
    type: String
  },
  type: {
    type: String
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  emailAuthenticated: {
    type: String,
    default:'No'
  },
  temporaryPassword: {
    type: String
  }
})
