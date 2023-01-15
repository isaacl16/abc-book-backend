const express = require('express');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');

const dbo = require('./db/conn');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', usersRouter);

app.use('/books', booksRouter);


dbo.connectToDB(() => {
    app.listen(PORT, () => {
        console.log(`ABC Book backend server listening on port ${PORT}!`);
    });
});