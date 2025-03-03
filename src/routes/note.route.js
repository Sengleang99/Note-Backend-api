const express = require("express");
const {
  addNote,
  readNote,
  updateNote,
  deleteNote,
  searchNote,
  updateNotePinned,
} = require("../controllers/note.controler");
const authenticateToken = require("../utils/utilities");
require("dotenv").config();

const router = express.Router();

router.get("/readallnote", authenticateToken, readNote);
router.get("/searchnotes/:noteId", authenticateToken, searchNote);
router.post("/addnotes", authenticateToken, addNote);
router.put("/updatenotes/:noteId", authenticateToken, updateNote);
router.delete("/deletenotes/:noteId", authenticateToken, deleteNote);
router.put("/updatenotespind/:noteId", authenticateToken, updateNotePinned);

module.exports = router;
