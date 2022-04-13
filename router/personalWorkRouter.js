const express = require('express');
const { authorizeRequest } = require('../controller/auth')

const personalWorkRouter = express.Router();

const { queryAllPersonalWorks, addPersonalWork, updatePersonalWork, deletePersonalWork } = require('../controller/personalWork');

personalWorkRouter.use(authorizeRequest);
personalWorkRouter.get('/', queryAllPersonalWorks);
// personalWorkRouter.get('/', getAllPersonalWorks);
personalWorkRouter.post('/', addPersonalWork);
personalWorkRouter.put('/:id', updatePersonalWork);
personalWorkRouter.delete('/:id', deletePersonalWork);


module.exports = personalWorkRouter; 