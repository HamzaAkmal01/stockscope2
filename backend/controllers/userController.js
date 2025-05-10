const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
exports.registerUser = async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      Email,
      PhoneNumber,
      Password,
      UserType = 'Trader',
      AccountBalance = 0,
      Updation_In_Profile = new Date().toISOString().split('T')[0],
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { Email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create user
    const user = await User.create({
      FirstName,
      LastName,
      Email,
      PhoneNumber,
      Password: hashedPassword,
      UserType,
      AccountBalance,
      Updation_In_Profile,
    });

    // Generate JWT
    const token = jwt.sign({ id: user.UserID, email: user.Email }, 'your_jwt_secret', { expiresIn: '1d' });

    res.status(201).json({
      token,
      user: {
        id: user.UserID,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
        UserType: user.UserType,
        AccountBalance: user.AccountBalance,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ where: { Email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.UserID, email: user.Email }, 'your_jwt_secret', { expiresIn: '1d' });
    res.json({
      token,
      user: {
        id: user.UserID,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
        UserType: user.UserType,
        AccountBalance: user.AccountBalance,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get Profile (Protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user.UserID,
      FirstName: user.FirstName,
      LastName: user.LastName,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
      UserType: user.UserType,
      AccountBalance: user.AccountBalance,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
}; 