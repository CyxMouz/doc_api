const Product = require("../models/product");
const Purchase = require("../models/purchase");
const User = require("../models/user");
const axios = require("axios");
let mongoose = require("mongoose");

// Create a new purchase record
exports.create = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // const session = await mongoose.startSession();

  // session.startTransaction();

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

    // await session.commitTransaction();
    // session.endSession();

    res.status(201).send(purchase);
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();

    res.status(400).send(error);
  }
};

// Create a new purchase record for multiple products
exports.createMultiple = async (req, res) => {
  const { selectedProducts, userId } = req.body;

  // Define an array to store purchase records
  const purchaseRecords = [];

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  const user = await User.findById(userId);
  try {
    for (const selectedProduct of selectedProducts) {
      const { productId, quantity } = selectedProduct;

      const product = await Product.findById(productId);

      if (!product || !user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Product or user not found" });
      }

      if (!product.availability || product.quantity < quantity) {
        await session.abortTransaction();
        session.endSession();
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

      // Save the purchase record to the database
      await purchase.save();

      // Push the purchase record to the array
      purchaseRecords.push(purchase);

      // Update product quantity and availability
      product.quantity -= quantity;
      if (product.quantity === 0) {
        product.availability = false;
      }
      await product.save();
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return a success response with purchase records
    res
      .status(201)
      .json({ message: "Purchases completed", purchases: purchaseRecords });
  } catch (error) {
    // Rollback the transaction and return an error response
    await session.abortTransaction();
    session.endSession();
    console.log(error);
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
    res.status(500).send(error);
  }
};

// Update a purchase record by ID
exports.update = async (req, res) => {
  const { id } = req.params;
  const { user, product, quantity } = req.body;

  try {
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      id,
      { user, product, quantity },
      { new: true }
    );

    if (!updatedPurchase) {
      return res.status(404).send("Purchase record not found");
    }

    res.send(updatedPurchase);
  } catch (error) {
    res.status(400).send(error);
  }
};
// Delete a purchase record by ID
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPurchase = await Purchase.findByIdAndDelete(id);

    if (!deletedPurchase) {
      return res.status(404).send("Purchase record not found");
    }

    res.send(deletedPurchase);
  } catch (error) {
    res.status(400).send(error);
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
    res.status(500).send(error);
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
        $sort: { totalPurchases: -1 }, // Sort in descending order based on total purchases
      },
      {
        $limit: 10, // Limit the results to the top 10 products (adjust as needed)
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
          product: 1, // Include the product field
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
          topProducts: { $slice: ["$topProducts", 3] }, // Include only the top 3 products
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

    // if user dont give any credit card type by default it will be visa
    if (credit_card_type == null || credit_card_type == undefined) {
      credit_card_type = "visa";
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

    return res.send([
      { filteredData: filteredData },
      { totalCreditCards: filteredData.length },
      { creditCardName: credit_card_type },
    ]);
  } catch (error) {
    res.status(500).send(error);
  }
};
