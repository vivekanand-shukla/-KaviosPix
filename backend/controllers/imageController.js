const Image = require("../models/Image");
const Album = require("../models/Album");
const cloudinary = require("../config/cloudinary");
const path = require("path");

// helper to check if user has access to album
const checkAlbumAccess = async (albumId, user) => {
  const album = await Album.findOne({ albumId });

  if (!album) return null;

  const isOwner = album.ownerId.toString() === user._id.toString();
  const isShared = album.sharedWith.includes(user.email);

  if (!isOwner && !isShared) return null;

  return album;
};

// upload image to album
const uploadImage = async (req, res) => {
  try {
    const { albumId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const album = await checkAlbumAccess(albumId, req.user);

    if (!album) {
      return res.status(404).json({ message: "Album not found or no access" });
    }

    // get tags from body (could be string or array)
    let tags = req.body.tags || [];
    if (typeof tags === "string") {
      tags = tags.split(",").map(t => t.trim());
    }

    const person = req.body.person || "";
    const isFavorite = req.body.isFavorite === "true";
    const fileSize = req.file.size;
    const fileName = req.file.originalname;

    // upload to cloudinary using buffer
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "kaviosPix" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // save image to db
    const image = await Image.create({
      albumId: album._id,
      name: fileName,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      tags,
      person,
      isFavorite,
      size: fileSize,
      uploadedAt: new Date()
    });

    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: "Error uploading image", error: err.message });
  }
};

// get all images in album (supports tag filter)
const getAllImages = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { tags } = req.query;

    const album = await checkAlbumAccess(albumId, req.user);

    if (!album) {
      return res.status(404).json({ message: "Album not found or no access" });
    }

    let filter = { albumId: album._id };

    // if tags query param exists, filter by tag
    if (tags) {
      filter.tags = { $in: [tags] };
    }

    const images = await Image.find(filter);

    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Error getting images", error: err.message });
  }
};

// get only favorite images
const getFavoriteImages = async (req, res) => {
  try {
    const { albumId } = req.params;

    const album = await checkAlbumAccess(albumId, req.user);

    if (!album) {
      return res.status(404).json({ message: "Album not found or no access" });
    }

    const favorites = await Image.find({ albumId: album._id, isFavorite: true });

    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Error getting favorites", error: err.message });
  }
};

// mark or unmark image as favorite
const favoriteImage = async (req, res) => {
  try {
    const { albumId, imageId } = req.params;
    const { isFavorite } = req.body;

    const album = await checkAlbumAccess(albumId, req.user);

    if (!album) {
      return res.status(404).json({ message: "Album not found or no access" });
    }

    const image = await Image.findOne({ imageId, albumId: album._id });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    image.isFavorite = isFavorite;
    await image.save();

    res.json(image);
  } catch (err) {
    res.status(500).json({ message: "Error updating favorite", error: err.message });
  }
};

// add comment to image
const addComment = async (req, res) => {
  try {
    const { albumId, imageId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const album = await checkAlbumAccess(albumId, req.user);

    if (!album) {
      return res.status(404).json({ message: "Album not found or no access" });
    }

    const image = await Image.findOne({ imageId, albumId: album._id });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    image.comments.push(comment);
    await image.save();

    res.json(image);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};

// delete image
const deleteImage = async (req, res) => {
  try {
    const { albumId, imageId } = req.params;

    const album = await checkAlbumAccess(albumId, req.user);

    if (!album) {
      return res.status(404).json({ message: "Album not found or no access" });
    }

    const image = await Image.findOne({ imageId, albumId: album._id });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // delete from cloudinary
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    await Image.findByIdAndDelete(image._id);

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting image", error: err.message });
  }
};

module.exports = { uploadImage, getAllImages, getFavoriteImages, favoriteImage, addComment, deleteImage };
