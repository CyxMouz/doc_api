const express = require("express");

const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
//const generateRandomProduct = require("./seeds/product.seeds");
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Establish a connexion to database
connectDB();

// Routes
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const purchaseRoutes = require("./routes/purchase.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);

//generateRandomProduct();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
