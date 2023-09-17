const product = require("../models/product");
const Product = require("../models/product");
const Review = require("../models/review");

const axios = require("axios");

const __ = require("lodash");

// Create a new product
exports.create = async (req, res) => {
  const {
    name,
    category,
    price,
    availability,
    description,
    quantity,
    imageUrl,
    imageList,
  } = req.body;
  try {
    const newProduct = new Product({
      name,
      category,
      price,
      availability,
      description,
      quantity,
      imageUrl,
      imageList,
    });
    await newProduct.save();

    //const insertedProducts = await Product.insertMany(productsData);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json(error);
  }
};
// Update a product
exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    quantity,
    name,
    price,
    availability,
    promo_rate,
    dated_promo,
    datef_promo,
  } = req.body;
  try {
    if (quantity < 0) {
      return res.status(400).json({
        message: "negative value of product quantity not acceptable !",
      });
    }
    if (name === "" || price === "" || availability === "") {
      return res.status(204).json({
        message: "Invalid name or price or availability",
      });
    }
    let product = await Product.findById(id);

    if (promo_rate) {
      if (dated_promo && datef_promo) {
        product.dated_promo = dated_promo;
        product.datef_promo = datef_promo;
        product.promo_rate = promo_rate;

        let reductionPrice = product.price * promo_rate * 0.01;

        product.promo_price = product.price - reductionPrice;
        product.save();
      } else {
        return res.status(400).json({
          message: "Invalid date promo begin or date promo end",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { quantity, name, price, availability },
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json("Product not found");
    }

    res.status(201).json(updatedProduct);
  } catch (error) {
    res.status(400).json(error);
  }
};
// Get one product
exports.getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json("Product not found");
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};
// Read all products
exports.getAll = async (req, res) => {
  console.log(req.user);
  const {
    page = 1,
    pageSize = 10,
    name,
    category,

    minPrice,
    maxPrice,
  } = req.query;

  try {
    const filters = {};

    if (name) {
      filters.name = { $regex: name, $options: "i" };
    }

    if (category) {
      filters.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {};

      if (minPrice !== undefined) {
        filters.price.$gte = parseFloat(minPrice);
      }

      if (maxPrice !== undefined) {
        filters.price.$lte = parseFloat(maxPrice);
      }
    }

    const query = Product.find(filters);

    const totalProducts = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / pageSize);

    query.skip((page - 1) * pageSize).limit(Number(pageSize));

    const products = await query.exec();

    res.status(201).json({
      products,
      currentPage: Number(page),
      totalPages,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete a product by ID
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json("Product not found");
    }

    res.status(201).json(deletedProduct);
  } catch (error) {
    res.status(400).json(error);
  }
};
// Function to fetch product data from an external API
exports.fetchExternalProductData = async (req, res) => {
  try {
    const response = await axios.get(req.body.url);

    return res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Review a product by user
exports.addUpdateReview = async (req, res) => {
  try {
    const { stars, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    // check if user gave his review
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      // update current review if review is already done
      existingReview.stars = stars;
      existingReview.comment = comment;
      await existingReview.save();
      const productReviewIndex = product.reviews.findIndex(
        (review) => review._id.toString() === existingReview._id.toString()
      );
      if (productReviewIndex !== -1) {
        product.reviews[productReviewIndex] = existingReview;
        await product.save();
      }
    } else {
      // Create new review
      const newReview = new Review({
        user: userId,
        product: productId,
        stars: stars,
        comment: comment,
      });
      await newReview.save();
      product.reviews.push(newReview);
      await product.save();
    }

    // update review stat
    const reviews = await Review.find({ product: productId });

    const totalReviews = reviews.length;

    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);

    const avgStars = totalStars / totalReviews;

    await Product.findByIdAndUpdate(productId, {
      totalReviews: totalReviews,
      totalStars: totalStars,
      avg_stars: avgStars,
    });

    res.status(201).json({ message: "Review added or updated successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add or update review",
      error: error.message,
    });
  }
};
