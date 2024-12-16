import mongoose from "mongoose";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
}

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/todoApp";

export const dbConnect = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(mongoURI);
      console.debug(`[MongoDB] Connected to ${mongoURI}`);
      resolve();
    } catch (err) {
      console.error("[MongoDB] Connection Error:", err.message);
      reject(err);
    }
  });
};

export const dbDisconnect = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.disconnect();
      console.debug("[MongoDB] Disconnected");
      resolve();
    } catch (err) {
      console.error("[MongoDB] Disconnection Error:", err.message);
      reject(err);
    }
  });
};