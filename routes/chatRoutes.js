const express = require("express");
const { getActiveChats, getMessages, deleteChat } = require("../controllers/chatController");
const { authenticateUser, authenticateAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/active", authenticateAdmin, getActiveChats);
router.get("/:userId/:adminId", authenticateUser, getMessages);
router.delete("/:userId/:adminId", authenticateAdmin, deleteChat);

module.exports = router;
