// src/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

const requireAuth = require("../middleware/auth.middleware");
const midllewareUser = require("../middleware/user.middleware");
const midllewareProduct = require("../middleware/reviewProduct.middleware");
// Create a new product
router.post("/", [requireAuth], productController.create);

// Read all products
router.get("/", [requireAuth], productController.getAll);

// Fetch a product from external API
router.get(
  "/external",
  [requireAuth, midllewareUser.isAdmin],
  productController.fetchExternalProductData
);

// Get a product by ID
router.get("/:id", productController.getOne);

// Update a product by ID
router.put(
  "/:id",
  [requireAuth, midllewareUser.isAdmin],
  productController.update
);

// Delete a product by ID
router.delete(
  "/:id",
  [requireAuth, midllewareUser.isAdmin],
  productController.delete
);

// Note Product by ID
router.post(
  "/rate/:id",
  [requireAuth, midllewareUser.isAdminOrCustomer, midllewareProduct.isEligible],
  productController.addUpdateReview
);

module.exports = router;
