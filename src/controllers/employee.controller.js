const conn = require("../models/dbConnectoin");

class employeeController {
  
    /**
   * @description Accept an admission request and insert data into the acceptinguserdata table
   * @route /api/student/accept-request/:id
   * @method POST
   * @access public
   */
    static acceptAdmissionRequest = (req, res) => {
      const admissionRequestId = req.params.id;
  
      // بدء المعاملة
      conn.beginTransaction(function(err) {
        if (err) {
          console.error('Error starting transaction: ' + err.stack);
          return res
            .status(500)
            .json({ error: "An error occurred while starting the transaction" });
        }
  
        // استعلام لاسترداد بيانات طلب القبول
        const selectQuery = 'SELECT * FROM admission_requests WHERE id = ?';
  
        conn.query(selectQuery, [admissionRequestId], (err, admissionRequestData) => {
          if (err) {
            console.error('Error fetching admission request data: ' + err.stack);
            return conn.rollback(function() {
              res
                .status(500)
                .json({ error: "An error occurred while fetching admission request data" });
            });
          }
  
          // تأكد من أن الطلب موجود وأن هناك بيانات متوفرة
          if (admissionRequestData.length === 0) {
            return conn.rollback(function() {
              res.status(404).json({ error: "Admission request not found" });
            });
          }
  
          // استخراج بيانات طلب القبول
          const requestData = admissionRequestData[0];
  
          // الآن يمكنك استخدام بيانات الطلب من admissionRequestData في عملية الإدراج في جدول الـuser
          const userInsertQuery = 'INSERT INTO user (name, email, role, room_id, password) VALUES (?, ?, ?, ?, ?)';
          const { email, national_id, password } = requestData;
          const role = 0; // افترضنا أن الرول هو 0
          const room_id = 1; // يمكنك تعيين قيمة room_id حسب الحالة
  
          conn.query(userInsertQuery, [requestData.name, email, role, room_id, password], (err, userInsertResult) => {
            if (err) {
              console.error('Error inserting user data: ' + err.stack);
              return conn.rollback(function() {
                res
                  .status(500)
                  .json({ error: "An error occurred while inserting user data" });
              });
            }
  
            // استرداد معرف العميل الذي تم إدراجه
            const userId = userInsertResult.insertId;
  
            // الآن يمكنك استخدام userId لإجراء عملية الإدراج في جدول acceptinguserdata
            const acceptingUserDataInsertQuery = 'INSERT INTO acceptinguserdata (user_id, university_id, nationality, national_id, name, date_of_birth, place_of_birth, gender, religion, residence_address, detailed_address, email, mobile_number, father_name, father_national_id, father_occupation, father_phone_number, guardian_name, guardian_national_id, guardian_phone_number, parents_status, college, level, previous_academic_year_gpa, status, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
            conn.query(acceptingUserDataInsertQuery, [userId, requestData.university_id, requestData.nationality, requestData.national_id, requestData.name, requestData.date_of_birth, requestData.place_of_birth, requestData.gender, requestData.religion, requestData.residence_address, requestData.detailed_address, requestData.email, requestData.mobile_number, requestData.father_name, requestData.father_national_id, requestData.father_occupation, requestData.father_phone_number, requestData.guardian_name, requestData.guardian_national_id, requestData.guardian_phone_number, requestData.parents_status, requestData.college, requestData.level, requestData.previous_academic_year_gpa, requestData.status, password], (err, acceptingUserDataInsertResult) => {
              if (err) {
                console.error('Error inserting data into acceptinguserdata: ' + err.stack);
                return conn.rollback(function() {
                  res
                    .status(500)
                    .json({ error: "An error occurred while inserting data into acceptinguserdata" });
                });
              }
  
              // الإدراج نجح، لنقم بحذف البيانات من جدول admission_requests
              const deleteQuery = 'DELETE FROM admission_requests WHERE id = ?';
              conn.query(deleteQuery, [admissionRequestId], (err) => {
                if (err) {
                  console.error('Error deleting admission request: ' + err.stack);
                  return conn.rollback(function() {
                    res
                      .status(500)
                      .json({ error: "An error occurred while deleting admission request" });
                  });
                }
  
                // إتمام المعاملة بنجاح
                conn.commit(function(err) {
                  if (err) {
                    console.error('Error committing transaction: ' + err.stack);
                    return conn.rollback(function() {
                      res
                        .status(500)
                        .json({ error: "An error occurred while committing the transaction" });
                    });
                  }
  
                  // عند الانتهاء بنجاح
                  res.status(201).json({
                    message: "Admission request has been accepted and processed successfully.",
                    data: acceptingUserDataInsertResult
                  });
                });
              });
            });
          });
        });
      });
    };
}
module.exports = employeeController;
