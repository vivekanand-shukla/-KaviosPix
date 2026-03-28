const jwt = require("jsonwebtoken");
require("dotenv").config();

// generate jwt token
const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
  return token;
};

module.exports = { generateToken };
