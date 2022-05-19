const fs = require('fs');
const Tour = require('../models/tourModel');

const APIFeatures = require('../utils/apiFeatures');

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

exports.aliasTopTours = (req, res, next) => {
  req.query.sort = 'price,-ratingsAverage';
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

//ROUTE HANDLER
/// Getting all the tours
exports.getAllTours = async (req, res) => {
  try {
    // CREATING QUERY
    //1A.) Filtering
    // console.log(req.query);
    // console.log(JSON.stringify(req.query));
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);

    // const query =  Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //1B.) Advance Filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    // { duration: { $gte: '5' }, difficulty: 'easy' } ---> mongoDB
    // { duration: { gte: '5' }, difficulty: 'easy' }

    //Executing Query
    // let query = Tour.find(JSON.parse(queryStr));

    //2.)Sorting
    // if (req.query.sort) {
    //   const querySort = req.query.sort.split(',').join(' ');
    //   query = query.sort(querySort);
    // } else {
    //   // query = query.sort('-createdAt');
    //   query = query.sort('-_id');
    // }

    //3.) FIELDS LIMITS
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   if (fields.includes('createdAt'))
    //     throw new Error('Accessing this field is not allowed');
    //   query = query.select(fields);
    //   // console.log(req.query);
    // } else {
    //   query = query.select('-__v');
    //   // query = query.select('-__v');
    // }

    //4.) Pagination
    // const page = +req.query.page || 1;
    // const limit = +req.query.limit || 100;
    // const skip = (page - 1) * limit;
    // console.log(page, limit, skip);

    // page 1 1-10, page 2 11-20, page 3 21-30
    // query = query.skip(skip).limit(limit);

    //Execute Query

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SENDING RESPONSE
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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // _id: '$difficulty',
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);

    res.status(200).json({
      status: 'Success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};
