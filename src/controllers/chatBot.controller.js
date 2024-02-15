// chatBot.js
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['ar'] });

manager.addDocument('ar', 'مرحبا', 'greetings.hello');
manager.addDocument('ar', 'السلام عليكم', 'greetings.hello');
manager.addDocument('ar', 'كيف حالك؟', 'greetings.howAreYou');
manager.addDocument('ar', 'مااسمك', 'greetings.whatIsYourName');
manager.addDocument('ar', 'كم عمرك؟', 'greetings.askAge'); // سؤال جديد حول العمر
manager.addAnswer('ar', 'greetings.hello', 'مرحبا لك أيضا!');
manager.addAnswer('ar', 'greetings.whatIsYourName', 'الدلوعه');
manager.addAnswer('ar', 'greetings.howAreYou', 'أنا بخير، شكراً. كيف يمكنني مساعدتك؟');
manager.addAnswer('ar', 'greetings.askAge', 'أنا مجرد برنامج حاسوب، ليس لدي عمر.');

manager.train();

async function getResponse(message) {
  const response = await manager.process('ar', message);
  return response.answer;
}

module.exports = { getResponse };
