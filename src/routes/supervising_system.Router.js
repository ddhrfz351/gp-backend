const validation = require("../middlewares/validation");

const Supervising_systemController= require('../controllers/supervising_system.controller');
const router = require("express").Router();
//=========================================\\


router.route('/city')
   .post(Supervising_systemController.addCity)
router.route('/building')
   .post(Supervising_systemController.addBuilding) 
router.route('/room')
   .post(Supervising_systemController.addRoom) 

router.route('/addCategory')
   .post(Supervising_systemController.addCategory)
router.route('/addCountryInCategory')
   .post(Supervising_systemController.addCountryInCategory)



//=========================================\\
module.exports = router;