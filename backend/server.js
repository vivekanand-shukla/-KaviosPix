const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

// import routes
const authRoutes = require("./routes/authRoutes");
const albumRoutes = require("./routes/albumRoutes");
const imageRoutes = require("./routes/imageRoutes");
// passport config
require("./config/passport");
const app = express();
// middlewares
app.use(cors({
  origin:[ process.env.CLIENT_URL , "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// routes
app.use("/auth", authRoutes);
app.use("/albums", albumRoutes);
app.use("/albums", imageRoutes);
// home route
app.get("/", (req, res) => {
  res.json({ message: "KaviosPix API is running!" });
});
// connect to mongodb and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
