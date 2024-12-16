import Task from "../models/TaskModel.js";
const TaskController = {
  addTask: async (req, res) => {
    try {
      const { title, priority } = req.body;
      if (!title) {
        return res.status(400).json({
          error: "Title is required",
        });
      }
      if (!["High", "Medium", "Low"].includes(priority)) {
        return res.status(400).json({
          error: "Invalid priority value",
        });
      }
      const description = req.body.description || "Default description";
      const dueDate = req.body.dueDate
        ? new Date(req.body.dueDate)
        : new Date();
      if (!req.user || !req.user._id) {
        console.debug("User identification missing");
        return res.status(400).json({
          error: "User identification is missing",
        });
      }
      const newTask = new Task({
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
        completed: false,
        user: req.user._id,
      });
      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  },
  getAllTasks: async (req, res) => {
    try {
      const userTasks = await Task.find({
        user: req.user._id,
      });
      res.json(userTasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },
  getTaskById: async (req, res) => {
    try {
      const task = await Task.findOne({
        _id: req.params.taskId,
        user: req.user._id,
      });
      if (!task) {
        return res.status(404).json({
          error: "Task not found",
        });
      }
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },
  updateTask: async (req, res) => {
    try {
      const updatedTask = await Task.findOneAndUpdate(
        {
          _id: req.params.taskId,
          user: req.user._id,
        },
        req.body,
        {
          new: true,
        },
      );
      if (!updatedTask) {
        return res.status(404).json({
          error: "Task not found",
        });
      }
      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },
  deleteTask: async (req, res) => {
    try {
      const deletedTask = await Task.findOneAndDelete({
        _id: req.params.taskId,
        user: req.user._id,
      });
      if (!deletedTask) {
        return res.status(404).json({
          error: "Task not found",
        });
      }
      res.status(200).json({
        message: "Task successfully deleted",
        taskId: req.params.taskId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },
  toggleTask: async (req, res) => {
    try {
      const task = await Task.findById(req.params.taskId);

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      if (task.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "Unauthorized to access this task",
        });
      }

      task.completed = !task.completed;

      const updatedTask = await task.save();

      res.status(200).json({
        message: "Task toggled successfully",
        task: updatedTask,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },
};
export default TaskController;
