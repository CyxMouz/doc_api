const User = require("../models/user");
const Product = require("../models/product");

// middleware to check if user can review or not a product, based on the condition : if he already did any purchase of that product

exports.isEligible = async (req, res, next) => {
  const { id } = req.params;
  try {
    let product = await Product.findById(id);
    let user = await User.findById(req.user.id).populate("purchaseHistory");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasPurchased = user.purchaseHistory.some((purchase) => {
      if (purchase.product._id.equals(product._id)) {
        return true;
      }
      return false;
    });

    if (hasPurchased) {
      return next();
    } else {
      return res.status(403).json({ message: "Require purchase" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
