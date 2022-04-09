const express = require('express');

const appRouter = express.Router();

const {queryAllApps, addApp, getAllApps} = require('../controller/app');


appRouter.get('/', queryAllApps);
// appRouter.get('/', getAllApps);
appRouter.post('/', addApp);


module.exports = appRouter; 