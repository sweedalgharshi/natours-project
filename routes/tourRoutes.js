const express = require('express');

const router = express.Router();
const tourController = require('../controllers/tourController');

// router.param('id', tourController.checkID);

// router.param('body')
//GET METHOD
//Get all the tours
///
//POST METHOD (creating the tour)
router
  .route('/')
  .get(tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createTour);
  .post(tourController.createTour);

////
//RESPONDING TO URL PARAMETERS
///Handling PATCH Request
///Handling DELETE Request
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
