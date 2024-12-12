const jwt = require("jsonwebtoken");
const User = require("./models/User");
const JWT_SECRET = process.env.JWT_SECRET_KEY ; // Your JWT secret

// Function to generate a JWT token
const generateToken = (payload) => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting 'Bearer <token>'
  if (!token) {
    return res
      .status(403)
      .json({ message: "No token provided. Access denied." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach the decoded payload to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  });
};

module.exports = { generateToken, verifyToken, verifyAdmin };
