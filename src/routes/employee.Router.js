const employeeController= require('../controllers/employee.controller');
 const validation = require("../middlewares/validation");
 const employee = require('../validations/employee.validation');
const router = require("express").Router();
//  /api/employee

router.route('/')
  .post(employeeController.acceptAdmissionRequest)
router.route('/reject')
  .post(employeeController.rejectAdmissionRequest)
router.route('/')
  .get( employeeController.getAllAdmissionRequests);
  router.route('/block/:national_id')
  .put(employeeController.blockStudent)
  





  module.exports = router;