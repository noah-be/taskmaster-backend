import request from "supertest";
import app, { startServer, stopServer, getServerStatus } from "../../app";
import * as dbModule from "../../config/dbConnect";

describe("Server Control", () => {
  beforeAll(async () => {
    jest
      .spyOn(dbModule, "dbConnect")
      .mockImplementation(() => Promise.resolve());
    await startServer();
  });

  afterAll(async () => {
    jest.spyOn(dbModule, "dbConnect").mockRestore();
    await stopServer();
  });

  describe("Normal Operations", () => {
    it("should stop and restart the server", async () => {
      await stopServer();
      expect(getServerStatus()).toBe(false);
      await startServer();
      expect(getServerStatus()).toBe(true);
    });
  }, 15000);

  describe("Error Handling", () => {
    afterAll(async () => {
      jest.spyOn(dbModule, "dbConnect").mockRestore();
    });

    it("should handle errors during server startup", async () => {
      dbModule.dbConnect.mockImplementationOnce(() =>
        Promise.reject(new Error("Database connection failed")),
      );
      await expect(startServer()).rejects.toThrow("Database connection failed");
      dbModule.dbConnect.mockReset();
    });
  });
});
