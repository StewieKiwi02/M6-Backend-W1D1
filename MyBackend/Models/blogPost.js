const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const blogPostSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String, required: true },
  readTime: {
    value: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  author: { type: String, required: true },
  content: { type: String, required: true },
  comments: [commentSchema]
}, { timestamps: true });

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;