const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  verifyEmail,
  deleteUser,
  verifyNewEmail,
  updateUser,
  changePassword,
  resetPassword,
  validateResetToken,
  requestPasswordReset,
} = require("../controllers/userController");

router.post("/login", loginUser);

router.post("/register", registerUser);

router.post("/verifyNewEmail/:token", verifyNewEmail);

router.post("/verifyEmail/:token", verifyEmail);

router.delete("/delete", deleteUser);

router.put("/update", updateUser);

router.put("/changePassword", changePassword);

router.post("/requestPasswordReset", requestPasswordReset);

router.get("/validateResetToken/:token", validateResetToken);

router.post("/resetPassword/:token", resetPassword);

module.exports = router;
