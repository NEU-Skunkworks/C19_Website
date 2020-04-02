/**
 * @file volunteerModel.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/27/2020
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

//This model defines the data fields we will be storing in the database.
module.exports= VolunteerSchema = new Schema({
  vfirstName: {
    type: String,
    required: 'First name is required'
  },
  vlastName: {
    type: String,
    required: 'Last name is required'
  },
  vemail: {
    type: String,
    required: 'Email ID is required'
  },

  vpassword: {
    type: String,
    required: 'Password is required'
  },
  vgender:{
    type:String,
    required: 'Gender is required'
  },
  vcreated_date: {
    type: Date,
    default: Date.now()
  },
  vage: {
    type: Number,
    min: 18,
    max: 65
  },
  vskills: {
    type: Schema.Types.Mixed,
    required: 'Skills are required'
  },
  vwork_experience: [
    {
      company: String,
      position: String,
      description: String,
      from: Date,
      to: Date
    }
  ],
  vworks_experience_years: {
    type: Number,
    required: 'Enter the number of years'
  },
  veducation: [
    {
      school: String,
      major: String,
      state: String,
      city: String,
      country: String,
      from: Date,
      to: Date
    }
  ],
  type: {
    type: String,
    default: 'Volunteer'
  },
  loginAttempts:{
    type:Number,
    default:0
  }
})
