import request from "supertest";
import app from "../../../app";
import UserModel from "../../../src/models/UserModel";

export function runAuthRoutesTests() {
  describe("Auth Route Tests", () => {
    it("should handle missing username on registration", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ password: "testpass123", username: "" });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        "Username and password are required",
      );
    });

    it("should handle missing username on check-username", async () => {
      const response = await request(app).get("/api/auth/check-username");
      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Username missing");
    });

    it("should handle invalid login attempt", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "nonexistent", password: "wrongpass" });
      expect(response.status).toBe(401);
      expect(response.body.message).toContain("Invalid credentials");
    });

    it("should handle database errors gracefully", async () => {
      jest.spyOn(UserModel, "findOne").mockImplementation(() => {
        throw new Error("Database error");
      });

      const response = await request(app)
        .get("/api/auth/check-username")
        .query({ username: "McTesterson" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Server error",
      });
      jest.restoreAllMocks();
    });
  });
}
