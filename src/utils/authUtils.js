import { createToken, setJwtCookie } from "./tokenUtils.js";

const finalizeAuthentication = async (res, userId) => {
  try {
    const token = createToken(userId);
    await setJwtCookie(token, res);
    return {
      redirectUrl: "/tasks",
      token: token,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

export { finalizeAuthentication };
