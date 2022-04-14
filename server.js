const express = require('express');
const cors = require('cors');

require('dotenv').config();
// const expenseRoutes = require('./routes/expense');

const testRouter = require('./router/testRouter');
const subscriptionRouter = require('./router/subscriptionRouter');
const appRouter = require('./router/appRouter');
const paidContentRouter = require('./router/paidContentRouter');
const personalWorkRouter = require('./router/personalWorkRouter');
const deviceRouter = require('./router/deviceRouter');
const userRouter = require('./router/userRouter');


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

app.use('/test', testRouter);
app.use('/user', userRouter);
app.use('/app', appRouter);
app.use('/subscription', subscriptionRouter);
app.use('/paid-content', paidContentRouter);
app.use('/device', deviceRouter);
app.use('/personal-work', personalWorkRouter);


app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${port}`);
});
