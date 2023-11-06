const express = require('express');
const conn =require("./src/models/dbConnectoin");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("upload"));
const cors=require("cors");
app.use(cors());
//======================================================================
const studentRouter= require('./src/routes/student.Router');
const employeeRouter= require('./src/routes/employee.Router');
const adminRouter= require('./src/routes/admin.Router');
const chatBotRouter= require('./src/routes/chatBot.Router');
const universityRouter= require('./src/routes/university.Router');
//======================================================================
app.use('/api/student', studentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chatBot', chatBotRouter);
app.use('/api/university', universityRouter);
const port = 3000; 
app.listen(port, () => {
    console.log(`server is running ${port}`);
});
module.exports = app;