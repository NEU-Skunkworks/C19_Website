/**
 * @file researcherModel.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

//This model defines the data fields we will be storing in the database.
module.exports = ResearcherSchema = new Schema({
  rfirstName: {
    type: String,
    required: 'First name is required'
  },
  rlastName: {
    type: String,
    required: 'Last name is required'
  },
  remail: {
    type: String,
    required: 'Email ID is required'
  },

  rpassword: {
    type: String,
    required: 'Password is required'
  },
  rgender: {
    type: String,
    required: 'Gender is required'
  },
  rcreated_date: {
    type: Date,
    default: Date.now()
  },
  rage: {
    type: Number,
    min: 18,
    max: 65
  },
  rinstitute: {
    type: String,
    required: 'Institute is required'
  },
  type: {
    type: String,
    default: 'Researcher'
  },
  loginAttempts:{
    type:Number,
    default:0
  }
})
