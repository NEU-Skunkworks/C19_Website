const mongoose = require('mongoose');
const CONSTANTS = require('../../CONSTANTS/constants');
const JobPostingSchema = require('../../model/jobPostingModel');
const testJobs = require('./data/test_jobs.json');

const seed = async () => {
  console.log('[SEED]: running...');
  try {
    const db = await mongoose.connect(CONSTANTS.mongoDBUrl, {
      useNewUrlParser: 'true',
      useUnifiedTopology: 'true',
      useCreateIndex: true,
    });

    const JobPosting = db.model('JobPostingSchema', JobPostingSchema);
    for (const posting of testJobs) {
      const {
        userID,
        jobTitle,
        description,
        weeklyCommitment,
        skills,
      } = posting;
      if (userID) {
        let newPosting = new JobPosting({
          userID: userID['$oid'],
          jobTitle,
          description,
          weeklycommitment: weeklyCommitment,
          skills,
        });
        newPosting.save();
      }
    }
    console.log('[SEED]: success');
  } catch (error) {
    console.log(error);
  }
};

seed();
