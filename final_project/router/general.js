const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
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
	// Send JSON response with formatted books
    res.send(JSON.stringify(books));
});

// Get all books using async/await + Axios
public_users.get('/books-async', async function (req, res) {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.send(book);
});


// Get book details based on ISBN with ASYNC
// set async call
const getBookByIsbn = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000); // Simulates a 1-second delay
  });
};

// Async GET route to retrieve a book
public_users.get('/async-isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  
  try {
    // Await the promise to resolve before sending the response
    const book = await getBookByIsbn(isbn);
    res.status(200).json(book);
  } catch (error) {
    // Handle errors (e.g., book doesn't exist)
    res.status(404).json({ message: error.message });
  }
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let authorName = req.params.author
  return res.send(Object.values(books).filter(book => book.author === authorName));
});


// Get book details based on Author with ASYNC
// Async GET function to retrieve books by author
public_users.get('/async-author/:author', async (req, res) => {
  try {
    const authorName = req.params.author;
    
    // Simulate an async delay (like fetching from a database)
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Convert the object to an array and filter by author
    const booksArray = Object.values(books);
    const filteredBooks = booksArray.filter(book => 
      book.author.toLowerCase() === authorName.toLowerCase()
    );

    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let bookTitle = req.params.title
  return res.send(Object.values(books).filter(book => book.title === bookTitle));
});


// Simulated asynchronous function to fetch books (like a database query)
const fetchBooks = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 100); 
  });
};

// GET endpoint to retrieve a book by title
public_users.get('/async-title/:title', async (req, res) => {
  try {
    // 1. Await the async data fetch
    const bookData = await fetchBooks();
    
    // 2. Extract the title from the URL parameters
    const requestedTitle = req.params.title.toLowerCase();

    // 3. Search through the books object
    const bookList = Object.values(bookData);
    const foundBook = bookList.find(b => b.title.toLowerCase() === requestedTitle);

    // 4. Send response
    if (foundBook) {
      res.status(200).json(foundBook);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.send(book['reviews']);
});

module.exports.general = public_users;
