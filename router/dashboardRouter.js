const express = require('express');
const { authorizeRequest } = require('../controller/auth')

const dashboardRouter = express.Router();

const { queryTotalValue, queryMonthlyCost } = require('../controller/dashboard');

dashboardRouter.use(authorizeRequest)
dashboardRouter.get('/total-value', queryTotalValue);
dashboardRouter.get('/monthly-cost', queryMonthlyCost);


module.exports = dashboardRouter; 