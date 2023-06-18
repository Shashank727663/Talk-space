const asyncHandler = require("express-async-handler");
const UserModel = require("../models/UserModel");
const generateToken = require('../generateToken');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  console.log("Request Body:", req.body); // Add this line for debugging

  if (!name || !email || !password) {
    console.log("Missing Fields:", { name, email, password }); 
    // Add this line for debugging
    res.status(400);
    throw new Error("Please enter all the mandatory fields.");
  }

  const exists = await UserModel.findOne({ email });
  console.log("User Exists:", exists); // Add this line for debugging

  const newUser = await UserModel.create({
    name,
    email,
    password,
    pic
  });

  // If user is created
  console.log("New User:", newUser); // Add this line for debugging

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      pic: newUser.pic,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create a new user...");
  }
});

const authUser = asyncHandler(async(req,res) => {
  const {email,password} = req.body;

  const existinguser = await UserModel.findOne({email});

  if(existinguser && (await existinguser.matchPassword(password))){
    res.json({
      _id: existinguser._id,
      name: existinguser.name,
      email: existinguser.email,
      pic: existinguser.pic,
      token: generateToken(existinguser._id),
    });
  }
  else{
    res.status(401);
    throw new Error("invalid email or password")
  }
})

// /api/user?search= shashank

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

    const users = await UserModel.find(keyword).find({ _id: { $ne: req.user._id } });

  res.send(users);
});



module.exports = { register , authUser , allUsers };
