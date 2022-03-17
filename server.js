const express = require('express');
require('dotenv').config();
// const expenseRoutes = require('./routes/expense');

const testRouter = require('./route/testRouter');

// Running express server
const app = express();
const port = process.env.PORT || 8000;

// route middlewares
// app.use('/api', expenseRoutes);

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/',testRouter);


app.get('/', (req, res, next) => {
    res.json({info:'Hello from Express   !!!!!!!!!!'})
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${port}`);
});
