const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.MONGODB_URI;

// database connection
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected");
  } catch (error) {
    console.error(
      "DB connection error: \n ------------- \n",
      error,
      "\n ------------- "
    );
  }
};

module.exports = connectDB;
