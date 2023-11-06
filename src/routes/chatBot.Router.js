const chatController= require('../controllers/chatBot.controller');
//  const validation = require("../middlewares/validation");

const router = require("express").Router();
//  /api/chatBot


router.route('/')
       .post(chatController.addQuestionAndAnswer)
       .get(chatController.searchAnswer);
   
  
      

  module.exports = router;