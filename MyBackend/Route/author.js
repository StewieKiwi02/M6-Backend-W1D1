const express = require("express");
const Author = require("../Models/author")


const router = express.Router();

router.get("/authors", async (req, res) =>{

    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

router.get("/authors/:id", async (req, res) =>{

    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
          return res.status(404).json({ message: "Autore non trovato" });
        }
        res.json(author);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/authors", async (req, res) => {
    try {
        const newAuthor = new Author(req.body);
        const savedAuthor = await newAuthor.save();
        res.status(201).json(savedAuthor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put("/authors/:id", async (req, res) => {
try {
    const updatedAuthor = await Author.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
    );

    if (!updatedAuthor) {
    return res.status(404).json({ message: "Autore non trovato" });
    }

    res.status(200).json(updatedAuthor);
} catch (error) {
    res.status(500).json({ message: "Errore nel server", error: error.message });
}
});

router.delete("/authors/:id", async (req, res) => {
    try {
      const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
  
      if (!deletedAuthor) {
        return res.status(404).json({ message: "Autore non trovato" });
      }
  
      res.status(200).json({ message: "Autore eliminato con successo" });
    } catch (error) {
      res.status(500).json({ message: "Errore nel server", error: error.message });
    }
});

module.exports = router;