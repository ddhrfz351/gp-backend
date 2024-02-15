const express = require('express');
const conn =require("./src/models/dbConnectoin");
const app = express();
const JWT =require("jsonwebtoken")
const cookieParse=require("cookie-parser")
 const expressSession=require("express-session")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("upload"));
app.use(cookieParse())
const cors=require("cors");
app.use(cors({
   origin:"*",
   methods:['GET','POST','PUT','DELETE'],
    credentials:true,
    allowedHeaders:['Content-Type', 'Authorization']
}));

app.use(expressSession({
    key: 'user',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: false,

}}))

//======================================================================
const studentRouter= require('./src/routes/student.Router');
const employeeRouter= require('./src/routes/employee.Router');
const adminRouter= require('./src/routes/admin.Router');
const chatBotRouter= require('./src/routes/chatBot.Router');
const loginRouter= require('./src/routes/login.Router');
const BasicData= require('./src/routes/BasicData.Router');
const housingRouter= require('./src/routes/housing.Router');
const supervising_systemRouter= require('./src/routes/supervising_system.Router');
//======================================================================
app.use('/api/student', studentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chatBot', chatBotRouter);
app.use('/api/login', loginRouter);
app.use('/api/BasicDate', BasicData);
app.use('/api/housing', housingRouter);
app.use('/api/supervising_system', supervising_systemRouter);
app.use(express.static("upload"))
const port = 5000; 
app.listen(port, () => {
    console.log(`server is running ${port}`);
});
module.exports = app;