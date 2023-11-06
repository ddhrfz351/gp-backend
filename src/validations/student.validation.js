const Joi = require('joi');
class Student {
static addApplicationEnrollment= Joi.object({
  university_id: Joi.number().required(),
  nationality: Joi.string().required(),
  national_id: Joi.string().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  date_of_birth: Joi.date().iso().required(),
  place_of_birth: Joi.string().required(),
  gender: Joi.string().valid('Male', 'Female').required(),
  religion: Joi.string().required(),
  residence_address: Joi.string().required(),
  detailed_address: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile_number: Joi.string().required(),
  father_name: Joi.string().required(),
  father_national_id: Joi.string().required(),
  father_occupation: Joi.string().required(),
  father_phone_number: Joi.string().required(),
  guardian_name: Joi.string().required(),
  guardian_national_id: Joi.string().required(),
  guardian_phone_number: Joi.string().required(),
  parents_status: Joi.string().valid('Married', 'Single', 'Divorced').required(),
  college: Joi.string().required(),
  level: Joi.number().required(),
  previous_academic_year_gpa: Joi.number().min(0).max(4).required(),
  status: Joi.string().valid('Pending', 'Approved', 'Rejected').required(),

});
}

module.exports = Student;
