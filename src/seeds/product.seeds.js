const Category = require("../models/category");
const Product = require("../models/product");
const { faker } = require("@faker-js/faker");
// Function to generate random product data
generateRandomProduct = async () => {
  let category = new Category({ name: faker.commerce.department() });
  await Category.create(category);
  const randomProduct = {
    name: faker.commerce.productName(),
    category: category,
    price: parseFloat(faker.commerce.price(10, 100, 2)),
    availability: Math.random() < 0.5,
  };

  let product = new Product(randomProduct);
  await Product.create(product);
};

module.exports = generateRandomProduct;
