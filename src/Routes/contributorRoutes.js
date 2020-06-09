/**
 * @file contributorRoutes.js
 * @author Zihao Zheng
 * @version 1.0
 * createdDate: 05/28/2020
 */

//Importing the contributor Controller.
const contributorController = require('../controller/contributorController');
const express = require('express');
const router = express.Router();

//get all the contributor
router.get('/', function (req, res, next) {
  contributorController.getContributors(req, res, next);
});

//Add a new contributor
router.post('/addContributor/:userID', function (req, res, next) {
  contributorController.addNewContributor(req, res);
});


//Update a contributor
router.put('/update/:contributorID', function (req, res, next) {
  contributorController.updateContributor(req, res, next);
});

//Delete a contributor
router.delete('/delete/:contributorID', function (req, res, next) {
  contributorController.deleteContributor(req, res, next);
});



module.exports = router;
