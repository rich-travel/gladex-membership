const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/user");
const packageRoutes = require("./routes/package");
const membershipLevelRoutes = require("./routes/membershipLevel");
const transferHistoryRoutes = require("./routes/transferHistory");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      process.env.CURRENT_ENV === "development"
        ? process.env.FRONTEND_URL
        : process.env.FRONTEND_URL_PROD,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Connected to MongoDB Atlas."))
  .catch((error) => console.error("MongoDB connection error:", error));

// Error Listener for Connection
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));

app.get("/", (req, res) => {
  res.send("Server is running!");
});
// User Routes
app.use("/api/users", userRoutes);
// Package Routes
app.use("/api/package", packageRoutes);
// Membership Level Routes
app.use("/api/membership-level", membershipLevelRoutes);
// Transfer History Routes
app.use("/api/transfer", transferHistoryRoutes);

// Start Server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is now running on port ${port}.`);
  });
}

// Export the Express app for Vercel
module.exports = app;
