const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
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

// Task 10: Get the list of books available in the shop — async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    const bookList = await new Promise(function (resolve, reject) {
      resolve(books);
    });
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 11: Get book details based on ISBN — async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise(function (resolve, reject) {
      const found = books[isbn];
      if (found) {
        resolve(found);
      } else {
        reject(new Error("Book not found"));
      }
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 12: Get book details based on Author — async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const result = await new Promise(function (resolve, reject) {
      const filtered = Object.keys(books)
        .filter(key => books[key].author === author)
        .map(key => books[key]);
      if (filtered.length > 0) {
        resolve(filtered);
      } else {
        reject(new Error("No books found for this author"));
      }
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 13: Get book details based on Title — async/await with Axios
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const result = await new Promise(function (resolve, reject) {
      const filtered = Object.keys(books)
        .filter(key => books[key].title === title)
        .map(key => books[key]);
      if (filtered.length > 0) {
        resolve(filtered);
      } else {
        reject(new Error("No books found with this title"));
      }
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;


module.exports.general = public_users;
