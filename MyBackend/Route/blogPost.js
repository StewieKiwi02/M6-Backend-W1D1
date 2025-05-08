const express = require("express");
const BlogPost = require("../Models/blogPost");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.patch("/:blogPostId/cover", upload.single("cover"), async (req, res) => {
  try {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Errore nel caricamento su Cloudinary", error: error.message });
        }

        const blogPost = await BlogPost.findById(req.params.blogPostId);
        if (!blogPost) {
          return res.status(404).json({ message: "Post del blog non trovato" });
        }

        blogPost.coverUrl = result.secure_url;
        await blogPost.save();

        res.status(200).json({
          message: "Copertura caricata con successo",
          coverUrl: result.secure_url
        });
      }
    ).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: "Errore nel server", error: err.message });
  }
});

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

router.get("/:id/comments", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trovato" });
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trovato" });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Commento non trovato" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trovato" });
    post.comments.push(req.body);
    await post.save();
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trovato" });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Commento non trovato" });

    comment.set(req.body);
    await post.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trovato" });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Commento non trovato" });

    comment.remove();
    await post.save();
    res.json({ message: "Commento eliminato con successo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
