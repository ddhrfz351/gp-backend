const conn = require("../models/dbConnectoin");

class ChatBotController {
    static searchAnswer = (req, res) => {
        const userQuestion = req.body.question;
    
        if (!userQuestion) {
          return res.status(400).json({ error: 'السؤال مطلوب.' });
        }
    
        // إجراء البحث عن الإجابة باستخدام السؤال
        const query = 'SELECT answer FROM qa_table WHERE question LIKE ?';
        const searchTerm = '%' + userQuestion + '%';
    
        conn.query(query, [searchTerm], (err, results) => {
          if (err) {
            console.error('خطأ في الاستعلام: ' + err.message);
            return res.status(500).json({ error: 'حدث خطأ أثناء البحث عن الإجابة.' });
          } else if (results.length === 0) {
            return res.json({ message: "لا يمكنني الرد علي سؤالك  نوجه الي شؤون الطلاب" });
          } else {
            return res.json({ answer: results[0].answer });
          }
        });
      }
  static addQuestionAndAnswer=(req, res) =>{
    const { question, answer } = req.body;
    const query = 'INSERT INTO qa_table (question, answer) VALUES (?, ?)';

    conn.query(query, [question, answer], (err, result) => {
      if (err) {
        console.error('خطأ في الإدراج: ' + err.message);
        res.status(500).json({ error: 'حدث خطأ أثناء إضافة السؤال والجواب.' });
      } else {
        res.json({ message: 'تم إضافة السؤال والجواب بنجاح.' });
      }
    });
  }
}

module.exports = ChatBotController ;
