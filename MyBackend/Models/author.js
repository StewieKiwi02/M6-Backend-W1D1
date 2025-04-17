const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({

    authorName:{
        type: String,
        required: true
    },

    authorSurname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    birthday: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
        required: true
    }
    
});

const Author = mongoose.model("Author", authorSchema)

module.exports = Author;