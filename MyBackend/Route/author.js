const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Author = require("../Models/author");
const sendEmail = require("../Utils/sendEmail");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const storage = multer.memoryStorage();
const upload = multer({ storage });

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "Autenticazione richiesta" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.authorId = decoded.authorId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token non valido" });
  }
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(400).json({ message: "Credenziali non valide" });
    }
    const isMatch = await author.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenziali non valide" });
    }
    const token = jwt.sign({ authorId: author._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Errore nel server", error: err.message });
  }
});

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ authorId: req.user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const author = await Author.findById(req.authorId);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: "Errore nel server", error: err.message });
  }
});

router.patch("/:authorId/avatar", authenticateToken, upload.single("avatar"), async (req, res) => {
  try {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Errore nel caricamento su Cloudinary", error: error.message });
        }
        const author = await Author.findById(req.params.authorId);
        if (!author) {
          return res.status(404).json({ message: "Autore non trovato" });
        }
        author.avatar = result.secure_url;
        await author.save();
        res.status(200).json({
          message: "Avatar caricato con successo",
          avatarUrl: result.secure_url
        });
      }
    ).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: "Errore nel server", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const authors = await Author.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Author.countDocuments();
    res.json({ total, page: Number(page), limit: Number(limit), authors });
  } catch (err) {
    res.status(500).json({ message: "Errore nel server", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: "Errore nel server", error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { authorName, authorSurname, email, birthday, avatar, password } = req.body;
    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return res.status(400).json({ message: "Email già registrata" });
    }
    const newAuthor = new Author({
      authorName,
      authorSurname,
      email,
      birthday,
      avatar,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    newAuthor.password = await bcrypt.hash(newAuthor.password, salt);
    const savedAuthor = await newAuthor.save();
    const subject = "Benvenuto nel nostro Blog!";
    const message = `Ciao ${savedAuthor.authorName},\n\nGrazie per esserti registrato nel nostro blog. Benvenuto!`;
    sendEmail(savedAuthor.email, subject, message);
    res.status(201).json(savedAuthor);
  } catch (err) {
    res.status(400).json({ message: "Dati non validi", error: err.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAuthor) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    res.json(updatedAuthor);
  } catch (err) {
    res.status(500).json({ message: "Errore nel server", error: err.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    res.json({ message: "Autore eliminato con successo" });
  } catch (err) {
    res.status(500).json({ message: "Errore nel server", error: err.message });
  }
});

module.exports = router;
