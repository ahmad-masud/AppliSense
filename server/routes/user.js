const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  deleteUser,
  updateUser,
  changePassword,
} = require("../controllers/userController");

router.post("/login", loginUser);

router.post("/register", registerUser);

router.delete("/delete", deleteUser);

router.put("/update", updateUser);

router.put("/changePassword", changePassword);

module.exports = router;
