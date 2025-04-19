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
const requireAuth = require("../middleware/requireAuth");

router.post("/login", loginUser);

router.post("/register", registerUser);

router.post("/verifyNewEmail/:token", requireAuth, verifyNewEmail);

router.post("/verifyEmail/:token", verifyEmail);

router.delete("/delete", requireAuth, deleteUser);

router.put("/update", requireAuth, updateUser);

router.put("/changePassword", requireAuth, changePassword);

router.post("/requestPasswordReset", requestPasswordReset);

router.get("/validateResetToken/:token", validateResetToken);

router.post("/resetPassword/:token", resetPassword);

module.exports = router;
