import User from "../../src/models/UserModel";
import puppeteer from "puppeteer";
import { startServer, stopServer } from "../../app";

export function runFunctionalTests() {
  describe("Login Page Functional Test", () => {
    let browser;
    let page;

    beforeAll(async () => {
      await startServer();
      await User.deleteMany({});

      browser = await puppeteer.launch({ headless: true });
      page = await browser.newPage();
    });

    afterAll(async () => {
      await User.deleteMany({});
      await page.close();
      await browser.close();
      await stopServer();
    });

    it("should allow a user to register and redirect to tasks page", async () => {
      await page.goto("http://localhost:3002");
      await page.click("#create-new-account-btn");
      await page.waitForSelector("#register-box");

      await page.type("#register-username", "newuser");
      await page.type("#register-password", "Password7/#");
      await page.click("#sign-up-btn");
      await page.waitForNavigation({ waitUntil: "networkidle0" });
      expect(page.url()).toContain("/tasks");
    });

    it("should redirect to tasks page upon successful login", async () => {
      await page.goto("http://localhost:3002");
      await page.waitForSelector("#login-form");
      await page.type("#login-username", "newuser");
      await page.type("#login-password", "Password7/#");
      await page.click("#login-btn");
      await page.waitForNavigation({ waitUntil: "networkidle0" });
      expect(page.url()).toContain("/tasks");
    });

    it("should open the edit task modal when a task row is clicked", async () => {
      const firstTaskSelector = "#task-row-0";
      const modalSelector = "#edit-task-modal";

      await page.waitForSelector(firstTaskSelector);
      await page.click(firstTaskSelector);

      await page.waitForSelector(modalSelector, { visible: true });

      const displayStyle = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return window.getComputedStyle(element).display;
      }, modalSelector);

      expect(displayStyle).not.toBe("none");
    });
  });
}