//#region import
import express from "express";
import { initSentry, startProfiling, stopProfiling } from "./instrument.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/routes/index.js";
import mdws from "./src/middlewares/index.js";
import { dbConnect, dbDisconnect } from "./src/config/dbConnect.js";

//#endregion

initSentry();
startProfiling();

const app = express();
let serverInstance;
let isServerRunning = false;

//#region environment
dotenv.config();
const port = process.env.PORT || 3009;
process.env.NODE_ENV === "development" && app.use(morgan("dev"));
//#endregion

export const startServer = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await dbConnect();

      app.use(cookieParser());
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(cors());

      // Routes
      app.use("/api/auth", routes.authRoutes);
      app.use("/api/task", routes.taskRoutes);

      // Middleware
      Sentry.setupExpressErrorHandler(app);

      serverInstance = app.listen(port, () => {
        isServerRunning = true;
        const serverDomain = process.env.SERVER_DOMAIN || "localhost";
        const currentTime = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        console.debug(
          `[${currentTime}] \x1b[94m\x1b[1m[Server]\x1b[0m \x1b[94mhttp://${serverDomain}:${port} 🚀\x1b[0m`,
        );
        resolve(serverInstance);
      });
    } catch (error) {
      console.error("Error starting server:", error);
      reject(error);
    }
  });
};

export const stopServer = async () => {
  if (serverInstance) {
    await dbDisconnect();

    return new Promise((resolve, reject) => {
      serverInstance.close((err) => {
        if (err) {
          console.error("Error stopping server:", err);
          reject(err);
          return;
        }
        isServerRunning = false;
        console.log("Server stopped");
        resolve();
      });
    });
  }
  stopProfiling();
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export const getServerStatus = () => isServerRunning;
export default app;
