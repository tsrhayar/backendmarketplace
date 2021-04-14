const mongoose = require("mongoose");
// 1 pour chiffrer mot de passe
const bcrypt = require("bcrypt");

const ProductSchema = new mongoose.Schema({
  name: {
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
  price: {
    type: Number,
    required: true,
  },
  seller: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

module.exports = mongoose.model("Product", ProductSchema);
