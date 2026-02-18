const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { verifyAccessToken } = require("../middlewares/auth");

router.get("/", verifyAccessToken, noteController.getAllNotes);
router.post("/", verifyAccessToken, noteController.createNote);
router.delete("/:id", verifyAccessToken, noteController.deleteNote);

module.exports = router;
