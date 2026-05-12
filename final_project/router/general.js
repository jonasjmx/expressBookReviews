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

// ── Internal sync helper routes (used by Axios async tasks) ──────────────────
public_users.get('/books', (req, res) => res.status(200).json(books));

public_users.get('/book-isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  return book
    ? res.status(200).json(book)
    : res.status(404).json({ message: "Book not found" });
});

public_users.get('/books-author/:author', (req, res) => {
  const result = Object.keys(books)
    .filter(k => books[k].author === req.params.author)
    .map(k => books[k]);
  return result.length > 0
    ? res.status(200).json(result)
    : res.status(404).json({ message: "No books found for this author" });
});

public_users.get('/books-title/:title', (req, res) => {
  const result = Object.keys(books)
    .filter(k => books[k].title === req.params.title)
    .map(k => books[k]);
  return result.length > 0
    ? res.status(200).json(result)
    : res.status(404).json({ message: "No books found with this title" });
});

// Task 10: Get all books available in the shop — async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 11: Get book details based on ISBN — async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get('http://localhost:5000/book-isbn/' + isbn);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 12: Get book details based on Author — async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = encodeURIComponent(req.params.author);
    const response = await axios.get('http://localhost:5000/books-author/' + author);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 13: Get book details based on Title — async/await with Axios
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = encodeURIComponent(req.params.title);
    const response = await axios.get('http://localhost:5000/books-title/' + title);
    return res.status(200).json(response.data);
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
