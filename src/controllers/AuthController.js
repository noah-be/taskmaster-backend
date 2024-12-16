import { createUser, validateUser } from "../utils/userUtils.js";
import { finalizeAuthentication } from "../utils/authUtils.js";
import { exampleTasks } from "../utils/exampleTasks.js";

import Task from "../models/TaskModel.js";

const AuthController = {
  async register(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }
    try {
      const newUser = await createUser(username, password);

      const tasksForUser = exampleTasks.map((task) => ({
        ...task,
        user: newUser._id,
      }));

      await Task.insertMany(tasksForUser);

      const authResult = await finalizeAuthentication(res, newUser._id);
      res.status(200).json({
        message: "User registered successfully",
        userId: newUser._id,
        redirectUrl: authResult.redirectUrl,
      });
    } catch (error) {
      next(error);
    }
  },
  async login(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }
    try {
      const user = await validateUser(username, password);

      if (!user) {
        res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const authResult = await finalizeAuthentication(res, user._id);
      res.status(200).json({
        message: "User logged in successfully",
        userId: user._id,
        redirectUrl: authResult.redirectUrl,
        token: authResult.token,
      });
    } catch (error) {
      next(error);
    }
  },
};
export default AuthController;
