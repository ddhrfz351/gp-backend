const conn = require("../models/dbConnectoin");
const fs = require("fs");
const path = require("path");

class Supervising_systemController{


  
static addCity = (req, res) => {
  const name = req.body.name;
  const universityName = req.body.university_name;

  if (!name || !universityName) {
      return res.status(400).json({ message: "يجب تقديم اسم المدينة واسم الجامعة." });
  }

  // دالة للبحث عن معرف الجامعة باستخدام اسم الجامعة
  const getUniversityIdByName = (universityName, callback) => {
      const query = 'SELECT id FROM universities WHERE name = ?';
      conn.query(query, [universityName], (err, result) => {
          if (err) {
              console.error('خطأ في الاستعلام: ' + err.message);
              return callback(err, null);
          }

          if (result.length === 0) {
              return callback(null, null); // لا يوجد جامعة تحمل هذا الاسم
          }

          const universityId = result[0].id;
          return callback(null, universityId);
      });
  };
//=========================================================================================================
  // الحصول على university_id باستخدام اسم الجامعة
  getUniversityIdByName(universityName, (err, universityId) => {
      if (err) {
          return res.status(500).json({ error: "حدث خطأ أثناء البحث عن معرف الجامعة." });
      }

      if (!universityId) {
          return res.status(404).json({ error: "الجامعة غير موجودة. يرجى إدخال اسم جامعة صحيح." });
      }

      // التحقق مما إذا كانت المدينة موجودة بالفعل في نفس الجامعة
      const checkCityQuery = 'SELECT id FROM cities WHERE name = ? AND university_id = ?';
      conn.query(checkCityQuery, [name, universityId], (checkErr, checkResult) => {
          if (checkErr) {
              console.error('خطأ في الاستعلام: ' + checkErr.message);
              return res.status(500).json({ error: "حدث خطأ أثناء التحقق من المدينة." });
          }

          if (checkResult.length > 0) {
              return res.status(409).json({ error: "المدينة موجودة بالفعل في نفس الجامعة." });
          }

          // إذا لم تكن المدينة موجودة، قم بإضافتها
          const insertCityQuery = 'INSERT INTO cities (name, university_id) VALUES (?, ?)';
          conn.query(insertCityQuery, [name, universityId], (err, result) => {
              if (err) {
                  console.error('خطأ في الاستعلام: ' + err.message);
                  return res.status(500).json({ error: "حدث خطأ أثناء إضافة المدينة." });
              }

              if (result.affectedRows === 1) {
                  return res.status(201).json({ message: "تمت إضافة المدينة بنجاح." });
              } else {
                  return res.status(500).json({ error: "لم تتم إضافة المدينة. يرجى المحاولة مرة أخرى." });
              }
          });
      });
  });
};
//=================================================================================================
// دالة للبحث عن معرف المدينة باستخدام اسم المدينة
static getCityIdByName = (cityName, callback) => {
  const query = 'SELECT id FROM cities WHERE name = ?';
  conn.query(query, [cityName], (err, result) => {
      if (err) {
          console.error('خطأ في الاستعلام: ' + err.message);
          return callback(err, null);
      }

      if (result.length === 0) {
          return callback(null, null); // لا توجد مدينة تحمل هذا الاسم
      }

      const cityId = result[0].id;
      return callback(null, cityId);
  });
};

// دالة للبحث عن معرف المبنى باستخدام اسم المبنى
static  getBuildingIdByName = (buildingName, callback) => {
  const query = 'SELECT id FROM buildings WHERE name = ?';
  conn.query(query, [buildingName], (err, result) => {
      if (err) {
          console.error('خطأ في الاستعلام: ' + err.message);
          return callback(err, null);
      }

      if (result.length === 0) {
          return callback(null, null); // لا توجد مبنى يحمل هذا الاسم
      }

      const buildingId = result[0].id;
      return callback(null, buildingId);
  });
};
//================================================================================
// تحديث دالة إضافة المبنى
static addBuilding = (req, res) => {
  const name = req.body.name;
  const cityName = req.body.city_name; // تغيير city_id إلى city_name
  const capacity = req.body.capacity;

  if (!name || !cityName || !capacity) {
      return res.status(400).json({ error: "يجب تقديم اسم المبنى واسم المدينة والسعة." });
  }

  // الحصول على city_id باستخدام اسم المدينة
  getCityIdByName(cityName, (err, cityId) => {
      if (err) {
          return res.status(500).json({ error: "حدث خطأ أثناء البحث عن معرف المدينة." });
      }

      if (!cityId) {
          return res.status(404).json({ error: "المدينة غير موجودة. يرجى إدخال اسم مدينة صحيح." });
      }

      // التحقق مما إذا كان المبنى موجود بنفس الاسم في نفس المدينة
      const checkBuildingQuery = 'SELECT id FROM buildings WHERE name = ? AND city_id = ?';
      conn.query(checkBuildingQuery, [name, cityId], (checkErr, checkResult) => {
          if (checkErr) {
              console.error('خطأ في الاستعلام: ' + checkErr.message);
              return res.status(500).json({ error: "حدث خطأ أثناء التحقق من المبنى." });
          }

          if (checkResult.length > 0) {
              return res.status(409).json({ error: "المبنى موجود بالفعل في نفس المدينة." });
          }

          // إذا لم يكن المبنى موجودًا، قم بإضافته
          const insertBuildingQuery = 'INSERT INTO buildings (name, city_id, capacity) VALUES (?, ?, ?)';
          conn.query(insertBuildingQuery, [name, cityId, capacity], (err, result) => {
              if (err) {
                  console.error('خطأ في الاستعلام: ' + err.message);
                  return res.status(500).json({ error: "حدث خطأ أثناء إضافة المبنى." });
              }

              if (result.affectedRows === 1) {
                  return res.status(201).json({ message: "تمت إضافة المبنى بنجاح." });
              } else {
                  return res.status(500).json({ error: "لم تتم إضافة المبنى. يرجى المحاولة مرة أخرى." });
              }
          });
      });
  });
}
//=============================================================================================
// تحديث دالة إضافة الغرفة
static addRoom = (req, res) => {
  const roomNumber = req.body.room_number;
  const type = req.body.type;
  const status = req.body.status;
  const buildingName = req.body.building_name; // تغيير building_id إلى building_name

  if (!roomNumber || !type || !status || !buildingName) {
      return res.status(400).json({ error: "يجب تقديم رقم الغرفة والنوع والحالة واسم المبنى." });
  }

  // الحصول على building_id باستخدام اسم المبنى
  getBuildingIdByName(buildingName, (err, buildingId) => {
      if (err) {
          return res.status(500).json({ error: "حدث خطأ أثناء البحث عن معرف المبنى." });
      }

      if (!buildingId) {
          return res.status(404).json({ error: "المبنى غير موجود. يرجى إدخال اسم مبنى صحيح." });
      }

      // التحقق مما إذا كانت الغرفة موجودة بنفس الرقم في نفس المبنى
      const checkRoomQuery = 'SELECT id FROM rooms WHERE room_number = ? AND building_id = ?';
      conn.query(checkRoomQuery, [roomNumber, buildingId], (checkErr, checkResult) => {
          if (checkErr) {
              console.error('خطأ في الاستعلام: ' + checkErr.message);
              return res.status(500).json({ error: "حدث خطأ أثناء التحقق من الغرفة." });
          }

          if (checkResult.length > 0) {
              return res.status(409).json({ error: "الغرفة موجودة بالفعل في نفس المبنى." });
          }

          // إذا لم تكن الغرفة موجودة، قم بإضافتها
          const insertRoomQuery = 'INSERT INTO rooms (room_number, type, status, building_id) VALUES (?, ?, ?, ?)';
          conn.query(insertRoomQuery, [roomNumber, type, status, buildingId], (err, result) => {
              if (err) {
                  console.error('خطأ في الاستعلام: ' + err.message);
                  return res.status(500).json({ error: "حدث خطأ أثناء إضافة الغرفة." });
              }

              if (result.affectedRows === 1) {
                  return res.status(201).json({ message: "تمت إضافة الغرفة بنجاح." });
              } else {
                  return res.status(500).json({ error: "لم تتم إضافة الغرفة. يرجى المحاولة مرة أخرى." });
              }
          });
      });
  });
}


 
  //==========================================================================
  static addCategory(req, res) {
    const category = req.body.category;
    const university_id = req.body.university_id;
  
    if (!category || !university_id) {
      return res.status(400).json({ error: "يجب تقديم اسم الفئة ومعرف الجامعة." });
    }
  
    // التحقق من وجود الجامعة بناءً على university_id
    const checkUniversityQuery = 'SELECT * FROM universities WHERE id = ?';
  
    conn.query(checkUniversityQuery, [university_id], (checkUniErr, checkUniResult) => {
      if (checkUniErr) {
        console.error('خطأ في الاستعلام: ' + checkUniErr.message);
        return res.status(500).json({ error: "حدث خطأ أثناء التحقق من وجود الجامعة." });
      }
  
      if (checkUniResult.length === 0) {
        return res.status(400).json({ error: "معرف الجامعة غير صالح." });
      }
  
      // التحقق من وجود الفئة بنفس الاسم ونفس الجامعة
      const checkCategoryQuery = 'SELECT * FROM Categories WHERE Category = ? AND University_ID = ?';
  
      conn.query(checkCategoryQuery, [category, university_id], (checkErr, checkResult) => {
        if (checkErr) {
          console.error('خطأ في الاستعلام: ' + checkErr.message);
          return res.status(500).json({ error: "حدث خطأ أثناء التحقق من وجود الفئة." });
        }
  
        if (checkResult.length > 0) {
          return res.status(400).json({ error: "الفئة موجودة بالفعل." });
        }
  
        // إذا لم يكن هناك فئة بنفس الاسم ونفس الجامعة، يمكن إضافة الفئة
        const insertCategoryQuery = 'INSERT INTO Categories (Category, University_ID) VALUES (?, ?)';
  
        conn.query(insertCategoryQuery, [category, university_id], (err, result) => {
          if (err) {
            console.error('خطأ في الاستعلام: ' + err.message);
            return res.status(500).json({ error: "حدث خطأ أثناء إضافة الفئة." });
          }
  
          return res.status(201).json({ message: "تمت إضافة الفئة بنجاح." });
        });
      });
    });
  }
//===================================================================================================
static addCountryInCategory(req, res) {
    const countryName = req.body.countryName;
    const category_id = req.body.category_id;
    const distance = req.body.distance; // Add this line to get the distance from the request
  
    if (!countryName || !category_id || distance === undefined) {
      return res.status(400).json({ error: "يجب تقديم اسم البلد ومعرف الفئة والمسافة." });
    }
  
    // Check if the specified category_id exists
    const checkCategoryQuery = 'SELECT * FROM Categories WHERE Category_ID = ?';
  
    conn.query(checkCategoryQuery, [category_id], (checkCategoryErr, checkCategoryResult) => {
      if (checkCategoryErr) {
        console.error('خطأ في الاستعلام: ' + checkCategoryErr.message);
        return res.status(500).json({ error: "حدث خطأ أثناء التحقق من وجود الفئة." });
      }
  
      if (checkCategoryResult.length === 0) {
        return res.status(400).json({ error: "معرف الفئة غير صالح." });
      }
  
      // Check if the specified countryName exists in the same category
      const checkCountryQuery = 'SELECT * FROM Countries WHERE Country_Name = ? AND Category_ID = ?';
  
      conn.query(checkCountryQuery, [countryName, category_id], (checkErr, checkResult) => {
        if (checkErr) {
          console.error('خطأ في الاستعلام: ' + checkErr.message);
          return res.status(500).json({ error: "حدث خطأ أثناء التحقق من وجود البلد." });
        }
  
        if (checkResult.length > 0) {
          return res.status(400).json({ error: "البلد موجود بالفعل في هذه الفئة." });
        }
  
        // If there is no country with the same name in the same category, add the country with distance
        const insertCountryQuery = 'INSERT INTO Countries (Country_Name, Category_ID, Distance) VALUES (?, ?, ?)';
  
        conn.query(insertCountryQuery, [countryName, category_id, distance], (err, result) => {
          if (err) {
            console.error('خطأ في الاستعلام: ' + err.message);
            return res.status(500).json({ error: "حدث خطأ أثناء إضافة البلد." });
          }
  
          return res.status(201).json({ message: "تمت إضافة البلد بنجاح." });
        });
      });
    });
  }

}
module.exports = Supervising_systemController;