const express = require("express");
const Author = require("../Models/author");

const router = express.Router();


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