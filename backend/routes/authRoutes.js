const express = require("express");
const router = express.Router();
const passport = require("passport");
const { googleCallback, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// start google oauth
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// google callback
router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);

// get current logged in user
router.get("/me", protect, getMe);

module.exports = router;
