const mongoose = require("mongoose");

const PublishSchema = new mongoose.Schema(
  { 
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: true,
        ref: "User ", // Assuming your User model is named "User "
    },
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    pdfFile: {
      iv: { type: String, required: true }, // Initialization vector
      data: { type: String, required: true }, // Encrypted data
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Publish", PublishSchema);