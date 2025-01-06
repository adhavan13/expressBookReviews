const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const {username,password} = req.body
  const user = users.find(user => user.username === username)
  if(!user)
  {
    users.push({username:username,password:password})
  }
  else{
    return res.status(200).json({user:username})
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  const bookList = await books;
  return res.status(200).json({ books: bookList });
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  const bookList = await Object.values(books); // Assuming `books` is an array of book objects
  const book = bookList.find((book) => book.isbn === isbn); // Fix: Added return in the callback

  if (!book) {
    return res.status(404).json({ message: "Not found!" }); // Use 404 for "Not Found"
  } else {
    return res.status(200).json({ book: book });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookList =await Object.values(books); // Assuming `books` is an array of book objects
  const book = bookList.find((book) => book.author === author);
  if (!book) {
    return res.status(404).json({ message: "Not found!" });
  } else {
    return res.status(200).json({ book: book });
  }
});

// Get all books based on title
public_users.get("/title/:title",async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookList = Object.values(books); // Assuming `books` is an array of book objects
  const book = await bookList.find((book) => book.title === title);
  if (!book) {
    return res.status(404).json({ message: "Not found!" });
  } else {
    return res.status(200).json({ book: book });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const bookList = Object.values(books); // Assuming `books` is an array of book objects
  const book = bookList.find((book) => book.isbn === isbn); // Fix: Added return in the callback

  if (!book) {
    return res.status(404).json({ message: "Not found!" }); // Use 404 for "Not Found"
  } else {
    return res.status(200).json({ book: book });
  }
});

module.exports.general = public_users;
