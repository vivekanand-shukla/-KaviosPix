const express = require("express");
const router = express.Router();
const {
  createAlbum,
  getAllAlbums,
  updateAlbum,
  deleteAlbum,
  shareAlbum
} = require("../controllers/albumController");
const { protect } = require("../middleware/authMiddleware");

// all routes are protected
router.post("/", protect, createAlbum);
router.get("/", protect, getAllAlbums);
router.put("/:albumId", protect, updateAlbum);
router.delete("/:albumId", protect, deleteAlbum);
router.post("/:albumId/share", protect, shareAlbum);

module.exports = router;
