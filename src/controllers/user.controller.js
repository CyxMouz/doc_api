const User = require("../models/user");

exports.create = async (req, res) => {
  const { username, email, password, gender, addresses } = req.body;

  try {
    const user = new User({
      username,
      email,
      password,
      gender,
      addresses,
    });

    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.createAdmin = async (req, res) => {
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
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.getAll = async (req, res) => {
  try {
    const users = await User.find().populate("purchaseHistory").exec();

    res.json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};
