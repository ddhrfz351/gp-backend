const BasicDataController = require('../controllers/BasicData.controller');
const chatController= require('../controllers/BasicData.controller');
const router = require("express").Router();
//  /api/BasicData

router.route('/')
       .get(BasicDataController.getStudentDataByNationalId)
router.route('/male')
       .get(BasicDataController.getFemaleStudents)
router.route('/female')
       .get(BasicDataController.getMaleStudents)
       
  module.exports = router;