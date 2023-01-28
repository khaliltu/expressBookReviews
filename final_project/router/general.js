const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
  
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  if (books){
    res.send(JSON.stringify(books,null,4));
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book){
    res.send(book);
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  for (let i = 0; i < Object.keys(books).length; i++) {
    let num = (i+1).toString();
    let book = books[num]
    if (book.author==author){
      return res.send(book);
    }
  }
  return res.status(300).json({message: "book with such author does not exist"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  for (let i = 0; i < Object.keys(books).length; i++) {
    let num = (i+1).toString();
    let book = books[num]
    if (book.title==title){
      return res.send(book);
    }
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book){
    res.send(book.reviews);
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
