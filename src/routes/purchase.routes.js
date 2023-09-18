// src/routes/purchaseRoutes.js
const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchase.controller");
const requireAuth = require("../middleware/auth.middleware");
const mUser = require("../middleware/user.middleware");
// Create a new purchase record
router.post("/", [requireAuth], purchaseController.create);

// Create a multiple purchase records
router.post("/multi", [requireAuth], purchaseController.createMultiple);

// Get statistic about purchases
router.get("/stats", purchaseController.getPurchaseStats);

// Fetch from external API Credit card data
router.get(
  "/fetch-credit-card-data",
  [requireAuth, mUser.isAdmin],
  purchaseController.fetchCreditCardData
);

// Retrieve a user's purchase history
router.get(
  "/:userId",
  [requireAuth, mUser.isAdmin || mUser],
  purchaseController.getUserPurchaseHistory
);

//router.put("/:id", purchaseController.update);

// Delete a purchase record by ID
//router.delete("/:id", purchaseController.delete);

module.exports = router;
