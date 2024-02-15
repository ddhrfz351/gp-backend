const adminController= require('../controllers/admin.controller');
 const validation = require("../middlewares/validation");
 const upload = require("../middlewares/uploadImages");
const Admin = require('../validations/admin.validation');
const router = require("express").Router();

//  /api/admin



router.route('/')
   .post(adminController.addUser)
   .get(adminController.getUsers)
router.route('/update/:national_id')
   .put(adminController.updateUser)
router.route('/block/:national_id')
   .put(adminController.blockUser)
router.route('/retribution')
   .post(adminController.addRetributionForUser)
   .get(adminController.getUserRetribution) 
   .delete(adminController.removeRetributionForUser)
router.route('/addAppointment')
.post(adminController.addAppointment) 
.delete(adminController.deleteAppointmentById) 
router.route('/guidelines')
.post( adminController.addApplicationGuidelines)
.delete( adminController.deleteGuidelinesById); 
router.route('/info/:name')
   .get(adminController.getUniversityDetails) 
router.route('/get/:role')
   .get(adminController.getUsersByRole)
router.route('/Appointment')
   .post(adminController.addAppointment)
   .put(adminController.updateAppointments)
   .delete(adminController.deleteAppointmentById)
   router.route('/unblock/:national_id')
   .put(adminController.unblockUser)
module.exports = router;