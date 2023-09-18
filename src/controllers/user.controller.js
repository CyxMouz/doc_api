const User = require("../models/user");

// create users by admin
exports.create = async (req, res) => {
  const { username, email, password, gender, addresses, role } = req.body;

  try {
    const user = new User({
      username,
      email,
      password,
      gender,
      addresses,
      role,
    });

    await user.save();

    // for now i return a user with password and everything
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// get all users
exports.getAll = async (req, res) => {
  try {
    const users = await User.find().populate("purchaseHistory").exec();

    res.json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.updatePassword = async (req, res) => {
  return res.status(501).json({ message: "Route not implemented" });
};
exports.update = async (req, res) => {
  return res.status(501).json({ message: "Route not implemented" });
};
exports.delete = async (req, res) => {
  return res.status(501).json({ message: "Route not implemented" });
};
exports.suspend = async (req, res) => {
  return res.status(501).json({ message: "Route not implemented" });
};
