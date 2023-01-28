const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  user = req.session.authorization['username'];
  if (review && user){
    const isbn = req.params.isbn;
    let book = books[isbn];
    book["reviews"][user]=review;
    books[isbn]=book;
    res.send(book);
  }
  else {return res.status(403).json({message: "Some credentials are missing. Please login!"});}
});


//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  user = req.session.authorization['username'];
  if (user){
    const isbn = req.params.isbn;
    let book = books[isbn];
    if(book["reviews"][user]){
      delete book["reviews"][user];
      books[isbn]=book;
      res.send(book);
    }
    else {
      return res.status(409).json({message: "Review not found"});
    }
  }
  else {
    return res.status(401).json({message: "Some credentials are missing. Please login!"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
