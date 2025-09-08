const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } 
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password,phone,role,gender } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already has been used' });

    const newUser = new User({ name, email, password,phone,role,gender });
    await newUser.save();

    res.status(201).json({ message: 'Register successfully' });
  } catch (err) {
     console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: `Email doesn't exist` });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong password' });

    // Tạo JWT
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
  res.status(200).json({
  message: 'Login successfully',
  accessToken, 
  refreshToken,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = (req, res) => {
  const token = req.body.refreshToken;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    const newAccessToken = generateAccessToken({ _id: decoded.userId });
    return res.json({ 
      accessToken: newAccessToken, 
      expiresIn: 30 * 1000 
    });
  });
};


