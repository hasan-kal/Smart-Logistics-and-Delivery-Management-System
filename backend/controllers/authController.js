const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Register (for customers/admins)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    user = await User.create({ name, email, password: hashedPassword, role });
    res.json({ msg: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login (customers/admins with password)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Agent login with OTP (mock version for now)
exports.agentLogin = async (req, res) => {
  try {
    const { phone } = req.body;

    // Check if agent exists
    let user = await User.findOne({ phone, role: 'agent' });
    if (!user) return res.status(400).json({ msg: "Agent not found" });

    // Mock OTP (we’ll integrate real SMS later)
    const otp = "123456"; // 🔥 for now hardcoded
    res.json({ msg: "OTP sent (mock)", otp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};