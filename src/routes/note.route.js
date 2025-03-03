const express = require ("express");
const {
  addNote,
  readNote,
  updateNote,
  deleteNote,
  updateNotePind,
  searchNote,
} = require("../controllers/note.controler");
const authenticateToken = require("../utils/utilities");
require("dotenv").config();

const router = express.Router();

router.get("/readallnote", authenticateToken, readNote);
router.get("/searchnotes", authenticateToken, searchNote);
router.post("/addnotes", authenticateToken, addNote);
router.put("/updatenotes/:noteId", authenticateToken, updateNote);
router.delete("/deletenotes/:noteId", authenticateToken, deleteNote);
router.put("/updatenotespind/:id", authenticateToken, updateNotePind);

module.exports = router;
