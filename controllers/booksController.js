// const Book = require('../models/book');

exports.getBook = async (req, res) => {
    const reqBody = req.body;
    console.log(req.params._id);
};

exports.getBooks = async (req, res) => {
    const reqBody = req.body;
    console.log(reqBody);
};

exports.addBooks = async (req, res) => {
    const reqBody = req.body;
    console.log(reqBody);
};

exports.updateBook = async (req, res) => {

};

exports.updateBooks = async (req, res) => {
    const reqBody = req.body;
    console.log(reqBody);
};

exports.removeBook = async (req, res) => {
    const reqBody = req.body;
    console.log(reqBody);
};

exports.removeBooks = async (req, res) => {
    const reqBody = req.body;
    console.log(reqBody);
};