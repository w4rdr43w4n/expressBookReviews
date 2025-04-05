const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    })
    .then((data) => {
      res.send(JSON.stringify(data, null, 4));
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong", details: err });
    });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    let isbn = req.params.isbn
    new Promise((resolve, reject) => {
        setTimeout(() => {
        if(!books[isbn]){
                reject(`Book with ISBN (${isbn}) not found`)
        }
          resolve(books[isbn]);
        }, 1000);
      })
      .then((data) => {
            return res.send(JSON.stringify(data,null,4))
      })
      .catch((err) => {
        res.status(500).json({ error: "Something went wrong", details: err });
      });

    }
 );
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author
    new Promise((resolve, reject) => {
        setTimeout(() => {
        let getByAuthor = Object.values(books).filter(book => book.author === author)
        if(!getByAuthor){
                reject(`Book with author (${author}) not found`)
        }
          resolve(getByAuthor);
        }, 1000);
      })
      .then((data) => {
            return res.send(JSON.stringify(data,null,4))
      })
      .catch((err) => {
        res.status(500).json({ error: "Something went wrong", details: err });
      });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
    let getByTitle = Object.values(books).filter(book => book.title === title)
    if(getByTitle){
        return res.send(JSON.stringify(getByTitle,null,4))
    }
    return res.status(404).json({message: `Book with title (${title}) not found`})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn
    if(books[isbn]){
        return res.send(books[isbn]["reviews"])
    }
    return res.status(404).json({message: `Book with ISBN (${isbn}) not found`});
});

module.exports.general = public_users;
