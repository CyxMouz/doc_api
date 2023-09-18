// src/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const requireAuth = require("../middleware/auth.middleware");
const mUser = require("../middleware/user.middleware");
// Create a new user
router.post("/", userController.create);

router.post("/admin/", [requireAuth, mUser.isAdmin], userController.create);

// // Read all users
router.get("/", userController.getAll);

// // Get a user by ID
// router.get("/:id", userController.getOne);

// // Update a user by ID
// router.put("/:id", [requireAuth] userController.update);

// // Delete a user by ID
// router.delete("/:id", userController.delete);

module.exports = router;
