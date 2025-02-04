const express = require("express");
const router = express.Router();
const {
  loginUser,
  loginUserWithOTP,
  registerUser,
  deleteUser,
  updateUser,
  changePassword,
  sendCode,
  verifyCode,
} = require("../controllers/userController");

router.post("/login", loginUser);

router.post("/loginWithOTP", loginUserWithOTP);

router.post("/register", registerUser);

router.delete("/delete", deleteUser);

router.put("/update", updateUser);

router.put("/changePassword", changePassword);

router.post("/sendCode", sendCode);

router.post("/verifyCode", verifyCode);

module.exports = router;
