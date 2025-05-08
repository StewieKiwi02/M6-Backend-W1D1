const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Author = require("../Models/author");
const sendEmail = require("../Utils/sendEmail"); 

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.patch("/:authorId/avatar", upload.single("avatar"), async (req, res) => {
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

        author.avatarUrl = result.secure_url;
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
    const newAuthor = new Author(req.body);
    const savedAuthor = await newAuthor.save();

   
    const subject = "Benvenuto nel nostro Blog!";
    const message = `Ciao ${savedAuthor.name},\n\nGrazie per esserti registrato nel nostro blog. Benvenuto!`;

    sendEmail(savedAuthor.email, subject, message);

    res.status(201).json(savedAuthor);
  } catch (err) {
    res.status(400).json({ message: "Dati non validi", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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
