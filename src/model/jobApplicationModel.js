/**
 * @file jobPostingModel.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

const mongoose=require('mongoose');
const Schema = mongoose.Schema

//This model defines the data fields we will be storing in the database.
module.exports= JobApplicationSchema = new Schema({
  jobID: {
    type: String
  },
  volunteerID: {
    type: String,
  },
  appliedDate: {
    type: Date,
    default: Date.now()
  },
  currentStatus:{
      type:String,
      default:'Application Submitted'
  }
})
