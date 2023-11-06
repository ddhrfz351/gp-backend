const conn = require("../models/dbConnectoin");

class universityController {  
    
    static addUniversity = (req, res) => {
        const name = req.body.name;
    
        if (!name) {
            return res.status(400).json({ error: "يجب تقديم اسم الجامعة." });
        }
    
        const query = 'INSERT INTO universities (name) VALUES (?)';
    
        conn.query(query, [name], (err, result) => {
            if (err) {
                console.error('خطأ في الاستعلام: ' + err.message);
                return res.status(500).json({ error: "حدث خطأ أثناء إضافة الجامعة." });
            }
    
            if (result.affectedRows === 1) {
                return res.status(201).json({ message: "تمت إضافة الجامعة بنجاح." });
            } else {
                return res.status(500).json({ error: "لم يتم إضافة الجامعة. يرجى المحاولة مرة أخرى." });
            }
        });
    }
    static addCity = (req, res) => {
        const name = req.body.name;
        const universityId = req.body.university_id;
    
        if (!name || !universityId) {
            return res.status(400).json({ error: "يجب تقديم اسم المدينة ومعرف الجامعة." });
        }
    
        // التحقق مما إذا كانت الجامعة موجودة بالفعل
        const checkUniversityQuery = 'SELECT id FROM universities WHERE id = ?';
        conn.query(checkUniversityQuery, [universityId], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('خطأ في الاستعلام: ' + checkErr.message);
                return res.status(500).json({ error: "حدث خطأ أثناء التحقق من الجامعة." });
            }
    
            if (checkResult.length === 0) {
                return res.status(404).json({ error: "الجامعة غير موجودة." });
            }
    
            // إذا تم التحقق من وجود الجامعة، قم بإضافة المدينة
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
    }
    static addBuilding = (req, res) => {
        const name = req.body.name;
        const cityId = req.body.city_id;
        const capacity = req.body.capacity;
    
        if (!name || !cityId || !capacity) {
            return res.status(400).json({ error: "يجب تقديم اسم المبنى ومعرف المدينة والسعة." });
        }
    
        // التحقق مما إذا كانت المدينة موجودة
        const checkCityQuery = 'SELECT id FROM cities WHERE id = ?';
        conn.query(checkCityQuery, [cityId], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('خطأ في الاستعلام: ' + checkErr.message);
                return res.status(500).json({ error: "حدث خطأ أثناء التحقق من المدينة." });
            }
    
            if (checkResult.length === 0) {
                return res.status(404).json({ error: "المدينة غير موجودة." });
            }
    
            // إذا تم التحقق من وجود المدينة، قم بإضافة المبنى
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
    }
    static addRoom = (req, res) => {
        const roomNumber = req.body.room_number;
        const type = req.body.type;
        const status = req.body.status;
        const buildingId = req.body.building_id;
    
        if (!roomNumber || !type || !status || !buildingId) {
            return res.status(400).json({ error: "يجب تقديم رقم الغرفة والنوع والحالة ومعرف المبنى." });
        }
    
        // التحقق مما إذا كان المبنى موجود ويتبع لنفس الجامعة
        const checkBuildingQuery = 'SELECT id FROM buildings WHERE id = ? ';
        conn.query(checkBuildingQuery, [buildingId, req.universityId], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('خطأ في الاستعلام: ' + checkErr.message);
                return res.status(500).json({ error: "حدث خطأ أثناء التحقق من المبنى." });
            }
    
            if (checkResult.length === 0) {
                return res.status(404).json({ error: "المبنى غير موجود أو لا يتبع نفس الجامعة." });
            }
    
            // إذا تم التحقق من وجود المبنى، قم بإضافة الغرفة
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
    }
    static addApplicationGuidelines = (req, res) => {
        const guidelines = req.body.guidelines;
        const files = req.body.files;
        const universityId = req.body.university_id;
    
        if (!guidelines || !files || !universityId) {
            return res.status(400).json({ error: "يجب تقديم الإرشادات والملفات ومعرف الجامعة." });
        }
    
        // قبل إضافة الإرشادات الجديدة، قم بحذف السجلات القديمة
        const deleteGuidelinesQuery = 'DELETE FROM `application guidelines and approvals` WHERE university_id = ?';
        conn.query(deleteGuidelinesQuery, [universityId], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error('خطأ في الاستعلام: ' + deleteErr.message);
                return res.status(500).json({ error: "حدث خطأ أثناء حذف الإرشادات القديمة." });
            }
    
            // بعد حذف السجلات القديمة، قم بإضافة الإرشادات الجديدة
            const insertGuidelinesQuery = 'INSERT INTO `application guidelines and approvals` (guidelines, files, university_id) VALUES (?, ?, ?)';
            conn.query(insertGuidelinesQuery, [guidelines, files, universityId], (err, result) => {
                if (err) {
                    console.error('خطأ في الاستعلام: ' + err.message);
                    return res.status(500).json({ error: "حدث خطأ أثناء إضافة الإرشادات." });
                }
    
                return res.status(201).json({ message: "تمت إضافة الإرشادات بنجاح." });
            });
        });
    }
   
    static getApplicationGuidelinesByName = (req, res) => {
        const universityName = req.params.name; // استخدم اسم الجامعة بدلاً من معرفها
    
        if (!universityName) {
            return res.status(400).json({ error: "يجب تقديم اسم الجامعة." });
        }
    
        // استعلم عن الإرشادات المرتبطة بجامعة معينة باستخدام اسم الجامعة
        const getGuidelinesQuery = 'SELECT * FROM `application guidelines and approvals` WHERE university_id IN (SELECT id FROM universities WHERE name = ?)';
        conn.query(getGuidelinesQuery, [universityName], (err, result) => {
            if (err) {
                console.error('خطأ في الاستعلام: ' + err.message);
                return res.status(500).json({ error: "حدث خطأ أثناء البحث عن الإرشادات." });
            }
    
            if (result.length > 0) {
                const guidelines = result[0];
                return res.status(200).json({ guidelines });
            } else {
                return res.status(404).json({ error: "لا توجد إرشادات متاحة لهذه الجامعة." });
            }
        });
    }
    
    static addAppointment = (req, res) => {
        const universityId = req.body.university_id;
        const startDate = req.body.start_date;
        const endDate = req.body.end_date;
        const category = req.body.category;
    
        if (!universityId || !startDate || !endDate || !category) {
            return res.status(400).json({ error: "يجب تقديم جميع البيانات المطلوبة." });
        }
    
        // حذف المواعد السابقة بنفس الفئة
        const deleteAppointmentsQuery = 'DELETE FROM appointments WHERE university_id = ? AND category = ?';
    
        conn.query(deleteAppointmentsQuery, [universityId, category], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error('خطأ في الاستعلام: ' + deleteErr.message);
                return res.status(500).json({ error: "حدث خطأ أثناء حذف المواعد السابقة." });
            }
    
            // إضافة الموعد الجديد
            const addAppointmentQuery = 'INSERT INTO appointments (university_id, start_date, end_date, category) VALUES (?, ?, ?, ?)';
    
            conn.query(addAppointmentQuery, [universityId, startDate, endDate, category], (addErr, addResult) => {
                if (addErr) {
                    console.error('خطأ في الاستعلام: ' + addErr.message);
                    return res.status(500).json({ error: "حدث خطأ أثناء إضافة الموعد." });
                }
    
                if (addResult.affectedRows === 1) {
                    return res.status(201).json({ message: "تمت إضافة الموعد بنجاح." });
                } else {
                    return res.status(500).json({ error: "لم يتم إضافة الموعد. يرجى المحاولة مرة أخرى." });
                }
            });
        });
    }
    
      static getAppointmentsByUniversityName = (req, res) => {
        const universityName = req.body.universityName; // استخراج اسم الجامعة من req.body
    
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
                console.error('خطأ في الاستعلام: ' + err.message);
                return res.status(500).json({ error: "حدث خطأ أثناء البحث عن المواعيد." });
            }
    
            if (result.length > 0) {
                const appointments = result;
                return res.status(200).json({ appointments });
            } else {
                return res.status(404).json({ error: "لا توجد مواعيد متاحة لهذه الجامعة." });
            }
        });
    }
    

    }
  

module.exports = universityController;