const studentController = require("../controllers/student.controller");
const validation = require("../middlewares/validation");
const validateUser = require("../middlewares/validateUser");
const student = require("../validations/student.validation");
const router = require("express").Router();

//  /api/student
router
  .route("/")
  .post(
    validation(student.insertAdmissionRequest),
    studentController.insertAdmissionRequest
  );
//تقديم طلب التحاق
router
  .route("/guidelines")
  .get(studentController.getApplicationGuidelinesByName); // عرض ارشادات جامعه ب الاسم

  router.route("/")
  .get(studentController.checkAdmissionStatusByNationalId); //الاستعلام عن القبول بالرقم القومي

router
  .route("/GetAppointment")
  .get(studentController.getAppointmentsByUniversityName); //الاستعلام عن مواعيد التقديم لكل جامعه ب اسمها
router.route("/edit").put(studentController.updateAdmissionRequestFields); 
//تعديل البيانات
router.route("/Absence")
.get(studentController.getUserAbsences); 
module.exports = router;
