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
module.exports= JobPostingSchema = new Schema({
  userID: {
    type: String
  },
  jobTitle: {
    type: String,
    required: 'Title is required'
  },
  description: {
    type: String,
    required: 'Description is required',
  },

  weeklycommitment:{
    type:Number,
    required: 'Weekly Commitment is required'
  },
  skills:{
      type:Schema.Types.Mixed,
      required:'Skills are required'
  },
  postedDate: {
    type: String,
    default: CONSTANTS.createTime()
  }
})
