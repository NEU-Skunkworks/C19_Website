/**
 * @file basicRoutes.js
 * @namespace routes
 * @author Mrunal
 * Created Date: 03/27/2020
 * @description user routes
 */
const express = require('express');
const router = express.Router();
const CONSTANTS = require('../CONSTANTS/constants');
const LOGGER = require('../Logger/logger');
// File name to be logged
const FILE_NAME = 'basicRoute.js';
/*
 * Hello world Route
 * @memberof basicRoute.js
 * @function /helloWorld
 * @param {object} req Request
 * @param {object} res Response
 * @returns {object} responseObject
 */
router.get("/hello", function (req, res) {
    let responseObj = {};
    LOGGER.info("Hello world " + FILE_NAME)
    res.statusCode = CONSTANTS.ERROR_CODE.SUCCESS
    res.statusMessage = CONSTANTS.ERROR_DESCRIPTION.SUCCESS
    responseObj.result = "Hello World"
    res.send(responseObj);
});
module.exports=router
