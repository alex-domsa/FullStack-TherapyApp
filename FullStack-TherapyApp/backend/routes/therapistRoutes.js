const express = require("express");
const therapistController = require("../controllers/therapistController");

const router = express.Router();

// GET all therapists
router.get("/", therapistController.getAllTherapists);

// GET therapist by ID
router.get("/:id", therapistController.getTherapistById);

// CREATE a new therapist
router.post("/", therapistController.createTherapist);

// UPDATE a therapist
router.put("/:id", therapistController.updateTherapist);

// DELETE a therapist
router.delete("/:id", therapistController.deleteTherapist);

module.exports = router; 