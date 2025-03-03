const express = require("express");
const {
  readUser,
  createAccount,
  login,
  getUserByToken,
} = require("../controllers/user.controler.js");
const authenticateToken = require("../utils/utilities.js");
const router = express.Router();

router.get("/", readUser);
router.post("/register", createAccount);
router.post("/login", login);
router.get("/getusertoken", authenticateToken, getUserByToken);

module.exports = router;
