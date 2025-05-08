const express = require("express");
const BlogPost = require("../Models/blogPost");
const router = express.Router();


router.get("/", async (req, res) => {
try {
const { title } = req.query;
let query = {};
if (title) {
query.title = { $regex: title, $options: "i" };
}
const posts = await BlogPost.find(query);
res.json(posts);
} catch (err) {
res.status(500).json({ message: err.message });
}
});


router.get("/:id", async (req, res) => {
try {
const post = await BlogPost.findById(req.params.id);
if (!post) return res.status(404).json({ message: "Post non trovato" });
res.json(post);
} catch (err) {
res.status(500).json({ message: err.message });
}
});


router.post("/", async (req, res) => {
try {
const newPost = new BlogPost(req.body);
const saved = await newPost.save();
res.status(201).json(saved);
} catch (err) {
res.status(400).json({ message: err.message });
}
});


router.put("/:id", async (req, res) => {
try {
const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
if (!updated) return res.status(404).json({ message: "Post non trovato" });
res.json(updated);
} catch (err) {
res.status(500).json({ message: err.message });
}
});


router.delete("/:id", async (req, res) => {
try {
const deleted = await BlogPost.findByIdAndDelete(req.params.id);
if (!deleted) return res.status(404).json({ message: "Post non trovato" });
res.json({ message: "Post eliminato con successo" });
} catch (err) {
res.status(500).json({ message: err.message });
}
});

router.get("/author/:email", async (req, res) => {
try {
const posts = await BlogPost.find({ author: req.params.email });
res.json(posts);
} catch (err) {
res.status(500).json({ message: err.message });
}
});

module.exports = router;