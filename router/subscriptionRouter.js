const express = require('express');
const { authorizeRequest } = require('../controller/auth')

const subscriptionRouter = express.Router();

const { queryAllSubscriptions, addSubscription, updateSubscription, deleteSubscription } = require('../controller/subscription');

subscriptionRouter.use(authorizeRequest);
subscriptionRouter.get('/', queryAllSubscriptions);
// subscriptionRouter.get('/', getAllSubscriptions);
subscriptionRouter.post('/', addSubscription);
subscriptionRouter.put('/:id', updateSubscription);
subscriptionRouter.delete('/:id', deleteSubscription);


module.exports = subscriptionRouter; 