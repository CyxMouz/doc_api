const Product = require("../models/product");
const Purchase = require("../models/purchase");
const User = require("../models/user");
const axios = require("axios");
let mongoose = require("mongoose");

// Create a new purchase record | we can use transaction here
exports.create = async (req, res) => {
  const { productId, quantity } = req.body;
  let userId = req.user.id;

  try {
    const product = await Product.findById(productId);

    const user = await User.findById(userId);

    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    if (!product.availability) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    if (product.quantity - quantity < 0 && product.availability === true) {
      return res
        .status(400)
        .json({ message: "Current quantity doesn't meet the needs" });
    } else {
      if (product.quantity - quantity == 0) {
        product.availability = "false";
      }
    }
    if (quantity == 0) {
      return res.status(400).json("Error quantity value not allowed !");
    }
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    product.quantity -= quantity;
    let totalPrice = product.price * quantity;
    await product.save();

    const purchase = new Purchase({
      user: userId,
      product: productId,
      quantity: quantity,
      totalPrice: totalPrice,
    });

    await purchase.save();

    user.purchaseHistory.push(purchase);
    await user.save();

    res.status(201).json(purchase);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Create a new purchase record for multiple products
exports.createMultiple = async (req, res) => {
  const { selectedProducts } = req.body;
  let userId = req.user.id;

  const purchaseRecords = [];

  const user = await User.findById(userId);
  try {
    for (const selectedProduct of selectedProducts) {
      const { productId, quantity } = selectedProduct;

      const product = await Product.findById(productId);

      if (!product || !user) {
        return res.status(400).json({ message: "Product or user not found" });
      }

      if (!product.availability || product.quantity < quantity) {
        return res.status(400).json({
          message: "Product is unavailable or quantity is insufficient",
        });
      }
      if (quantity == 0) {
        continue;
      }
      // Calculate the total price for the purchase
      const totalPrice = product.price * quantity;

      // Create a purchase record
      const purchase = new Purchase({
        user: userId,
        product: productId,
        quantity,
        totalPrice,
      });

      await purchase.save();

      purchaseRecords.push(purchase);

      // Update product quantity and availability
      product.quantity -= quantity;
      if (product.quantity === 0) {
        product.availability = false;
      }
      await product.save();
    }

    res
      .status(201)
      .json({ message: "Purchases completed", purchases: purchaseRecords });
  } catch (error) {
    res.status(400).json({ message: "Failed to complete purchases", error });
  }
};

// Retrieve a user purchase history
exports.getUserPurchaseHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const purchases = await Purchase.find({ user: userId })
      .populate("product")
      .sort({ purchaseDate: -1 });
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json(error);
  }
};

//
// Update a purchase record by ID, ps: no need i think !
exports.update = async (req, res) => {};

// Delete a purchase record by ID, no need for tests purpose
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPurchase = await Purchase.findByIdAndDelete(id);

    if (!deletedPurchase) {
      return res.status(404).json("Purchase record not found");
    }

    res.json(deletedPurchase);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getPurchaseStats = async (req, res) => {
  try {
    let totalPurchase = await getTotalPurchases();
    let topSelling = await getTopSellingProducts();
    let trend = await getPurchaseTrends();

    res.json([
      { TotalPurchase: totalPurchase },
      { topSelling: topSelling },
      { trend: trend },
    ]);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get top-selling products based on total purchases
getTopSellingProducts = async () => {
  try {
    const topSellingProducts = await Purchase.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: "$productDetails._id",
          productName: { $first: "$productDetails.name" },
          totalPurchases: { $sum: 1 },
        },
      },
      {
        $sort: { totalPurchases: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    return topSellingProducts;
  } catch (error) {
    return error;
  }
};

getTotalPurchases = async () => {
  try {
    const totalPurchase = await Purchase.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: "$productDetails._id",
          Name: {
            $first: "$productDetails.name",
          },
          totalPurchases: { $sum: 1 },
        },
      },
    ]);
    return totalPurchase;
  } catch (error) {
    return error;
  }
};

getPurchaseTrends = async () => {
  try {
    const purchaseTrends = await Purchase.aggregate([
      {
        $project: {
          month: { $month: "$purchaseDate" },
          year: { $year: "$purchaseDate" },
          product: 1,
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            product: "$product",
          },
          totalPurchases: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, totalPurchases: -1 },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          topProducts: {
            $push: {
              product: "$_id.product",
              totalPurchases: "$totalPurchases",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          topProducts: { $slice: ["$topProducts", 3] }, // Include only the top 3 products here
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    return purchaseTrends;
  } catch (error) {
    return error;
  }
};

exports.fetchCreditCardData = async (req, res) => {
  try {
    let { size, credit_card_type } = req.query;

    // if in the api call credits card is not given; type by default will be visa
    if (
      credit_card_type == null ||
      credit_card_type == undefined ||
      credit_card_type == ""
    ) {
      credit_card_type = "visa";
    }
    if (!size || size < 0 || size > 100) {
      size = 100;
    }

    const response = await axios.get(
      `http://random-data-api.com/api/v2/credit_cards?size=${size}`
    );

    const filteredData = response.data
      .filter((card) => card.credit_card_type === credit_card_type)
      .map((card) => {
        return {
          id: card.id,
          uid: card.uid,
          credit_card_type: card.credit_card_type,
        };
      });

    return res.json([
      { filteredData: filteredData },
      { totalCreditCards: filteredData.length },
      { creditCardName: credit_card_type },
    ]);
  } catch (error) {
    res.status(500).json(error);
  }
};
