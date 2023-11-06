const employeeController= require('../controllers/employee.controller');
 const validation = require("../middlewares/validation");
 const employee = require('../validations/employee.validation');
const router = require("express").Router();
//  /api/employee

router.route('/:id')
  .post(employeeController.acceptAdmissionRequest)









  module.exports = router;