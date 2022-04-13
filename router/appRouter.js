const express = require('express');
const { authorizeRequest } = require('../controller/auth')

const appRouter = express.Router();

const { queryAllApps, addApp, updateApp, deleteApp } = require('../controller/app');

appRouter.use(authorizeRequest)
appRouter.get('/', queryAllApps);
appRouter.post('/', addApp);
appRouter.put('/:id', updateApp);
appRouter.delete('/:id', deleteApp);

module.exports = appRouter; 