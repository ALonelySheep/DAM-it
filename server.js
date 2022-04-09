const express = require('express');
const cors = require('cors');

require('dotenv').config();
// const expenseRoutes = require('./routes/expense');

const testRouter = require('./router/testRouter');
const subscriptionRouter = require('./router/subscriptionRouter');
const appRouter = require('./router/appRouter');

// Running express server
const app = express();
const port = process.env.PORT || 8000;

// route middlewares
// app.use('/api', expenseRoutes);

const bodyParser = require('body-parser')
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/test',testRouter);
app.use('/subscription',subscriptionRouter);
app.use('/app',appRouter);


app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${port}`);
});
