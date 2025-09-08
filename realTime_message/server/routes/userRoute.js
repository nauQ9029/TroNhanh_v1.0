const express = require("express");
const {
  registerUser,
  loginUser,
  findUserById,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/find/:userId", findUserById);

module.exports = router;
