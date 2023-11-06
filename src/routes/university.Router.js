const universityController= require('../controllers/university.controller');
 const validation = require("../middlewares/validation");
//  const university = require('../validations/employee.validation');
const router = require("express").Router();
//  /api/university

router.route('/')
  .post(universityController.addUniversity)
router.route('/city')
  .post(universityController.addCity)
router.route('/building')
  .post(universityController.addBuilding) 
router.route('/room')
  .post(universityController.addRoom) 
  router.route('/guidelines')
  .post(universityController.addApplicationGuidelines) 
router.route('/guidelines/:name')
  .get(universityController.getApplicationGuidelinesByName) 
router.route('/addAppointment')
  .post(universityController.addAppointment) 
  .get(universityController.getAppointmentsByUniversityName) 






  module.exports = router;