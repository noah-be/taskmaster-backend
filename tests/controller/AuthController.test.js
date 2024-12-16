import { createUser, validateUser } from "utils/userUtils";
import { finalizeAuthentication } from "utils/authUtils";
import Task from "models/TaskModel";
import AuthController from "controllers/AuthController";
import { exampleTasks } from "utils/exampleTasks";
import httpMocks from "node-mocks-http";

jest.mock("utils/userUtils.js");
jest.mock("utils/authUtils.js");
jest.mock("models/TaskModel.js");
jest.mock("utils/exampleTasks.js", () => ({
  exampleTasks: [
    { name: "Task 1", completed: false },
    { name: "Task 2", completed: true },
  ],
}));

describe("AuthController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should return 400 if no username or password provided", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/register",
        body: {},
      });
      const res = httpMocks.createResponse();
      res.json = jest.fn();
      const next = jest.fn();

      await AuthController.register(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username and password are required",
      });
    });

    it("should successfully register a user", async () => {
      createUser.mockResolvedValue({ _id: "userId" });
      finalizeAuthentication.mockResolvedValue({ redirectUrl: "/tasks" });
      Task.insertMany.mockResolvedValue(true);

      const req = httpMocks.createRequest({
        method: "POST",
        url: "/register",
        body: { username: "user", password: "password" },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await AuthController.register(req, res, next);

      expect(createUser).toHaveBeenCalledWith("user", "password");
      expect(Task.insertMany).toHaveBeenCalledWith(
        exampleTasks.map((task) => ({ ...task, user: "userId" })),
      );
      expect(finalizeAuthentication).toHaveBeenCalledWith(res, "userId");
      expect(res.statusCode).toBe(200);
    });

    it("should handle exceptions during registration", async () => {
      const error = new Error("Test error");
      createUser.mockRejectedValue(error);

      const req = httpMocks.createRequest({
        method: "POST",
        url: "/register",
        body: { username: "user", password: "password" },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await AuthController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    it("should return 400 if no username or password provided", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/login",
        body: {},
      });
      const res = httpMocks.createResponse();
      res.json = jest.fn();
      const next = jest.fn();

      await AuthController.login(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username and password are required",
      });
    });

    it("should successfully log in a user", async () => {
      validateUser.mockResolvedValue({ _id: "userId" });
      finalizeAuthentication.mockResolvedValue({ redirectUrl: "/tasks" });

      const req = httpMocks.createRequest({
        method: "POST",
        url: "/login",
        body: { username: "user", password: "password" },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await AuthController.login(req, res, next);

      expect(validateUser).toHaveBeenCalledWith("user", "password");
      expect(finalizeAuthentication).toHaveBeenCalledWith(res, "userId");
      expect(res.statusCode).toBe(200);
    });

    it("should handle exceptions during login", async () => {
      const error = new Error("Test error");
      validateUser.mockRejectedValue(error);

      const req = httpMocks.createRequest({
        method: "POST",
        url: "/login",
        body: { username: "user", password: "password" },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await AuthController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
