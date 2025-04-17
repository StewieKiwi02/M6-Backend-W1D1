const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authorRoutes = require("./Route/author");


const server = express();
const PORT = 3001;

server.use(cors());
server.use(express.json());
server.use("/api/authors", authorRoutes);

const connStr = 'mongodb+srv://Kiwi:SecretKey6990%3F%3F@testcluster.kcluamm.mongodb.net/blogDB?retryWrites=true&w=majority';

mongoose.connect(connStr)
.then(() => console.log("Connesso a MongoDB Atlas!"))
.catch(err => console.error("Errore di connessione a MongoDB Atlas:", err));


server.listen(PORT, () => {

    console.log(`Server attivo su http://localhost:${PORT}`)
});