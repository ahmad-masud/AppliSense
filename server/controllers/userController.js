const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKEN_SECRET, { expiresIn: "30d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    if (!user.verified) {
      return res
        .status(403)
        .json({ error: "Please verify your email to log in." });
    }

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

  const user = await User.register(firstName, lastName, email, password);

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.IS_LOCAL ? "http://localhost:3000" : "https://applisense.vercel.app"}/verifyEmail/${token}`;

  await transporter.sendMail({
    from: `"AppliSense" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your account",
    html: `<p>Welcome! Please verify your account by clicking the link below:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
  });

  res
    .status(200)
    .json({ message: "Verification email sent. Please check your inbox." });
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) throw new Error("User not found");

    user.verified = true;
    await user.save();

    res.status(200).send("Email verified. You can now log in.");
  } catch (err) {
    res.status(400).send("Invalid or expired verification link.");
  }
};

const verifyNewEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, newEmail } = decoded;
    const user = await User.findById(id);
    if (!user || user.pendingEmail !== newEmail) {
      throw new Error("Invalid token or mismatched email.");
    }

    user.email = newEmail;
    user.pendingEmail = null;
    await user.save();

    const jwtToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: jwtToken,
    });
  } catch (err) {
    console.error("Verification error:", err.message);
    res.status(400).json({ error: "Invalid or expired verification link." });
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
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    if (newFirstName) user.firstName = newFirstName;
    if (newLastName) user.lastName = newLastName;

    if (newEmail && newEmail !== email) {
      const existing = await User.findOne({ email: newEmail });
      if (existing)
        return res.status(400).json({ error: "Email already exists" });

      user.pendingEmail = newEmail;

      const token = jwt.sign(
        { id: user._id, newEmail },
        process.env.TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const link = `${process.env.IS_LOCAL ? "http://localhost:3000" : "https://applisense.vercel.app"}/verifyNewEmail/${token}`;

      await transporter.sendMail({
        from: `"AppliSense" <${process.env.EMAIL_USER}>`,
        to: newEmail,
        subject: "Verify your new email",
        html: `<p>Please click the link to verify your new email address:</p><a href="${link}">${link}</a>`,
      });

      await user.save();

      return res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: email,
        message: "Verification email sent to new address",
      });
    }

    await user.save();

    return res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.changePassword(email, oldPassword, newPassword);
    res.status(200).json({ email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("No user found with that email");

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.IS_LOCAL ? "http://localhost:3000" : "https://applisense.vercel.app"}/resetPassword/${token}`;

    await transporter.sendMail({
      from: `"AppliSense" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `<p>Click the link below to reset your password. This link is valid for 15 minutes.</p><a href="${resetUrl}">${resetUrl}</a>`,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const validateResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    jwt.verify(token, process.env.TOKEN_SECRET);
    res.status(200).json({ valid: true });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) throw new Error("User not found");

    const bcrypt = require("bcrypt");
    const validator = require("validator");

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Password is not strong enough");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password successfully reset" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  verifyEmail,
  deleteUser,
  verifyNewEmail,
  updateUser,
  changePassword,
  requestPasswordReset,
  validateResetToken,
  resetPassword,
};
