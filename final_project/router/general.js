const express = require('express');
const axios = require('axios');

const public_users = express.Router();

let books = require("./booksdb.js");
let users = require("./auth_users.js").users;


// Register
public_users.post("/register", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Unable to register user. Username and/or password not provided"
        });
    }

    const exists = users.find(user => user.username === username);

    if (exists) {
        return res.status(404).json({
            message: "User already exists!"
        });
    }

    users.push({
        username: username,
        password: password
    });

    res.status(200).json({
        message: "User successfully registred. Now you can login"
    });
});


// Get all books
public_users.get('/', function (req, res) {
    res.json(books);
});


// Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    const book = Object.values(books).find(
        book => book.isbn === isbn
    );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});


// Get book by author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    const book = Object.values(books).find(
        book => book.author === author
    );

    if (!book) {
        return res.status(404).json({
            message: "Book with author name " + author + " not found."
        });
    }

    res.json(book);
});


// Get book by title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    const book = Object.values(books).find(
        book => book.title === title
    );

    if (!book) {
        return res.status(404).json({
            message: "Book with title " + title + " not found."
        });
    }

    res.json(book);
});


// Get review
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    const book = Object.values(books).find(
        book => book.isbn === isbn
    );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book.reviews);
});


// =====================================================
// Q11 - AXIOS + ASYNC/AWAIT
// =====================================================

async function getAllBooks() {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
}


async function getBooksByISBN(isbn) {
    const response = await axios.get(
        `http://localhost:5000/isbn/${encodeURIComponent(isbn)}`
    );
    return response.data;
}


async function getBooksByAuthor(author) {
    const response = await axios.get(
        `http://localhost:5000/author/${encodeURIComponent(author)}`
    );
    return response.data;
}


async function getBooksByTitle(title) {
    const response = await axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
    );
    return response.data;
}


async function getBookReview(isbn) {
    const response = await axios.get(
        `http://localhost:5000/review/${encodeURIComponent(isbn)}`
    );
    return response.data;
}


// Export functions
module.exports.getAllBooks = getAllBooks;
module.exports.getBooksByISBN = getBooksByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
module.exports.getBookReview = getBookReview;

module.exports.general = public_users;