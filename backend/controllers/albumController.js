const Album = require("../models/Album");
const Image = require("../models/Image");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// create a new album
const createAlbum = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Album name is required" });
    }

    const album = await Album.create({
      name,
      description: description || "",
      ownerId: req.user._id,
      sharedWith: []
    });

    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ message: "Error creating album", error: err.message });
  }
};

// get all albums (owned + shared)
const getAllAlbums = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // find albums owned by user or shared with user
    const albums = await Album.find({
      $or: [
        { ownerId: req.user._id },
        { sharedWith: userEmail }
      ]
    });

    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: "Error getting albums", error: err.message });
  }
};

// update album description
const updateAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { description } = req.body;

    const album = await Album.findOne({ albumId });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // only owner can update
    if (album.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not the owner of this album" });
    }

    album.description = description;
    await album.save();

    res.json(album);
  } catch (err) {
    res.status(500).json({ message: "Error updating album", error: err.message });
  }
};

// delete album and all its images
const deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findOne({ albumId });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // only owner can delete
    if (album.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not the owner of this album" });
    }

    // delete all images from cloudinary and db
    const images = await Image.find({ albumId: album._id });

    for (let img of images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    await Image.deleteMany({ albumId: album._id });
    await Album.findByIdAndDelete(album._id);

    res.json({ message: "Album deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting album", error: err.message });
  }
};

// share album with other users via email
const shareAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { emails } = req.body;

    if (!emails || emails.length === 0) {
      return res.status(400).json({ message: "Emails are required" });
    }

    const album = await Album.findOne({ albumId });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // only owner can share
    if (album.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not the owner of this album" });
    }

    // check if all emails exist in system
    for (let email of emails) {
      const userExists = await User.findOne({ email });
      if (!userExists) {
        return res.status(400).json({ message: `User with email ${email} does not exist` });
      }
    }

    // add emails to sharedWith (avoid duplicates)
    for (let email of emails) {
      if (!album.sharedWith.includes(email)) {
        album.sharedWith.push(email);
      }
    }

    await album.save();

    res.json({ message: "Album shared successfully", album });
  } catch (err) {
    res.status(500).json({ message: "Error sharing album", error: err.message });
  }
};

module.exports = { createAlbum, getAllAlbums, updateAlbum, deleteAlbum, shareAlbum };
