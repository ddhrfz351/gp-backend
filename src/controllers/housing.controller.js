const conn = require("../models/dbConnectoin");

class HousingController {

  static allocateRoom = (req, res) => {
    const roomNumber = req.params.roomNumber;
    console.log(roomNumber);
    // Get room status
    const roomQuery = 'SELECT status FROM rooms WHERE room_number = ? LIMIT 1';
    conn.query(roomQuery, [roomNumber], (err, roomResult) => {
      if (err) {
        console.error('Error fetching room data: ' + err.stack);
        return res.status(500).json({ error: "An error occurred while fetching room data" });
      }

      if (roomResult.length === 0) {
        return res.status(404).json({ error: "Room not found" });
      }

      const roomData = roomResult[0];

      // Check room status
      if (roomData.status === 1) {
        // Room is available
       
        res.status(200).json({
          message: "Room is available.",
          data: {
            roomNumber: roomNumber
          }
        });
      } else {
        // Room is not available
        res.status(404).json({ error: "Room not available" });
      }
    });
  };
  static assignRoom = (req, res) => {
    const nationalId = req.query.nationalId;

    // Check if the user already exists
    const checkUserQuery = `SELECT * FROM user WHERE national_id = '${nationalId}' LIMIT 1`;

    conn.query(checkUserQuery, (err, userResult) => {
        if (err) {
            console.error('Error checking user data:', err.stack);
            return res.status(500).json({ error: "An error occurred while checking user data" });
        }

        // If the user doesn't exist, return an error
        if (userResult.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Retrieve housing type preference from admission_requests table
        const getHousingTypeQuery = `SELECT housing_type FROM admission_requests WHERE national_id = '${nationalId}' LIMIT 1`;

        conn.query(getHousingTypeQuery, (err, housingTypeResult) => {
            if (err) {
                console.error('Error retrieving housing type preference:', err.stack);
                return res.status(500).json({ error: "An error occurred while retrieving housing type preference" });
            }

            // If housing type preference is not found, return an error
            if (housingTypeResult.length === 0) {
                return res.status(404).json({ error: "Housing type preference not found for the user" });
            }

            const housingType = housingTypeResult[0].housing_type;

            // Check if the user already has a room assigned
            const checkUserRoomQuery = `SELECT room_id FROM user WHERE national_id = '${nationalId}' LIMIT 1`;

            conn.query(checkUserRoomQuery, (err, userRoomResult) => {
                if (err) {
                    console.error('Error checking user room data:', err.stack);
                    return res.status(500).json({ error: "An error occurred while checking user room data" });
                }

                // If the user already has a room assigned, return that information
                if (userRoomResult.length > 0 && userRoomResult[0].room_id !== null) {
                    const userAssignedRoomId = userRoomResult[0].room_id;
                    return res.status(200).json({
                        message: "User already assigned to a room.",
                        data: {
                            userId: nationalId,
                            assignedRoomId: userAssignedRoomId
                        }
                    });
                }

                // If the user doesn't have a room assigned, proceed with room assignment
                let roomTypeQuery = '';

                // Define the room type query based on housing type preference
                if (housingType === 'مميز') {
                    roomTypeQuery = `SELECT id, status, cap, NumberOfResidents FROM rooms WHERE type = 'مميز' AND status = 1 LIMIT 1`;
                } else {
                    roomTypeQuery = `SELECT id, status, cap, NumberOfResidents FROM rooms WHERE type = 'عادي' AND status = 1 LIMIT 1`;
                }

                conn.query(roomTypeQuery, (err, roomResult) => {
                    if (err) {
                        console.error('Error fetching room data:', err.stack);
                        return res.status(500).json({ error: "An error occurred while fetching room data" });
                    }

                    if (roomResult.length === 0) {
                        return res.status(404).json({ error: "No available rooms" });
                    }

                    const roomData = roomResult[0];

                    // Increment occupants count
                    const newOccupantsCount = roomData.NumberOfResidents + 1;

                    // Update room data
                    const updateRoomQuery = `UPDATE rooms SET NumberOfResidents = ${newOccupantsCount}, status ='${(newOccupantsCount === roomData.cap) ? 0 : 1}' WHERE id = '${roomData.id}'`;

                    conn.query(updateRoomQuery, (err, updateRoomResult) => {
                        if (err) {
                            console.error('Error updating room status:', err.stack);
                            return res.status(500).json({ error: "An error occurred while updating room status" });
                        }

                        // Update user data with room assignment
                        const updateUserQuery = `UPDATE user SET room_id = ${roomData.id} WHERE national_id = '${nationalId}'`;

                        conn.query(updateUserQuery, (err, updateUserResult) => {
                            if (err) {
                                console.error('Error updating user data:', err.stack);
                                return res.status(500).json({ error: "An error occurred while updating user data" });
                            }

                            // Success
                            res.status(201).json({
                                message: "Room assigned successfully.",
                                data: {
                                    userId: nationalId,
                                    room: roomData
                                }
                            });
                        });
                    });
                });
            });
        });
    });
};

static getAcceptedStudents = (req, res) => {
  let acceptedStatus = 'Accepted';
  let academicYear = req.query.academicYear;
  let gender = req.query.gender;

  let conditions = [];
  if (academicYear) {
      conditions.push(`college = '${academicYear}'`);
  }
  if (gender) {
      conditions.push(`gender = '${gender}'`);
  }

  let conditionsQuery = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  // Query to select accepted students
  const selectAcceptedStudentsQuery = `SELECT * FROM admission_requests ${conditionsQuery} AND status = '${acceptedStatus}'`;

  conn.query(selectAcceptedStudentsQuery, (err, results) => {
      if (err) {
          console.error('Error retrieving accepted students:', err.stack);
          return res.status(500).json({ error: "An error occurred while retrieving accepted students" });
      }

      // If there are no accepted students, return empty array
      if (results.length === 0) {
          return res.status(404).json({ message: "No accepted students found" });
      }

      // If there are accepted students, return them
      res.status(200).json({ acceptedStudents: results });
  });
};


  
}

module.exports = HousingController;
