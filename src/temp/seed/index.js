const mongoose = require('mongoose');
const CONSTANTS = require('../../CONSTANTS/constants');
const JobPostingSchema = require('../../model/jobPostingModel');
const UserSchema = require('../../model/userModel');
const testJobs = require('./data/test_jobs.json');
const testResearchers = require('./data/test_researchers.json');
const testVolunteers = require('./data/test_volunteers.json');

const seedUsers = (db) => {
  try {
    const User = db.model('UserSchema', UserSchema);

    for (let researcher of testResearchers) {
      const { _id, ...rest } = researcher;
      let newUser = User({
        _id: _id['$oid'],
        ...rest,
      });
      newUser.save();
    }

    for (let volunteer of testVolunteers) {
      const { _id, ...rest } = volunteer;
      let newUser = User({
        _id: _id['$oid'],
        ...rest,
      });
      newUser.save();
    }
  } catch (error) {
    console.log(error);
  }
};

const seedJobs = (db) => {
  try {
    const JobPosting = db.model('JobPostingSchema', JobPostingSchema);
    const [{ _id: researcherID1 }, { _id: researcherID2 }] = testResearchers;

    for (let i = 0; i < testJobs.length; i++) {
      // divvy up jobs between mock researchers
      let currentResearcher = i % 2 ? researcherID1 : researcherID2;

      const {
        jobTitle,
        description,
        weeklyCommitment,
        postedDate,
        skills,
      } = testJobs[i];
      let newPosting = new JobPosting({
        userID: currentResearcher['$oid'],
        jobTitle,
        description,
        weeklycommitment: weeklyCommitment,
        postedDate: postedDate['$date'],
        skills,
      });
      newPosting.save();
    }
  } catch (error) {
    console.log(error);
  }
};

const seed = async () => {
  console.log('[SEED]: running...');
  try {
    const db = await mongoose.connect(CONSTANTS.mongoDBUrl, {
      useNewUrlParser: 'true',
      useUnifiedTopology: 'true',
      useCreateIndex: true,
    });

    seedUsers(db);
    seedJobs(db);

    console.log('[SEED]: success');
  } catch (error) {
    console.log(error);
  }
};

seed();
