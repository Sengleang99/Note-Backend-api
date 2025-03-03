const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token after "Bearer"

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: No token provided",
      status: false,
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err.message); // Log error for debugging
      return res.status(403).json({
        message: "Forbidden: Invalid token",
        status: false,
      });
    }

    req.userId = decoded.id; // Attach user data to request
    next();
  });
}

module.exports = authenticateToken;
