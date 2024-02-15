const housingController= require('../controllers/housing.controller');
 const validation = require("../middlewares/validation");
 
const router = require("express").Router();
//  /api/employee


 
router.route('/')
  .post( housingController.assignRoom);
 

  router.route('/i')
  .post( housingController.allocateRoom);
 



  module.exports = router;