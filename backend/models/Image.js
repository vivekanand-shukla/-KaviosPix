const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const imageSchema = new mongoose.Schema({
  imageId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String
  },
  tags: {
    type: [String],
    default: []
  },
  person: {
    type: String,
    default: ""
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  comments: {
    type: [String],
    default: []
  },
  size: {
    type: Number
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
