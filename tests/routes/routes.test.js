import { runGeneralRoutesTests } from "./generalRouteTests.js";
import { runAuthRoutesTests } from "./authRoutesTest.js";
import { runTaskRoutesTests } from "./taskRouteTests.js";
import { startServer, stopServer } from "../../../app.js";

describe("Route Tests", () => {
  beforeAll(async () => {
    await startServer();
  });

  afterAll(async () => {
    await stopServer();
  });

  runGeneralRoutesTests();
  runAuthRoutesTests();
  runTaskRoutesTests();
});
