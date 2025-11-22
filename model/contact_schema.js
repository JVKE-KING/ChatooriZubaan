const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  message: {
    type: String,
    required: true,
  }
});

const Contact = new mongoose.model("contact", contactSchema);
module.exports = Contact;