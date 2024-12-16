import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Task from "models/TaskModel.js";

let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Task Model Test", () => {
  // Test Case: Creating a task successfully
  it("create task successfully", async () => {
    const taskData = {
      title: "Task Title",
      description: "Task Description",
      user: new mongoose.Types.ObjectId(),
    };
    const validTask = new Task(taskData);
    const savedTask = await validTask.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe(taskData.title);
    expect(savedTask.description).toBe(taskData.description);
    expect(savedTask.completed).toBe(false);
    expect(savedTask.priority).toBe("Low");
  });

  // Test Case: Insert task unsuccessfully due to missing required "title"
  it("create task without required field should fail", async () => {
    const taskData = {
      description: "Task Description",
      user: new mongoose.Types.ObjectId(),
    };
    let err;
    try {
      const invalidTask = new Task(taskData);
      await invalidTask.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
  });

  // Test Case: Trim title of the task
  it("trims the title field of the task", async () => {
    const taskData = {
      title: "   Task Title   ",
      description: "Task Description",
      user: new mongoose.Types.ObjectId(),
    };
    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask.title).toBe(taskData.title.trim());
  });

  // Test Case: Check default completed status
  it("default completed status is false", async () => {
    const taskData = {
      title: "Task Title",
      description: "Task Description",
      user: new mongoose.Types.ObjectId(),
    };
    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask.completed).toBe(false);
  });

  // Test Case: Check enum validation for priority
  it("fails saving task with invalid priority", async () => {
    const taskData = {
      title: "Task Title",
      description: "Invalid Priority",
      priority: "Invalid",
      user: new mongoose.Types.ObjectId(),
    };
    let err;
    try {
      const invalidPriorityTask = new Task(taskData);
      await invalidPriorityTask.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.priority).toBeDefined();
  });
});
