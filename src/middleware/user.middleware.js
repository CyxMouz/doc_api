exports.isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Requires admin role " });
  }
};
exports.isCustomer = async (req, res, next) => {
  if (req.user && req.user.role === "customer") {
    return next();
  } else {
    return res.status(403).json({ message: "Requires customer role " });
  }
};

exports.isAdminOrCustomer = async (req, res, next) => {
  if ((req.user && req.user.role === "customer") || req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Requires  role " });
  }
};
