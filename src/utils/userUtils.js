import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";

const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new UserModel({
    username,
    password: hashedPassword,
  });
  await newUser.save();
  return newUser;
};
const checkUsername = async (username) => {
  const existingUser = await UserModel.findOne({
    username,
  });
  return Boolean(existingUser);
};
const validateUser = async (username, password) => {
  const user = await UserModel.findOne({
    username,
  });
  if (!user) {
    return null;
  }
  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }
  return user;
};
export { createUser, checkUsername, validateUser };
