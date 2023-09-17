// src/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const requireAuth = require("../middleware/auth.middleware");
const mUser = require("../middleware/user.middleware");

// Create a new category
router.post("/", [requireAuth, mUser.isAdmin], categoryController.create);

// Read all categorys
router.get("/", categoryController.getAll);

// Get a category by ID
router.get("/:id", categoryController.getOne);

// Update a category by ID
router.put("/:id", [requireAuth, mUser.isAdmin], categoryController.update);

// Delete a category by ID
router.delete("/:id", [requireAuth, mUser.isAdmin], categoryController.delete);

module.exports = router;
