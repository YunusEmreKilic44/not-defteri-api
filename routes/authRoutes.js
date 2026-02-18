const express = require("express");

const router = express.Router();
const authController = require("../controllers/authController");
const { verifyRefreshToken } = require("../middlewares/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", verifyRefreshToken, authController.refresh);

module.exports = router;
