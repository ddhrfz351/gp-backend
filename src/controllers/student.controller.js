const conn = require("../models/dbConnectoin");

class studentController {  
  
  
  /**
   * @description Insert a new admission request
   * @route /api/student/requests
   * @method POST
   * @access public
   */
  static insertAdmissionRequest = (req, res) => {
    const dataToInsert = {
      university_id: req.body.university_id,
      nationality: req.body.nationality,
      national_id: req.body.national_id,
      name: req.body.name,
      date_of_birth: req.body.date_of_birth,
      place_of_birth: req.body.place_of_birth,
      gender: req.body.gender,
      religion: req.body.religion,
      residence_address: req.body.residence_address,
      detailed_address: req.body.detailed_address,
      email: req.body.email,
      mobile_number: req.body.mobile_number,
      father_name: req.body.father_name,
      father_national_id: req.body.father_national_id,
      father_occupation: req.body.father_occupation,
      father_phone_number: req.body.father_phone_number,
      guardian_name: req.body.guardian_name,
      guardian_national_id: req.body.guardian_national_id,
      guardian_phone_number: req.body.guardian_phone_number,
      parents_status: req.body.parents_status,
      college: req.body.college,
      level: req.body.level,
      previous_academic_year_gpa: req.body.previous_academic_year_gpa,
      status: req.body.status,
      password: req.body.password
    };
  
    const insertQuery = `INSERT INTO admission_requests SET ?`;
  
    conn.query(insertQuery, dataToInsert, (err, result) => {
      if (err) {
        console.error('Error inserting admission request: ' + err.stack);
        return res
          .status(500)
          .json({ error: "An error occurred while inserting admission request" });
      }
  
      res.status(201).json({
        message: "Admission request has been inserted successfully.",
        data: result
      });
    });
  };
  
  /**
   * @description Get all admission requests
   * @route /api/student/requests
   * @method GET
   * @access public
   */
  static getAllAdmissionRequests = (req, res) => {
    const selectQuery = `SELECT * FROM admission_requests`;
  
    conn.query(selectQuery, (err, results) => {
      if (err) {
        console.error('Error fetching admission requests: ' + err.stack);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching admission requests" });
      }
  
      res.status(200).json({
        message: "All admission requests have been retrieved successfully.",
        data: results
      });
    });
  };
}

module.exports = studentController;
