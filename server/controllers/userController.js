const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

let verificationCodes = {};

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const code = generateCode();
    verificationCodes[email] = code;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
    });

    res.json({ message: "Code sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Error sending email", error: error.message });
  }
};

const verifyCode = (req, res) => {
  const { email, code } = req.body;

  if (verificationCodes[email] === code) {
    delete verificationCodes[email];
    res.json({ success: true, message: "Code verified successfully!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid code" });
  }
};

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKEN_SECRET, { expiresIn: "3d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    const firstName = user.firstName;
    const lastName = user.lastName;
    res.status(200).json({ firstName, lastName, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUserWithOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.loginWithOTP(email);
    const token = createToken(user._id);
    const firstName = user.firstName;
    const lastName = user.lastName;
    res.status(200).json({ firstName, lastName, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.register(firstName, lastName, email, password);
    const token = createToken(user._id);
    res.status(200).json({ firstName, lastName, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.delete(email);
    res.status(200).json({ email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { email, newFirstName, newLastName, newEmail } = req.body;

  try {
    const user = await User.update(email, newFirstName, newLastName, newEmail);
    res.status(200).json({
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.changePassword(email, newPassword);
    res.status(200).json({ email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  loginUserWithOTP,
  registerUser,
  deleteUser,
  updateUser,
  changePassword,
  sendCode,
  verifyCode,
};
