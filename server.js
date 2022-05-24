const mongoose = require('mongoose');
const dotenv = require('dotenv');
process.on('uncaughtException', (err) => {
  console.log(`UNHANDLED EXCEPTION! 💥 Shuting Down...`);
  console.log(`${err.name} ${err.message}`);
  process.exit(1);
});

dotenv.config({
  path: './config.env',
});
const app = require('./app');

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
const server = app.listen(port, () => {
  console.log(`Listening from the port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`UNHANDLED REJECTION! 💥 Shuting Down...`);
  console.log(`${err.name} ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
