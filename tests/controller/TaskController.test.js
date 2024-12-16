import TaskController from "controllers/TaskController";
import Task from "models/TaskModel";

//#region setup

jest.mock("models/TaskModel", () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(),
  }));
});

const mockReq = ({ body = {}, user = {} } = {}) => ({
  body,
  user,
  params: {},
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const res = mockRes();

//#endregion

describe("TaskController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addTask", () => {
    it("should successfully create a task", async () => {
      const req = mockReq({
        body: { title: "Test Task", priority: "High" },
        user: { _id: "user123" },
      });

      await TaskController.addTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
    it("should return 400 if no title provided", async () => {
      const req = mockReq({
        body: { priority: "High" },
        user: { _id: "user123" },
      });

      await TaskController.addTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Title is required",
      });
    });
    it("should return 400 for invalid priority", async () => {
      const req = mockReq({
        body: { title: "Test Task", priority: "Invalid" },
        user: { _id: "user123" },
      });

      await TaskController.addTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid priority value",
      });
    });
    it("should return 400 if user identification is missing", async () => {
      const res = mockRes();

      const req = mockReq({ body: { title: "Test Task", priority: "High" } }); // No user ID

      await TaskController.addTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "User identification is missing",
      });
    });
    it("should handle internal server error", async () => {
      Task.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error("Internal Server Error")),
      }));

      const req = mockReq({
        body: { title: "Test Task", priority: "Medium" },
        user: { _id: "user123" },
      });
      const res = mockRes();

      await TaskController.addTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        "Internal Server Error: Internal Server Error",
      );
    });
  });

  describe("getTaskById", () => {
    it("should successfully add a task", async () => {
      expect(true).toBe(true);
    });
  });

  describe("updateTask", () => {
    it("should successfully add a task", async () => {
      expect(true).toBe(true);
    });
  });
  describe("deleteTask", () => {
    it("should successfully add a task", async () => {
      expect(true).toBe(true);
    });
  });
  describe("toggleTask", () => {
    it("should successfully add a task", async () => {
      expect(true).toBe(true);
    });
  });
});
