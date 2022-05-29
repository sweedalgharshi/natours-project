const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1.) Global Middleware
//SET Security HTTP headers
app.use(helmet());

// console.log(process.env.NODE_ENV);
//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please try again after an hour',
});

app.use('/api', limiter);

//Body Parser, reading data from the body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

//Data sanitization against NoSQL Query injection
app.use(mongoSanitize());
//Data Sanitization against XSS (cross site scripting attacks)
app.use(xss());

//Prevent parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'price',
      'difficulty',
    ],
  })
);
//Serving Static Files
app.use(express.static(`${__dirname}/public`));

//2.) Creating our own middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋🏻👋🏻');
//   next();
// });

//TEST MIDDLEWARES
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);

  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//HANDLING UNHANDLE ROUTES
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Can't find this ${req.originalUrl} url on this server`,
  // });

  // const err = new Error(
  //   `Can't find this ${req.originalUrl} url on this server`
  // );
  // err.status = 'fail';
  // err.statusCode = 404;

  next(
    new AppError(`Can't find this ${req.originalUrl} url on this server`, 400)
  );
});

//GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);
//Get all the tours
// app.get('/api/v1/tours', getAllTours);

////
//RESPONDING TO URL PARAMETERS
// app.get('/api/v1/tours/:id', getTour);

///
//POST METHOD (creating the tour)
// app.post('/api/v1/tours', createTour);

///Handling PATCH Request
// app.patch('/api/v1/tours/:id', updateTour);

///Handling DELETE Request
// app.delete('/api/v1/tours/:id', deleteTour);

//Listening on the port
//START SERVER
module.exports = app;
//////
//////
///OLD CODE

///
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: `Hello from the server side ! 👻`, app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can POST to this endpoint...');
// });
