const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// generate token
const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "1h" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    let user = await userModel.findOne({ email });
    if (user)
      return res.status(400).json("user with the given email already exists");
    if (!name || !email || !password)
      return res.status(400).json("all fields are required");
    if (!validator.isEmail(email))
      return res.status(400).json("invalid email format");
    if (!validator.isStrongPassword(password))
      return res.status(400).json("weak password");

    // proceed to register if validation passes
    user = new userModel({ name, email, password });

    // salt (encrypt) password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    // generate token
    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (err) {
    console.log(" >>>[INFO] failed to register a user", err.message);
    res.status(500).json(err);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // validation
    let user = await userModel.findOne({ email });
    if (!user) return res.status(400).json("invalid email or password");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) res.status(400).json("invalid email or password");

    // generate token
    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (err) {
    console.log(" >>>[DEBUG] failed to login \n", err.message);
    res.status(500).json(err);
  }
};

const findUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    console.log(" >>>[DEBUG] failed to find the user \n", err.message);
    res.status(500).json(err);
  }
};

module.exports = { registerUser, loginUser, findUserById };
