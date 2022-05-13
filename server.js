const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
  path: './config.env',
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB CONNECTION SUCCESSFUL!'));

const app = require('./app');
// console.log(app.get('env'));
// console.log(process.env);

//MONGOOSE

// const testTour = new Tour({
//   name: 'The Snow Adventurer',
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('Error:💥', err);
//   });
//Listening on the port
//START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening from the port ${port}`);
});
