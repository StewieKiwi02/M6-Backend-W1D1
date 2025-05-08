const express = require("express");
const Post = require("../Models/post");

const router = express.Router();

router.get("/", async (req, res) => {
try {
const { page = 1, limit = 10 } = req.query;
const posts = await Post.find()
.skip((page - 1) * limit)
.limit(Number(limit));
const total = await Post.countDocuments();
res.json({ total, page: Number(page), limit: Number(limit), posts });
} catch (err) {
res.status(500).json({ message: err.message });
}
});

router.get("/:id", async (req, res) => {
try {
const post = await Post.findById(req.params.id);
if (!post) return res.status(404).json({ message: "Post non trovato" });
res.json(post);
} catch (err) {
res.status(500).json({ message: err.message });
}
});

router.post("/", async (req, res) => {
try {
const newPost = new Post(req.body);
const saved = await newPost.save();
res.status(201).json(saved);
} catch (err) {
res.status(400).json({ message: err.message });
}
});

router.put("/:id", async (req, res) => {
try {
const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
new: true,
runValidators: true
});
if (!updated) return res.status(404).json({ message: "Post non trovato" });
res.status(200).json(updated);
} catch (err) {
res.status(500).json({ message: err.message });
}
});


router.delete("/:id", async (req, res) => {
try {
const deleted = await Post.findByIdAndDelete(req.params.id);
if (!deleted) return res.status(404).json({ message: "Post non trovato" });
res.status(200).json({ message: "Post eliminato" });
} catch (err) {
res.status(500).json({ message: err.message });
}
});

module.exports = router;