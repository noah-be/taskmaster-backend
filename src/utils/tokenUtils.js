import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const createToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    JWT_SECRET,
    {
      expiresIn: "24h",
    },
  );
};

const verifyGoogleToken = async (idToken) => {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
};

async function setJwtCookie(token, res) {
  try {
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: IS_PRODUCTION ? "None" : "Lax",
      secure: IS_PRODUCTION,
      maxAge: 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to set JWT cookie");
  }
}

export { createToken, verifyGoogleToken, setJwtCookie };
