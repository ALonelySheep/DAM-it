const express = require('express');

const subscriptionRouter = express.Router();

const { queryAllSubscriptions,addSubscription, getAllSubscriptions } = require('../controller/subscription');


subscriptionRouter.get('/', queryAllSubscriptions);
// subscriptionRouter.get('/', getAllSubscriptions);
subscriptionRouter.post('/', addSubscription);


module.exports = subscriptionRouter; 