const express = require('express');

const appRouter = express.Router();

const {queryAllApps, addApp, updateApp,deleteApp} = require('../controller/app');


appRouter.get('/', queryAllApps);
appRouter.post('/', addApp);
appRouter.put('/:id', updateApp);
appRouter.delete('/:id', deleteApp);

module.exports = appRouter; 