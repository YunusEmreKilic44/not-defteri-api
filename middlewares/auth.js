const jwt = require("jsonwebtoken");

const { secret } = require("../config/jwtConfig");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Token gerekli! Lütfen giriş yapınız!" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Geçersiz token" });
  }
};

module.exports = {
  verifyToken,
};
