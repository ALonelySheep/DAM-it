const express = require('express');
const { authorizeRequest } = require('../controller/auth')

const userRouter = express.Router();

const { addUser } = require('../controller/user');

userRouter.use(authorizeRequest)
userRouter.post('/', addUser);

module.exports = userRouter; 