const express = require("express");
const clientController = require("../controllers/clientController");

const router = express.Router();

// GET all clients
router.get("/", clientController.getAllClients);

// GET client by ID
router.get("/:id", clientController.getClientById);

// CREATE a new client
router.post("/", clientController.createClient);

// UPDATE a client
router.put("/:id", clientController.updateClient);

// DELETE a client
router.delete("/:id", clientController.deleteClient);

module.exports = router; 