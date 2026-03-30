const { generateToken } = require("../utils/generateToken");

// called after google oauth success
const googleCallback = (req, res) => {
  try {
    const token = generateToken(req.user._id);

    // redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
// get current user info
const getMe = (req, res) => {
  try {
    res.json({
      userId: req.user._id,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { googleCallback, getMe };
