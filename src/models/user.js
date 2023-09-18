const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "customer"], // in my case now i have only 2 roles
    default: "customer", // Here default role will be customer
  },
  gender: {
    type: String,
    enum: ["male", "female"], // :)
  },

  purchaseHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
    },
  ],
  addresses: [
    {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
  ],
});

userSchema.set("timestamps", true);
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});
module.exports = mongoose.model("User", userSchema);
