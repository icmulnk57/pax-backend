const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.cookieToken || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Access token is required.",
      code: 401,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Invalid or expired token.",
        code: 403,
      });
    }

    req.user = user;
    next();
  });
};


module.exports = authenticateToken;
