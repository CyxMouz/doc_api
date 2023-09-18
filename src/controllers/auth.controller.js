const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.SECRETKEY, { expiresIn: "1h" });

    res.json({ token: `Bearer ${token}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
