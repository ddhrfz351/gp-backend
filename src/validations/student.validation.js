const Joi = require('joi');
class Student {
  static insertAdmissionRequest = Joi.object({
    
    Student_type: Joi.string().min(3).valid('مستجد','قديم').trim().max(10).required(),
    nationality: Joi.string().valid('وافد','مصرى').trim().required(),
    national_id: Joi.when('nationality', {
      is: 'مصرى',
      then: Joi.string().length(14).required(),
      otherwise: Joi.string().length(14)
    }),  
    name: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).max(100).required(),
    date_of_birth: Joi.date().required(),
    place_of_birth: Joi.string().trim().required(),
    gender: Joi.string().valid('ذكر','انثي').trim().required(),
    religion: Joi.string().valid('مسلم', 'مسيحي', 'يهودي').trim().required(),
    residence_address: Joi.string().min(3).max(100).required(),
    detailed_address: Joi.string().min(3).max(150).required(),
    email: Joi.string().email().required(),
    mobile_number: Joi.string().min(3).max(50).required(),
    father_name: Joi.when('nationality', {
      is: 'مصرى',
      then: Joi.string().min(3).max(70).required(),
      otherwise: Joi.string().min(3).max(70)
    }),
    father_national_id: Joi.when('nationality', {
      is: 'مصرى',
      then: Joi.string().length(14).required(),
      otherwise: Joi.string().length(14)
    }),
    father_occupation: Joi.when('nationality', {
      is: 'مصرى',
      then: Joi.string().min(2).max(100).required(),
      otherwise: Joi.string().min(2).max(100)
    }),
    father_phone_number: Joi.when('nationality', {
      is: 'مصرى',
      then: Joi.string().min(3).max(50).required(),
      otherwise: Joi.string().min(3).max(50)
    }),
    guardian_name: Joi.when('nationality', {
      is: 'مصرى',
      then: Joi.string().min(3).max(100).required(),
      otherwise: Joi.string().min(3).max(100)
    }),
    guardian_national_id: Joi.when('nationality', {
      is: 'مصرى',
      then: Joi.string().required(),
      otherwise: Joi.string()
    }),
    guardian_phone_number: Joi.when('nationality', {
      is: 'مصرى',
      then: Joi.string().min(3).max(50).required(),
      otherwise: Joi.string().min(3).max(50)
    }),
    parents_status: Joi.string().valid('متزوج', 'أعزب', 'مطلق').required(),
    college: Joi.string().min(3).max(100).required(),
    level: Joi.number().integer().min(1).max(5).required(),
    previous_academic_year_gpa: Joi.when('Student_type', {
      is: 'قديم',
      then: Joi.number().min(0).max(4).required(),
      otherwise: Joi.number().min(0).max(4)
    }),
    Housing_in_previous_years: Joi.when('Student_type', {
      is: 'قديم',
      then: Joi.string().min(3).max(100).required(),
      otherwise: Joi.string().min(3).max(100)
    }),
    housing_type: Joi.string().min(3).max(50).valid('مميز', 'عادي').required(),
    university_name: Joi.string().min(3).max(50).required(),
    family_abroad: Joi.boolean().default(false),
    special_needs:Joi.boolean().default(false),
    Secondary_Division: Joi.string().min(3).max(50).required(),
    Total_grades_high_school: Joi.number().min(1).required(),
    Passport_number: Joi.when('nationality', {
      is: 'وافد',
      then: Joi.string().min(3).max(50).required(),
      otherwise: Joi.string().min(3).max(50)
    }),
    Passport_issuing_authority: Joi.when('nationality', {
      is: 'وافد',
      then: Joi.string().min(3).max(50).required(),
      otherwise: Joi.string().min(3).max(50)
    }),
  });


// static getAppointmentsByUniversityName = Joi.object({
//   universityName: Joi.string().min(3).max(100).required(),
// })

}

module.exports = Student;
