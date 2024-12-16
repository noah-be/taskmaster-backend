import express from "express";
import authenticateToken from "../middlewares/authTokenMiddleware.js";
import TaskController from "../controllers/TaskController.js";

const router = express.Router();

router.get("/getAll", authenticateToken, TaskController.getAllTasks);
router.post("/", authenticateToken, TaskController.addTask);
router.get("/:taskId", authenticateToken, TaskController.getTaskById);
router.patch("/:taskId", authenticateToken, TaskController.updateTask);
router.delete("/:taskId", authenticateToken, TaskController.deleteTask);
router.patch("/toggle/:taskId", authenticateToken, TaskController.toggleTask);

export default router;
