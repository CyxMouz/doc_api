exports.isValidCard = async (req, res, next) => {
  if (req.body.cardNumber) {
    // logic for valid card to be implemented !!!

    next();
  }
  return res.status(400).json({ message: "Invalid card" });
};
