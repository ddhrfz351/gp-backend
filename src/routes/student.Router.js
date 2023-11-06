const studentController= require('../controllers/student.controller');
 const validation = require("../middlewares/validation");
 const student = require('../validations/student.validation');
const router = require("express").Router();
//  /api/student


router.route('/')
//   .post(validation(student.addApplicationEnrollment), studentController.addApplicationenrollment);
   .post(studentController. insertAdmissionRequest)
   .get( studentController.getAllAdmissionRequests);

  module.exports = router;