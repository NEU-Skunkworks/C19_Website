/**
 * @file contributorModel.js
 * @author Zihao Zheng
 * @version 1.0
 * createdDate: 05/28/2020
 */

const mongoose=require('mongoose');
const Schema = mongoose.Schema
const CONSTANTS=require('../CONSTANTS/constants')

//This model defines the data fields we will be storing in the database.
module.exports= ContributorSchema = new Schema({
  
  name: {
    type: String,
    required: 'Name is required'
  },
  description: {
    type: String,
    required: 'Description is required',
  },
  skill: {
    type: String,
    required: 'Skill is required',
  },
  link: {
    type: String,
    required: 'Link is required'
  }
})
