const conn = require("../models/dbConnectoin");
const bcrypt = require("bcrypt");

class studentController {
  /**
   * @description تقديم طلب التحاق
   * @route /api/student/
   * @method POST
   * @access public
   */
  static insertAdmissionRequest = async (req, res) => {
    console.log(req.session);
    try {
      const defaultStatus = "لم يتم مراجعة الطلب";
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Check if the national ID already exists
      const checkExistingQuery =
        "SELECT id FROM admission_requests WHERE national_id = ?";
      conn.query(
        checkExistingQuery,
        [req.body.national_id],
        (checkErr, checkResult) => {
          if (checkErr) {
            console.error(
              "Error checking existing admission request: " + checkErr.stack
            );
            return res
              .status(500)
              .json({
                error:
                  "An error occurred while checking existing admission request",
              });
          }

          if (checkResult.length > 0) {
            return res
              .status(400)
              .json({
                error: "Admission request with this national ID already exists",
              });
          }

          // Get university_id using the sent university_name
          const getUniversityIdQuery =
            "SELECT id FROM universities WHERE name = ?";
          conn.query(
            getUniversityIdQuery,
            [req.body.university_name],
            (uniErr, uniResult) => {
              if (uniErr) {
                console.error("Error getting university ID: " + uniErr.stack);
                return res
                  .status(500)
                  .json({
                    error: "An error occurred while getting university ID",
                  });
              }

              if (uniResult.length === 0) {
                return res
                  .status(400)
                  .json({ error: "University with this name does not exist" });
              }

              const university_id = uniResult[0].id;

              // Determine the category and distance based on the residence address
              const getCategoryAndDistanceQuery =
                "SELECT Category_ID, Distance FROM countries WHERE Country_Name = ?";

              // Replace the condition above with your actual condition for determining the category and distance
              console.log(getCategoryAndDistanceQuery);
              conn.query(
                getCategoryAndDistanceQuery,
                [req.body.residence_address],
                (categoryErr, categoryResult) => {
                  if (categoryErr) {
                    console.error(
                      "Error getting category and distance: " +
                        categoryErr.stack
                    );
                    return res
                      .status(500)
                      .json({
                        error:
                          "An error occurred while getting category and distance",
                      });
                  }

                  let categoryID, distance;

                  if (categoryResult.length > 0) {
                    // If data is found, use it
                    categoryID = categoryResult[0].Category_ID;
                    distance = categoryResult[0].Distance;
                  }

                  // Data to insert
                  const dataToInsert = {
                    university_id: university_id,
                    Student_type: req.body.Student_type,
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
                    previous_academic_year_gpa:
                      req.body.previous_academic_year_gpa,
                    status: defaultStatus,
                    password: hashedPassword,
                    Housing_in_previous_years:
                      req.body.Housing_in_previous_years,
                    housing_type: req.body.housing_type,
                    family_abroad: req.body.family_abroad,
                    special_needs: req.body.special_needs,
                    Secondary_Division: req.body.Secondary_Division,
                    Total_grades_high_school: req.body.Total_grades_high_school,
                    Passport_number: req.body.Passport_number,
                    Passport_issuing_authority:
                      req.body.Passport_issuing_authority,
                    distance: distance, // Add the distance to the data
                    category: categoryID, // Add the category to the data
                    university_name: req.body.university_name,
                  };

                  const insertQuery = `INSERT INTO admission_requests SET ?`;

                  conn.query(insertQuery, dataToInsert, (err, result) => {
                    if (err) {
                      console.error(
                        "Error inserting admission request: " + err.stack
                      );
                      return res
                        .status(500)
                        .json({
                          error:
                            "An error occurred while inserting admission request",
                        });
                    }

                    // If the request is inserted successfully, add the user to the "user" table
                    const userToInsert = {
                      name: req.body.name,
                      email: req.body.email,
                      national_id: req.body.national_id,
                      role: 0, // Set the role to 0
                      password: hashedPassword,
                    };

                    const insertUserQuery = `INSERT INTO user SET ?`;

                    conn.query(
                      insertUserQuery,
                      userToInsert,
                      (userErr, userResult) => {
                        if (userErr) {
                          console.error(
                            "Error inserting user: " + userErr.stack
                          );
                          return res
                            .status(500)
                            .json({
                              error: "An error occurred while inserting user",
                            });
                        }

                        res.status(201).json({
                          message:
                            "Admission request and user have been inserted successfully.",
                          admissionRequestData: result,
                          userData: userResult,
                        });
                      }
                    );
                  });
                }
              );
            }
          );
        }
      );
    } catch (error) {
      console.error("Error inserting admission request: " + error.stack);
      res
        .status(500)
        .json({ error: "An error occurred while inserting admission request" });
    }
  };
/**
   * @description عرض ارشادات وتعليمات جامعه معينه من خلال اسمها 
   * @route /api/student/guidelines
   * @method get
   * @access public
   */
  static getApplicationGuidelinesByName = (req, res) => {
    const universityName = req.query.name; // Updated parameter name

    if (!universityName) {
      return res.status(400).json({ error: "يجب تقديم اسم الجامعة." });
    }

    const getGuidelinesQuery =
      "SELECT * FROM `application guidelines and approvals` WHERE university_id IN (SELECT id FROM universities WHERE name = ?)";

    conn.query(getGuidelinesQuery, [universityName], (err, result) => {
      if (err) {
        console.error("Error executing query: " + err.message);
        return res
          .status(500)
          .json({ error: "حدث خطأ أثناء البحث عن الإرشادات." });
      }

      if (result.length > 0) {
        const guidelines = result[0];
        return res.status(200).json({ guidelines });
      } else {
        return res
          .status(404)
          .json({ message: "لا توجد إرشادات متاحة لهذه الجامعة." });
      }
    });
  };

  /**
   * @description عرض مواعيدالتقديم ل جامعه معينه من خلال اسمها 
   * @route /api/student/GetAppointment
   * @method get
   * @access public
   */
  static getAppointmentsByUniversityName = (req, res) => {
    const universityName = req.query.universityName; 

    if (!universityName) {
      return res.status(400).json({ error: "يجب تقديم اسم الجامعة." });
    }

    // الاستعلام عن المواعيد باستخدام اسم الجامعة
    const getAppointmentsQuery = `
        SELECT a.* 
        FROM appointments AS a
        JOIN universities AS u ON a.university_id = u.id
        WHERE u.name = ?
    `;

    conn.query(getAppointmentsQuery, [universityName], (err, result) => {
      if (err) {
        console.error("خطأ في الاستعلام: " + err.message);
        return res
          .status(500)
          .json({ error: "حدث خطأ أثناء البحث عن المواعيد." });
      }

      if (result.length > 0) {
        const appointments = result;
        return res.status(200).json({ appointments });
      } else {
        return res
          .status(404)
          .json({ error: "لا توجد مواعيد متاحة لهذه الجامعة." });
      }
    });
  };
   /**
   * @description الاستعلام عن القبول بالرقم القومي
   * @route /api/student/
   * @method get
   * @access public
   */

  static checkAdmissionStatusByNationalId = (req, res) => {
    const nationalId = req.query.national_id;

    const selectQuery =
      "SELECT name, college, university_name, status FROM admission_requests WHERE national_id = ?";

    conn.query(selectQuery, [nationalId], (err, admissionRequestData) => {
      if (err) {
        console.error("Error fetching admission request data: " + err.stack);
        return res
          .status(500)
          .json({
            error: "An error occurred while fetching admission request data",
          });
      }

      // Check if admission request data exists
      if (admissionRequestData.length === 0) {
        return res.status(404).json({ error: "Admission request not found" });
      }

      const { name, college, university_name, status } =
        admissionRequestData[0];

      res.status(200).json({
        name: name,
        college: college,
        university_name: university_name,
        admissionStatus: status,
      });
    });
  };
  /**
   * @description Update specific fields of an admission request after password verification
   * @route /api/student/updateRequest/:id
   * @method PUT
   * @access public
   */
  static updateAdmissionRequestFields = async (req, res) => {
    const requestId = req.query.national_id;
    const currentPassword = req.query.password;

    // Check for the existence of the request using the national ID or request number
    const checkExistingQuery =
      'SELECT * FROM admission_requests WHERE national_id = ? AND status = "لم يتم مراجعة الطلب"';
    conn.query(
      checkExistingQuery,
      [requestId],
      async (checkErr, checkResult) => {
        if (checkErr) {
          console.error("Error checking admission request: " + checkErr.stack);
          return res
            .status(500)
            .json({
              error: "An error occurred while checking admission request",
            });
        }

        // Check for the existence of the request and that its status has not changed
        if (checkResult.length === 0) {
          return res
            .status(400)
            .json({
              error: "Admission request not found or has been reviewed",
            });
        }

        const admissionRequestData = checkResult[0];

        // Check the validity of the password
        const isPasswordValid = await bcrypt.compare(
          currentPassword,
          admissionRequestData.password
        );

        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid password" });
        }

        // If the password is valid, update the specified fields
        const updateFields = {};
        for (const field in req.query) {
          if (
            req.query[field] !== undefined &&
            field !== "national_id" &&
            field !== "password"
          ) {
            updateFields[field] = req.query[field];
          }
        }

        const updateQuery =
          "UPDATE admission_requests SET ? WHERE national_id = ?";
        conn.query(
          updateQuery,
          [updateFields, requestId],
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error(
                "Error updating admission request fields: " + updateErr.stack
              );
              return res
                .status(500)
                .json({
                  error:
                    "An error occurred while updating admission request fields",
                });
            }

            // After successfully updating the request data, update the user data in the "user" table
            const updateUserFields = {};
            if (req.query.name !== undefined) {
              updateUserFields.name = req.query.name;
            }
            if (req.query.email !== undefined) {
              updateUserFields.email = req.query.email;
            }

            const updateUserQuery = "UPDATE user SET ? WHERE national_id = ?";
            conn.query(
              updateUserQuery,
              [updateUserFields, requestId],
              (userUpdateErr, userUpdateResult) => {
                if (userUpdateErr) {
                  console.error(
                    "Error updating user data: " + userUpdateErr.stack
                  );
                  return res
                    .status(500)
                    .json({
                      error: "An error occurred while updating user data",
                    });
                }

                res.status(200).json({
                  message:
                    "Admission request fields and user data have been updated successfully.",
                  data: updateResult,
                  userData: userUpdateResult,
                });
              }
            );
          }
        );
      }
    );
  };
  static getUserAbsences = (req, res) => {
    const nationalId = req.query.nationalId; // تفترض أن الرقم القومي مُمرر عبر الطلب

    // استعلام استرجاع الجزاءات للمستخدم بناءً على الرقم القومي
    const getUserAbsencesQuery = `
        SELECT user_absences.*
        FROM user
        INNER JOIN user_absences ON user.id = user_absences.user_id
        WHERE user.national_id = '${nationalId}'
    `;

    // تنفيذ الاستعلام
    conn.query(getUserAbsencesQuery, (err, absences) => {
        if (err) {
            console.error('Error retrieving user absences:', err.stack);
            return res.status(500).json({ error: "An error occurred while retrieving user absences" });
        }

        // التحقق مما إذا كان هناك جزاءات أم لا
        if (absences.length === 0) {
            return res.status(200).json({
                message: "No absences found for the user.",
                data: {
                    absences: []
                }
            });
        }

        // إرجاع النتائج إذا وجدت جزاءات
        res.status(200).json({
            message: "User absences retrieved successfully.",
            data: {
                absences: absences
            }
        });
    });
};
}

module.exports = studentController;
