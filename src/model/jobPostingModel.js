/**
 * @file jobPostingModel.js
 * @author Rahul Handoo
 * @version 1.0
 * createdDate: 03/28/2020
 */

const mongoose=require('mongoose');
const Schema = mongoose.Schema

//This model defines the data fields we will be storing in the database.
module.exports= JobPostingSchema = new Schema({
  researcherID: {
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

  requirements:{
    type:String,
    required: 'Requirements are required'
  },
  skills:{
      type:Schema.Types.Mixed,
      required:'Skills are required'
  },
  postedDate: {
    type: Date,
    default: Date.now()
  },
  work_experience_required: {
    type: Number,
    required:'Work experience is required'
  }
})
