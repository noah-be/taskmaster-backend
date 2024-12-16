import request from "supertest";
import app from "../../../app";

export function runGeneralRoutesTests() {
  describe("General Routes", () => {
    const routes = ["/", "/about", "/contact"];

    routes.forEach((route) => {
      it(`should access the ${route} page`, async () => {
        const response = await request(app).get(route);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toEqual(
          expect.stringContaining("text/html"),
        );
      });
    });
  });
}
