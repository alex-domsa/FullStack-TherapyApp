const express = require("express");
const sessionController = require("../controllers/sessionController");

const router = express.Router();

// GET all sessions
router.get("/", sessionController.getAllSessions);

// GET session by ID
router.get("/:id", sessionController.getSessionById);

// CREATE a new session
router.post("/", sessionController.createSession);

// UPDATE a session
router.put("/:id", sessionController.updateSession);

// DELETE a session
router.delete("/:id", sessionController.deleteSession);

module.exports = router; 