const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).json({ error: "missing token" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "invalid token" });

    req.user = user;
    next();
  });
}

module.exports = authenticateJWT;
