const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const authorSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: true,
  },
  authorSurname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


authorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

authorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
