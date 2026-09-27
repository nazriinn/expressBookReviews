const express = require('express');
const axios = require('axios');

const public_users = express.Router();

let books = require("./booksdb.js");
let users = require("./auth_users.js").users;


// =========================
// GENERAL USER ROUTES
// =========================

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

    return res.status(200).json({
        message: "User successfully registred. Now you can login"
    });
});


public_users.get('/', function (req, res) {
    res.json({ books });
});


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


// ======================================================
// TASK 10 - GET ALL BOOKS USING AXIOS + ASYNC/AWAIT
// ======================================================

async function getAllBooks() {
    try {
        const response = await axios.get("http://localhost:5000/");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error.message);
    }
}


// ======================================================
// TASK 11 - GET BOOK BY ISBN USING AXIOS + ASYNC/AWAIT
// ======================================================

async function getBooksByISBN(isbn) {
    try {
        const response = await axios.get(
            `http://localhost:5000/isbn/${encodeURIComponent(isbn)}`
        );

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error.message);
    }
}


// ======================================================
// TASK 12 - GET BOOK BY AUTHOR USING AXIOS + ASYNC/AWAIT
// ======================================================

async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error.message);
    }
}


// ======================================================
// TASK 13 - GET BOOK BY TITLE USING AXIOS + ASYNC/AWAIT
// ======================================================

async function getBooksByTitle(title) {
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error.message);
    }
}


// Export functions
module.exports.getAllBooks = getAllBooks;
module.exports.getBooksByISBN = getBooksByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;

module.exports.general = public_users;