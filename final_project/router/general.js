const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists! Please try a different username." });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const getAllBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    const bookList = await getAllBooks;
    return res.status(200).json(JSON.stringify(bookList));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const getBook = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    });
    const book = await getBook;
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      const result = bookKeys
        .filter(key => books[key].author === author)
        .map(key => books[key]);
      if (result.length > 0) {
        resolve(result);
      } else {
        reject(new Error("No books found for this author"));
      }
    });
    const result = await getBooksByAuthor;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      const result = bookKeys
        .filter(key => books[key].title === title)
        .map(key => books[key]);
      if (result.length > 0) {
        resolve(result);
      } else {
        reject(new Error("No books found with this title"));
      }
    });
    const result = await getBooksByTitle;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
