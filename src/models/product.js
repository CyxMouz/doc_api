const mongoose = require("mongoose");
const reviewSchema = require("./review");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  // ---------------------------- //
  description: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  imageList: [
    {
      type: String,
    },
  ],
  imageUrl: {
    type: String,
  },

  promo_rate: {
    type: Number,
    default: 0,
  },
  dated_promo: {
    type: Date,
  },
  datef_promo: {
    type: Date,
  },
  promo_price: {
    type: Number,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  totalStars: {
    type: Number,
    default: 0,
  },
  avg_stars: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
productSchema.set("timestamps", true);
module.exports = mongoose.model("Product", productSchema);
