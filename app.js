const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const { nextTick } = require('process');

const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//1.) Middleware
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

//2.) Creating our own middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋🏻👋🏻');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
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
