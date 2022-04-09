const express = require('express');

const subscriptionRouter = express.Router();

const { queryAllSubscriptions, addSubscription, updateSubscription, deleteSubscription } = require('../controller/subscription');


subscriptionRouter.get('/', queryAllSubscriptions);
// subscriptionRouter.get('/', getAllSubscriptions);
subscriptionRouter.post('/', addSubscription);
subscriptionRouter.put('/:id', updateSubscription);
subscriptionRouter.delete('/:id', deleteSubscription);


module.exports = subscriptionRouter; 