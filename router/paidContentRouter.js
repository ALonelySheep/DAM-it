const express = require('express');
const { authorizeRequest } = require('../controller/auth')

const paidContentRouter = express.Router();

const { queryAllPaidContents, addPaidContent, updatePaidContent, deletePaidContent } = require('../controller/paidContent');

paidContentRouter.use(authorizeRequest);
paidContentRouter.get('/', queryAllPaidContents);
// paidContentRouter.get('/', getAllPaidContents);
paidContentRouter.post('/', addPaidContent);
paidContentRouter.put('/:id', updatePaidContent);
paidContentRouter.delete('/:id', deletePaidContent);


module.exports = paidContentRouter; 