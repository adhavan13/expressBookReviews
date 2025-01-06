const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
secretKey = "adhavan";
const isValid = (username) => {
  //returns boolean
  return users.some((user) => user.username === username);
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const user = users.find((user) => user.username === username);
  return user && user.password === password;
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  const user = users.find((user) => user.username == username);
  if (user && user.password == password) {
    const token = jwt.sign({ username: user.name }, secretKey, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "login successfull", token: token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  isbn = req.params.isbn;
  const { review } = req.body;

  const token = req.header["authorization"];
  if (!token) {
    return res.status(403).json({ message: "Authorization token required" });
  }
  try {
    const decode = jwt.verify(token, secretKey);
    const username = decode.username;
    console.log(username);
    const bookList = Object.keys(books);
    const key = bookList.find((key) => books[key].isbn === isbn);
    if (!key) return res.status(404).json({ message: "Book not found" });
    books[key].review[username] = review;
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.body;
  isbn = req.params.isbn;
  const bookList = Object.keys(books);
  try {
    const key = bookList.find((key) => books[key].isbn === isbn);
    if (key) {
      review = books[key].review;
      review = Object.keys(review).filter((key) => key !== username);
      books[key].review = review;
      return res.status(200).json({ message: "deleted", book: books[key] });
    }
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
