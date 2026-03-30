const express = require("express");
const router = express.Router();
const {
  uploadImage,
  getAllImages,
  getFavoriteImages,
  favoriteImage,
  addComment,
  deleteImage
} = require("../controllers/imageController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
// image routes - all protected
router.post("/:albumId/images", protect, upload.single("file"), uploadImage);
router.get("/:albumId/images", protect, getAllImages);
router.get("/:albumId/images/favorites", protect, getFavoriteImages);
router.put("/:albumId/images/:imageId/favorite", protect, favoriteImage);
router.post("/:albumId/images/:imageId/comments", protect, addComment);
router.delete("/:albumId/images/:imageId", protect, deleteImage);

module.exports = router;
