const express = require('express');

const testRouter = express.Router();

const {clearDB, initDB, resetDB, insertTestData} = require('../controller/test');


testRouter.get('/clearDB', clearDB);

testRouter.get('/initDB', initDB);

testRouter.get('/resetDB', resetDB);

testRouter.get('/testData', insertTestData);

module.exports = testRouter; 