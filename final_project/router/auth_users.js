const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
   // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Login endpoint
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {accessToken, username}
        req.session.username = username

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Set the isbn param
    const isbn = req.params.isbn;
    // Set new review to be added via query
    const newReview = req.query.review
    // retrieve username from sessoin
    const username = req.session.username;
  
    // Check if the user is logged in
    if (!username) {
        return res.status(403).json({ message: "User not logged in" });}
  
    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });}
  
    // Check if a review text was provided
    if (!newReview) {
      return res.status(400).json({ message: "Review content is required" });
    }
  
    // Add or update the review under the user's name
    books[isbn].reviews[username] = newReview;
  
    // Return a success message
    return res.status(200).json({ 
      message: `Review successfully added/updated for ISBN ${isbn}`,
      book: books[isbn]
    });
  });

  // Delete book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    books[isbn].reviews = {}
    return res.status(200).json({messsage:"Review has been deleted"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
