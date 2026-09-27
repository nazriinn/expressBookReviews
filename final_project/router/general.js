const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ===============================
// Q11 - AXIOS + ASYNC/AWAIT
// ===============================

async function getAllBooks() {
    try {
        const response = await axios.get("http://localhost:5000/");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting all books:", error.message);
    }
}

async function getBooksByISBN(isbn) {
    try {
        const response = await axios.get(
            `http://localhost:5000/isbn/${encodeURIComponent(isbn)}`
        );

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting book by ISBN:", error.message);
    }
}

async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting book by author:", error.message);
    }
}

async function getBooksByTitle(title) {
    try {
        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting book by title:", error.message);
    }
}


// ===============================
// Q11 - FUNCTIONS CAN BE EXECUTED
// ===============================

if (require.main === module) {

    (async () => {

        const command = process.argv[2];
        const value = process.argv.slice(3).join(" ");

        if (command === "all") {
            await getAllBooks();
        }

        else if (command === "isbn") {
            await getBooksByISBN(value);
        }

        else if (command === "author") {
            await getBooksByAuthor(value);
        }

        else if (command === "title") {
            await getBooksByTitle(value);
        }

        else {
            console.log("Usage:");
            console.log("node general.js all");
            console.log("node general.js isbn <isbn>");
            console.log("node general.js author <author>");
            console.log("node general.js title <title>");
        }

    })();

}


// ===============================
// EXISTING PROJECT ROUTES
// ===============================

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    return userswithsamename.length > 0;
};


public_users.post("/register", (req, res) => {

    const username = req.query.username;
    const password = req.query.password;

    if (username && password) {

        if (!doesExist(username)) {

            users.push({
                "username": username,
                "password": password
            });

            return res.status(200).json({
                message: "User successfully registred. Now you can login"
            });

        } else {

            return res.status(404).json({
                message: "User already exists!"
            });

        }
    }

    return res.status(404).json({
        message: "Unable to register user. Username and/or password not provided"
    });
});


public_users.get('/', function (req, res) {
    res.send(JSON.stringify({ books }, null, 4));
});


public_users.get('/users', function (req, res) {
    res.send(JSON.stringify({ users }, null, 4));
});


public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    const book = Object.values(books).find(
        book => book.isbn === isbn
    );

    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.send(`Book with ISBN ${isbn} not found.`);
    }
});


public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    const book = Object.values(books).find(
        book => book.author === author
    );

    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.send(`Book with author name ${author} not found.`);
    }
});


public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    const book = Object.values(books).find(
        book => book.title === title
    );

    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.send(`Book with title ${title} not found.`);
    }
});


public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    const book = Object.values(books).find(
        book => book.isbn === isbn
    );

    if (book) {

        res.send(JSON.stringify(book.reviews, null, 4));

    } else {

        res.send(`Book with ISBN ${isbn} not found.`);

    }
});


module.exports.getAllBooks = getAllBooks;
module.exports.getBooksByISBN = getBooksByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;

module.exports.general = public_users;