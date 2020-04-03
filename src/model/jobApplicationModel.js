/**
 * @file jobPostingModel.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

const mongoose=require('mongoose');
const Schema = mongoose.Schema
const CONSTANTS=require('../CONSTANTS/constants')
//This model defines the data fields we will be storing in the database.
module.exports= JobApplicationSchema = new Schema({
  jobID: {
    type: String
  },
  postedbyID:{
    type:String
  },
  userID: {
    type: String,
  },
  jobTitle:{
    type:String
  },
  appliedDate: {
    type: String,
    default: CONSTANTS.createTime()
  },
  currentStatus:{
      type:String,
      default:'Application Submitted'
  }
})
