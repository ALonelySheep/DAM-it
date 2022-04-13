const express = require('express');
const { authorizeRequest } = require('../controller/auth')

const deviceRouter = express.Router();

const { queryAllDevices, addDevice, updateDevice, deleteDevice } = require('../controller/device');

deviceRouter.use(authorizeRequest)
deviceRouter.get('/', queryAllDevices);
// deviceRouter.get('/', getAllDevices);
deviceRouter.post('/', addDevice);
deviceRouter.put('/:id', updateDevice);
deviceRouter.delete('/:id', deleteDevice);


module.exports = deviceRouter; 