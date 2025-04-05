const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");



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
public_users.get('/',function (req, res) {
    
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn
    if(books[isbn]){
        return res.send(JSON.stringify(books[isbn],null,4))
    }
    return res.status(404).json({message: `Book with ISBN (${isbn}) not found`});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author
    let getByAuthor = Object.values(books).filter(book => book.author === author)
    if(getByAuthor){
        return res.send(JSON.stringify(getByAuthor,null,4))
    }
    return res.status(404).json({message: `Book with author (${author}) not found`})
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

// Client Side Code


const BASE_URL = "http://localhost:5000"; 


async function getAllBooks() {
  try {
    const res = await axios.get(`${BASE_URL}/`);
    console.log("All Books:", res.data);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function getBookByISBN(isbn) {
    try{
       const res = await axios.get(`${BASE_URL}/isbn/${isbn}`)
       console.log("Book by ISBN:", res.data)
    }catch(err){
    console.error("Error:", err.message);
    }
}

async function getBooksByAuthor(author) {
  try {
    const res = await axios.get(`${BASE_URL}/author/${author}`);
    console.log("Books by Author:", res.data);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function getBooksByTitle(title) {
    try{
        let res = await axios.get(`${BASE_URL}/title/${title}`)
        console.log("Books with Title:", res.data)
    } catch (err) {
    console.error("Error:", err.message);
  }
}

module.exports.general = public_users;
