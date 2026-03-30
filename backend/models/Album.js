const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const albumSchema = new mongoose.Schema({
  albumId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sharedWith: {
    type: [String],
    default: []
  }
}, { timestamps: true });

const Album = mongoose.model("Album", albumSchema);
module.exports = Album;
