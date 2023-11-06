function validation(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        // يمكنك إرسال رسالة الخطأ إلى العميل
        res.status(400).json({ error: error.details.map(detail => detail.message).join(', ') });
      } else {
        next(); // مرور الى الوسيط التالي (middleware)
      }
    };
  }
  
  module.exports = validation;
  