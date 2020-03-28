/**
 * @file volunteerModel.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/27/2020
 */

const mongoose=require('mongoose');
const Schema = mongoose.Schema

//This model defines the data fields we will be storing in the database.
module.exports= VolunteerSchema = new Schema({
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
  password:{
    type:String,
    required: 'Password is required'
  },
  phone: {
    type: Number
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  age: {
    type: Number,
    min: 18,
    max: 65
  },
  skills: {
    type: Schema.Types.Mixed,
    required: 'Skills are required'
  },
  description: {
    type: String,
    required: 'A short description is required'
  },
  work_experience: {
    type: Schema.Types.Mixed
  },
  education: {
    type: Schema.Types.Mixed
  }
})
