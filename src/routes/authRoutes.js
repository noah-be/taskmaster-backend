import AuthController from "../controllers/AuthController.js";
import express from "express";
import UserModel from "../models/UserModel.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.get("/check-username", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({
      message: "Username missing",
    });
  }
  try {
    const userExists = await UserModel.findOne({
      username,
    });
    return res.json({
      isAvailable: !userExists,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
