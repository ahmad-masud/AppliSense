const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");
const Application = require("../models/Application");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pendingEmail: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

userSchema.statics.register = async function (
  firstName,
  lastName,
  email,
  password
) {
  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw new Error("Email is already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hash,
  });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Email not found");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Password is incorrect");
  }

  return user;
};

userSchema.statics.delete = async function (email) {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await this.findOne({ email });

  await Application.deleteMany({ user_id: user._id });

  await this.findOneAndDelete({ email });
};

userSchema.statics.update = async function (
  email,
  newFirstName,
  newLastName,
  newEmail
) {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Email not found");
  }

  if (newFirstName) {
    user.firstName = newFirstName;
  }
  if (newLastName) {
    user.lastName = newLastName;
  }
  if (newEmail) {
    user.email = newEmail;
  }

  await user.save();
};

userSchema.statics.changePassword = async function (
  email,
  oldPassword,
  newPassword
) {
  if (!email || !oldPassword || !newPassword) {
    throw new Error("All fields are required");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Email not found");
  }

  const match = await bcrypt.compare(oldPassword, user.password);

  if (!match) {
    throw new Error("Old password is incorrect");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Password is not strong enough");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  user.password = hash;

  await user.save();
};

module.exports = mongoose.model("User", userSchema);
