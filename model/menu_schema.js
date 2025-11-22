const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  dishName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
    set: (value) => `₹ ${value}`,
  },
  offer: {
    type: String,
    default: "No Offer",
  },
  availability: {
    type: String,
    default: "Available",
  },
  ingredients: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  spicyLevel: {
    type: String,
    enum: ["mild", "medium", "spicy"], // Only allows these values
    default: "mild", // Default to 'mild' if not provided
  },
  vegan: {
    type: Boolean,
    default: false,
  },
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
