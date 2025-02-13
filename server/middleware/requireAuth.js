const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = await User.findById(_id).select("_id");
    next();
  } catch (error) {
    return res.status(401).json({ error: "Request is not authorized." });
  }
};

module.exports = requireAuth;
