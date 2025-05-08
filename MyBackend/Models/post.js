const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
category: {
type: String,
required: true
},
title: {
type: String,
required: true
},
cover: {
type: String,
required: true
},
readTime: {
value: {
type: Number,
required: true
},
unit: {
type: String,
enum: ["min", "h"],
required: true
}
},
author: {
type: String,
required: true
},
content: {
type: String,
required: true
}
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;