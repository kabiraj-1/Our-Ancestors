const User = require("../models/User");

module.exports = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.isVerified) return res.status(403).json({ message: "User is not verified" });

  next();
};
