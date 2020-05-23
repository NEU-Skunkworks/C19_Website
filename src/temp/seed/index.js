require('dotenv').config();
const JobPostingSchema = require('../../model/jobPostingModel');
const UserSchema = require('../../model/userModel');
const testJobs = require('./data/test_jobs.json');
const testResearchers = require('./data/test_researchers.json');
const testVolunteers = require('./data/test_volunteers.json');
const { connectDatabase } = require('../../database');

const seedUsers = async (db) => {
  try {
    const User = db.model('UserSchema', UserSchema);

    for (let researcher of testResearchers) {
      const { _id, ...rest } = researcher;
      let newUser = User({
        _id: _id['$oid'],
        ...rest,
      });
      await newUser.save();
    }

    for (let volunteer of testVolunteers) {
      const { _id, ...rest } = volunteer;
      let newUser = User({
        _id: _id['$oid'],
        ...rest,
      });
      await newUser.save();
    }
  } catch (error) {
    throw error;
  }
};

const seedJobs = async (db) => {
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
      await newPosting.save();
    }
  } catch (error) {
    throw error;
  }
};

const seed = async () => {
  console.log('[SEED]: running...');
  let db;
  try {
    db = await connectDatabase(__filename);

    await seedUsers(db);
    await seedJobs(db);

    console.log('[SEED]: success');
  } catch (error) {
    console.log(error.stack);
    console.log('[SEED]: error');
  } finally {
    if (db) {
      db.connection.close();
    }
  }
};

seed();
