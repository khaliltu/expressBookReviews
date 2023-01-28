const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const axios = require('axios').default;

const app = express();
const url = "http://localhost:5000/";
// axios call function for tasks 10-11-12-13
const connectToURL = (url)=>{
    const req = axios.get(url);
    console.log(req);
    req.then(resp => {
        console.log("Fulfilled")
        console.log(resp.data);
    })
    .catch(err => {
        console.log("Rejected for url "+url)
        console.log(err.toString())
    });
}
//task 10 (get all books available in the shop)
const getListBooks = connectToURL(url);
//task 11 (get book based on ISBN)
const getBookByIsbn = connectToURL(url+"isbn/1");
//task 12 (get book details based on author)
const getBookDetailsByAuthor = connectToURL(url+"author/Dante Alighieri");
// task 13 (get book details based on title)
const getBookDetailsByTitle = connectToURL(url+"title/The Book Of Job");

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
        if(req.session.authorization) {
            token = req.session.authorization['accessToken'];
            jwt.verify(token, "access",(err,user)=>{
                if(!err){
                    console.log(user);
                    req.user = user;
                    next();
                }
                else{
                    return res.status(403).json({message: "User not authenticated"})
                }
             });
         } else {
             return res.status(403).json({message: "User not logged in"})
         }
     });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
