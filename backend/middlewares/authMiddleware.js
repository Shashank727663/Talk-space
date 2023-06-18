const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const asyncHandler = require("express-async-handler");



const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        token = req.headers.authorization.split(" ")[1];
        // Check if the token is present
        if (!token) {
          return res.status(401).json({ message: 'No token, authorization denied' });
        }
        // Decoding token id
        const decoded = jwt.verify(token, 'shashank');
        req.user = await User.findById(decoded.id);
        next();
      } catch (err) {
        res.status(401);
        throw new Error("Token failed");
      }
    } else {
      res.status(401).json({ message: 'No token, authorization denied' });
    }
  });

module.exports = { protect }
  