const fs = require('fs');
const Tour = require('../models/tourModel');

//Reading the data-json file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

/*
exports.checkID = (req, res, next, val) => {
  console.log(`The tour id is ${val}`);
  // if (req.params.id * 1 > tours.length) {
    //   return res.status(404).json({
      //     status: 'fail',
      //     message: 'Invalid ID',
      //   });
      // }
      next();
    };
    
    exports.checkBody = (req, res, next) => {
      if (!req.body.name || !req.body.price) {
        return res.status(400).json({
          status: 'fail',
          message: 'Missing name or price',
        });
      }
      
      next();
    };
*/

//ROUTE HANDLER
/// Getting all the tours
exports.getAllTours = async (req, res) => {
  // console.log(req.requestTime);
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};

//Getting only one tour
exports.getTour = async (req, res) => {
  try {
    // console.log(req.params);
    const tour = await Tour.findById(req.params.id);

    console.log(tour);
    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // // if (id > tours.length)

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

//Creating a tour
exports.createTour = async (req, res) => {
  try {
    // console.log(req.body);

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, ...req.body); // you can use spread operator too {...} alternative : req.body
  // tours.push(newTour);

  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tours: newTour,
  //       },
  //     });
  //   }
  // );
  // res.send('Done!');
};

// Updating the tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};

//Deleting the tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};
